use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::path::PathBuf;
use tauri::Manager;

pub mod db;

// State to hold valid app data
pub struct AppState {
    pub ollama_url: Mutex<String>,
    pub db_path: Mutex<PathBuf>,
}

// Types for Ollama API
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OllamaModel {
    pub name: String,
    pub modified_at: Option<String>,
    pub size: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OllamaModelsResponse {
    models: Vec<OllamaModel>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    stream: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatResponse {
    message: Option<ChatMessage>,
    done: bool,
}

// --- DB Commands ---

#[tauri::command]
async fn create_conversation(state: tauri::State<'_, AppState>, title: String, model: String) -> Result<String, String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::create_conversation(&db_path, &title, &model).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_conversations(state: tauri::State<'_, AppState>) -> Result<Vec<db::Conversation>, String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::get_conversations(&db_path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_messages(state: tauri::State<'_, AppState>, conversation_id: String) -> Result<Vec<db::Message>, String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::get_messages(&db_path, &conversation_id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_conversation(state: tauri::State<'_, AppState>, conversation_id: String) -> Result<(), String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::delete_conversation(&db_path, &conversation_id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn rename_conversation(state: tauri::State<'_, AppState>, conversation_id: String, title: String) -> Result<(), String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::update_conversation_title(&db_path, &conversation_id, &title).map_err(|e| e.to_string())
}

#[tauri::command]
async fn update_message(state: tauri::State<'_, AppState>, message_id: String, content: String) -> Result<(), String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::update_message_content(&db_path, &message_id, &content).map_err(|e| e.to_string())
}

#[tauri::command]
async fn truncate_conversation(state: tauri::State<'_, AppState>, conversation_id: String, after_message_id: String) -> Result<(), String> {
    let db_path = state.db_path.lock().unwrap().clone();
    db::delete_messages_after(&db_path, &conversation_id, &after_message_id).map_err(|e| e.to_string())
}

// --- Ollama Commands ---

#[tauri::command]
async fn list_models(state: tauri::State<'_, AppState>) -> Result<Vec<OllamaModel>, String> {
    let url = state.ollama_url.lock().unwrap().clone();
    let client = reqwest::Client::new();
    
    let response = client
        .get(format!("{}/api/tags", url))
        .send()
        .await
        .map_err(|e| format!("Failed to connect to Ollama: {}", e))?;

    if !response.status().is_success() {
        return Err("Ollama is not running or returned an error".to_string());
    }

    let models_response: OllamaModelsResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(models_response.models)
}

#[tauri::command]
async fn check_ollama_status(state: tauri::State<'_, AppState>) -> Result<bool, String> {
    let url = state.ollama_url.lock().unwrap().clone();
    let client = reqwest::Client::new();
    
    match client.get(format!("{}/api/tags", url)).send().await {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}

// Command to send a chat message AND save to DB
#[tauri::command]
async fn send_chat_message(
    state: tauri::State<'_, AppState>,
    conversation_id: String,
    content: String,
    model: String,
) -> Result<String, String> {
    let url = state.ollama_url.lock().unwrap().clone();
    let db_path = state.db_path.lock().unwrap().clone();
    let client = reqwest::Client::new();
    
    // 1. Save User Message
    db::add_message(&db_path, &conversation_id, "user", &content)
        .map_err(|e| format!("Failed to save user message: {}", e))?;

    // 2. Fetch history for context
    let history = db::get_messages(&db_path, &conversation_id)
        .map_err(|e| format!("Failed to fetch history: {}", e))?;
    
    let chat_messages: Vec<ChatMessage> = history.into_iter().map(|msg| ChatMessage {
        role: msg.role,
        content: msg.content,
    }).collect();

    // 3. Send to Ollama
    let request = ChatRequest {
        model,
        messages: chat_messages,
        stream: false,
    };

    let response = client
        .post(format!("{}/api/chat", url))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to send message: {}", e))?;

    if !response.status().is_success() {
        return Err("Ollama returned an error".to_string());
    }

    let chat_response: ChatResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let ai_content = match chat_response.message {
        Some(msg) => msg.content,
        None => return Err("No response from model".to_string()),
    };

    // 4. Save AI info
    db::add_message(&db_path, &conversation_id, "assistant", &ai_content)
        .map_err(|e| format!("Failed to save AI message: {}", e))?;

    Ok(ai_content)
}

#[tauri::command]
async fn regenerate_response(
    state: tauri::State<'_, AppState>,
    conversation_id: String,
    model: String,
) -> Result<String, String> {
    let url = state.ollama_url.lock().unwrap().clone();
    let db_path = state.db_path.lock().unwrap().clone();
    let client = reqwest::Client::new();

    // 1. Fetch history for context
    let history = db::get_messages(&db_path, &conversation_id)
        .map_err(|e| format!("Failed to fetch history: {}", e))?;
    
    let chat_messages: Vec<ChatMessage> = history.into_iter().map(|msg| ChatMessage {
        role: msg.role,
        content: msg.content,
    }).collect();

    // 2. Send to Ollama
    let request = ChatRequest {
        model,
        messages: chat_messages,
        stream: false,
    };

    let response = client
        .post(format!("{}/api/chat", url))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to send message: {}", e))?;

    if !response.status().is_success() {
        return Err("Ollama returned an error".to_string());
    }

    let chat_response: ChatResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let ai_content = match chat_response.message {
        Some(msg) => msg.content,
        None => return Err("No response from model".to_string()),
    };

    // 3. Save AI info
    db::add_message(&db_path, &conversation_id, "assistant", &ai_content)
        .map_err(|e| format!("Failed to save AI message: {}", e))?;

    Ok(ai_content)
}

// Original greet command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();
            let app_data_dir = app.path().app_data_dir().expect("failed to get app data dir");
            std::fs::create_dir_all(&app_data_dir).expect("failed to create app data dir");
            let db_path = app_data_dir.join("talos.db");
            
            db::init_db(&db_path).expect("failed to init db");

            app.manage(AppState {
                ollama_url: Mutex::new("http://localhost:11434".to_string()),
                db_path: Mutex::new(db_path),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            list_models,
            check_ollama_status,
            send_chat_message,
            create_conversation,
            get_conversations,
            get_messages,
            delete_conversation,
            rename_conversation,
            update_message,
            truncate_conversation,
            regenerate_response
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

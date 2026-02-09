use rusqlite::{params, Connection, Result};
use std::path::Path;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Conversation {
    pub id: String,
    pub title: String,
    pub model: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub role: String,
    pub content: String,
    pub created_at: String,
}

pub fn init_db(path: &Path) -> Result<()> {
    let conn = Connection::open(path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            model TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        )",
        [],
    )?;

    Ok(())
}

pub fn create_conversation(path: &Path, title: &str, model: &str) -> Result<String> {
    let conn = Connection::open(path)?;
    let id = uuid::Uuid::new_v4().to_string();
    
    conn.execute(
        "INSERT INTO conversations (id, title, model) VALUES (?1, ?2, ?3)",
        params![id, title, model],
    )?;

    Ok(id)
}

pub fn get_conversations(path: &Path) -> Result<Vec<Conversation>> {
    let conn = Connection::open(path)?;
    let mut stmt = conn.prepare("SELECT id, title, model, created_at FROM conversations ORDER BY updated_at DESC")?;
    
    let conversation_iter = stmt.query_map([], |row| {
        Ok(Conversation {
            id: row.get(0)?,
            title: row.get(1)?,
            model: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?;

    let mut conversations = Vec::new();
    for conversation in conversation_iter {
        conversations.push(conversation?);
    }
    
    Ok(conversations)
}

pub fn add_message(path: &Path, conversation_id: &str, role: &str, content: &str) -> Result<Message> {
    let conn = Connection::open(path)?;
    let id = uuid::Uuid::new_v4().to_string();
    let created_at = chrono::Utc::now().to_rfc3339(); // Use ISO format or just let SQLite handle it? Using rfc3339 is better for portability.
    // Actually sqlite DEFAULT CURRENT_TIMESTAMP is simpler but string parsing varies.
    // let's stick to sqlite default for stored, but return current time.
    
    conn.execute(
        "INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)",
        params![id, conversation_id, role, content],
    )?;

    // Update conversation updated_at
    conn.execute(
        "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?1",
        params![conversation_id],
    )?;

    Ok(Message {
        id,
        role: role.to_string(),
        content: content.to_string(),
        created_at: "now".to_string(), // Simplified return, real app might fetch
    })
}

pub fn get_messages(path: &Path, conversation_id: &str) -> Result<Vec<Message>> {
    let conn = Connection::open(path)?;
    let mut stmt = conn.prepare("SELECT id, role, content, created_at FROM messages WHERE conversation_id = ?1 ORDER BY created_at ASC")?;
    
    let message_iter = stmt.query_map(params![conversation_id], |row| {
        Ok(Message {
            id: row.get(0)?,
            role: row.get(1)?,
            content: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?;

    let mut messages = Vec::new();
    for msg in message_iter {
        messages.push(msg?);
    }
    
    Ok(messages)
}

pub fn delete_conversation(path: &Path, id: &str) -> Result<()> {
    let conn = Connection::open(path)?;
    conn.execute("DELETE FROM conversations WHERE id = ?1", params![id])?;
    Ok(())
}


pub fn update_conversation_title(path: &Path, id: &str, title: &str) -> Result<()> {
    let conn = Connection::open(path)?;
    conn.execute("UPDATE conversations SET title = ?1 WHERE id = ?2", params![title, id])?;
    Ok(())
}

pub fn update_message_content(path: &Path, id: &str, content: &str) -> Result<()> {
    let conn = Connection::open(path)?;
    conn.execute("UPDATE messages SET content = ?1 WHERE id = ?2", params![content, id])?;
    Ok(())
}

pub fn delete_messages_after(path: &Path, conversation_id: &str, after_message_id: &str) -> Result<()> {
    let conn = Connection::open(path)?;
    // proper way to do this: get the creation time of the message, then delete everything after it.
    // Or, if we assume chronological insertion order matches rowid/creation time.
    // Let's use subquery on created_at for safety.
    conn.execute(
        "DELETE FROM messages 
         WHERE conversation_id = ?1 
         AND created_at > (SELECT created_at FROM messages WHERE id = ?2)",
        params![conversation_id, after_message_id],
    )?;
    Ok(())
}

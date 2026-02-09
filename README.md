# Talos

## Private, Local AI Companion

Talos is a modern, privacy-first AI chat application designed for performance and aesthetic control. Built on the Tauri framework and powered by Ollama, it runs entirely on your local machine, ensuring your conversations remain private, fast, and secure.

Experience AI with a polished, responsive interface that adapts to your preference with widely varied built-in themes.

---

## Features

### Local Privacy
Powered by Ollama, Talos runs offline. Your data never leaves your device, providing complete privacy and security for your conversations.

### Adaptive Design
Choose from distinct visual themes to match your environment:

*   **Retro**: A pixel-art interface inspired by classic computing.
*   **Bubbly**: A soft, approachable design with rounded aesthetics.
*   **Glass**: A modern, translucent interface using glassmorphism.
*   **Minimal**: A distraction-free, high-contrast dark mode.

### Enhanced Interaction
*   **Rich Text Support**: Full Markdown rendering for code blocks, lists, and formatted text.
*   **Contextual Editing**: Edit previous messages to diverge the conversation path. The AI automatically regenerates responses based on the updated context.
*   **Session Management**: Organize, save, and switch between multiple conversation threads seamlessly.

---

## Technology Stack

Talos is built with a focus on performance and modern web standards:

*   **Frontend**: React 18, TypeScript, Vite
*   **Backend**: Rust (Tauri v2)
*   **Database**: SQLite
*   **AI Engine**: Ollama

---

## Getting Started

### Prerequisites

Ensure the following components are installed on your system:

1.  **Ollama**: Required for the AI model inference.
2.  **Node.js** or **Bun**: Required for the frontend environment.
3.  **Rust**: Required for compiling the application backend.

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/AleenaTahir1/Talos.git
    cd Talos
    ```

2.  **Install Dependencies**

    ```bash
    bun install
    # or
    npm install
    ```

3.  **Run Development Server**

    ```bash
    bun tauri dev
    # or
    npm run tauri dev
    ```

---

## License

This project is distributed under the MIT License. See the `LICENSE` file for more information.

## Author

**Aleena Tahir**
[GitHub Profile](https://github.com/AleenaTahir1)

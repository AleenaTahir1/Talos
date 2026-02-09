# Talos (formerly Sage)

Talos is a modern, locally-running AI chat application built with **Tauri**, **React**, and **Ollama**. It features a polished UI with multiple themes (Retro, Bubbly, Glass, Minimal) and completely local privacy.

## Features

-   **Local AI**: Powered by Ollama, running entirely on your machine.
-   **Multiple Themes**: Switch between Retro (pixel art), Bubbly (soft pastels), Glass (futuristic), and Minimal styles.
-   **Markdown Support**: Full support for code blocks, lists, and formatted text.
-   **Conversation Management**: Create, delete, and switch between multiple chat sessions.
-   **Edit & Regenerate**: Edit your previous prompts to steer the conversation in a new direction.
-   **Cross-Platform**: Built with Tauri for native performance on Windows, macOS, and Linux.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Backend**: Rust (Tauri)
-   **Database**: SQLite (local storage)
-   **AI Engine**: Ollama

## Prerequisites

-   [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) (npm/pnpm/yarn)
-   [Rust](https://www.rust-lang.org/tools/install)
-   [Ollama](https://ollama.com/) (must be running locally)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AleenaTahir1/Talos.git
    cd Talos
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Run the development server**:
    ```bash
    npm run tauri dev
    # or
    bun tauri dev
    ```

## License

MIT

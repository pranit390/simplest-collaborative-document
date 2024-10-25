# simplest-collaborative-document


# Collaborative Text Editor

This project is a collaborative text editor built with **React** and **Socket.io**, enabling real-time text editing among multiple users. 

## Features

- **Real-time Collaboration**: Changes made by one user are instantly visible to all connected users.
- **User Locking Mechanism**: The text area locks for the user currently editing, preventing others from making changes until they finish.
- **Automatic Unlocking**: The document unlocks for others when the current user is inactive (not typing or hovering) or blurs the text area.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **npm**: npm (Node Package Manager) is included with Node.js. Verify the installation by running:
  ```bash
  node --version
  npm --version

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository

Open your terminal and run the following commands to clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>

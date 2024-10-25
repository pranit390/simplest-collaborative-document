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
  ```
## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository

Open your terminal and run the following commands to clone the repository:

  ```bash
  git clone https://github.com/pranit-checked/simplest-collaborative-document.git>
  cd simplest-collaborative-document
  ```
### 2. Run the server
  ```bash

 cd server
 npm i
 node server.js
  ```
### 3. Run the React app
  ```bash
 cd collaborative-text-editor
 npm i
 npm run start
  ```


## How to verify?
1. Open localhost:3000 in chrome and safari also you can open multiple tab in single browser
2. Write your name when prompt ask.
3. Try writing on one tab/browser you will see other tab/browser is notified and text area is locked.
4. Edge cases covered: On blur of text area and inactivity of 5 seconds text area will be unlocked for use again.










  







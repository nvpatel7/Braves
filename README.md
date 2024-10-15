# Baseball Event Visualizer

This web application allows users to select a batter or pitcher from two dropdown menus and view batted events based on their selection. A D3 diagram is displayed with interactive points showing information about each event, including the pitcher, batter, and a video link to the event.

## Prerequisites

- **Python 3.11** or later
  - For macOS: Install Python via Homebrew:
    ```bash
    brew install python3@11
    ```
  - Alternatively, download the latest version of Python from the [official website](https://www.python.org/downloads/).

- **Node.js (v10.8.2)** or **Yarn (v1.22.22)**
  - For macOS: Install via Homebrew:
    - **NPM**:
      ```bash
      brew install npm
      ```
    - **Yarn**:
      ```bash
      brew install yarn
      ```
  - Alternatively, download Node.js from the [official Node.js website](https://nodejs.org/), and Yarn using this command:
    ```bash
    npm install -g yarn
    ```

## Installation & Setup

1. **Install Python** (if you don’t already have it):
   - On macOS:
     ```bash
     brew install python3@11
     ```
   - Alternatively, download and install from [Python's official website](https://www.python.org/downloads/).

2. **Create a Python virtual environment**:
   - Navigate to the root directory of the project and run:
     ```bash
     python3 -m venv venv
     ```

3. **Activate the virtual environment**:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Navigate to the backend directory**:
   ```bash
   cd backend
    ```

5. **Make a .env file**:
   - Create a `.env` file in the `backend` directory with the following content:
      `
      SECRET_KEY='your_secret_key'
      `
      Replace `'your_secret_key'` with the secret key given to you via email.

6. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

7. **Apply backend migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Load data into the database**:
   ```bash
   python populate_db.py
    ```

9. **Start the Django server**:
    ```bash
    python manage.py runserver
    ```

10. **Navigate to the frontend directory**:
    ```bash
    cd ..
    cd frontend
     ```

11. **Install frontend dependencies**:
    ```bash
    yarn install
    ```
    or
    ```bash
    npm install
    ```

12. **Start the React development server**:
    ```bash
    yarn start
    ```
    or
    ```bash
    npm start
    ```

13. **Open the application in your browser**:
    - Navigate to `http://localhost:3000/` in your browser.


## Features
- **Select Batter or Pitcher**: Choose a batter or pitcher from the dropdown menu to view batted events.
- **Interactive Diagram**: View a D3 diagram with interactive points showing information about each event.
- **Event Information**: Click on a point to view information about the pitcher, batter, and a video link to the event.
- **Responsive Design**: The application is designed to work on desktop and mobile devices.


## Technologies
- **Frontend**: React.ts, D3.js, TypeScript
- **Backend**: Django, Django REST framework, SQLite

## How to Use
1. **Select a Batter or Pitcher**: Choose a batter or pitcher from the dropdown menu and click the "Submit" button.
2. **View Batted Events**: Hover on a point in the diagram to view information about the event.

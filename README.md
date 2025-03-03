# Music Recommender System

A full-stack web application that recommends music based on user preferences, instrument proficiency, and group collaboration.

## Overview

The Music Recommender System allows musicians to:

- Register with their instrument and proficiency level
- Create and join music groups
- Create recommendation campaigns
- Get personalized song recommendations based on their instrument and skill level
- Rate and review song recommendations
- Collaborate with other musicians

## Architecture

The system consists of two main components:

- **Frontend**: React-based single-page application with Material UI
- **Backend**: Python Flask API with a SQLite database

## Technologies

### Frontend

- React 18
- Redux Toolkit (RTK Query) for API communication
- Material UI v6 for UI components
- React Router for navigation
- Day.js for date handling

### Backend

- Python 3.9+
- Flask web framework
- Peewee ORM
- SQLite database
- JWT for authentication

## Prerequisites

Before you begin, ensure you have:

- Node.js (v16+) and npm installed
- Python 3.9+ installed
- Git for version control

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/yourusername/music-recommender-system.git
cd music-recommender-system
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:
   The backend uses a `settings.env` file for configuration. Make sure it contains:

```
MODE=LOCAL
HOST=127.0.0.1
PORT=5000
DB_PATH=db/music_recommender.db
```

5. Initialize the database:

```bash
python init_db.py
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the backend URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start the Backend Server

1. From the backend directory with the virtual environment activated:

```bash
python web.py
```

The backend server will start on http://localhost:5000.

### Start the Frontend Development Server

1. From the frontend directory:

```bash
npm start
```

The frontend development server will start on http://localhost:3000.

## Usage

1. Register a new account with your email, password, and instrument details
2. Log in with your credentials
3. Create or join a music group using an invite code
4. Create recommendation campaigns within a group
5. Rate songs that are recommended to you
6. Explore recommendations based on your instrument and proficiency

## Features

- **User Authentication**: Secure login and registration system
- **User Profile**: Track your instrument, proficiency, and music preferences
- **Groups**: Create and join groups of musicians
- **Campaigns**: Create themed recommendation campaigns with deadlines
- **Recommendations**: Get personalized song recommendations
- **Rating System**: Rate and provide feedback on recommendations

## API Documentation

The backend provides the following API endpoints:

- `/api/user` - User management endpoints
- `/api/group` - Group management endpoints
- `/api/campaign` - Campaign and recommendation endpoints

For detailed API documentation, refer to the backend code or use a tool like Swagger UI.

## Troubleshooting

### Backend Issues

- Ensure the virtual environment is activated
- Check that the correct port is available (default: 5000)
- Verify database permissions and paths

### Frontend Issues

- Clear browser cache if experiencing UI issues
- Check the console for error messages
- Ensure the backend server is running and accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI for the component library
- Redux Toolkit for state management
- Flask for the backend framework

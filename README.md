# Full Stack Notes App

## Description
A full-stack web application that allows users to take notes, categorize them, and filter by categories. The app is divided into two parts: 
- **Frontend**: Developed with React to provide a seamless SPA experience.
- **Backend**: Built with Flask using an ORM to persist data in a relational database.

## Features
### Phase 1 (Mandatory)
- Create, edit, and delete notes.
- Archive and unarchive notes.
- List active notes.
- List archived notes.

### Phase 2 (Optional)
- Add or remove categories to/from notes.
- Filter notes by categories.

## Default Login
Default credentials:
- **Username**: `default`
- **Password**: `default`

## Technologies Used
### Frontend
- React (v18.x)
- React Router (for navigation)
- Axios (for API calls)

### Backend
- Flask (v2.x)
- Flask-SQLAlchemy (ORM for database interaction)
- Flask-Migrate (for handling database migrations)
- Marshmallow (for serialization and validation)

### Database
- SQLite (for simplicity, though other relational databases can be used)

### Development Tools
- Node.js (v18.x) and npm
- Python (v3.x) and pip
- Git (for version control)

---

## Installation and Setup

### Prerequisites
Ensure the following tools are installed on your system:
- Python 3.x
- Node.js (v18.x) and npm
- SQLite (if using SQLite for the database)

### Clone the Repository
```bash
git clone <repository_url>
cd <repository_folder>

Run the Setup Script

The app is configured to run with a single script. This script sets up the backend, initializes the database, installs frontend dependencies, and starts both services.

./start.sh

Once the script completes:

    The backend will run at http://localhost:5000.
    The frontend will run at http://localhost:3000.

Visit http://localhost:3000 to use the app.

Directory Structure

project/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Application factory
│   │   ├── models/           
│   │   │   ├── models.py       # Database models
│   │   │   └── ...
│   │   ├── routes/           
│   │   │   ├── routes.py       # API endpoints
│   │   │   └── ...
│   │   ├── schemas/          
│   │   │   ├── schemas.py      # Serialization schemas
│   │   │   └── ...
│   │   ├── config.py           # Configuration file
│   │   └── ...
│   ├── requirements.txt        # Backend dependencies
│   ├── migrations/             # Database migrations folder
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.js              # Main application
│   │   ├── index.js            # Application entry point
│   │   └── ...
│   ├── public/
│   ├── package.json            # Frontend dependencies
│   └── ...
├── start.sh                    # Script to setup and run the app
└── README.md                   # Project documentation

Troubleshooting
Common Issues

    Port conflicts: If ports 5000 or 3000 are already in use, stop the conflicting processes or modify the port settings in the start.sh script.
    Python virtual environment not activating: Ensure you have the python3-venv package installed (sudo apt install python3-venv).
    Database errors: Run the following to reinitialize the database:

    flask db init
    flask db migrate
    flask db upgrade

Logs

    Backend logs: Terminal output where flask run is executed.
    Frontend logs: Terminal output where npm start is executed.

Live Deployment

    https://fullstack-notes-frontend-5yxa.onrender.com/

Contact

If you have any questions or need assistance, feel free to contact:

    Developer: Antonio Valdez Aguayo
    Email: tonypeanut93@gmail.com
    GitHub Profile: https://github.com/tonypeanut

License

This project is open source and available under the MIT License.

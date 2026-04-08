# E-memory

## CI/CD Status

### Backend
[![Pylint](https://github.com/1mr124/E-memory/actions/workflows/pylint.yml/badge.svg)](https://github.com/1mr124/E-memory/actions/workflows/pylint.yml)

### Frontend
[![Tests](https://github.com/1mr124/E-memory/actions/workflows/frontend-test.yml/badge.svg)](https://github.com/1mr124/E-memory/actions/workflows/frontend-test.yml)
[![Lint](https://github.com/1mr124/E-memory/actions/workflows/frontend-lint.yml/badge.svg)](https://github.com/1mr124/E-memory/actions/workflows/frontend-lint.yml)
[![Build](https://github.com/1mr124/E-memory/actions/workflows/frontend-build.yml/badge.svg)](https://github.com/1mr124/E-memory/actions/workflows/frontend-build.yml)

### Security
[![Dependency Check](https://github.com/1mr124/E-memory/actions/workflows/dependency-check.yml/badge.svg)](https://github.com/1mr124/E-memory/actions/workflows/dependency-check.yml)

---

A personal knowledge management application with hierarchical topics and information entries.

## Features

- **Hierarchical Topic Management**: Organize topics in a tree structure with parent-child relationships
- **Multiple Content Types**: Store text, links, and images as information entries
- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **Browse & Search**: Navigate topics via breadcrumbs or search across all topics
- **CRUD Operations**: Create, read, update, and delete topics and information entries
- **Delete Modes**: Choose between cascade delete (delete all children) or promote children to parent level

## Tech Stack

### Backend
- **Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **Flask-Migrate**: Database migrations
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-WTF**: Form validation
- **SQLite**: Database (development), configurable for production

### Frontend
- **React 18**: UI framework
- **React Router DOM**: Client-side routing
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP client for API requests
- **React Icons**: Icon components

## Project Structure

```
E-memory/
├── FlaskSite/                 # Backend application
│   ├── api/v1/               # API route blueprints
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── info.py          # Information entry endpoints
│   │   └── topic.py        # Topic management endpoints
│   ├── controllers/          # Business logic layer
│   │   ├── auth_controller.py
│   │   ├── info_controller.py
│   │   └── topic_controller.py
│   ├── services/             # Data access layer
│   │   ├── auth_service.py
│   │   ├── info_service.py
│   │   └── topic_service.py
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── topic.py
│   │   └── info.py
│   ├── forms/               # WTForms for validation
│   ├── utils/               # Utility functions
│   └── config.py           # Application configuration
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AddTopicForm.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── DeleteTopic.jsx
│   │   │   ├── InfoContainer.jsx
│   │   │   ├── SearchContainer.jsx
│   │   │   ├── TopicTreeView.jsx
│   │   │   └── TopicsContainer.jsx
│   │   ├── api/           # API clients
│   │   ├── services/      # Service layer
│   │   └── context/       # React contexts
│   └── package.json
├── migrations/             # Database migrations
├── requirements.txt        # Python dependencies
├── run.py                # Application entry point
└── README.md            # This file
```

## Installation

### Backend

1. Clone the repository:
```bash
git clone https://github.com/1mr124/E-memory.git
cd E-memory
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
flask db upgrade
```

### Frontend

1. Navigate to the client directory:
```bash
cd client
```

2. Install Node.js dependencies:
```bash
npm install
```

## Running the Application

### Backend

Run locally (localhost:5001):
```bash
python run.py
```

Run on LAN (accessible from other devices on the network):
```bash
python run.py lan
```

### Frontend

Run development server (localhost:3000):
```bash
cd client
npm start
```

Build for production:
```bash
cd client
npm run build
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token

### Topics
- `POST /api/v1/topic/create` - Create a new topic
- `GET /api/v1/topic/all` - Get all topics for the current user
- `GET /api/v1/topic/roots` - Get root topics (no parent)
- `GET /api/v1/topic/<id>/children` - Get subtopics and info entries for a topic
- `GET /api/v1/topic/<id>/breadcrumb` - Get breadcrumb path for a topic
- `PUT /api/v1/topic/<id>/move` - Move a topic to a new parent
- `POST /api/v1/delete` - Delete a topic

### Information
- `POST /api/v1/info/create` - Create an info entry
- `GET /api/v1/info/<id>` - Get an info entry
- `PUT /api/v1/info/<id>` - Update an info entry
- `DELETE /api/v1/info/<id>` - Delete an info entry
- `POST /api/v1/info/<id>/content` - Add content to an info entry

## Database Migrations

Create a new migration:
```bash
flask db migrate -m "description of changes"
```

Apply migrations:
```bash
flask db upgrade
```

## Code Quality

### Backend

Run pylint (matches CI):
```bash
pylint FlaskSite/ --enable=W --disable=C0103 --ignore=tests --ignore=migrations
```

### Frontend

Run tests:
```bash
cd client
npm test
```

Run ESLint:
```bash
cd client
npm run start
# ESLint runs automatically on build
```

Build for production:
```bash
cd client
npm run build
```

### Security

Check Python dependencies for vulnerabilities:
```bash
pip install pip-audit
pip-audit --requirement requirements.txt
```

Check Node.js dependencies for vulnerabilities:
```bash
cd client
npm audit
```

## Configuration

The application uses environment variables. Create a `.env` file in the root directory:

```
FLASK_ENV=development  # or production
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///site.db  # or your production database URL
```

## Development

### Backend
- API routes are in `FlaskSite/api/v1/`
- Controllers handle request validation and response formatting
- Services contain business logic and database queries
- Models define the database schema

### Frontend
- Components are organized by feature in `client/src/components/`
- API calls go through `client/src/api/` layer
- Service layer (`client/src/services/`) handles business logic
- Context (`client/src/context/`) manages global state like authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature-amazing-feature`)
5. Open a Pull Request

Please ensure your code passes all CI checks before submitting a PR:
- Backend Pylint score must not decrease
- Frontend tests must pass
- Frontend build must succeed
- No critical security vulnerabilities in dependencies

## License

This project is licensed under the MIT License.

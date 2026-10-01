# Todo MERN Stack

A full-stack task manager built with **MongoDB**, **Express**, **React** and **Node.js**, written in TypeScript end to end and fully containerized with Docker Compose.

The app supports the core CRUD lifecycle of a todo item: create, list, edit, toggle completion and delete. All data is persisted in MongoDB through a REST API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [User Flows](#user-flows)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Features

| Feature | Description |
| --- | --- |
| Add task | Create a new todo from the input form. Empty or whitespace-only input is ignored. |
| List tasks | All todos are fetched from the API when the app loads. |
| Edit task | Inline editing with save and cancel controls. |
| Toggle status | Mark a task as complete or incomplete with a single click. |
| Delete task | Remove a task permanently. |
| Timestamps | `createdAt` and `updatedAt` are recorded automatically for every todo. |
| DB admin UI | Mongo Express is included for browsing the database in the browser. |

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| [React 19](https://react.dev/) | Component-based UI library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Vite 8](https://vite.dev/) | Dev server, bundler and `/api` proxy |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling via `@tailwindcss/vite` |
| [Axios](https://axios-http.com/) | HTTP client for API calls |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon set (Material Design, Ionicons, Font Awesome) |
| [ESLint](https://eslint.org/) | Linting with `typescript-eslint` and React Hooks rules |

### Backend

| Technology | Purpose |
| --- | --- |
| [Node.js 24](https://nodejs.org/) | JavaScript runtime |
| [Express 5](https://expressjs.com/) | REST API framework |
| [Mongoose 9](https://mongoosejs.com/) | MongoDB ODM and schema modelling |
| [CORS](https://github.com/expressjs/cors) | Cross-origin request handling |
| [tsx](https://tsx.is/) | Runs TypeScript directly with watch mode |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |

### Database and Infrastructure

| Technology | Purpose |
| --- | --- |
| [MongoDB](https://www.mongodb.com/) | Document database |
| [Mongo Express](https://github.com/mongo-express/mongo-express) | Web-based MongoDB admin interface |
| [Docker](https://www.docker.com/) | Containerization of each service |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container orchestration with health checks |
| [pnpm](https://pnpm.io/) | Package manager |

---

## Architecture

```mermaid
flowchart LR
    User([User / Browser])

    subgraph Docker["Docker network: todo_app"]
        direction LR
        FE["Frontend<br/>React + Vite<br/>:5173"]
        BE["Backend<br/>Express API<br/>:5000"]
        DB[("MongoDB<br/>:27017")]
        ME["Mongo Express<br/>:8081"]
    end

    User -->|HTTP| FE
    FE -->|"Vite proxy /api/*"| BE
    BE -->|Mongoose| DB
    User -->|Admin UI| ME
    ME --> DB
```

The React client calls relative `/api/*` URLs. During development, the Vite dev server proxies these requests to the Express backend, so the browser never needs to know the backend address.

### Service Startup Order

```mermaid
flowchart TD
    A[docker compose up] --> B[MongoDB container starts]
    B --> C{Health check:<br/>ping succeeds?}
    C -- No --> B
    C -- Yes --> D[Backend starts]
    C -- Yes --> E[Mongo Express starts]
    D --> F[connectDB via MONGO_URI]
    F --> G[Frontend starts]
    G --> H[App available on FRONTEND_PORT]
```

---

## User Flows

### Overall Interaction Flow

```mermaid
flowchart TD
    Start([Open app]) --> Load[GET /api/todos]
    Load --> List[Render todo list]

    List --> Action{User action}

    Action -->|Type text and submit| Add[POST /api/todos]
    Action -->|Click circle| Toggle[PATCH /api/todos/:id<br/>completed = !completed]
    Action -->|Click edit icon| Edit[Enter inline edit mode]
    Action -->|Click trash icon| Delete[DELETE /api/todos/:id]

    Edit --> EditChoice{Save or cancel?}
    EditChoice -->|Save| Save[PATCH /api/todos/:id<br/>text = new value]
    EditChoice -->|Cancel| List

    Add --> Update[Update local state]
    Toggle --> Update
    Save --> Update
    Delete --> Update
    Update --> List
```

### Add a Todo

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React App
    participant BE as Express API
    participant DB as MongoDB

    U->>FE: Enter text and click "Add task"
    FE->>FE: Validate input is not empty
    FE->>BE: POST /api/todos { text }
    BE->>DB: todo.save()
    DB-->>BE: Saved document
    BE-->>FE: 201 Created + todo
    FE->>FE: Append todo to list, clear input
    FE-->>U: New task visible
```

### Edit a Todo

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React App
    participant BE as Express API
    participant DB as MongoDB

    U->>FE: Click edit icon
    FE-->>U: Show input with current text
    U->>FE: Modify text and click save
    FE->>BE: PATCH /api/todos/:id { text }
    BE->>DB: findById(id)
    alt Todo exists
        BE->>DB: todo.save()
        DB-->>BE: Updated document
        BE-->>FE: Updated todo
        FE->>FE: Replace todo in list, exit edit mode
    else Todo not found
        BE-->>FE: 404 Todo not found
        FE->>FE: Exit edit mode
    end
```

### Toggle Completion

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React App
    participant BE as Express API
    participant DB as MongoDB

    U->>FE: Click status circle
    FE->>BE: PATCH /api/todos/:id { completed: !completed }
    BE->>DB: findById + save
    DB-->>BE: Updated document
    BE-->>FE: Updated todo
    FE-->>U: Circle filled or cleared
```

### Delete a Todo

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React App
    participant BE as Express API
    participant DB as MongoDB

    U->>FE: Click trash icon
    FE->>BE: DELETE /api/todos/:id
    BE->>DB: findByIdAndDelete(id)
    DB-->>BE: Acknowledged
    BE-->>FE: { message: "Todo deleted" }
    FE->>FE: Remove todo from list
    FE-->>U: Task removed
```

### Todo State Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Created
    Pending --> Completed: Toggle
    Completed --> Pending: Toggle
    Pending --> Editing: Click edit
    Completed --> Editing: Click edit
    Editing --> Pending: Save / Cancel (if pending)
    Editing --> Completed: Save / Cancel (if completed)
    Pending --> [*]: Delete
    Completed --> [*]: Delete
```

---

## API Reference

Base URL: `/api/todos`

| Method | Endpoint | Request Body | Success Response | Error Responses |
| --- | --- | --- | --- | --- |
| `GET` | `/api/todos` | – | `200` Array of todos | `500` |
| `POST` | `/api/todos` | `{ "text": string }` | `201` Created todo | `400` |
| `PATCH` | `/api/todos/:id` | `{ "text"?: string, "completed"?: boolean }` | `200` Updated todo | `404`, `400` |
| `DELETE` | `/api/todos/:id` | – | `200` `{ "message": "Todo deleted" }` | `500` |

Error responses follow the shape:

```json
{ "message": "Error description" }
```

---

## Data Model

```mermaid
erDiagram
    TODO {
        ObjectId _id PK
        String text "required"
        Boolean completed "default: false"
        Date createdAt "auto"
        Date updatedAt "auto"
    }
```

---

## Project Structure

```
todo_mern_stack/
├── backend/
│   ├── config/
│   │   └── db.ts              # MongoDB connection via Mongoose
│   ├── models/
│   │   └── todo.model.ts      # Todo schema and model
│   ├── routes/
│   │   └── todo.route.ts      # CRUD route handlers
│   ├── index.ts               # Express app entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.tsx            # Main UI and API interaction logic
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Tailwind import
│   ├── vite.config.ts         # Vite plugins and /api proxy
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yaml        # MongoDB, Mongo Express, backend, frontend
├── example.env                # Environment variable template
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js 24+](https://nodejs.org/) and [pnpm](https://pnpm.io/) (only for running without Docker)

### Run with Docker (recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd todo_mern_stack

# 2. Create the environment file
cp example.env .env

# 3. Build and start all services
docker compose up --build
```

| Service | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Mongo Express | http://localhost:8081 |

### Run Locally (without Docker)

```bash
# Backend
cd backend
pnpm install
MONGO_URI=<your_mongo_uri> PORT=5000 pnpm dev

# Frontend (in a separate terminal)
cd frontend
pnpm install
REACT_APP_API_URL=http://localhost:5000 pnpm dev
```

---

## Environment Variables

Defined in `.env` (copy from `example.env`).

| Variable | Used By | Description | Default |
| --- | --- | --- | --- |
| `MONGO_ROOT_USERNAME` | MongoDB, Mongo Express | Root database user | `admin` |
| `MONGO_ROOT_PASSWORD` | MongoDB, Mongo Express | Root database password | `password` |
| `MONGO_PORT` | MongoDB | Host port mapped to MongoDB | `27017` |
| `MONGO_DB_NAME` | – | Database name | `todo_app` |
| `MONGO_EXPRESS_USERNAME` | Mongo Express | Basic auth username for the admin UI | `admin` |
| `MONGO_EXPRESS_PASSWORD` | Mongo Express | Basic auth password for the admin UI | `password` |
| `MONGO_EXPRESS_PORT` | Mongo Express | Admin UI port | `8081` |
| `BACKEND_PORT` | Backend | Port the Express server listens on | `5000` |
| `MONGO_URI` | Backend | MongoDB connection string | `mongodb://admin:password@mongodb:27017/todo_app?authSource=admin` |
| `FRONTEND_PORT` | Frontend | Host port mapped to the Vite dev server | `5173` |

> **Note:** Default credentials in `example.env` are intended for local development only. Change them before deploying anywhere public.

---

## License

ISC

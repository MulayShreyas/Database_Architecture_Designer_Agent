<<<<<<< HEAD
# Database Architect Agent

An AI-powered database schema generation tool that converts natural language descriptions into complete database schemas with interactive visualization.

![Database Architect Agent](https://via.placeholder.com/800x400/0f172a/0ea5e9?text=Database+Architect+Agent)

## Features

- 🤖 **AI-Powered Generation**: Describe your application in natural language and get a complete database schema
- 🔄 **Dialect Support**: Generate schemas for MySQL or PostgreSQL with proper syntax
- 📊 **Interactive ER Diagrams**: Visualize your schema with Mermaid.js diagrams
- 🌳 **Tree View Editor**: Browse and modify tables, columns, and relationships
- ✏️ **Live Editing**: Change relationship cardinality (1:1, 1:N, N:M) and see instant SQL updates
- 📋 **Export Options**: Copy SQL, download .sql files, export Mermaid diagrams, or JSON schemas
- 🎨 **Modern UI**: Beautiful dark theme with glassmorphism effects

## Architecture

The application uses an **Intermediate Representation (IR)** architecture:

1. **AI Processing**: User prompt → LLM → Structured JSON Schema
2. **Compilation Engine**: JSON Schema → SQL DDL + Mermaid Diagram
3. **Interactive Editing**: UI changes → JSON updates → Instant recompilation

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Prompt   │────▶│   AI (Backend)   │────▶│   JSON Schema   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────────────────────┴──────────────────────────────────┐
                        │                                                                     │
                        ▼                                                                     ▼
              ┌──────────────────┐                                              ┌──────────────────┐
              │   SQL Compiler   │                                              │ Mermaid Compiler │
              └────────┬─────────┘                                              └────────┬─────────┘
                       │                                                                  │
                       ▼                                                                  ▼
              ┌──────────────────┐                                              ┌──────────────────┐
              │    SQL DDL       │                                              │   ER Diagram     │
              └──────────────────┘                                              └──────────────────┘
```

## Tech Stack

### Frontend

- **React** + **TypeScript** (Vite)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Mermaid.js** for ER diagrams
- **Prism.js** for SQL syntax highlighting
- **Lucide Icons**

### Backend

- **FastAPI** (Python)
- **OpenAI** / **Anthropic** for AI generation
- **Pydantic** for data validation

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI or Anthropic API key

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate venv (Windows)
.\venv\Scripts\activate

# Activate venv (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and add your API key
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY or ANTHROPIC_API_KEY

# Run the server
python -m uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Usage

1. **Describe your application** in the text area (e.g., "A multi-vendor e-commerce platform with inventory management")
2. **Select your SQL dialect** (MySQL or PostgreSQL)
3. **Click "Generate Schema"** to create your database schema
4. **View the ER diagram** or **browse the tree view** to explore tables and relationships
5. **Edit relationships** by clicking on them and changing cardinality
6. **Export** your schema as SQL, Mermaid, or JSON

## API Endpoints

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/health`          | Health check                |
| POST   | `/api/generate-schema` | Generate schema from prompt |
| POST   | `/api/refine-schema`   | Refine existing schema      |

## Schema JSON Structure

```typescript
interface SchemaDefinition {
  id: string;
  name: string;
  description: string;
  dialect: "mysql" | "postgresql";
  tables: TableDefinition[];
  relationships: RelationshipDefinition[];
  storedProcedures: StoredProcedureDefinition[];
  createdAt: string;
  updatedAt: string;
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
=======
# Database_Architecture_Designer_Agent
>>>>>>> 1a37a0800ae1c215b0a385cfb87ac1a4ce7af80c

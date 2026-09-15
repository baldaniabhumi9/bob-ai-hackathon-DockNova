# DockNova Backend Foundation

FastAPI server foundation for DockNova Port Congestion Predictor & Operations Optimiser.

## Architecture

- `app/api/`: REST API endpoints and router declarations.
- `app/services/`: Core application services and business logic orchestration.
- `app/core/`: Application settings, environment configuration, and logging setup.
- `tests/`: Automated unit and integration test suite.
- `main.py`: Entry point for the FastAPI application server.

## Setup & Running the Server

### 1. Environment Setup (.venv)

To resolve Python 3.13 OR-Tools + Protobuf compatibility:

```bash
cd src/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Start API Server

```bash
python3 -m uvicorn main:app --port 8000
```

Verify API endpoints via curl:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/port/status
curl http://localhost:8000/api/vessels
curl http://localhost:8000/api/port/berth-risk
curl http://localhost:8000/api/congestion/forecast
```


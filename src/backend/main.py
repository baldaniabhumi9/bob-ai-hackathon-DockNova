from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import (
    berths_router,
    cranes_router,
    emergency_router,
    operations_router,
    routes_router,
    simulation_router,
    live_state_router,
)
from app.routers.vessels import router as vessels_router
from app.routers.port import router as port_router
from app.routers.congestion import router as congestion_router

app = FastAPI(
    title="DockNova API",
    description="Port Operations Control Tower & Congestion Predictor API Foundation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "system": "DockNova Port Operations API",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Register Optimization & Operations Routers
app.include_router(berths_router)
app.include_router(cranes_router)
app.include_router(routes_router)
app.include_router(operations_router)
app.include_router(simulation_router)
app.include_router(emergency_router)
app.include_router(live_state_router)

# Register ML & Data Routers
app.include_router(vessels_router)
app.include_router(port_router)
app.include_router(congestion_router)

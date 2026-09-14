"""Controls and read-only snapshot for the shared live operations state."""

from fastapi import APIRouter

from app.services.operational_state import live_state

router = APIRouter(prefix="/api/live", tags=["Live Operations"])


@router.get("/state")
def get_live_state() -> dict:
    return live_state.snapshot()


@router.post("/start")
def start_live_state(speed: float = 1.0) -> dict:
    live_state.start(speed)
    return live_state.snapshot()


@router.post("/pause")
def pause_live_state() -> dict:
    live_state.pause()
    return live_state.snapshot()


@router.post("/reset")
def reset_live_state() -> dict:
    live_state.reset()
    return live_state.snapshot()


@router.post("/speed/{speed}")
def set_live_speed(speed: float) -> dict:
    live_state.set_speed(speed)
    return live_state.snapshot()


@router.post("/advance/{hours}")
def advance_live_state(hours: float) -> dict:
    live_state.advance(hours)
    return live_state.snapshot()
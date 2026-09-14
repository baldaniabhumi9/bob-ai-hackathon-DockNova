"""Shared deterministic in-memory port operations state."""

from __future__ import annotations

from datetime import datetime, timedelta
from threading import RLock

from app.data.loader import (
    REFERENCE_TIME,
    get_berth_models,
    get_crane_models,
    get_vessel_models,
    get_vessel_workloads,
)
from app.services.optimization.models import (
    BerthModel,
    BerthStatus,
    CraneModel,
    CraneStatus,
    VesselModel,
    VesselStatus,
)


class LiveStateManager:
    """Owns one shared state instance for all API requests."""

    def __init__(self) -> None:
        self._lock = RLock()
        self.reset()

    def reset(self) -> None:
        with getattr(self, "_lock", RLock()):
            self.current_time = REFERENCE_TIME
            self.speed = 1.0
            self.running = False
            self.vessels = get_vessel_models(self.current_time)
            self.berths = get_berth_models(self.current_time)
            self.cranes = get_crane_models()
            self.workloads = get_vessel_workloads()
            self.progress_teu = {v.id: 0.0 for v in self.vessels}
            self.assignments: dict[str, str] = {}
            self.crane_assignments: dict[str, list[str]] = {}
            self.events: list[dict[str, str]] = []
            self._last_wall_time = datetime.utcnow()
            self._reconcile()

    def start(self, speed: float = 1.0) -> None:
        with self._lock:
            self.speed = speed if speed in (1.0, 5.0, 10.0) else 1.0
            self.running = True
            self._last_wall_time = datetime.utcnow()

    def pause(self) -> None:
        with self._lock:
            self._advance_from_wall_clock()
            self.running = False

    def set_speed(self, speed: float) -> None:
        with self._lock:
            self._advance_from_wall_clock()
            self.speed = speed if speed in (1.0, 5.0, 10.0) else 1.0

    def advance(self, hours: float) -> None:
        with self._lock:
            self._advance(hours)

    def tick(self) -> None:
        with self._lock:
            self._advance_from_wall_clock()

    def _advance_from_wall_clock(self) -> None:
        now = datetime.utcnow()
        if self.running:
            elapsed = max(0.0, (now - self._last_wall_time).total_seconds() / 3600)
            if elapsed:
                self._advance(elapsed * self.speed)
        self._last_wall_time = now

    def _advance(self, hours: float) -> None:
        if hours <= 0:
            return
        self.current_time += timedelta(hours=hours)
        self._reconcile(hours)

    def _record(self, vessel: VesselModel, message: str) -> None:
        self.events.insert(0, {
            "timestamp": self.current_time.isoformat(),
            "vesselId": vessel.id,
            "message": message,
        })
        self.events = self.events[:50]

    def _reconcile(self, elapsed_hours: float = 0.0) -> None:
        for vessel in self.vessels:
            if vessel.status == VesselStatus.SCHEDULED and vessel.eta <= self.current_time:
                vessel.status = VesselStatus.WAITING
                self._record(vessel, f"{vessel.name} arrived and entered the waiting queue")

        self._release_completed()
        self._assign_waiting_vessels()
        self._update_progress(elapsed_hours)
        self._release_completed()
        self._assign_waiting_vessels()

    def _release_completed(self) -> None:
        for vessel in self.vessels:
            berth_id = self.assignments.get(vessel.id)
            if not berth_id or vessel.status not in (VesselStatus.BERTHED, VesselStatus.HANDLING, VesselStatus.COMPLETED):
                continue
            if self.progress_teu[vessel.id] < self.workloads.get(vessel.id, 0.0):
                continue
            vessel.status = VesselStatus.COMPLETED
            vessel.etd = self.current_time
            berth = next(b for b in self.berths if b.id == berth_id)
            berth.status = BerthStatus.AVAILABLE
            berth.current_vessel_id = None
            for crane_id in self.crane_assignments.get(vessel.id, []):
                crane = next(c for c in self.cranes if c.id == crane_id)
                crane.status = CraneStatus.OPERATIONAL
            self._record(vessel, f"{vessel.name} completed handling and departed")
            vessel.status = VesselStatus.DEPARTED
            self.assignments.pop(vessel.id, None)
            self.crane_assignments.pop(vessel.id, None)

    def _assign_waiting_vessels(self) -> None:
        waiting = sorted(
            (v for v in self.vessels if v.status == VesselStatus.WAITING),
            key=lambda v: ({"HIGH": 0, "MEDIUM": 1, "LOW": 2}[v.priority.value], v.eta),
        )
        for vessel in waiting:
            berth = next((b for b in self.berths if self._eligible(vessel, b)), None)
            if berth is None:
                continue
            available = [
                c for c in self.cranes
                if c.berth_id == berth.id and c.status in (CraneStatus.OPERATIONAL, CraneStatus.IDLE)
            ]
            if not available:
                continue
            vessel.status = VesselStatus.HANDLING
            berth.status = BerthStatus.OCCUPIED
            berth.current_vessel_id = vessel.id
            self.assignments[vessel.id] = berth.id
            selected = available[: max(1, min(len(available), 2))]
            self.crane_assignments[vessel.id] = [c.id for c in selected]
            for crane in selected:
                crane.status = CraneStatus.IDLE
            self._record(vessel, f"{vessel.name} berthed at {berth.code} with {len(selected)} cranes")

    def _update_progress(self, elapsed_hours: float) -> None:
        for vessel in self.vessels:
            if vessel.status not in (VesselStatus.BERTHED, VesselStatus.HANDLING):
                continue
            crane_ids = self.crane_assignments.get(vessel.id, [])
            capacity = sum(c.capacity_teu_per_hour for c in self.cranes if c.id in crane_ids)
            self.progress_teu[vessel.id] = min(
                self.workloads.get(vessel.id, 0.0),
                self.progress_teu[vessel.id] + capacity * elapsed_hours,
            )

    @staticmethod
    def _eligible(vessel: VesselModel, berth: BerthModel) -> bool:
        return (
            berth.status == BerthStatus.AVAILABLE
            and vessel.draft_meters <= berth.max_draft_meters
            and vessel.length_meters <= berth.max_length_meters
            and vessel.type in berth.compatible_vessel_types
        )

    def snapshot(self) -> dict:
        with self._lock:
            self.tick()
            waiting = [v for v in self.vessels if v.status == VesselStatus.WAITING]
            occupied = [b for b in self.berths if b.status == BerthStatus.OCCUPIED]
            return {
                "currentTime": self.current_time,
                "running": self.running,
                "speed": self.speed,
                "vessels": list(self.vessels),
                "berths": list(self.berths),
                "cranes": list(self.cranes),
                "workloads": dict(self.workloads),
                "progressTEU": dict(self.progress_teu),
                "waitingVessels": len(waiting),
                "occupiedBerths": len(occupied),
                "events": list(self.events),
            }


live_state = LiveStateManager()
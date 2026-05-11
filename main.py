from __future__ import annotations

import math
import random
import time
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


ROOT = Path(__file__).resolve().parent

app = FastAPI(title="Factory Command Center", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=ROOT), name="static")


@app.on_event("startup")
def startup() -> None:
    _initialize_telemetry_state()


BASE_LINES: list[dict[str, Any]] = [
    {"id": "L-01", "name": "Final Assembly A", "status": "green", "output": 412, "target": 440, "oee": 94, "yield": 97, "downtime": "7m", "takt": 55, "cycle": 52},
    {"id": "L-02", "name": "Final Assembly B", "status": "green", "output": 387, "target": 400, "oee": 91, "yield": 99, "downtime": "12m", "takt": 55, "cycle": 54},
    {"id": "L-03", "name": "Weld & Join", "status": "red", "output": 298, "target": 380, "oee": 67, "yield": 84, "downtime": "48m", "takt": 42, "cycle": 61},
    {"id": "L-04", "name": "Sub-Assembly C", "status": "green", "output": 444, "target": 450, "oee": 93, "yield": 98, "downtime": "9m", "takt": 50, "cycle": 49},
    {"id": "L-05", "name": "Paint & Finish", "status": "amber", "output": 320, "target": 360, "oee": 78, "yield": 91, "downtime": "28m", "takt": 60, "cycle": 68},
    {"id": "L-06", "name": "Electrical Fit", "status": "green", "output": 401, "target": 420, "oee": 89, "yield": 96, "downtime": "14m", "takt": 48, "cycle": 46},
    {"id": "L-07", "name": "Press & Form", "status": "red", "output": 210, "target": 350, "oee": 55, "yield": 79, "downtime": "72m", "takt": 38, "cycle": 71},
    {"id": "L-08", "name": "Machining A", "status": "green", "output": 368, "target": 380, "oee": 90, "yield": 97, "downtime": "11m", "takt": 44, "cycle": 43},
    {"id": "L-09", "name": "Packaging", "status": "amber", "output": 305, "target": 360, "oee": 75, "yield": 88, "downtime": "24m", "takt": 36, "cycle": 42},
    {"id": "L-10", "name": "QA & Test", "status": "green", "output": 430, "target": 440, "oee": 92, "yield": 98, "downtime": "8m", "takt": 52, "cycle": 50},
]

STATIONS: list[dict[str, Any]] = [
    {"name": "Material Intake", "type": "INTAKE", "units": 308, "pass": 307, "cycle": "28.3s", "defects": 1},
    {"name": "CNC Machining", "type": "MACHINE", "units": 299, "pass": 296, "cycle": "42.1s", "defects": 3},
    {"name": "Press Forming", "type": "PRESS", "units": 290, "pass": 289, "cycle": "18.7s", "defects": 2},
    {"name": "Deburring", "type": "FINISH", "units": 287, "pass": 287, "cycle": "12.4s", "defects": 0},
    {"name": "Sub-Assembly I", "type": "ASSEMBLY", "units": 283, "pass": 282, "cycle": "55.2s", "defects": 2},
    {"name": "Sub-Assembly II", "type": "ASSEMBLY", "units": 280, "pass": 279, "cycle": "61.8s", "defects": 1},
    {"name": "Welding", "type": "WELD", "units": 275, "pass": 271, "cycle": "34.5s", "defects": 7},
    {"name": "Heat Treatment", "type": "THERMAL", "units": 270, "pass": 270, "cycle": "180s", "defects": 0},
    {"name": "Painting", "type": "PAINT", "units": 267, "pass": 263, "cycle": "48.0s", "defects": 5},
    {"name": "Electrical Install", "type": "ELEC", "units": 262, "pass": 261, "cycle": "72.3s", "defects": 1},
    {"name": "Final Assembly", "type": "ASSEMBLY", "units": 259, "pass": 258, "cycle": "88.5s", "defects": 1},
    {"name": "QA Inspection", "type": "QA", "units": 257, "pass": 257, "cycle": "24.1s", "defects": 0},
]

ASSETS: list[dict[str, Any]] = [
    {"name": "L-07 Hydraulic Press #3", "line": "L-07", "health": 23, "mtbf": 18, "mttr": 4.2, "status": "red", "risk": "<2h", "type": "RED"},
    {"name": "L-03 Weld Station #7", "line": "L-03", "health": 48, "mtbf": 42, "mttr": 3.1, "status": "amber", "risk": "<8h", "type": "AMBER"},
    {"name": "L-05 Paint Oven #2", "line": "L-05", "health": 61, "mtbf": 68, "mttr": 2.4, "status": "amber", "risk": "<24h", "type": "AMBER"},
    {"name": "L-01 Assembly Robot #2", "line": "L-01", "health": 79, "mtbf": 112, "mttr": 1.8, "status": "green", "risk": ">48h", "type": "GREEN"},
    {"name": "L-06 Test Bench #1", "line": "L-06", "health": 82, "mtbf": 128, "mttr": 1.2, "status": "green", "risk": ">72h", "type": "GREEN"},
]

MAINT_EVENTS: list[dict[str, Any]] = [
    {"time": "13:58", "type": "EMERGENCY", "asset": "L-07 Hydraulic Press #3", "desc": "Emergency shutdown - pressure sensor failure", "status": "OPEN", "dur": "Ongoing", "color": "red"},
    {"time": "12:30", "type": "CORRECTIVE", "asset": "L-03 Weld Station #7", "desc": "Weld tip replacement after temp exceedance", "status": "IN PROGRESS", "dur": "45m", "color": "amber"},
    {"time": "10:00", "type": "PLANNED", "asset": "L-08 CNC #2", "desc": "Scheduled PM - lubrication & calibration", "status": "COMPLETED", "dur": "62m", "color": "green"},
    {"time": "09:15", "type": "PLANNED", "asset": "L-04 Press #1", "desc": "Bearing inspection - PM compliance", "status": "COMPLETED", "dur": "38m", "color": "green"},
    {"time": "UPCOMING", "type": "PLANNED", "asset": "L-05 Paint Oven #2", "desc": "Temperature sensor calibration - overdue 2 days", "status": "SCHEDULED", "dur": "30m est.", "color": "blue"},
    {"time": "UPCOMING", "type": "PLANNED", "asset": "L-10 Test Bench #3", "desc": "Quarterly calibration verification", "status": "SCHEDULED", "dur": "60m est.", "color": "blue"},
]

DEFECT_LOG: list[dict[str, str]] = [
    {"time": "14:18", "line": "L-07", "station": "ST-03", "serial": "SN-00821", "batch": "BATCH-44B", "cat": "Dimensional", "sev": "CRITICAL", "op": "OP-214", "status": "Open"},
    {"time": "13:55", "line": "L-03", "station": "ST-07", "serial": "SN-00694", "batch": "BATCH-43A", "cat": "Weld", "sev": "CRITICAL", "op": "OP-208", "status": "In Review"},
    {"time": "13:42", "line": "L-05", "station": "ST-09", "serial": "SN-00712", "batch": "BATCH-43C", "cat": "Paint", "sev": "WARNING", "op": "OP-219", "status": "Open"},
    {"time": "13:11", "line": "L-03", "station": "ST-07", "serial": "SN-00688", "batch": "BATCH-43A", "cat": "Weld", "sev": "HIGH", "op": "OP-208", "status": "Rework"},
    {"time": "12:48", "line": "L-07", "station": "ST-03", "serial": "SN-00801", "batch": "BATCH-44B", "cat": "Dimensional", "sev": "HIGH", "op": "OP-214", "status": "Scrap"},
    {"time": "12:30", "line": "L-03", "station": "ST-06", "serial": "SN-00675", "batch": "BATCH-43A", "cat": "Weld", "sev": "MEDIUM", "op": "OP-207", "status": "Closed"},
    {"time": "12:15", "line": "L-01", "station": "ST-11", "serial": "SN-00641", "batch": "BATCH-42A", "cat": "Assembly", "sev": "LOW", "op": "OP-201", "status": "Closed"},
    {"time": "11:52", "line": "L-05", "station": "ST-09", "serial": "SN-00698", "batch": "BATCH-43C", "cat": "Paint", "sev": "MEDIUM", "op": "OP-219", "status": "Rework"},
]

KPI_SUMMARY: list[dict[str, str]] = [
    {"name": "Overall OEE", "actual": "82%", "target": "85%", "delta": "-3%", "status": "amber"},
    {"name": "First Pass Yield", "actual": "94.3%", "target": "95%", "delta": "-0.7%", "status": "amber"},
    {"name": "Safety - Days Clean", "actual": "14", "target": "30", "delta": "On track", "status": "green"},
    {"name": "Customer OTIF", "actual": "96.4%", "target": "98%", "delta": "-1.6%", "status": "amber"},
    {"name": "PM Compliance", "actual": "87%", "target": "95%", "delta": "-8%", "status": "red"},
    {"name": "Energy kWh/unit", "actual": "2.84", "target": "2.60", "delta": "+0.24", "status": "amber"},
    {"name": "Scrap Rate", "actual": "0.55%", "target": "<0.5%", "delta": "+0.05%", "status": "amber"},
    {"name": "Labor Productivity", "actual": "94 u/h", "target": "100 u/h", "delta": "-6", "status": "amber"},
]

telemetry_state: dict[str, Any] = {}


def _phase() -> float:
    return time.time() / 3.0


def _live_lines() -> list[dict[str, Any]]:
    phase = _phase()
    lines = deepcopy(BASE_LINES)
    for idx, line in enumerate(lines):
        wave = math.sin(phase + idx * 0.74)
        drift = round(wave * (3 + idx % 3))
        line["output"] = max(0, int(line["output"] + drift))
        line["cycle"] = round(max(1, float(line["cycle"]) + wave * 0.9), 1)
        line["oee"] = max(1, min(99, int(line["oee"] + round(wave * 2))))
        line["yield"] = max(1, min(100, int(line["yield"] + round(wave))))
        if line["oee"] >= 85 and line["yield"] >= 95:
            line["status"] = "green"
        elif line["oee"] >= 72:
            line["status"] = "amber"
        else:
            line["status"] = "red"
    lines[2]["status"] = "red"
    lines[6]["status"] = "red"
    return lines


def _live_kpis(lines: list[dict[str, Any]]) -> dict[str, Any]:
    phase = _phase()
    produced = sum(int(line["output"]) for line in lines)
    target = sum(int(line["target"]) for line in lines)
    oee = round(sum(float(line["oee"]) for line in lines) / len(lines), 1)
    fpy = round(sum(float(line["yield"]) for line in lines) / len(lines), 1)
    defects = 24 + int(abs(math.sin(phase)) * 3)
    avg_cycle = round(sum(float(line["cycle"]) for line in lines) / len(lines), 1)
    hourly_base = [350, 370, 420, 400, 440, 430, 450, 438]
    throughput_today = [max(0, v + int(math.sin(phase + i) * 12)) for i, v in enumerate(hourly_base)]
    return {
        "updatedAt": datetime.now().isoformat(),
        "overview": {
            "oee": oee,
            "availability": 91,
            "performance": 87,
            "quality": 96,
            "unitsProduced": produced,
            "unitsTarget": target,
            "firstPassYield": fpy,
            "totalDefects": defects,
            "rework": 3,
            "avgCycleTime": avg_cycle,
            "cycleTarget": 42,
            "otif": 96.4,
        },
        "banner": {
            "greeting": f"Good afternoon, Sarah. Plant running at {round(oee)}% OEE - 2 lines need your attention.",
            "meta": datetime.now().strftime("%a %d %b %Y - %H:%M IST - PLANT 4 - PUNE NORTH - CUSTOMER OTIF: 96.4%%").upper(),
        },
        "throughput": {
            "today": throughput_today,
            "yesterday": [310, 340, 380, 370, 400, 390, 420, 410],
            "target": 400,
            "labels": ["08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h"],
        },
        "sparks": {
            "spk1": throughput_today,
            "spk2": [95, 94, 96, 93, 95, 94, 95, round(fpy)],
            "spk3": [32, 28, 35, 24, 30, 22, 28, defects],
            "spk4": [44, 46, 43, 48, 45, 47, 46, avg_cycle],
        },
        "defectBreakdown": [
            {"label": "Dimensional", "n": 8, "c": "#ef4444"},
            {"label": "Weld", "n": 6, "c": "#f59e0b"},
            {"label": "Paint", "n": 5, "c": "#2563eb"},
            {"label": "Assembly", "n": 3, "c": "#6366f1"},
            {"label": "Other", "n": defects - 22, "c": "#a8a8b8"},
        ],
        "bottlenecks": [
            {"l": "L-07 Press", "m": 72 + int(abs(math.sin(phase)) * 3), "c": "var(--red)"},
            {"l": "L-03 Weld", "m": 48 + int(abs(math.cos(phase)) * 2), "c": "var(--red)"},
            {"l": "L-05 Paint", "m": 28, "c": "var(--amber)"},
            {"l": "L-09 Pack", "m": 24, "c": "var(--amber)"},
            {"l": "L-01 Assm", "m": 7, "c": "var(--green)"},
        ],
        "shiftComparison": [
            {"v": 3650, "l": "A Mon"},
            {"v": 3820, "l": "B Mon"},
            {"v": 3710, "l": "A Tue"},
            {"v": produced, "l": "B Now"},
        ],
        "quality": {
            "defectLog": DEFECT_LOG,
            "kpiSummary": KPI_SUMMARY,
        },
    }


def _initialize_telemetry_state() -> None:
    lines = _live_lines()
    base_state = _live_kpis(lines)
    telemetry_state.clear()
    telemetry_state.update(base_state)
    telemetry_state["updatedAt"] = datetime.now().isoformat()


def simulate_telemetry_tick() -> None:
    if not telemetry_state:
        return

    overview = telemetry_state["overview"]
    overview["unitsProduced"] = int(overview["unitsProduced"] + random.randint(0, 3))
    overview["totalDefects"] = int(overview["totalDefects"] + random.choice([0, 0, 0, 1]))

    current_oee = float(overview["oee"])
    current_oee = round(max(1.0, min(99.9, current_oee + random.uniform(-0.1, 0.1))), 1)
    overview["oee"] = current_oee

    current_avg_cycle = float(overview["avgCycleTime"])
    current_avg_cycle = round(max(1.0, current_avg_cycle + random.uniform(-0.1, 0.1)), 1)
    overview["avgCycleTime"] = current_avg_cycle

    throughput_today = telemetry_state["throughput"]["today"]
    if throughput_today:
        last_point = int(throughput_today[-1])
        next_point = max(0, last_point + random.randint(-5, 5))
        throughput_today.pop(0)
        throughput_today.append(next_point)

    telemetry_state["sparks"]["spk1"] = throughput_today
    telemetry_state["sparks"]["spk3"][-1] = int(overview["totalDefects"])
    telemetry_state["sparks"]["spk4"][-1] = current_avg_cycle

    for bottleneck in telemetry_state["bottlenecks"]:
        label = bottleneck["l"]
        if label == "L-07 Press":
            bottleneck["m"] = 72 + random.randint(0, 3)
        elif label == "L-03 Weld":
            bottleneck["m"] = 48 + random.randint(0, 2)
        elif label == "L-05 Paint":
            bottleneck["m"] = 28
        elif label == "L-09 Pack":
            bottleneck["m"] = 24
        elif label == "L-01 Assm":
            bottleneck["m"] = 7

    telemetry_state["banner"]["greeting"] = (
        f"Good afternoon, Sarah. Plant running at {round(current_oee)}% OEE - 2 lines need your attention."
    )
    telemetry_state["banner"]["meta"] = datetime.now().strftime(
        "%a %d %b %Y - %H:%M IST - PLANT 4 - PUNE NORTH - CUSTOMER OTIF: 96.4%%"
    ).upper()
    telemetry_state["updatedAt"] = datetime.now().isoformat()


def _live_alerts() -> dict[str, Any]:
    phase = _phase()
    alerts = [
        {
            "location": "L-07 - ST-03",
            "title": "L-07 - Hydraulic Pressure Drop",
            "issue": "Hydraulic pressure drop",
            "detail": "SN-00821 - BATCH-44B - Station 03",
            "operator": "OP-214",
            "serial": "SN-00821",
            "batch": "BATCH-44B",
            "severity": "CRITICAL",
            "status": "red",
            "time": f"{2 + int(abs(math.sin(phase)))}m",
        },
        {
            "location": "L-03 - ST-07",
            "title": "L-03 - Weld Temp Exceeded",
            "issue": "Weld temp exceeded UCL +12C",
            "detail": "SN-00694 - BATCH-43A - Station 07",
            "operator": "OP-208",
            "serial": "SN-00694",
            "batch": "BATCH-43A",
            "severity": "CRITICAL",
            "status": "red",
            "time": "18m",
        },
        {
            "location": "L-05 - ST-09",
            "title": "L-05 - Paint Color Deviation",
            "issue": "Paint color deviation Delta=4.2",
            "detail": "SN-00712 - BATCH-43C - Station 09",
            "operator": "OP-219",
            "serial": "SN-00712",
            "batch": "BATCH-43C",
            "severity": "WARNING",
            "status": "amber",
            "time": "41m",
        },
    ]
    return {"updatedAt": datetime.now().isoformat(), "open": len(alerts), "alerts": alerts}


@app.get("/")
def dashboard() -> FileResponse:
    return FileResponse(ROOT / "dashboard.html")


@app.get("/kpis")
def kpis() -> dict[str, Any]:
    simulate_telemetry_tick()
    telemetry_state["overview"]["unitsTarget"] = telemetry_state["overview"].get("unitsTarget", telemetry_state["overview"]["unitsProduced"])
    telemetry_state["shiftComparison"][3]["v"] = telemetry_state["overview"]["unitsProduced"]
    return telemetry_state


@app.get("/machines")
def machines() -> dict[str, Any]:
    return {
        "updatedAt": datetime.now().isoformat(),
        "machines": _live_lines(),
        "stations": deepcopy(STATIONS),
        "assets": deepcopy(ASSETS),
        "maintenanceEvents": deepcopy(MAINT_EVENTS),
    }


@app.get("/alerts")
def alerts() -> dict[str, Any]:
    return _live_alerts()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

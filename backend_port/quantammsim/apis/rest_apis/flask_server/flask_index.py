import time
from datetime import timedelta, datetime
import threading
import traceback

from flask import Flask, request
import json
import jsonpickle
from flask_cors import CORS
import pandas as pd
import os
import hashlib
import hmac
import ipaddress
from datetime import timezone as tz

from quantammsim.apis.rest_apis.simulator_dtos.simulation_run_dto import (
    FinancialAnalysisResult,
    LoadPriceHistoryRequestDto,
    TrainingDto,
    SimulationRunDto,
    SimulationResult,
    FinancialAnalysisRequestDto,
)

from quantammsim.simulator_analysis_tools.finance.param_financial_calculator import (
    run_pool_simulation,
    run_financial_analysis,
    process_return_array,
)
from quantammsim.utils.data_processing.historic_data_utils import (
    get_historic_daily_csv_data,
    get_coin_comparison_data,
)
from quantammsim.runners.jax_runners import train_on_historic_data
from quantammsim.core_simulator.param_utils import get_run_location

app = Flask(__name__, static_url_path="", static_folder="frontend/quantAMMapp/build")

CORS(app)

app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_ACCESS_CSRF_HEADER_NAME"] = "ROBODEX-X-CSRF-TOKEN"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
app.config["JWT_SECRET_KEY"] = (
    "2b25014d8e591e91cc4e3bfc3a7561983e06bc7ff0a140bcecca3c0a15d31c5e"
)

TRAINING_RUNS = {}
TRAINING_RUNS_LOCK = threading.Lock()


def _to_float(value):
    if isinstance(value, bool):
        return 1.0 if value else 0.0
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "":
            return None
        try:
            return float(stripped)
        except ValueError:
            return None
    return None


def _to_int(value):
    parsed = _to_float(value)
    if parsed is None:
        return None
    return int(parsed)


def _read_result_entries(run_location):
    if not os.path.exists(run_location):
        return []

    with open(run_location, "r", encoding="utf-8") as result_file:
        data = json.load(result_file)

    if isinstance(data, str):
        try:
            parsed = json.loads(data)
        except json.JSONDecodeError:
            return []
    elif isinstance(data, list):
        parsed = data
    else:
        return []

    if not isinstance(parsed, list):
        return []

    return parsed


def _extract_objective_value(value, preferred_metric):
    if isinstance(value, dict):
        if preferred_metric in value:
            preferred = _to_float(value.get(preferred_metric))
            if preferred is not None:
                return preferred
        for candidate_key in (
            "daily_log_sharpe",
            "sharpe",
            "returns_over_uniform_hodl",
            "returns_over_hodl",
            "return",
            "returns",
            "objective",
        ):
            candidate = _to_float(value.get(candidate_key))
            if candidate is not None:
                return candidate
        for candidate in value.values():
            parsed = _to_float(candidate)
            if parsed is not None:
                return parsed
        return None

    if isinstance(value, list):
        parsed_values = []
        for item in value:
            parsed = _extract_objective_value(item, preferred_metric)
            if parsed is not None:
                parsed_values.append(parsed)
        if len(parsed_values) == 0:
            return None
        return sum(parsed_values) / len(parsed_values)

    return _to_float(value)


def _summarise_training_progress(run_location):
    entries = _read_result_entries(run_location)
    if len(entries) == 0:
        return {"latestStep": 0, "latestObjective": None, "totalSteps": None}

    run_fingerprint = entries[0] if isinstance(entries[0], dict) else {}
    preferred_metric = run_fingerprint.get("return_val", "daily_log_sharpe")

    step_entries = [entry for entry in entries[1:] if isinstance(entry, dict)]
    if len(step_entries) == 0:
        total_steps = _to_int(
            (run_fingerprint.get("optimisation_settings") or {}).get("n_iterations")
        )
        return {"latestStep": 0, "latestObjective": None, "totalSteps": total_steps}

    latest_step = max(_to_int(entry.get("step")) or 0 for entry in step_entries)
    latest_entries = [
        entry for entry in step_entries if (_to_int(entry.get("step")) or 0) == latest_step
    ]

    objective_candidates = []
    for entry in latest_entries:
        objective_value = _extract_objective_value(
            entry.get("objective"), preferred_metric
        )
        if objective_value is None:
            objective_value = _extract_objective_value(
                entry.get("train_objective"), preferred_metric
            )
        if objective_value is None:
            objective_value = _extract_objective_value(
                entry.get("test_objective"), preferred_metric
            )
        if objective_value is not None:
            objective_candidates.append(objective_value)

    latest_objective = max(objective_candidates) if len(objective_candidates) > 0 else None
    total_steps = _to_int(
        (run_fingerprint.get("optimisation_settings") or {}).get("n_iterations")
    )

    return {
        "latestStep": latest_step,
        "latestObjective": latest_objective,
        "totalSteps": total_steps,
    }


def _set_run_state(run_id, **kwargs):
    with TRAINING_RUNS_LOCK:
        state = TRAINING_RUNS.get(run_id, {})
        state.update(kwargs)
        TRAINING_RUNS[run_id] = state
        return dict(state)


def _get_run_state(run_id):
    with TRAINING_RUNS_LOCK:
        state = TRAINING_RUNS.get(run_id)
        return dict(state) if state is not None else None


def _training_worker(run_id, run_fingerprint, run_location):
    try:
        _set_run_state(run_id, status="Running")
        train_on_historic_data(run_fingerprint=run_fingerprint, verbose=False)
        _set_run_state(
            run_id,
            status="Complete",
            finishedAtIso=datetime.now(tz.utc).isoformat(),
        )
    except Exception as exc:
        traceback.print_exc()
        _set_run_state(
            run_id,
            status="Failed",
            errorMessage=str(exc),
            finishedAtIso=datetime.now(tz.utc).isoformat(),
        )


def _run_training_response_payload(run_id, run_location, status, error_message=None):
    progress = _summarise_training_progress(run_location)
    payload = {
        "runId": run_id,
        "trainingRunId": run_id,
        "runLocation": run_location,
        "status": status,
        "latestStep": progress.get("latestStep"),
        "currentStep": progress.get("latestStep"),
        "step": progress.get("latestStep"),
        "totalSteps": progress.get("totalSteps"),
        "stepsTotal": progress.get("totalSteps"),
        "latestObjective": progress.get("latestObjective"),
        "objective": progress.get("latestObjective"),
    }
    if error_message:
        payload["errorMessage"] = error_message
        payload["error"] = error_message
    return payload


@app.route("/api/runTraining", methods=["POST"])
def runTraining():
    request_data = request.get_json()
    dto = TrainingDto(request_data)

    base_run_id = (dto.trainingRunFilename or "").strip() or f"train-btf-{int(time.time())}"
    existing_state = _get_run_state(base_run_id)
    if existing_state and existing_state.get("status") == "Running":
        run_location = existing_state.get("runLocation", "")
        payload = _run_training_response_payload(
            base_run_id, run_location, existing_state.get("status", "Running")
        )
        return json.dumps(payload)

    run_id = base_run_id
    if existing_state and existing_state.get("status") in {"Complete", "Failed"}:
        run_id = f"{base_run_id}-{int(time.time())}"
        dto.trainingRunFilename = run_id

    run_fingerprint = dto.convert_to_run_fingerprint()
    run_name = get_run_location(run_fingerprint)
    run_location = os.path.join("./results", f"{run_name}.json")

    if os.path.exists(run_location):
        run_id = f"{run_id}-{int(time.time())}"
        dto.trainingRunFilename = run_id
        run_fingerprint = dto.convert_to_run_fingerprint()
        run_name = get_run_location(run_fingerprint)
        run_location = os.path.join("./results", f"{run_name}.json")

    worker = threading.Thread(
        target=_training_worker,
        args=(run_id, run_fingerprint, run_location),
        daemon=True,
    )
    _set_run_state(
        run_id,
        status="Running",
        runLocation=run_location,
        startedAtIso=datetime.now(tz.utc).isoformat(),
        threadName=worker.name,
    )
    worker.start()

    payload = _run_training_response_payload(run_id, run_location, "Running")
    return json.dumps(payload)


@app.route("/api/retrieveTraining", methods=["POST"])
def retrieveTraining():
    request_data = request.get_json()
    dto = TrainingDto(request_data)
    requested_run_id = (dto.trainingRunFilename or "").strip()

    run_state = _get_run_state(requested_run_id) if requested_run_id else None

    if run_state and run_state.get("runLocation"):
        run_location = run_state["runLocation"]
        status = run_state.get("status", "Running")
        error_message = run_state.get("errorMessage")
        payload = _run_training_response_payload(
            requested_run_id, run_location, status, error_message
        )
        return json.dumps(payload)

    # Fallback for server restarts: infer location from current request payload.
    run_fingerprint = dto.convert_to_run_fingerprint()
    run_name = get_run_location(run_fingerprint)
    run_location = os.path.join("./results", f"{run_name}.json")

    status = "Pending"
    if os.path.exists(run_location):
        progress = _summarise_training_progress(run_location)
        latest_step = progress.get("latestStep")
        total_steps = progress.get("totalSteps")
        if (
            isinstance(latest_step, int)
            and isinstance(total_steps, int)
            and total_steps > 0
            and latest_step >= total_steps
        ):
            status = "Complete"
        else:
            status = "Running"
    payload = _run_training_response_payload(
        requested_run_id or run_name, run_location, status
    )
    return json.dumps(payload)


@app.route("/api/runSimulation", methods=["POST"])
def runSimulation():
    """
    Handle the POST request to run a simulation.

    This function reads the request data, initializes a SimulationRunDto object,
    and runs the pool simulation. The results are then encoded into JSON format
    and returned as a response.

    Returns
    -------
    str
        A JSON string containing the simulation results.
    """
    request_data = request.get_json()

    dto = SimulationRunDto(request_data)
    result = run_pool_simulation(dto)

    print(result["analysis"])
    
    resultJSON = jsonpickle.encode(SimulationResult(result), unpicklable=False)
    jsonString = json.dumps(resultJSON, indent=4)

    return jsonString


PEPPER = os.environ.get(
    "IP_HASH_PEPPER", app.config["JWT_SECRET_KEY"]
).encode()  # 32 random bytes


def canonical_ip(raw_ip: str) -> str:
    """First hop, trimmed, canonical textual representation."""
    first = raw_ip.split(",")[0].strip()  # X-Forwarded-For support
    # strip :port on IPv4
    if first.count(":") == 1 and "." in first:
        first = first.split(":")[0]
    return str(ipaddress.ip_address(first))


def hash_ip(ip: str) -> str:
    """Deterministic, keyed, one-way hash of an IP address."""
    return hmac.new(PEPPER, ip.encode(), hashlib.sha256).hexdigest()


@app.route("/api/runAuditLog", methods=["POST"])
def runAuditLog():
    """
    Handle the POST request to log audit information.

    This function retrieves a parquet file labeled with today's Unix timestamp,
    updates the log with the provided audit information, and saves the updated file.

    Returns
    -------
    str
        A success message.
    """

    # Retrieve the request data
    request_data = request.get_json()

    requester_ip = canonical_ip(
        request.headers.get("X-Forwarded-For", request.remote_addr)
    )
    hashed_ip = hash_ip(requester_ip)

    timezone = (
        request_data["timestamp"].split(",")[-1].strip()
        if "," in request_data.get("timestamp", "")
        else "Unknown"
    )

    audit_info = {
        "timestamp": int(
            datetime.now(tz.utc).replace(second=0, microsecond=0).timestamp()
        ),
        "user": request_data["user"],  # FingerprintJS visitorId from front-end
        "page": request_data["page"],
        "tosAgreement": request_data["tosAgreement"],
        "isMobile": request_data["isMobile"],
        "timezone": timezone,
        "flask_user": hashed_ip,  # pseudonymised IP
    }

    today_unix_timestamp = int(
        datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
    )
    file_name = f"{today_unix_timestamp}.parquet"
    file_path = os.path.join("./audit_logs", file_name)

    if os.path.exists(file_path):
        df = pd.read_parquet(file_path, engine="pyarrow")
    else:
        df = pd.DataFrame(
            columns=[
                "timestamp",
                "user",
                "page",
                "tosAgreement",
                "isMobile",
                "timezone",
                "flask_user",
                "count",
            ]
        )

    row_filter = (
        (df["timestamp"] == audit_info["timestamp"])
        & (df["user"] == audit_info["user"])
        & (df["page"] == audit_info["page"])
        & (df["tosAgreement"] == audit_info["tosAgreement"])
        & (df["isMobile"] == audit_info["isMobile"])
        & (df["timezone"] == audit_info["timezone"])
        & (df["flask_user"] == audit_info["flask_user"])
    )

    if df[row_filter].empty:
        audit_info["count"] = 1
        df = pd.concat([df, pd.DataFrame([audit_info])], ignore_index=True)
    else:
        df.loc[row_filter, "count"] += 1

    os.makedirs("./audit_logs", exist_ok=True)
    df.to_parquet(file_path, engine="pyarrow")

    return json.dumps({"message": "Audit log updated successfully."})


@app.route("/api/runFinancialAnalysis", methods=["POST"])
def runFinancialAnalysis():
    """
    Handle the POST request to run a financial analysis.

    This function reads the request data, initializes a FinancialAnalysisRequestDto object,
    processes the return arrays, and runs the financial analysis. The results are then encoded
    into JSON format and returned as a response.

    Returns
    -------
    str
        A JSON string containing the financial analysis results.
    """
    request_data = request.get_json()
    dto = FinancialAnalysisRequestDto(request_data)

    portfolio_returns, benchmark_returns, _, _ = process_return_array(
        dto.returns, dto.benchmarks
    )

    start_timestamp = dto.returns[0][0]
    end_timestamp = dto.returns[-1][0]
    start_date = time.strftime(
        "%Y-%m-%d  %H:%M:%S", time.gmtime(start_timestamp / 1000)
    )
    end_date = time.strftime("%Y-%m-%d  %H:%M:%S", time.gmtime(end_timestamp / 1000))

    result = run_financial_analysis(
        portfolio_daily_returns=portfolio_returns,
        startDateString=start_date,
        endDateString=end_date,
        bechmark_names=dto.benchmarks,
        benchmarks_returns=benchmark_returns,
    )

    resultJSON = jsonpickle.encode(FinancialAnalysisResult(result), unpicklable=False)
    jsonString = json.dumps(resultJSON, indent=4)

    return jsonString


@app.route("/api/loadHistoricDailyPrices", methods=["POST"])
def loadHistoricDailyPrices():
    """
    Handle the POST request to load historic daily prices.

    This function reads the request data, initializes a LoadPriceHistoryRequestDto object,
    retrieves historic daily price data from CSV files, converts the data to JSON format,
    and returns the JSON string as a response.

    Returns
    -------
    str
        A JSON string containing the historic daily price data.
    """
    request_data = request.get_json()
    dto = LoadPriceHistoryRequestDto(request_data)
    root = "../../../../quantammsim/data/"
    historic = get_historic_daily_csv_data([dto.coinCode], root)
    result = historic.to_json(orient="records")  # Is this the right way to do this?
    parsed = json.loads(result)
    jsonString = json.dumps(parsed)
    return jsonString


@app.route("/api/loadCoinComparisonData", methods=["POST"])
def loadCoinComparisonData():
    """
    Handle the POST request to load coin comparison data.

    This function retrieves coin comparison data from CSV files, converts the data to JSON format,
    and returns the JSON string as a response.

    Returns
    -------
    str
        A JSON string containing the coin comparison data.
    """
    root = "../../../../quantammsim/data/"
    historic = get_coin_comparison_data(root)
    result = historic.to_json(orient="records")
    parsed = json.loads(result)
    jsonString = json.dumps(parsed)
    ##return result
    return jsonString


@app.route("/api/products", methods=["GET"])
def products():
    """
    Handle the GET request to retrieve product information.

    This function reads product data from a JSON file and returns it as a response.

    Returns
    -------
    dict
        A dictionary containing the product information.
    """
    file_path = "./stubs/productStubs.json"

    with open(file_path, "r", encoding="utf-8") as file:
        content = json.load(file)

    return content


@app.route("/api/filters", methods=["GET"])
def filters():
    """
    Handle the GET request to retrieve filter information.

    This function reads filter data from a JSON file and returns it as a response.

    Returns
    -------
    dict
        A dictionary containing the filter information.
    """
    file_path = "./stubs/filterStubs.json"

    with open(file_path, "r", encoding="utf-8") as file:
        content = json.load(file)

    return content


@app.route("/api/test", methods=["GET"])
def test():
    return "Hello World"


@app.route("/health", methods=["GET"])
def health():
    return "OK"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5001")

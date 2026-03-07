Backend Port Files
==================

Copy these files into `github-quantamm-sim`:

1. `backend_port/quantammsim/apis/rest_apis/flask_server/flask_index.py`
   -> `quantammsim/apis/rest_apis/flask_server/flask_index.py`
2. `backend_port/quantammsim/apis/rest_apis/simulator_dtos/simulation_run_dto.py`
   -> `quantammsim/apis/rest_apis/simulator_dtos/simulation_run_dto.py`
3. `backend_port/quantammsim/simulatorMocks/simulationRunDto.py`
   -> `quantammsim/simulatorMocks/simulationRunDto.py`

What This Adds
--------------

- `runTraining` API endpoint:
  - Accepts `TrainingDto`
  - Builds run fingerprint via `TrainingDto.convert_to_run_fingerprint()`
  - Starts async training thread with `train_on_historic_data`
  - Returns shape compatible with web polling (`runId`, `runLocation`, `status`, `latestStep`, `totalSteps`, `latestObjective`)

- `retrieveTraining` API endpoint:
  - Returns current run status from in-memory map when available
  - Falls back to inferred result file status after restart
  - Returns the same polling-compatible shape

- `TrainingDto` conversion hardening:
  - Handles scalar/list update rule values
  - Handles bool/int/float parsing safely
  - Derives `startDateString`/`endDateString` from unix timestamps
  - Maps legacy numeric `return_val` to `optimisation_settings.val_fraction`
  - Writes objective metric to top-level `return_val` (trainer-compatible)
  - Maps `k_per_day` -> `initial_k_per_day` (+ `initial_k` for compatibility)

Quick Copy Commands
-------------------

Run from `github-quantamm-web`:

```bash
cp backend_port/quantammsim/apis/rest_apis/flask_server/flask_index.py \
  ../github-quantamm-sim/quantammsim/apis/rest_apis/flask_server/flask_index.py

cp backend_port/quantammsim/apis/rest_apis/simulator_dtos/simulation_run_dto.py \
  ../github-quantamm-sim/quantammsim/apis/rest_apis/simulator_dtos/simulation_run_dto.py

cp backend_port/quantammsim/simulatorMocks/simulationRunDto.py \
  ../github-quantamm-sim/quantammsim/simulatorMocks/simulationRunDto.py
```

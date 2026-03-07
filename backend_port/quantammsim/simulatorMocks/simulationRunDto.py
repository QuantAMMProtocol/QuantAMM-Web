
from datetime import datetime, timezone


class LoadPriceHistoryRequestDto(object):
    def __init__(self, jsonDto):
        self.coinCode = jsonDto["coinCode"]


class TrainingParameterDto(object):
    def __init__(self, factorDto):
        self.name = factorDto["name"]
        self.value = factorDto["value"]


# input root
class SimulationRunDto(object):
    def __init__(self, jsonDto):
        self.pool = LiquidityPoolDto(jsonDto["pool"])
        self.startDate = jsonDto["startUnix"]
        self.endDate = jsonDto["endUnix"]


class TrainingDto(object):
    @staticmethod
    def _coerce_float(value):
        if value is None:
            return None
        if isinstance(value, list):
            if len(value) == 0:
                return None
            value = value[0]
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

    @staticmethod
    def _coerce_int(value):
        parsed = TrainingDto._coerce_float(value)
        if parsed is None:
            return None
        return int(parsed)

    @staticmethod
    def _coerce_bool(value):
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return value != 0
        if isinstance(value, str):
            normalised = value.strip().lower()
            if normalised in {"true", "1", "yes", "y", "on"}:
                return True
            if normalised in {"false", "0", "no", "n", "off"}:
                return False
        return None

    @staticmethod
    def _coerce_scalar_or_vector(value):
        if value is None:
            return None
        if isinstance(value, list):
            parsed = []
            for item in value:
                parsed_item = TrainingDto._coerce_float(item)
                if parsed_item is None:
                    return None
                parsed.append(parsed_item)
            if len(parsed) == 1:
                return parsed[0]
            return parsed
        return TrainingDto._coerce_float(value)

    @staticmethod
    def _to_utc_string(unix_value):
        timestamp = TrainingDto._coerce_float(unix_value)
        if timestamp is None:
            return None
        if abs(timestamp) >= 10_000_000_000:
            timestamp = timestamp / 1000.0
        return datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime(
            "%Y-%m-%d %H:%M:%S"
        )

    @staticmethod
    def _normalise_objective_and_val_fraction(raw_return_val, raw_val_fraction):
        metric_options = {
            "daily_log_sharpe",
            "sharpe",
            "return",
            "returns",
            "returns_over_hodl",
            "returns_over_uniform_hodl",
            "annualised_returns",
            "calmar",
            "sterling",
            "ulcer",
            "reserves_and_values",
        }
        objective_metric = None
        val_fraction = TrainingDto._coerce_float(raw_val_fraction)

        if isinstance(raw_return_val, str):
            candidate = raw_return_val.strip()
            if candidate in metric_options:
                objective_metric = candidate
            else:
                maybe_fraction = TrainingDto._coerce_float(candidate)
                if maybe_fraction is not None and val_fraction is None:
                    val_fraction = maybe_fraction
        else:
            maybe_fraction = TrainingDto._coerce_float(raw_return_val)
            if maybe_fraction is not None and val_fraction is None:
                val_fraction = maybe_fraction

        if objective_metric is None:
            objective_metric = "daily_log_sharpe"

        if val_fraction is not None:
            if val_fraction < 0.0:
                val_fraction = 0.0
            elif val_fraction >= 1.0:
                val_fraction = 0.99

        return objective_metric, val_fraction

    @staticmethod
    def _set_if_not_none(target_dict, key, value):
        if value is not None:
            target_dict[key] = value

    def convert_to_run_fingerprint(self):
        raw_optimisation_settings = dict()
        update_rule_parameters = dict()

        for urp in self.pool.updateRule.updateRuleFactors:
            update_rule_parameters[urp.name] = urp.value

        for opt in self.trainingParameters.trainingParameters:
            raw_optimisation_settings[opt.name] = opt.value

        optimisation_settings = dict()
        self._set_if_not_none(
            optimisation_settings,
            "base_lr",
            self._coerce_float(raw_optimisation_settings.get("base_lr")),
        )
        optimiser = raw_optimisation_settings.get("optimiser")
        if optimiser is not None and str(optimiser).strip() != "":
            optimisation_settings["optimiser"] = str(optimiser).strip()
        self._set_if_not_none(
            optimisation_settings,
            "decay_lr_ratio",
            self._coerce_float(raw_optimisation_settings.get("decay_lr_ratio")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "decay_lr_plateau",
            self._coerce_float(raw_optimisation_settings.get("decay_lr_plateau")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "batch_size",
            self._coerce_int(raw_optimisation_settings.get("batch_size")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "train_on_hessian_trace",
            self._coerce_bool(raw_optimisation_settings.get("train_on_hessian_trace")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "min_lr",
            self._coerce_float(raw_optimisation_settings.get("min_lr")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "n_iterations",
            self._coerce_int(raw_optimisation_settings.get("n_iterations")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "n_cycles",
            self._coerce_int(raw_optimisation_settings.get("n_cycles")),
        )
        self._set_if_not_none(
            optimisation_settings,
            "n_parameter_sets",
            self._coerce_int(raw_optimisation_settings.get("n_parameter_sets")),
        )

        objective_metric, val_fraction = self._normalise_objective_and_val_fraction(
            raw_optimisation_settings.get("return_val"),
            raw_optimisation_settings.get("val_fraction"),
        )
        optimisation_settings["return_val"] = objective_metric
        self._set_if_not_none(optimisation_settings, "val_fraction", val_fraction)

        run_fingerprint = {
            "filename_override": self.trainingRunFilename or "override",
            "startDateUnix": self.startDate,
            "endDateUnix": self.endDate,
            "tokens": [
                constituent.coinCode for constituent in self.pool.poolConstituents
            ],
            "rule": self.pool.updateRule.name,
            "optimisation_settings": optimisation_settings,
            "return_val": objective_metric,
            "bout_offset": 30 * 24 * 60 * 6,
            "subsidary_pools": [],
        }

        self._set_if_not_none(
            run_fingerprint, "startDateString", self._to_utc_string(self.startDate)
        )
        self._set_if_not_none(
            run_fingerprint, "endDateString", self._to_utc_string(self.endDate)
        )

        initial_memory_length = self._coerce_scalar_or_vector(
            update_rule_parameters.get("memory_length")
        )
        if initial_memory_length is None:
            initial_memory_length = self._coerce_scalar_or_vector(
                update_rule_parameters.get("memory_days")
            )
        self._set_if_not_none(
            run_fingerprint, "initial_memory_length", initial_memory_length
        )

        initial_memory_length_delta = self._coerce_scalar_or_vector(
            update_rule_parameters.get("memory_length_delta")
        )
        if initial_memory_length_delta is None:
            initial_memory_length_delta = self._coerce_scalar_or_vector(
                update_rule_parameters.get("memory_days_delta")
            )
        self._set_if_not_none(
            run_fingerprint, "initial_memory_length_delta", initial_memory_length_delta
        )

        initial_k_per_day = self._coerce_scalar_or_vector(
            update_rule_parameters.get("k_per_day")
        )
        if initial_k_per_day is None:
            initial_k_per_day = self._coerce_scalar_or_vector(
                update_rule_parameters.get("k")
            )
        self._set_if_not_none(run_fingerprint, "initial_k_per_day", initial_k_per_day)
        self._set_if_not_none(run_fingerprint, "initial_k", initial_k_per_day)

        self._set_if_not_none(
            run_fingerprint,
            "initial_weights_logits",
            self._coerce_scalar_or_vector(update_rule_parameters.get("weights_logits")),
        )
        self._set_if_not_none(
            run_fingerprint,
            "initial_log_amplitude",
            self._coerce_scalar_or_vector(update_rule_parameters.get("log_amplitude")),
        )
        self._set_if_not_none(
            run_fingerprint,
            "initial_raw_width",
            self._coerce_scalar_or_vector(update_rule_parameters.get("raw_width")),
        )
        self._set_if_not_none(
            run_fingerprint,
            "initial_raw_exponents",
            self._coerce_scalar_or_vector(update_rule_parameters.get("raw_exponents")),
        )
        self._set_if_not_none(
            run_fingerprint,
            "chunk_period",
            self._coerce_int(update_rule_parameters.get("chunk_period")),
        )
        self._set_if_not_none(
            run_fingerprint,
            "weight_interpolation_period",
            self._coerce_int(update_rule_parameters.get("weight_interpolation_period")),
        )
        initial_pool_value = self._coerce_float(
            update_rule_parameters.get("ipool_value")
        )
        if initial_pool_value is None:
            initial_pool_value = self._coerce_float(
                update_rule_parameters.get("initial_pool_value")
            )
        self._set_if_not_none(
            run_fingerprint,
            "initial_pool_value",
            initial_pool_value,
        )
        self._set_if_not_none(
            run_fingerprint,
            "fees",
            self._coerce_float(update_rule_parameters.get("fees")),
        )
        self._set_if_not_none(
            run_fingerprint,
            "maximum_change",
            self._coerce_float(raw_optimisation_settings.get("maximum_change")),
        )
        run_fingerprint["use_alt_lamb"] = initial_memory_length_delta is not None

        return run_fingerprint

    def __init__(self, jsonDto):
        self.trainingRunFilename = jsonDto["trainingRunFilename"]
        self.pool = LiquidityPoolDto(jsonDto["pool"])
        self.startDate = jsonDto["startUnix"]
        self.endDate = jsonDto["endUnix"]
        self.trainingParameters = TrainingParametersDto(jsonDto["trainingParameters"])


class TrainingParametersDto(object):
    def __init__(self, paramDto):
        params = list()
        for param in paramDto["trainingParameters"]:
            params.append(TrainingParameterDto(param))
        self.trainingParameters = params


class LiquidityPoolDto(object):
    def __init__(self, poolDto):
        self.id = poolDto["id"]
        poolConstituents = list()
        for coin in poolDto["poolConstituents"]:
            poolConstituents.append(LiquidityPoolCoinDto(coin))
        self.poolConstituents = poolConstituents
        self.updateRule = UpdateRuleDto(poolDto["updateRule"])


class UpdateRuleDto(object):
    def __init__(self, ruleDto):
        self.name = ruleDto["name"]
        factors = list()
        for coin in ruleDto["updateRuleParameters"]:
            factors.append(UpdateRuleFactorDto(coin))
        self.updateRuleFactors = factors


class UpdateRuleFactorDto(object):
    def __init__(self, factorDto):
        self.name = factorDto["name"]
        self.value = float(factorDto["value"])


class LiquidityPoolCoinDto(object):
    def __init__(self, coinDto=None):
        if coinDto is None:
            return

        self.coinCode = coinDto["coinCode"]
        self.marketValue = coinDto["marketValue"]
        self.currentPrice = coinDto["currentPrice"]
        self.amount = coinDto["amount"]
        self.weight = coinDto["weight"]


# outputs
class SimulationResult(object):
    def __init__(self, resultTimeSteps):
        self.timeSteps = resultTimeSteps


class SimulationResultTimestepDto(object):
    def __init__(self, unix, coinsHeld, timeStepTotal):
        self.unix = unix
        self.coinsHeld = coinsHeld
        self.timeStepTotal = timeStepTotal


class SimulationRunMetric:
    def __init__(self, Rf, metricName, metricValue, benchmarkName, metricTimePeriod):
        self.Rf = Rf
        self.metricName = metricName
        self.metricValue = metricValue
        self.benchmarkName = benchmarkName
        self.metricTimePeriod = metricTimePeriod


class SimulationResultTimeseries(object):
    def __init__(self, resultTimeSteps, Rf, metricName, benchmarkName):
        self.timeSteps = resultTimeSteps
        self.Rf = Rf
        self.metricName = metricName
        self.benchmarkName = benchmarkName

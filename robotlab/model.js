
/* RobotLab: modelo educativo hipotético. Sin datos de fabricantes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.RobotModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const CAPACITY_WH = 1000;
  const TIME_ACCELERATION = 60; // 1 segundo real = 60 segundos simulados
  const PRESETS = Object.freeze({
    production: Object.freeze({ s: 1.5, w: 1.5, e: 1, label: 'Máxima productividad' }),
    autonomy: Object.freeze({ s: 0.6, w: 0.7, e: 1.3, label: 'Menor potencia' }),
    balanced: Object.freeze({ s: 1, w: 1, e: 1, label: 'Operación equilibrada' })
  });

  function within(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function evaluate(params) {
    const { s, w, e } = params;
    if (![s, w, e].every(Number.isFinite) || s <= 0 || w <= 0 || e <= 0) {
      throw new RangeError('Los multiplicadores s, w y e deben ser positivos y finitos.');
    }
    const productivity = 30 * s * w; // tareas/h
    const power = (150 + 100 * s * s + 80 * w) / e; // W
    return { productivity, power, whPerTask: power / productivity };
  }
  function initialize(initialPercent = 100) {
    return { energyWh: CAPACITY_WH * within(initialPercent, 0, 100) / 100, tasks: 0, simulatedSeconds: 0 };
  }
  /** Aplica un paso de tiempo real en segundos, con corte exacto al agotarse la batería. */
  function advance(state, params, realDeltaSeconds) {
    if (!Number.isFinite(realDeltaSeconds) || realDeltaSeconds < 0) throw new RangeError('Paso temporal inválido.');
    const { productivity, power } = evaluate(params);
    const requestedSimulatedSeconds = realDeltaSeconds * TIME_ACCELERATION;
    const possibleSimulatedSeconds = power > 0 ? (state.energyWh / power) * 3600 : requestedSimulatedSeconds;
    const effectiveSimulatedSeconds = Math.max(0, Math.min(requestedSimulatedSeconds, possibleSimulatedSeconds));
    const simulatedHours = effectiveSimulatedSeconds / 3600;
    const energyWh = Math.max(0, state.energyWh - power * simulatedHours);
    const depleted = energyWh < 1e-8;
    return {
      energyWh: depleted ? 0 : energyWh,
      tasks: state.tasks + productivity * simulatedHours,
      simulatedSeconds: state.simulatedSeconds + effectiveSimulatedSeconds,
      depleted
    };
  }
  function autonomyHours(energyWh, power) { return power > 0 ? Math.max(0, energyWh) / power : Infinity; }
  function batteryPercent(energyWh) { return within(100 * energyWh / CAPACITY_WH, 0, 100); }
  return Object.freeze({ CAPACITY_WH, TIME_ACCELERATION, PRESETS, within, evaluate, initialize, advance, autonomyHours, batteryPercent });
});


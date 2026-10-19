
/* RobotLab | Static browser application, ES/EN. Educational assumptions unchanged. */
(() => {
  'use strict';
  const M = window.RobotModel;
  const I = window.RobotLabI18n, t = I.t;
  if (!M) throw new Error('Falta model.js');
  const $ = (id) => document.getElementById(id);
  const fmt = (n, digits = 1) => Number(n).toLocaleString(I.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const simulation = {
    params: { s: 1, w: 1, e: 1 },
    initialCharge: 100,
    state: M.initialize(100),
    mode: 'idle', // idle, running, paused, depleted
    lastFrame: null,
    lastRecordedSecond: 0,
    history: []
  };
  const inputs = { s: $('speed'), w: $('workload'), e: $('efficiency'), initial: $('initial-charge') };
  const output = { s: $('speed-value'), w: $('workload-value'), e: $('efficiency-value'), initial: $('initial-charge-value') };
  const status = $('stage');
  const animateArea = $('robot-area');
  const stageNames = { idle: 'EN ESPERA', running: 'EN FUNCIONAMIENTO', paused: 'EN PAUSA', depleted: 'BATERÍA AGOTADA' };
  const modeNames = { idle: 'En espera', running: 'Funcionando', paused: 'En pausa', depleted: 'Agotada' };
  let toastTimeout = null;
  let animationId = null;
  let lastQuizAnswer = null;
  let lastNotice = null;

  function report(text, vars = {}) {
    lastNotice = { text, vars };
    const box = $('toast');
    box.textContent = t(text, vars);
    box.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { box.hidden = true; }, 3800);
  }
  function durationClock(seconds) {
    const n = Math.floor(seconds);
    const h = String(Math.floor(n / 3600)).padStart(2, '0');
    const m = String(Math.floor((n % 3600) / 60)).padStart(2, '0');
    const s = String(n % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  function autonomyText(hours) {
    if (!Number.isFinite(hours)) return '∞';
    const total = Math.round(Math.max(0, hours) * 60);
    return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, '0')}`;
  }
  function modeSet(next) {
    simulation.mode = next;
    status.dataset.active = String(next === 'running');
    $('state-label').textContent = t(stageNames[next]);
    $('m-state').textContent = t(modeNames[next]);
    $('start-btn').disabled = next === 'running' || next === 'depleted';
    $('pause-btn').disabled = next !== 'running';
    inputs.initial.disabled = next === 'running';
    $('start-btn').querySelector('span').textContent = t(next === 'paused' ? 'Reanudar simulación' : 'Iniciar simulación');
    if (next === 'depleted') $('insight-text').textContent = t('La batería se agotó. Reiniciá la simulación para continuar.');
  }
  function updateSlider(slider) {
    const fraction = (Number(slider.value) - Number(slider.min)) / (Number(slider.max) - Number(slider.min));
    slider.style.setProperty('--fill', `${fraction * 100}%`);
  }
  function updateControls() {
    inputs.s.value = simulation.params.s;
    inputs.w.value = simulation.params.w;
    inputs.e.value = simulation.params.e;
    inputs.initial.value = simulation.initialCharge;
    Object.values(inputs).forEach(updateSlider);
    output.s.textContent = `${fmt(simulation.params.s, 2)}×`;
    output.w.textContent = `${fmt(simulation.params.w, 2)}×`;
    output.e.textContent = `${fmt(simulation.params.e, 2)}×`;
    output.initial.textContent = `${fmt(simulation.initialCharge, 0)}%`;
    const { s, w } = simulation.params;
    status.style.setProperty('--cycle-duration', `${(2 / s).toFixed(3)}s`);
    animateArea.style.setProperty('--arm-angle', `${Math.round(12 + 18 * w)}deg`);
    animateArea.style.setProperty('--leg-angle', `${Math.round(7 + 5 * s)}deg`);
  }
  function updateMetrics() {
    const model = M.evaluate(simulation.params);
    const state = simulation.state;
    const battery = M.batteryPercent(state.energyWh);
    $('m-productivity').textContent = fmt(model.productivity);
    $('m-power').textContent = fmt(model.power, 0);
    $('m-battery').textContent = fmt(battery, 0);
    $('m-energy').textContent = t('{energy} Wh disponibles', { energy: fmt(state.energyWh, 0) });
    $('m-autonomy').textContent = autonomyText(M.autonomyHours(state.energyWh, model.power));
    $('m-wh-task').textContent = fmt(model.whPerTask, 2);
    $('m-tasks').textContent = fmt(state.tasks, 2);
    $('m-time').textContent = durationClock(state.simulatedSeconds);
    $('hud-power').textContent = `${fmt(model.power, 0)} W`;
    $('hud-speed').textContent = `${fmt(simulation.params.s, 2)} ×`;
    $('charge-fill').style.width = `${battery}%`;
    $('charge-fill').style.background = battery < 20 ? 'linear-gradient(90deg,#db686c,#fdab92)' : 'linear-gradient(90deg,#28bca7,#87ffe1)';
  }
  function contextualInsight() {
    const { s, w, e } = simulation.params;
    const m = M.evaluate(simulation.params);
    if (simulation.mode === 'depleted') return;
    let text;
    if (m.whPerTask > 12) text = 'Observá el costo por tarea: menos watts no siempre implica mayor eficiencia productiva.';
    else if (m.whPerTask < 8) text = '¡Buen hallazgo! En este modelo, el ritmo de producción reduce los Wh por tarea.';
    else if (e > 1.15) text = 'Una eficiencia relativa superior reduce la potencia para una misma velocidad y carga.';
    else if (s > 1.2 || w > 1.2) text = 'Mayor producción exige observar también la potencia y la autonomía.';
    else text = 'Consejo: probá aumentar la velocidad y observá cómo cambian la productividad y el consumo.';
    $('insight-text').textContent = t(text);
  }
  function snapshot() {
    const model = M.evaluate(simulation.params);
    return {
      time: simulation.state.simulatedSeconds,
      battery: M.batteryPercent(simulation.state.energyWh),
      tasks: simulation.state.tasks,
      power: model.power,
      productivity: model.productivity,
      whPerTask: model.whPerTask,
      energy: simulation.state.energyWh,
      s: simulation.params.s, w: simulation.params.w, e: simulation.params.e
    };
  }
  function record(force = false) {
    const current = snapshot();
    const last = simulation.history[simulation.history.length - 1];
    if (!force && last && current.time - last.time < 30) return;
    if (last && Math.abs(current.time - last.time) < 1e-8) simulation.history[simulation.history.length - 1] = current;
    else simulation.history.push(current);
    if (simulation.history.length > 240) simulation.history.shift();
    renderCharts();
  }
  function svgNode(tag, attributes = {}, content) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [key, val] of Object.entries(attributes)) node.setAttribute(key, String(val));
    if (content !== undefined) node.textContent = content;
    return node;
  }
  const charts = [
    { id: 'chart-battery', key: 'battery', color: '#65e7c9', upper: 100, min: 0, unit: '%' },
    { id: 'chart-tasks', key: 'tasks', color: '#82b1ff', unit: '' },
    { id: 'chart-power', key: 'power', color: '#c1a3f7', min: 0, unit: ' W' }
  ];
  function renderCharts() {
    const history = simulation.history;
    if (!history.length) return;
    for (const config of charts) {
      const el = $(config.id);
      el.replaceChildren();
      const L = 42, R = 335, T = 12, B = 145;
      const values = history.map((x) => x[config.key]);
      let yMin = config.min ?? Math.min(0, ...values);
      let yMax = config.upper ?? Math.max(1, ...values) * 1.12;
      if (yMax <= yMin) yMax = yMin + 1;
      const timeMin = history[0].time;
      const timeMax = Math.max(timeMin + 60, history[history.length - 1].time);
      const px = (time) => L + (time - timeMin) / (timeMax - timeMin) * (R - L);
      const py = (v) => B - (v - yMin) / (yMax - yMin) * (B - T);
      for (let i = 0; i <= 4; i++) {
        const y = T + i * ((B - T) / 4);
        el.append(svgNode('line', { x1: L, x2: R, y1: y, y2: y, stroke: '#294054', 'stroke-width': 1, 'stroke-dasharray': i === 4 ? '0' : '3 5' }));
        const labelVal = yMax - i * ((yMax - yMin) / 4);
        el.append(svgNode('text', { x: L - 8, y: y + 3, 'text-anchor': 'end', fill: '#7890a2', 'font-size': 10, 'font-family': 'Arial, sans-serif' }, `${Math.round(labelVal)}${config.unit}`));
      }
      const points = history.map((d) => `${px(d.time).toFixed(2)},${py(d[config.key]).toFixed(2)}`);
      const path = points.length === 1 ? `M ${L} ${py(values[0]).toFixed(2)} L ${R} ${py(values[0]).toFixed(2)}` : `M ${points.join(' L ')}`;
      const gradientId = `grad-${config.key}`;
      const defs = svgNode('defs');
      const grad = svgNode('linearGradient', { id: gradientId, x1: '0', y1: '0', x2: '0', y2: '1' });
      grad.append(svgNode('stop', { offset: '0', 'stop-color': config.color, 'stop-opacity': '.22' }));
      grad.append(svgNode('stop', { offset: '1', 'stop-color': config.color, 'stop-opacity': '0' }));
      defs.append(grad); el.append(defs);
      const firstX = points.length === 1 ? L : px(history[0].time);
      const lastX = points.length === 1 ? R : px(history[history.length - 1].time);
      const area = `${path} L ${lastX} ${B} L ${firstX} ${B} Z`;
      el.append(svgNode('path', { d: area, fill: `url(#${gradientId})` }));
      el.append(svgNode('path', { d: path, fill: 'none', stroke: config.color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      const lastValue = values[values.length - 1];
      const dot = svgNode('circle', { cx: lastX, cy: py(lastValue), r: 4, fill: config.color, stroke: '#142236', 'stroke-width': 2 });
      dot.append(svgNode('title', {}, `${fmt(lastValue, 2)}${config.unit} · ${fmt(history[history.length - 1].time / 60, 1)} ${t('minutos')}`));
      el.append(dot);
      const box = el.closest('.chart-card');
      box.querySelector('.chart-bottom span:first-child').textContent = `${fmt(timeMin / 60, 0)} min`;
    }
  }
  function refresh() { updateControls(); updateMetrics(); contextualInsight(); }
  function stopAnimation() { if (animationId !== null) cancelAnimationFrame(animationId); animationId = null; simulation.lastFrame = null; }
  function start() {
    if (simulation.mode === 'depleted') { report('Reiniciá para recuperar la batería.'); return; }
    if (simulation.mode === 'running') return;
    modeSet('running');
    simulation.lastFrame = null;
    animationId = requestAnimationFrame(tick);
    refresh();
  }
  function pause(auto = false) {
    if (simulation.mode !== 'running') return;
    stopAnimation();
    modeSet('paused');
    refresh();
    if (auto) report('Simulación pausada al cambiar de pestaña para evitar saltos de tiempo.');
  }
  function reset({ notify = true } = {}) {
    stopAnimation();
    simulation.state = M.initialize(simulation.initialCharge);
    simulation.history = [];
    simulation.lastRecordedSecond = 0;
    modeSet('idle');
    record(true);
    refresh();
    if (notify) report('Simulación reiniciada. Se borró el historial de la ejecución anterior.');
  }
  function tick(timestamp) {
    if (simulation.mode !== 'running') return;
    if (simulation.lastFrame === null) simulation.lastFrame = timestamp;
    const delta = Math.max(0, Math.min((timestamp - simulation.lastFrame) / 1000, .1));
    simulation.lastFrame = timestamp;
    const next = M.advance(simulation.state, simulation.params, delta);
    simulation.state = { energyWh: next.energyWh, tasks: next.tasks, simulatedSeconds: next.simulatedSeconds };
    updateMetrics();
    record();
    if (next.depleted) {
      record(true);
      stopAnimation();
      modeSet('depleted');
      contextualInsight();
      report('Batería agotada: finalizó la simulación.');
      return;
    }
    animationId = requestAnimationFrame(tick);
  }
  function choosePreset(key) {
    const cfg = M.PRESETS[key];
    if (!cfg) return;
    stopAnimation();
    simulation.params = { s: cfg.s, w: cfg.w, e: cfg.e };
    simulation.initialCharge = 100;
    document.querySelectorAll('[data-preset]').forEach((button) => {
      const selected = button.dataset.preset === key;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('.scenario-action').replaceChildren(
        document.createTextNode(t(selected ? 'Escenario seleccionado' : 'Probar escenario') + ' '),
        (() => { const icon = document.createElementNS(SVG_NS, 'svg'); icon.setAttribute('class', 'icon'); const use = document.createElementNS(SVG_NS, 'use'); use.setAttribute('href', selected ? '#ic-check' : '#ic-arrow'); icon.append(use); return icon; })()
      );
    });
    reset({ notify: false });
    report('Escenario «{label}» aplicado. Presioná Iniciar para experimentar.', { label: t(cfg.label) });
  }
  function renderComparison() {
    const host = $('scenario-bars');
    const presets = Object.entries(M.PRESETS).map(([key, preset]) => ({ key, label: preset.label, ...M.evaluate(preset) }));
    const high = Math.max(...presets.map((item) => item.whPerTask));
    host.replaceChildren();
    presets.forEach((item, i) => {
      const row = document.createElement('div'); row.className = 'bar-row';
      const name = document.createElement('span'); name.className = 'bar-label'; name.textContent = t(item.label);
      const track = document.createElement('div'); track.className = 'bar-track';
      const bar = document.createElement('div'); bar.className = `bar-fill ${['bar-one', 'bar-two', 'bar-three'][i]}`;
      bar.style.width = `${(item.whPerTask / high) * 100}%`;
      track.append(bar);
      const value = document.createElement('span'); value.className = 'bar-value'; value.textContent = `${fmt(item.whPerTask, 2)} Wh`;
      row.append(name, track, value); host.append(row);
    });
  }
  function quiz(answer) {
    lastQuizAnswer = answer;
    const right = answer === 'b';
    document.querySelectorAll('.quiz-option').forEach((button) => {
      button.classList.toggle('correct', button.dataset.answer === 'b');
      button.classList.toggle('wrong', !right && button.dataset.answer === answer);
      button.setAttribute('aria-pressed', String(button.dataset.answer === answer));
    });
    const feedback = $('quiz-feedback');
    feedback.hidden = false;
    feedback.textContent = t(right
      ? '¡Correcto! La potencia contiene un término proporcional a s², pero también hay componentes independientes de la velocidad. Por eso no es una relación lineal simple.'
      : 'No exactamente. Fijate en el término 100 × s² de la fórmula. Si s se duplica, ese componente se cuadruplica, mientras las otras partes quedan igual. Elegí otra opción.');
  }
  function exportCSV() {
    const cols = ['tiempo_simulado_seg','bateria_pct','energia_Wh','potencia_W','productividad_tareas_h','tareas_acumuladas','energia_Wh_por_tarea','velocidad_s','carga_w','eficiencia_e'];
    const lines = [cols.join(',')];
    for (const p of simulation.history) {
      const vals = [p.time,p.battery,p.energy,p.power,p.productivity,p.tasks,p.whPerTask,p.s,p.w,p.e];
      lines.push(vals.map(v => Number(v).toFixed(5)).join(','));
    }
    const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'robotlab_datos_simulados.csv';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    report('Datos exportados: archivo CSV generado con los resultados de tu simulación.');
  }
  function renderChallenge() {
    const list = $('challenge-results');
    list.replaceChildren();
    for (const preset of Object.values(M.PRESETS)) {
      const result = M.evaluate(preset);
      const item = document.createElement('li');
      item.textContent = t('{label}: {tasks} tareas por carga completa.', { label: t(preset.label), tasks: fmt(M.CAPACITY_WH / result.whPerTask) });
      list.append(item);
    }
  }
  function localize() {
    modeSet(simulation.mode);
    refresh(); renderComparison(); renderCharts(); renderChallenge();
    document.querySelectorAll('[data-preset]').forEach(button => {
      button.querySelector('.scenario-action').firstChild.textContent = t(button.classList.contains('selected') ? 'Escenario seleccionado' : 'Probar escenario') + ' ';
    });
    if (lastQuizAnswer) quiz(lastQuizAnswer);
    if (lastNotice && !$('toast').hidden) $('toast').textContent = t(lastNotice.text, lastNotice.vars);
  }
  function init() {
    for (const [key, input] of Object.entries(inputs)) {
      input.addEventListener('input', () => {
        if (key === 'initial') {
          simulation.initialCharge = Number(input.value);
          if (simulation.mode === 'idle') {
            simulation.state = M.initialize(simulation.initialCharge);
            record(true);
          }
        } else {
          simulation.params[key] = Number(input.value);
          if (simulation.mode === 'idle' && simulation.state.simulatedSeconds === 0) {
            simulation.state = M.initialize(simulation.initialCharge);
          }
          // Cambio personalizado: sin escenario predefinido seleccionado.
          document.querySelectorAll('[data-preset]').forEach((button) => {
            button.classList.remove('selected');
            button.setAttribute('aria-pressed', 'false');
            const label = button.querySelector('.scenario-action');
            if (label) label.firstChild.textContent = t('Probar escenario') + ' ';
            const use = label?.querySelector('use'); if (use) use.setAttribute('href', '#ic-arrow');
          });
          record(true);
        }
        refresh();
      });
    }
    $('start-btn').addEventListener('click', start);
    $('pause-btn').addEventListener('click', () => pause(false));
    $('reset-btn').addEventListener('click', () => reset());
    document.querySelectorAll('[data-preset]').forEach((button) => button.addEventListener('click', () => choosePreset(button.dataset.preset)));
    document.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => quiz(button.dataset.answer)));
    $('download-csv').addEventListener('click', exportCSV);
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });
    window.addEventListener('pagehide', () => { if (simulation.mode === 'running') pause(false); });
    modeSet('idle');
    updateControls(); updateMetrics(); renderComparison(); renderChallenge(); record(true); contextualInsight();
    document.addEventListener('robotlab:language', localize);
  }
  init();
  // Superficie de inspección para pruebas locales, no modifica ni envía datos personales.
  window.__robotLabDiagnostics = Object.freeze({ snapshot, getMode: () => simulation.mode, getHistory: () => [...simulation.history] });
})();


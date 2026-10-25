/* ES/EN labels share the course language preference; model values stay unchanged. */
(() => {
  'use strict';
  const pairs = [
    ['RobotLab — Laboratorio de Robótica Humanoide | China tecnológica', 'RobotLab — Humanoid Robotics Laboratory | Technological China'],
    ['Laboratorio interactivo de robótica humanoide: explorá productividad, consumo, batería y decisiones industriales con un modelo matemático educativo.', 'Interactive humanoid robotics laboratory: explore productivity, energy, battery life and industrial decisions with an educational mathematical model.'],
    ['RobotLab, ir al inicio', 'RobotLab, back to top'],
    ['Secciones del laboratorio', 'Laboratory sections'],
    ['Laboratorio', 'Laboratory'], ['Experimentos', 'Experiments'], ['Análisis', 'Analysis'], ['Aprender', 'Learn'],
    ['Idioma del laboratorio', 'Laboratory language'], ['Volver a simuladores', 'Back to simulators'],
    ['LABORATORIO DE SIMULACIÓN', 'SIMULATION LABORATORY'], ['/ EXPERIENCIA 01', '/ EXPERIENCE 01'],
    ['El futuro industrial', 'Learn about the industrial future'], ['se aprende experimentando.', 'through experimentation.'],
    ['Controlá un robot humanoide, explorá las decisiones de producción y descubrí por qué', 'Control a humanoid robot, explore production decisions and discover why'],
    ['más velocidad no siempre significa mejor eficiencia.', 'greater speed does not always mean greater efficiency.'],
    ['Entrar al laboratorio', 'Enter the laboratory'], ['Cómo funciona', 'How it works'],
    ['Información del curso', 'Course information'], ['SERIE EDUCATIVA', 'EDUCATIONAL SERIES'],
    ['CHINA TECNOLÓGICA', 'TECHNOLOGICAL CHINA'], ['Robots, chips y la nueva revolución industrial', 'Robots, chips and the new industrial revolution'],
    ['Docente: Sergio Gevatschnaider', 'Instructor: Sergio Gevatschnaider'],
    ['01 / SIMULACIÓN EN VIVO', '01 / LIVE SIMULATION'], ['Estación de trabajo', 'Humanoid'], ['humanoide', 'workstation'],
    ['MODELO INTERACTIVO', 'INTERACTIVE MODEL'], ['RELOJ ×60', 'CLOCK ×60'], ['ESTACIÓN', 'STATION'],
    ['LABORATORIO INDUSTRIAL', 'INDUSTRIAL LABORATORY'], ['EN ESPERA', 'IDLE'], ['EN FUNCIONAMIENTO', 'RUNNING'], ['EN PAUSA', 'PAUSED'], ['BATERÍA AGOTADA', 'BATTERY DEPLETED'],
    ['MODELO HUMANOIDE', 'HUMANOID MODEL'], ['SIMULACIÓN', 'EDUCATIONAL'], ['EDUCATIVA', 'SIMULATION'],
    ['TELEMETRÍA', 'TELEMETRY'], ['ENERGÍA', 'ENERGY'], ['EN TIEMPO REAL', 'IN REAL TIME'],
    ['Robot humanoide estilizado, animado según velocidad y carga de trabajo', 'Stylised humanoid robot, animated according to speed and workload'],
    ['UNIDAD ROBÓTICA', 'ROBOTIC UNIT'], ['CONEXIÓN SIMULADA', 'SIMULATED CONNECTION'], ['VISTA', 'VIEW'], ['FRONTAL / 01', 'FRONT / 01'],
    ['Panel de control de la simulación', 'Simulation control panel'], ['CENTRO DE COMANDO', 'COMMAND CENTRE'], ['Panel de control', 'Control panel'],
    ['Ajustá las variables y observá su efecto sobre la operación.', 'Adjust the variables and observe their effect on the operation.'],
    ['Velocidad de movimiento', 'Movement speed'], ['0,5× · lenta', '0.5× · slow'], ['1,5× · rápida', '1.5× · fast'],
    ['Carga de trabajo', 'Workload'], ['0,5× · ligera', '0.5× · light'], ['1,5× · intensa', '1.5× · heavy'],
    ['Eficiencia energética relativa', 'Relative energy efficiency'], ['0,7×', '0.7×'], ['1,3×', '1.3×'],
    ['Batería al reiniciar', 'Battery on reset'], ['Este valor se aplica al reiniciar, no durante la ejecución', 'This value applies on reset, not during a run'],
    ['Iniciar simulación', 'Start simulation'], ['Reanudar simulación', 'Resume simulation'], ['Pausar', 'Pause'], ['Reiniciar', 'Reset'],
    ['Consejo: probá aumentar la velocidad y observá cómo cambia la productividad y el consumo.', 'Tip: increase speed and observe how productivity and energy use change.'],
    ['Consejo: probá aumentar la velocidad y observá cómo cambian la productividad y el consumo.', 'Tip: increase speed and observe how productivity and energy use change.'],
    ['PRODUCTIVIDAD', 'PRODUCTIVITY'], ['tareas/h', 'tasks/h'], ['Producción instantánea', 'Instantaneous output'],
    ['POTENCIA', 'POWER'], ['Consumo instantáneo', 'Instantaneous power use'], ['BATERÍA', 'BATTERY'], ['Porcentaje de batería', 'Battery percentage'],
    ['{energy} Wh disponibles', '{energy} Wh remaining'], ['AUTONOMÍA', 'BATTERY LIFE'], ['Estimación a ritmo actual', 'Estimate at the current rate'],
    ['ENERGÍA POR TAREA', 'ENERGY PER TASK'], ['Wh/tarea', 'Wh/task'], ['Menos es mejor', 'Lower is better'],
    ['TIEMPO SIMULADO', 'SIMULATED TIME'], ['TAREAS ACUMULADAS', 'COMPLETED TASKS'], ['ACELERACIÓN TEMPORAL', 'TIME ACCELERATION'], ['ESTADO', 'STATUS'],
    ['En espera', 'Idle'], ['Funcionando', 'Running'], ['En pausa', 'Paused'], ['Agotada', 'Depleted'],
    ['La batería se agotó. Reiniciá la simulación para continuar.', 'The battery is depleted. Reset the simulation to continue.'],
    ['Observá el costo por tarea: menos watts no siempre implica mayor eficiencia productiva.', 'Look at energy per task: fewer watts do not always mean greater production efficiency.'],
    ['¡Buen hallazgo! En este modelo, el ritmo de producción reduce los Wh por tarea.', 'Good finding! In this model, the production rate reduces Wh per task.'],
    ['Una eficiencia relativa superior reduce la potencia para una misma velocidad y carga.', 'Higher relative efficiency reduces power at the same speed and workload.'],
    ['Mayor producción exige observar también la potencia y la autonomía.', 'Higher output also requires watching power and battery life.'],
    ['02 / TOMÁ DECISIONES', '02 / MAKE DECISIONS'], ['Tres estrategias.', 'Three strategies.'], ['Resultados distintos.', 'Different results.'],
    ['Elegí un escenario para aplicar sus parámetros al laboratorio y compararlos.', 'Choose a scenario to apply its parameters to the laboratory and compare results.'],
    ['01 / RENDIMIENTO', '01 / OUTPUT'], ['Máxima', 'Maximum'], ['productividad', 'productivity'],
    ['Priorizá la cantidad de tareas por hora y analizá cuánto cuesta energéticamente.', 'Prioritise tasks per hour and examine their energy cost.'],
    ['67,5 tareas/h', '67.5 tasks/h'], ['Probar escenario', 'Try scenario'],
    ['02 / AUTONOMÍA', '02 / BATTERY LIFE'], ['Menor', 'Lower'], ['potencia', 'power'],
    ['Reducí el consumo instantáneo y descubrí el costo energético por unidad.', 'Reduce instantaneous power and discover the energy cost per unit.'],
    ['12,6 tareas/h', '12.6 tasks/h'], ['03 / REFERENCIA', '03 / BASELINE'], ['Operación', 'Balanced'], ['equilibrada', 'operation'],
    ['Usá el escenario de referencia para contrastar las otras configuraciones.', 'Use the baseline scenario to compare the other configurations.'],
    ['30,0 tareas/h', '30.0 tasks/h'], ['Escenario seleccionado', 'Selected scenario'],
    ['Máxima productividad', 'Maximum productivity'], ['Menor potencia', 'Lower power'], ['Operación equilibrada', 'Balanced operation'],
    ['EXPERIMENTO GUIADO · 5 MINUTOS', 'GUIDED EXPERIMENT · 5 MINUTES'],
    ['¿Qué estrategia completa más tareas con una batería?', 'Which strategy completes more tasks on one battery?'],
    ['Compará los tres escenarios desde el 100% de carga. Anotá productividad, potencia y Wh por tarea. Hacé una predicción y contrastala con el modelo.', 'Compare the three scenarios from a full charge. Record productivity, power and Wh per task. Make a prediction and check it against the model.'],
    ['Ver una pista y la respuesta', 'Show a hint and the answer'],
    ['Dividí los 1.000 Wh de la batería por los Wh necesarios para cada tarea. Con los parámetros de cada escenario, el modelo calcula:', 'Divide the battery’s 1,000 Wh by the Wh needed for each task. Using each scenario’s parameters, the model calculates:'],
    ['La estrategia de máxima productividad también completa más tareas por carga en este ejemplo. La conclusión depende de estos supuestos, no describe un robot comercial.', 'The maximum-productivity strategy also completes more tasks per charge in this example. This conclusion depends on these assumptions; it does not describe a commercial robot.'],
    ['{label}: {tasks} tareas por carga completa.', '{label}: {tasks} tasks per full charge.'],
    ['UN HALLAZGO CONTRAINTUITIVO', 'A COUNTERINTUITIVE FINDING'], ['Menos potencia', 'Lower power'], ['no siempre', 'does not always'], ['significa más eficiencia.', 'mean greater efficiency.'],
    ['La estrategia de menor consumo usa menos watts, pero también realiza menos tareas. Observá la energía necesaria para completar', 'The lower-power strategy uses fewer watts but also performs fewer tasks. Look at the energy needed to complete'],
    ['una tarea', 'one task'], ['en cada estrategia.', 'with each strategy.'], ['Comparación de consumo en Wh por tarea', 'Comparison of energy use in Wh per task'],
    ['Los valores provienen del mismo modelo matemático hipotético. Son resultados del ejercicio, no mediciones de robots comerciales.', 'The values come from the same hypothetical mathematical model. They are exercise results, not measurements of commercial robots.'],
    ['03 / OBSERVÁ LOS DATOS', '03 / OBSERVE THE DATA'], ['El laboratorio', 'The laboratory'], ['en números.', 'in numbers.'],
    ['Los gráficos registran los valores calculados durante tu simulación.', 'The charts record values calculated during your simulation.'], ['↓ Descargar datos CSV', '↓ Download CSV data'],
    ['Nivel de batería', 'Battery level'], ['% restante', '% remaining'], ['Evolución del porcentaje de batería', 'Battery percentage over time'], ['Tiempo simulado →', 'Simulated time →'],
    ['Tareas acumuladas', 'Completed tasks'], ['tareas', 'tasks'], ['Evolución de las tareas acumuladas', 'Completed tasks over time'], ['Potencia eléctrica', 'Electrical power'], ['Evolución de la potencia eléctrica', 'Electrical power over time'],
    ['DESAFÍO PARA ESTUDIANTES', 'STUDENT CHALLENGE'], ['Antes de mover el control, ¿qué predicción harías?', 'Before moving the slider, what would you predict?'],
    ['Si duplicáramos la velocidad manteniendo los demás parámetros constantes, ¿qué ocurriría con la potencia eléctrica en este modelo?', 'If we doubled speed while holding the other parameters constant, what would happen to electrical power in this model?'],
    ['Se duplicaría exactamente.', 'It would exactly double.'], ['Aumentaría, pero no necesariamente al doble.', 'It would increase, but not necessarily double.'], ['Permanecería constante.', 'It would stay constant.'],
    ['¡Correcto! La potencia contiene un término proporcional a s², pero también hay componentes independientes de la velocidad. Por eso no es una relación lineal simple.', 'Correct! Power includes a term proportional to s², as well as components independent of speed. That is why the relationship is not simply linear.'],
    ['No exactamente. Fijate en el término 100 × s² de la fórmula. Si s se duplica, ese componente se cuadruplica, mientras las otras partes quedan igual. Elegí otra opción.', 'Not quite. Look at the 100 × s² term in the formula. Doubling s quadruples that component, while the other parts stay unchanged. Try another option.'],
    ['04 / ENTENDÉ EL MODELO', '04 / UNDERSTAND THE MODEL'], ['La matemática', 'The mathematics'], ['detrás del movimiento.', 'behind the movement.'],
    ['Un modelo sencillo para aprender a pensar como analistas de sistemas industriales.', 'A simple model for learning to think like an industrial systems analyst.'],
    ['tareas por hora', 'tasks per hour'], ['Sube cuando aumentan la velocidad (s) o la carga de trabajo (w).', 'Increases when speed (s) or workload (w) rises.'],
    ['POTENCIA ELÉCTRICA', 'ELECTRICAL POWER'], ['La velocidad tiene un término cuadrático. La eficiencia (e) reduce la potencia.', 'Speed has a quadratic term. Efficiency (e) reduces power.'],
    ['E / tarea = W / P', 'E / task = W / P'], ['Wh por tarea', 'Wh per task'], ['Permite comparar cuánta energía necesita cada estrategia para producir una unidad.', 'Compares the energy each strategy needs to produce one unit.'],
    ['INDUSTRIA Y TECNOLOGÍA', 'INDUSTRY AND TECHNOLOGY'], ['¿Por qué estudiar robótica en China?', 'Why study robotics in China?'],
    ['La robótica humanoide conecta avances en inteligencia artificial, sensores, baterías, actuadores y automatización. Empresas chinas como Unitree y UBTECH forman parte de este ecosistema en desarrollo. En la práctica, las capacidades de cada equipo deben verificarse con documentación y ensayos independientes.', 'Humanoid robotics connects advances in artificial intelligence, sensors, batteries, actuators and automation. Chinese companies such as Unitree and UBTECH are part of this developing ecosystem. In practice, each machine’s capabilities must be verified using documentation and independent tests.'],
    ['Explorar los materiales del curso', 'Explore course materials'], ['IMPORTANTE · SUPUESTOS', 'IMPORTANT · ASSUMPTIONS'], ['Un simulador no es un robot real.', 'A simulator is not a real robot.'],
    ['Todos los coeficientes, las ecuaciones y la capacidad de batería de 1.000 Wh son', 'All coefficients, equations and the 1,000 Wh battery capacity are'], ['hipotéticos y educativos', 'hypothetical and educational'],
    ['. No son especificaciones ni datos experimentales de Unitree, UBTECH u otros fabricantes.', '. They are not specifications or experimental data from Unitree, UBTECH or other manufacturers.'],
    ['Reloj acelerado: 1 segundo real = 60 segundos simulados. La carga inicial se aplica al reiniciar. Los cambios de parámetros afectan la operación futura, no alteran el pasado.', 'Accelerated clock: 1 real second = 60 simulated seconds. The initial charge applies on reset. Parameter changes affect future operation, not past results.'],
    ['Aprender haciendo. Experimentar para comprender.', 'Learn by doing. Experiment to understand.'], ['Laboratorio educativo independiente · 2026', 'Independent educational laboratory · 2026'], ['Diseñado para GitHub Pages · Sin dependencias externas', 'Designed for GitHub Pages · No external dependencies'],
    ['Reiniciá para recuperar la batería.', 'Reset to recharge the battery.'], ['Simulación pausada al cambiar de pestaña para evitar saltos de tiempo.', 'Simulation paused after switching tabs to prevent time jumps.'],
    ['Simulación reiniciada. Se borró el historial de la ejecución anterior.', 'Simulation reset. The previous run’s history was cleared.'], ['Batería agotada: finalizó la simulación.', 'Battery depleted: the simulation has finished.'],
    ['Escenario «{label}» aplicado. Presioná Iniciar para experimentar.', 'Scenario “{label}” applied. Press Start to experiment.'], ['Datos exportados: archivo CSV generado con los resultados de tu simulación.', 'Data exported: a CSV file was generated with your simulation results.'], ['minutos', 'minutes']
  ];
  const english = new Map(pairs), spanish = new Map(pairs.map(([es,en]) => [en,es]));
  let language = 'es';
  const t = (text, vars = {}) => {
    let result = language === 'en' ? (english.get(text) || text) : text;
    for (const [key,value] of Object.entries(vars)) result = result.replaceAll('{'+key+'}', String(value));
    return result;
  };
  function translatePage() {
    const dictionary = language === 'en' ? english : spanish;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node=walker.nextNode(); node; node=walker.nextNode()) {
      if (node.parentElement.closest('script,style')) continue;
      const key=node.data.trim(), replacement=dictionary.get(key);
      if (replacement) node.data=node.data.replace(key,replacement);
    }
    document.querySelectorAll('[aria-label],[title]').forEach(el => {
      for (const attribute of ['aria-label','title']) {
        const value=el.getAttribute(attribute);
        if (dictionary.has(value)) el.setAttribute(attribute,dictionary.get(value));
      }
    });
    document.title=t('RobotLab — Laboratorio de Robótica Humanoide | China tecnológica');
    document.querySelector('meta[name="description"]').content=t('Laboratorio interactivo de robótica humanoide: explorá productividad, consumo, batería y decisiones industriales con un modelo matemático educativo.');
  }
  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'es';
    document.documentElement.lang=language;
    document.documentElement.dataset.language=language;
    translatePage();
    const extension=document.getElementById('class2-extension');if(extension){extension.textContent=language==='en'?'Class 2: costs and agents ↗':'Clase 2: costos y agentes ↗';extension.href='../materiales/clase-2/lab.html?lang='+language;}
    for (const code of ['es','en']) document.getElementById('set-'+code).setAttribute('aria-pressed',String(code===language));
    try { localStorage.setItem('china-ai-language',language); } catch (_) {}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
    document.dispatchEvent(new CustomEvent('robotlab:language'));
  }
  window.RobotLabI18n=Object.freeze({t,setLanguage,get language(){return language;},get locale(){return language==='en'?'en-US':'es-AR';}});
  let saved;try{saved=localStorage.getItem('china-ai-language');}catch(_){}
  const query=new URLSearchParams(location.search).get('lang');
  setLanguage(['es','en'].includes(query)?query:saved||(navigator.language.startsWith('es')?'es':'en'));
  for(const code of ['es','en'])document.getElementById('set-'+code).addEventListener('click',()=>setLanguage(code));
})();

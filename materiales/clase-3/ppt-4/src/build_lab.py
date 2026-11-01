from pathlib import Path
import re,json
B=Path(__file__).resolve().parents[1];B.mkdir(parents=True,exist_ok=True)
s=Path(__file__).with_name('lab-source.html').read_text();s=s[:s.index('<script>')]
s=s.replace(",url('HERO_DATA')",'')
fixes={
'Más robots, riesgo de congestión':'Más robots, menor coordinación',
'Menor uptime y más retrabajo':'Menor disponibilidad y calidad',
'Demanda (piezas/turno)':'Órdenes brutas (piezas/turno)',
'Las mejoras de aprendizaje dependen del escenario; valores indexados de un modelo docente, sin extrapolación económica a China.':'Todos los escenarios usan una reducción acumulada de ciclo del 17% en 20 trimestres. Editar un control activa Personalizado. Los índices no son porcentajes de éxito medidos.',
'Demanda cubierta':'Órdenes conformes',
'Piezas buenas / demanda':'Conformes / órdenes brutas',
'OEE sintético':'Índice operativo',
'Disponibilidad × desempeño × calidad':'Proxy de disponibilidad, destreza y calidad',
'Etapa de menor capacidad':'Puede haber restricciones empatadas',
'Producción efectiva versus demanda':'Producción conforme y órdenes brutas',
'Evolución trimestral de 2026 a 2030: piezas conformes, demanda y referencia.':'20 trimestres, 2026–2030. Trayectorias hipotéticas, sin calibración ni pronóstico.',
'Utilización efectiva de la celda':'Utilización de capacidad robótica',
'Cobertura de la demanda':'Órdenes con pieza conforme',
'Capacidad de robots = N × (28.800 s / ciclo) × disponibilidad × destreza × coordinación. Producción procesada = min(capacidad robótica, capacidad logística, demanda). Conformes = procesadas × calidad. OEE sintético = disponibilidad × desempeño de destreza y coordinación × calidad.':'Capacidad = N × (28.800 s / ciclo efectivo) × disponibilidad × destreza × coordinación. Procesadas = min(capacidad robótica, logística, órdenes brutas). Conformes = procesadas × calidad. Índice operativo = disponibilidad × destreza × coordinación × calidad; es un proxy, distinto del OEE medido con un ciclo ideal.',
'Aprendizaje trimestral determinista, con mejoras suavizadas en ciclo y percepción; la demanda crece de forma hipotética. El índice no es un benchmark de un fabricante, ni un pronóstico de empleo o productividad.':'Con g = trimestre/19: ciclo efectivo = ciclo × (1 − 0,17g). Percepción mejora 6 puntos; disponibilidad y coordinación, 3; calidad, 1,2. Se aplican topes de 99,5 y 99,7. Destreza = 0,65 + 0,35 × percepción/100; coordinación efectiva = 0,67 + 0,33 × coordinación/100. Logística = capacidad inicial × (1 + 0,14g). Órdenes = órdenes iniciales × 1,013^trimestre. Se excluyen colas, inventarios, retrabajo y trayectorias físicas.',
'NIST Robotics':'NIST · Evaluación robótica',
}
for a,b in sorted(fixes.items(),key=lambda x:-len(x[0])):
 assert a in s,a
 s=s.replace(a,b)
s=s.replace('https://www.nist.gov/el/intelligent-systems-division-73500/robotics','https://www.nist.gov/programs-projects/performance-assessment-framework-robotic-systems')
s=s.replace('<div class="navright">','<div class="navright"><a href="index.html">PPT 4</a><a href="../index.html">Clase 3</a><a href="../ppt-1/index.html">PPT 1</a><a href="../ppt-2/index.html">PPT 2</a><a href="../ppt-3/index.html">PPT 3</a><a href="videos.html">Videos</a><a href="lab.html?lang=es" data-lab-language="es">ES</a><a href="lab-en.html?lang=en" data-lab-language="en">EN</a>')
s=s.replace('<span class="stepcounter" id="counter">','<label class="tiny" for="quarter-control">Trimestre <input id="quarter-control" type="range" min="0" max="19" step="1" value="0" style="width:170px"></label><span id="scenario-name" class="tiny"></span><span class="stepcounter" id="counter">')
s=s.replace('<div class="card kpi"><b>Cuello de botella</b>','<div class="card kpi"><b>Costo por pieza</b><strong id="cost">—</strong><em>u.m. ficticias / pieza conforme</em></div><div class="card kpi"><b>Cuello de botella</b>')
s=s.replace('<svg id="chart"','<p class="tiny chart-legend"><span style="color:var(--cyan)">━━ Conformes del escenario</span> · <span style="color:var(--red)">━━ Órdenes brutas</span> · <span style="color:var(--gold)">┄┄ Conformes de referencia</span></p><svg id="chart"')
s=s.replace('<p class="tiny muted"><b>Bibliografía:', '<p class="tiny muted">Costo del turno = 200 + 30 × robots + 0,04 × capacidad logística inicial, en unidades monetarias ficticias. Costo unitario = costo del turno / conformes. Coeficientes constantes para los cinco escenarios. Se excluyen CAPEX, financiamiento e impuestos. No representa precios ni ROI empresarial.</p><p class="tiny muted"><b>Bibliografía:')
s=s.replace('</style>','a{color:var(--cyan)}.control{align-self:start}.navright a{font-size:12px;font-weight:750}.kpis{grid-template-columns:repeat(5,minmax(0,1fr))}.kpi strong{font-size:24px;overflow-wrap:anywhere}.chart-legend{line-height:1.8}.chart-legend span{white-space:normal}@media(max-width:1150px){.kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:740px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}.hero-inner{min-width:0}.hero p,.navright a{overflow-wrap:anywhere}</style>')
D={
'China Tecnológica · Robótica e IA incorporada | Laboratorio SG':'Technological China · Robotics and Embodied AI | SG Laboratory',
'PPT 04 · LABORATORIO':'PPT 04 · LABORATORY','Cambiar tema visual':'Change visual theme','Noche':'Night','Luz':'Light','Pizarra':'Chalkboard','Clase 3':'Class 3',
'Laboratorio interactivo · China Tecnológica':'Interactive laboratory · Technological China','Robótica e IA incorporada':'Robotics and embodied AI',
'Experimentá con una celda industrial: robots, tiempo de ciclo, percepción, disponibilidad, calidad, coordinación y demanda. Observá por qué la producción útil depende de toda la cadena.':'Experiment with an industrial cell: robots, cycle time, perception, availability, quality, coordination and orders. See why useful output depends on the whole system.',
'HTML autónomo · offline':'Self-contained HTML · offline','Modelo dinámico reproducible':'Reproducible dynamic model','No calibrado a fabricantes':'Not calibrated to manufacturers',
'01 / Escenarios de fábrica':'01 / Factory scenarios','Podés ajustar todas las variables después de elegir un caso.':'You can adjust every variable after selecting a case.',
'⚖️ Referencia':'⚖️ Reference','Celda mixta equilibrada':'A balanced mixed cell','🏭 Escalamiento':'🏭 Scaling','Más robots, menor coordinación':'More robots, lower coordination','🧠 Política adaptativa':'🧠 Adaptive policy','Percepción y destreza mejoradas':'Improved perception and dexterity','⚠️ Interrupciones':'⚠️ Disruptions','Menor disponibilidad y calidad':'Lower availability and quality','🔗 Integración total':'🔗 Full integration','Equilibrio entre toda la planta':'Coordination across the plant',
'02 / Parámetros ajustables':'02 / Adjustable parameters','Planta hipotética con turno de ocho horas. No son cifras de Unitree, UBTECH ni AGIBOT.':'A hypothetical plant with an eight-hour shift. These are not Unitree, UBTECH or AGIBOT figures.',
'Robots en la celda':'Robots in the cell','Tiempo de ciclo (segundos)':'Cycle time (seconds)','Disponibilidad operativa':'Operating availability','Calidad de primera pasada':'First-pass quality','Percepción y destreza (índice)':'Perception and dexterity (index)','Coordinación de flota (índice)':'Fleet coordination (index)','Capacidad logística (piezas/turno)':'Logistics capacity (parts/shift)','Órdenes brutas (piezas/turno)':'Gross orders (parts/shift)',
'Todos los escenarios usan una reducción acumulada de ciclo del 17% en 20 trimestres. Editar un control activa Personalizado. Los índices no son porcentajes de éxito medidos.':'All scenarios use a cumulative 17% cycle reduction over 20 quarters. Editing a control activates Custom. Indices are not measured success percentages.',
'Piezas conformes':'Good parts','Por turno de ocho horas':'Per eight-hour shift','Órdenes conformes':'Good orders','Conformes / órdenes brutas':'Good output / gross orders','Índice operativo':'Operating index','Proxy de disponibilidad, destreza y calidad':'Availability, dexterity and quality proxy','Cuello de botella':'Bottleneck','Puede haber restricciones empatadas':'Constraints can be tied','Costo por pieza':'Cost per part','u.m. ficticias / pieza conforme':'Fictional m.u. / good part',
'▶ Simular':'▶ Run','→ Paso':'→ Step','← Anterior':'← Back','↺ Reiniciar':'↺ Reset','Trimestre':'Quarter','T1 · 2026':'Q1 · 2026',
'03 / Planta ilustrativa en movimiento':'03 / Illustrative factory in motion','Flujo con estaciones, robots móviles y control de calidad; la animación es explicativa y no refleja trayectorias reales.':'Stations, mobile robots and quality control. The animation explains functions without representing real trajectories.',
'Esquema animado de fábrica con robots y transportadores':'Animated factory schematic with robots and conveyors','ENTRADA':'INPUT','CALIDAD':'QUALITY','SALIDA':'OUTPUT','Mapa funcional · diagrama propio':'Functional map · original diagram','Los controles modifican los tres eslabones del sistema.':'Controls modify the three constraints in the system.',
'04 / Producción conforme y órdenes brutas':'04 / Good output and gross orders','20 trimestres, 2026–2030. Trayectorias hipotéticas, sin calibración ni pronóstico.':'20 quarters, 2026–2030. Hypothetical trajectories without calibration or forecasting.','━━ Conformes del escenario':'━━ Scenario good output','━━ Órdenes brutas':'━━ Gross orders','┄┄ Conformes de referencia':'┄┄ Reference good output','Producción y demanda por trimestre':'Output and orders by quarter',
'05 / Diagnóstico y sensibilidad':'05 / Diagnosis and sensitivity','Utilización de capacidad robótica':'Robot capacity utilisation','Órdenes con pieza conforme':'Orders with a good part','06 / Matemática y límites':'06 / Mathematics and limits',
fixes['Capacidad de robots = N × (28.800 s / ciclo) × disponibilidad × destreza × coordinación. Producción procesada = min(capacidad robótica, capacidad logística, demanda). Conformes = procesadas × calidad. OEE sintético = disponibilidad × desempeño de destreza y coordinación × calidad.']:'Capacity = N × (28,800 s / effective cycle) × availability × dexterity × coordination. Processed = min(robot capacity, logistics, gross orders). Good output = processed × quality. Operating index = availability × dexterity × coordination × quality. It is a proxy, distinct from OEE measured against an ideal cycle.',
fixes['Aprendizaje trimestral determinista, con mejoras suavizadas en ciclo y percepción; la demanda crece de forma hipotética. El índice no es un benchmark de un fabricante, ni un pronóstico de empleo o productividad.']:'With g = quarter/19: effective cycle = cycle × (1 − 0.17g). Perception gains 6 points; availability and coordination gain 3; quality gains 1.2. Caps of 99.5 and 99.7 apply. Dexterity = 0.65 + 0.35 × perception/100; effective coordination = 0.67 + 0.33 × coordination/100. Logistics = initial capacity × (1 + 0.14g). Orders = initial orders × 1.013^quarter. Queues, inventory, rework and physical paths are excluded.',
'Costo del turno = 200 + 30 × robots + 0,04 × capacidad logística inicial, en unidades monetarias ficticias. Costo unitario = costo del turno / conformes. Coeficientes constantes para los cinco escenarios. Se excluyen CAPEX, financiamiento e impuestos. No representa precios ni ROI empresarial.':'Shift cost = 200 + 30 × robots + 0.04 × initial logistics capacity, in fictional monetary units. Unit cost = shift cost / good output. Coefficients are constant across all five presets. CAPEX, financing and taxes are excluded. This does not represent commercial prices or investment returns.',
'Bibliografía:':'References:','NIST · Evaluación robótica':'NIST · Robotics assessment',
'Simulación académica original · Sergio Gevatschnaider · Sin API, afiliación institucional ni fecha de dictado. La producción de fábrica es hipotética.':'Original teaching simulation · Sergio Gevatschnaider · No API, institutional affiliation or class date. Factory output is hypothetical.'}
model=Path(__file__).with_name('model-source.js').read_text();app=Path(__file__).with_name('app.js').read_text();(B/'model.cjs').write_text(model)
for l in ['es','en']:
 out=s
 if l=='en':
  embedded=re.findall(r'data:image/[^;]+;base64,[A-Za-z0-9+/=]+',out)
  for i,asset in enumerate(embedded):out=out.replace(asset,f'__PPT4_ASSET_{i}__')
  for a,b in sorted(D.items(),key=lambda x:-len(x[0])):out=out.replace(a,b)
  out=out.replace('lang="es"','lang="en"')
  for i,asset in enumerate(embedded):out=out.replace(f'__PPT4_ASSET_{i}__',asset)
 # Nav follows the active language; switching languages is handled by the state-preserving link.
 out=out.replace('href="index.html"',f'href="index.html?lang={l}"').replace('href="../index.html"',f'href="../index.html?lang={l}"').replace('href="videos.html"',f'href="videos.html?lang={l}"')
 for k in [1,2,3]:out=out.replace(f'href="../ppt-{k}/index.html"',f'href="../ppt-{k}/index.html?lang={l}"')
 out+='<script>'+model+'</script><script>'+app+'</script></body></html>'
 (B/('lab-en.html' if l=='en' else 'lab.html')).write_text(out)
Path(__file__).with_name('lab-i18n.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
print('ES/EN self-contained labs generated with fixed reference and reproducible inputs')

(() => {
    'use strict';

    const STORAGE_KEY = 'china-ai-language';
    const fileName = decodeURIComponent(window.location.pathname.split('/').pop() || '');

    const common = {
        'Contexto editorial': 'Editorial context',
        '← Portada bilingüe / Bilingual home': '← Bilingual home / Portada bilingüe',
        '· Recurso bilingüe ES/EN · edición 2026': '· Bilingual ES/EN resource · 2026 edition',
        'Material elaborado por el profesor Sergio Gevatschnaider': 'Prepared by Professor Sergio Gevatschnaider'
    };

    const dictionaries = {
        'Capital Robótico vs Capital Común — Efecto del Data Flywheel.html': {
            'Capital Robótico y Data Flywheel — Demostración Interactiva': 'Robotic Capital and the Data Flywheel — Interactive Demonstration',
            '⚡ Capital Robótico vs Capital Común — Efecto del Data Flywheel': '⚡ Robotic Capital vs Conventional Capital — The Data Flywheel Effect',
            'Interactúa con los parámetros y observa cómo el aprendizaje endógeno (': 'Adjust the parameters to see how endogenous learning (',
            ') eleva la productividad del capital robótico': ') raises the productivity of robotic capital',
            '⚙️ Parámetros del modelo': '⚙️ Model Parameters',
            'Parámetros del modelo': 'Model Parameters',
            'A — Escala': 'A — Scale',
            'α — Trabajo (L)': 'α — Labour (L)',
            'β — Capital común (K)': 'β — Conventional capital (K)',
            'γ — Capital robótico (R·θ)': 'γ — Robotic capital (R·θ)',
            'α+β+γ = 1.00 → Rendimientos constantes a escala': 'α+β+γ = 1.00 → Constant returns to scale',
            'Dotaciones': 'Factor Endowments',
            'L — Trabajo': 'L — Labour',
            'K — Capital común': 'K — Conventional capital',
            'R — Capital robótico': 'R — Robotic capital',
            'Flywheel de datos': 'Data Flywheel',
            'U — Uso (operaciones)': 'U — Use (operations)',
            'D — Diversidad (tareas)': 'D — Diversity (tasks)',
            'β — Sensibilidad': 'β — Sensitivity',
            'λ — Velocidad de aprendizaje': 'λ — Learning rate',
            'T — Ciclos (acumulación)': 'T — Cycles (accumulation)',
            'Aislar aprendizaje (R constante)': 'Isolate learning (hold R constant)',
            'Barra apilada: Δ por θ': 'Stacked bar: Δ from θ',
            'Preajuste: énfasis en el aprendizaje': 'Preset: learning emphasis',
            'Con un λ bajo, la curva tarda más en saturarse y T tiene un efecto mayor.': 'With a low λ, the curve saturates more slowly and T has a larger effect.',
            'Producción y efecto del aprendizaje': 'Output and Learning Effect',
            'θ₀ (actual)': 'θ₀ (current)',
            'θ₁ (tras T)': 'θ₁ (after T)',
            'ΔY por θ (puro)': 'ΔY from θ (pure learning effect)',
            'ΔY total (Y₂−Y₀)': 'Total ΔY (Y₂−Y₀)',
            '% explicado por θ': '% explained by θ',
            'actual': 'current',
            'posterior': 'post-flywheel',
            'Barras Y0, Y1, Y2 y MP_R': 'Bars for Y0, Y1, Y2 and MP_R',
            'Lectura:': 'How to read this:',
            'Y₁ = más uso': 'Y₁ represents greater use',
            'sin': 'without',
            'aprender. Y₂ = uso +': 'learning. Y₂ combines use and',
            'aprendizaje': 'learning',
            '. La parte apilada resalta la ganancia pura del': '. The stacked portion highlights the pure gain from the',
            '(Δθ). Prueba a reducir λ o activa “Aislar aprendizaje”.': '(Δθ). Try reducing λ or select “Isolate learning”.',
            'Curva de aprendizaje': 'Learning Curve',
            'Se grafica θ vs': 'The chart plots θ against',
            '. Puntos: estado actual (x₀) y tras T ciclos (x₁).': '. Points show the current state (x₀) and the state after T cycles (x₁).',
            'Elaborado por el profesor Sergio Gevatschnaider': 'Prepared by Professor Sergio Gevatschnaider',
            'Y₁: +uso SIN aprendizaje': 'Y₁: +use WITHOUT learning',
            'Y₂: +uso + aprendizaje (θ)': 'Y₂: +use + learning (θ)',
            'MP_R actual': 'Current MP_R',
            'MP_R post-flywheel': 'Post-flywheel MP_R',
            'Δ por θ': 'Δ from θ'
        },
        'Data Flywheel (U→D→Q→U).html': {
            'Data Flywheel Robótico — EE. UU. vs. China': 'Robotic Data Flywheel — United States vs. China',
            'Simulador del Data Flywheel — EE. UU. vs. China': 'Data Flywheel Simulator — United States vs. China',
            'Dos modos:': 'Two modes:',
            'multiplicativo y': 'multiplicative and',
            'de acumulación y flujo con instalaciones de la IFR': 'stock–flow using IFR installation data',
            'Modo y horizonte': 'Mode and Time Horizon',
            'Modo': 'Mode',
            'Horizonte T (meses)': 'Time Horizon T (months)',
            'Umbral τ (tτ)': 'Threshold τ (tτ)',
            'Parámetros globales': 'Global Parameters',
            'ω (obsolescencia)': 'ω (obsolescence)',
            'Estado y parámetros — EE. UU. (': 'State and parameters — United States (',
            'azul': 'blue',
            'U0 (miles)': 'U0 (thousands)',
            's (mes)': 's (per month)',
            'I anual (miles)': 'Annual I (thousands)',
            'ρ (mes)': 'ρ (per month)',
            'Estado y parámetros — China (': 'State and parameters — China (',
            'rojo': 'red',
            '📊 Base': '📊 Baseline',
            '🌐 CN ↑ δ (0.45→0.70)': '🌐 China ↑ δ (0.45→0.70)',
            '⚡ EE. UU. ↓ σ (0.002→0.001)': '⚡ United States ↓ σ (0.002→0.001)',
            '📈 CN ↑ I (+20%)': '📈 China ↑ I (+20%)',
            '🎯 EE. UU. ↑ δ (0.80→0.90)': '🎯 United States ↑ δ (0.80→0.90)',
            '↺ Restablecer': '↺ Reset',
            '▶ Reproducir': '▶ Play',
            '⏸ Pausar': '⏸ Pause',
            'EE. UU.': 'United States',
            'Q final': 'Final Q',
            'Calidad del modelo Q(t)': 'Model Quality Q(t)',
            'Unidades desplegadas U(t) (miles)': 'Deployed Units U(t) (thousands)',
            'Datos acumulados D(t)': 'Cumulative Data D(t)',
            'Tiempo hasta Q ≥ τ': 'Time to Reach Q ≥ τ',
            'Simulador animado — EE. UU. vs. China · Data Flywheel (U→D→Q→U) · Material elaborado por el profesor Sergio Gevatschnaider': 'Animated simulator — United States vs. China · Data Flywheel (U→D→Q→U) · Prepared by Professor Sergio Gevatschnaider',
            'EE. UU. (miles)': 'United States (thousands)',
            'China (miles)': 'China (thousands)'
        },
        'Robot_datos_sinteticos.html': {
            'Modelo de data flywheel — datos reales y sintéticos': 'Data Flywheel Model — Real + Synthetic Data',
            '🔄 Modelo de data flywheel — datos reales y sintéticos': '🔄 Data Flywheel Model — Real + Synthetic Data',
            'Flujo de datos efectivo U↑D↑Q↑U con datos sintéticos (sim2real, mezcla óptima y reducción de fricción efectiva)': 'Effective U↑D↑Q↑U data flow with synthetic data (sim-to-real transfer, optimal mixing and lower effective friction)',
            '🎯 Escenarios': '🎯 Scenarios',
            'Selecciona un escenario': 'Select a Scenario',
            '⚙️ Parámetros globales': '⚙️ Global Parameters',
            'β (eficiencia)': 'β (learning efficiency)',
            'θ (curvatura)': 'θ (curvature)',
            'φ (peso de la diversidad)': 'φ (diversity weight)',
            '⏱️ Meses': '⏱️ Months',
            '🧪 Canal de datos sintéticos': '🧪 Synthetic-Data Channel',
            'Escala S (×)': 'S Scale (×)',
            'Fidelidad ψ (±)': 'Fidelity ψ (±)',
            'Cobertura χ (±)': 'Coverage χ (±)',
            'Mezcla óptima η* (±)': 'Optimal Mix η* (±)',
            '📊 Leyenda': '📊 Legend',
            'EE. UU.': 'United States',
            'Q: calidad': 'Q: quality',
            'U: unidades': 'U: units',
            'D: datos': 'D: data',
            'm(η): mezcla': 'm(η): mix',
            '📈 Métricas clave (KPI)': '📈 Key Performance Indicators (KPIs)',
            '📊 Calidad Q(t)': '📊 Quality Q(t)',
            '🤖 Despliegue U(t)': '🤖 Deployment U(t)',
            '💾 Datos D(t)': '💾 Data D(t)',
            '🔀 Mezcla m(η) y fracción η(t)': '🔀 Mix m(η) and Fraction η(t)',
            '🎨 δ efectiva (diversidad)': '🎨 Effective δ (diversity)',
            '⚡ Flujo ΔD': '⚡ Flow ΔD',
            'Modelo matemático:': 'Mathematical model:',
            'Con': 'Where',
            'Escenario base': 'Baseline Scenario',
            'Escenario base reproducible: canal sintético desactivado (S=0).': 'Reproducible baseline: the synthetic-data channel is disabled (S=0).',
            'EE. UU.: datos sintéticos de alta fidelidad': 'United States: high-fidelity synthetic data',
            'EE. UU. compensa un U menor con datos sintéticos de alta fidelidad y cobertura, y una mezcla ajustada.': 'The United States offsets a lower U with high-fidelity, high-coverage synthetic data and a tuned mix.',
            'China: simulación + diversidad': 'China: simulation + diversity',
            'China aumenta la diversidad real (δR) y añade simulación de alta cobertura; en esta calibración, t90 se reduce considerablemente.': 'China increases real-world diversity (δR) and adds high-coverage simulation; in this calibration, t90 falls substantially.',
            'China: mayor diversidad (real)': 'China: greater diversity (real-world data)',
            'Aumentar δR en China puede acelerar el aprendizaje en esta calibración (diversidad > escala).': 'Increasing δR in China can accelerate learning in this calibration (diversity > scale).',
            'EE. UU.: menor fricción (real)': 'United States: lower friction (real-world deployment)',
            'Reducir σ aumenta U, pero modifica poco t90 si no crecen la diversidad o la fidelidad.': 'Reducing σ increases U but changes t90 only slightly unless diversity or fidelity also improve.',
            'Umbral Q=0.90': 'Threshold Q=0.90',
            't₉₀ (EE. UU.)': 't₉₀ (United States)',
            't₉₀ (China)': 't₉₀ (China)',
            'meses hasta Q≥0.90': 'months to reach Q≥0.90',
            'Q final (EE. UU.)': 'Final Q (United States)',
            'Q final (China)': 'Final Q (China)',
            'U final (EE. UU.)': 'Final U (United States)',
            'U final (China)': 'Final U (China)',
            'D final (EE. UU.)': 'Final D (United States)',
            'D final (China)': 'Final D (China)',
            'unidades desplegadas': 'deployed units',
            'datos acumulados': 'cumulative data',
            'EE. UU. — Q': 'United States — Q',
            'China — Q': 'China — Q',
            'EE. UU. — U (miles)': 'United States — U (thousands)',
            'China — U (miles)': 'China — U (thousands)',
            'EE. UU. — D': 'United States — D',
            'China — D': 'China — D',
            'EE. UU. — m(η)': 'United States — m(η)',
            'China — m(η)': 'China — m(η)',
            'EE. UU. — η(t)': 'United States — η(t)',
            'China — η(t)': 'China — η(t)',
            'EE. UU. — δ^eff': 'United States — δ^eff',
            'China — δ^eff': 'China — δ^eff',
            'EE. UU. — ΔD_eff': 'United States — ΔD_eff',
            'China — ΔD_eff': 'China — ΔD_eff'
        },
        'Capital Robótico vs. Capital Común_Teoría.html': {
            'Capital Robótico vs. Capital Común: El Efecto del Data Flywheel': 'Robotic Capital vs Conventional Capital: The Data Flywheel Effect',
            'Cambiar tema': 'Change theme',
            'Capital Robótico vs. Capital Común': 'Robotic Capital vs Conventional Capital',
            'Una simulación del impacto del Data Flywheel en la productividad total': 'A simulation of the Data Flywheel’s impact on total output',
            '1. Propósito General del Simulador': '1. Purpose of the Simulator',
            'Este simulador busca cuantificar el efecto del aprendizaje tecnológico (Data Flywheel) sobre la productividad y el crecimiento económico.': 'This simulator quantifies the effect of technology-driven learning (the Data Flywheel) on productivity and economic growth.',
            'En otras palabras:': 'In other words:',
            '¿cuánto del crecimiento de una economía proviene de invertir más en robots (capital físico) y cuánto proviene de aprender y mejorar con los datos (capital cognitivo o aprendizaje)?': 'how much economic growth comes from investing in more robots (physical capital), and how much comes from learning and improving through data (cognitive capital or learning)?',
            '2. Estructura Conceptual del Modelo': '2. Conceptual Structure of the Model',
            'El modelo se basa en una función de producción ampliada de tipo Cobb–Douglas, que incluye tres tipos de capital:': 'The model uses an extended Cobb–Douglas production function with three productive inputs:',
            'Fórmula de Producción': 'Production Function',
            'Componentes del Modelo': 'Model Components',
            'Símbolo': 'Symbol',
            'Nombre': 'Name',
            'Intuición': 'Interpretation',
            'Producción total': 'Total output',
            'Valor económico generado.': 'Economic value generated.',
            'Nivel tecnológico general': 'General technology level',
            'Innovaciones externas (no por aprendizaje interno).': 'External innovations (not generated by internal learning).',
            'Trabajo humano': 'Human labour',
            'Capital humano y horas de trabajo.': 'Human capital and hours worked.',
            'Capital común': 'Conventional capital',
            'Máquinas, fábricas, infraestructura.': 'Machinery, factories and infrastructure.',
            'Capital robótico': 'Robotic capital',
            'Robots, automatización inteligente.': 'Robots and intelligent automation.',
            'Productividad del aprendizaje': 'Learning productivity',
            'Cuánto más eficaces se vuelven los robots gracias a los datos.': 'The extent to which data make robots more effective.',
            'Elasticidades': 'Elasticities',
            'Miden cuánto contribuye cada tipo de capital al total (suma ≈ 1).': 'Measure each input’s contribution to output (sum ≈ 1).',
            '3. El Data Flywheel en este Contexto': '3. The Data Flywheel in This Model',
            'El Data Flywheel es el ciclo de retroalimentación positiva que ocurre cuando más robots generan más datos, que entrenan mejor la IA, lo que hace que esos robots sean más productivos (mayor θ), impulsando aún más su uso.': 'The Data Flywheel is a positive feedback loop: more robots generate more data; those data improve AI training; and better AI makes robots more productive (a higher θ), encouraging further use.',
            'Matemáticamente, este aprendizaje se modela como una curva de saturación exponencial:': 'Mathematically, learning is represented by an exponential saturation curve:',
            'Fórmula del Aprendizaje': 'Learning Function',
            'Parámetros Clave': 'Key Parameters',
            'Parámetro': 'Parameter',
            'Significado': 'Meaning',
            'Uso o despliegue de robots.': 'Robot use or deployment.',
            'Diversidad de datos disponibles.': 'Diversity of available data.',
            'Ritmo de aprendizaje (velocidad con que el sistema incorpora experiencia).': 'Learning rate (how quickly the system incorporates experience).',
            'Potencial máximo de mejora por aprendizaje.': 'Maximum potential improvement from learning.',
            'Intuitivamente: La fórmula': 'Intuitively, the expression',
            'significa que al principio el sistema aprende rápido, pero luego el aprendizaje se desacelera a medida que se acerca a su máxima eficiencia posible (1 + β': 'means that the system learns quickly at first, then learning slows as it approaches its maximum attainable efficiency (1 + β',
            '4. Etapas que Calcula el Simulador': '4. Stages Calculated by the Simulator',
            'El simulador compara tres escenarios fijos:': 'The simulator compares three fixed scenarios:',
            'Etapa 1: Producción Base (Y₀)': 'Stage 1: Baseline Output (Y₀)',
            'Representa el estado inicial de la economía. Los robots trabajan con su nivel inicial de productividad (θ₀), sin aprendizaje adicional.': 'This is the economy’s initial state. Robots operate at their initial productivity level (θ₀), with no additional learning.',
            'Etapa 2: Más Uso, Sin Aprendizaje (Y₁)': 'Stage 2: Greater Use, No Learning (Y₁)',
            'Aumenta la cantidad de robots (R), pero sin mejorar su eficiencia (θ). Esto muestra el crecimiento puramente por inversión física. Es el crecimiento industrial clásico: “Pongo más máquinas, produzco más.”': 'The number of robots (R) increases without any improvement in efficiency (θ). This isolates growth from physical investment: the classic industrial logic of “more machines, more output.”',
            'Etapa 3: Más Uso + Aprendizaje (Y₂ - Efecto Flywheel)': 'Stage 3: Greater Use + Learning (Y₂ — Flywheel Effect)',
            'Además de tener más robots, estos aprendieron de la experiencia. Su productividad aumentó de θ₀ a θ₁. Es el crecimiento que proviene del capital cognitivo.': 'In addition to deploying more robots, the robots learn from experience. Their productivity rises from θ₀ to θ₁, capturing growth from cognitive capital.',
            '5. Interpretación del Gráfico de Resultados': '5. Interpreting the Results Chart',
            'El gráfico visualiza las tres etapas y dos métricas de productividad marginal (MP': 'The chart displays the three stages and two measures of marginal productivity (MP',
            'Visualización de Resultados de la Simulación': 'Simulation Results',
            'Y₀ (Base)': 'Y₀ (Baseline)',
            'Producción inicial:': 'Initial output:',
            'Y₁ (+uso sin aprendizaje)': 'Y₁ (+use, no learning)',
            'Más robots, misma eficiencia:': 'More robots, same efficiency:',
            'Y₂ (+uso + aprendizaje)': 'Y₂ (+use + learning)',
            'Más robots y más inteligencia:': 'More robots and greater intelligence:',
            'actual': 'current',
            'Productividad marginal actual:': 'Current marginal productivity:',
            'post-flywheel': 'post-flywheel',
            'Productividad marginal post-aprendizaje:': 'Marginal productivity after learning:',
            '6. ¿Qué Dicen los Resultados?': '6. What Do the Results Show?',
            '(a) Crecimiento Total': '(a) Total Growth',
            'El crecimiento total del sistema fue de': 'Total system growth was',
            '(de 108.50 a 117.24), lo que representa un aumento del': '(from 108.50 to 117.24), an increase of',
            '(b) Descomposición del Crecimiento': '(b) Growth Decomposition',
            'Fuente de Crecimiento': 'Source of Growth',
            'Aporte al Crecimiento': 'Contribution to Growth',
            'Porcentaje del Total': 'Share of Total',
            'Aumento de Robots (sin aprendizaje)': 'More Robots (no learning)',
            'Aprendizaje (Data Flywheel)': 'Learning (Data Flywheel)',
            'Interpretación Clave:': 'Key interpretation:',
            'Casi la mitad del crecimiento total no provino de tener más robots, sino de que los robots existentes aprendieron y mejoraron gracias al Data Flywheel.': 'In this calibration, nearly half of total growth comes not from having more robots, but from existing robots learning and improving through the Data Flywheel.',
            '(c) Productividad Marginal (MP': '(c) Marginal Productivity (MP',
            'La productividad marginal del capital robótico bajó de 0.33 a 0.31, reflejando la ley de rendimientos decrecientes. Aunque los robots son más productivos en conjunto, cada robot adicional contribuye un poco menos al total a medida que la economía se satura.': 'The marginal productivity of robotic capital falls from 0.33 to 0.31, reflecting diminishing returns. Although the robot fleet is more productive overall, each additional robot contributes slightly less as the model economy approaches saturation.',
            '7. Intuición Económica': '7. Economic Intuition',
            'Imagina dos escenarios en una fábrica inteligente:': 'Consider two scenarios in a smart factory:',
            'Escenario A (Sin aprendizaje - Y₁):': 'Scenario A (No learning — Y₁):',
            'Compras más robots, pero cada uno hace exactamente lo mismo que antes. El crecimiento depende del capital físico.': 'You purchase more robots, but each performs exactly as before. Growth depends on physical capital.',
            'Escenario B (Con aprendizaje - Y₂):': 'Scenario B (With learning — Y₂):',
            'Los robots (nuevos y viejos) aprenden de los datos, se coordinan mejor, optimizan tareas y fallan menos. El crecimiento depende del capital cognitivo.': 'New and existing robots learn from data, coordinate better, optimise tasks and fail less often. Growth depends on cognitive capital.',
            'En el segundo caso, la producción aumenta sin necesidad de agregar tanto hardware, porque el software (la IA) se vuelve más eficiente.': 'In the second case, output rises with less additional hardware because the software layer—the AI—becomes more effective.',
            '8. Conclusión Final y Resumen': '8. Conclusion and Summary',
            'Este simulador muestra la transición estructural de la economía moderna: ya no basta con invertir más dinero en máquinas (capital físico); ahora, la ventaja competitiva surge de aprender con los datos (capital cognitivo).': 'This simulator illustrates a structural feature of the modern economy: physical investment still matters, but learning from data can also become a source of competitive advantage.',
            'Puntos Clave:': 'Key Points:',
            'Más del 45% del crecimiento provino del aprendizaje del sistema (θ).': 'More than 45% of growth came from system learning (θ) in this calibration.',
            'El Data Flywheel convierte el uso de robots en una forma de entrenamiento: cada tarea genera información que mejora la productividad futura.': 'The Data Flywheel turns robot use into a form of training: each task generates information that can improve future productivity.',
            'El sistema sigue mostrando rendimientos decrecientes marginales, lo que significa que el aprendizaje se vuelve más lento o costoso a medida que el sistema se perfecciona.': 'The model still exhibits diminishing marginal returns: learning becomes slower or more costly as the system improves.',
            'En Resumen': 'At a Glance',
            'Concepto': 'Concept',
            'Descripción': 'Description',
            'Ejemplo Didáctico': 'Teaching Example',
            'Estado base': 'Baseline state',
            'Fábrica con robots estándar.': 'Factory with standard robots.',
            'Más robots sin aprendizaje': 'More robots without learning',
            '“Duplico el número de máquinas.”': '“I double the number of machines.”',
            'Más robots + aprendizaje': 'More robots + learning',
            '“Los robots se vuelven más inteligentes.”': '“The robots become more intelligent.”',
            'ΔY por θ': 'ΔY from θ',
            'Ganancia cognitiva': 'Cognitive gain',
            'El efecto real del Data Flywheel.': 'The isolated Data Flywheel effect.',
            'Productividad marginal': 'Marginal productivity',
            'Valor agregado por cada robot adicional.': 'Value added by each additional robot.',
            'Lección clave:': 'Key lesson:',
            'En esta calibración ilustrativa, el aprendizaje (datos + IA) genera un aporte al crecimiento comparable al de la inversión física.': 'In this illustrative calibration, learning (data + AI) contributes an amount of growth comparable to physical investment.',
            'Material elaborado por el profesor Sergio Gevatschnaider a partir del simulador de capital común y capital robótico.': 'Prepared by Professor Sergio Gevatschnaider using the conventional-capital and robotic-capital simulator.'
        },
        'Simulador Data Flywheel Componentes.html': {
            'El Efecto Flywheel: La Carrera Robótica Mundial': 'The Flywheel Effect: The Global Robotics Race',
            'Cambiar tema': 'Change theme',
            'El Efecto Flywheel': 'The Flywheel Effect',
            'Cómo los Datos Impulsan la Carrera Robótica Mundial': 'How Data Shape the Global Robotics Race',
            '1. El Círculo Virtuoso: ¿Qué es el "Data Flywheel"?': '1. The Virtuous Cycle: What Is the Data Flywheel?',
            'En el centro de la competencia en robótica e IA entre Estados Unidos y China se encuentra un ciclo autorreforzante conocido como': 'At the centre of the robotics and AI competition between the United States and China is a self-reinforcing cycle known as a',
            '(volante de inercia de datos). Este marco ayuda a analizar qué factores pueden influir en el liderazgo tecnológico.': '(data flywheel). This framework helps analyse the factors that may influence technological leadership.',
            'Es un sistema dinámico de retroalimentación: el despliegue de más robots genera enormes cantidades de datos del mundo real. Estos datos se utilizan para entrenar y refinar los modelos de IA, mejorando sus capacidades. A su vez, estos modelos mejorados impulsan el despliegue de aún más robots, creando un ciclo continuo de mejora.': 'It is a dynamic feedback system: deploying more robots generates large volumes of real-world data. Those data are used to train and refine AI models, improving their capabilities. Better models can then support further robot deployment, creating a continuous cycle of improvement.',
            'El Ciclo del "Data Flywheel" en Robótica': 'The Data Flywheel Cycle in Robotics',
            '1. Más Robots': '1. More Robots',
            'Se despliegan más unidades en el mundo real.': 'More units are deployed in real-world settings.',
            'Generan': 'Generate',
            '2. Más Datos': '2. More Data',
            'Se recopila información masiva sobre interacciones.': 'Large volumes of interaction data are collected.',
            'Entrenan': 'Train',
            '3. IA más Inteligente': '3. More Capable AI',
            'Los modelos de IA se refinan y mejoran.': 'AI models are refined and improved.',
            'Potencian': 'Enable',
            '4. Robots más Capaces': '4. More Capable Robots',
            'Nuevas unidades son más autónomas y eficientes.': 'New units become more autonomous and efficient.',
            '2. Una Historia de Dos Estrategias: Calidad vs. Cantidad': '2. Two Stylised Strategies: Quality vs Quantity',
            'Esta simulación estilizada contrasta dos configuraciones hipotéticas. El modelo incorpora variables como el despliegue, las tasas de aprendizaje y la calidad de los datos; no pretende describir de forma exhaustiva las estrategias nacionales reales.': 'This stylised simulation contrasts two hypothetical configurations. The model includes deployment, learning rates and data quality; it is not intended as a comprehensive description of either country’s actual strategy.',
            'Comparativa Estratégica: China vs. Estados Unidos': 'Stylised Comparison: China vs United States',
            'Enfoque de China: Cantidad': 'China Configuration: Scale',
            'Despliegue masivo para una rápida acumulación de datos. El volumen acelera el aprendizaje de la IA, incluso con datos de menor calidad individual.': 'Large-scale deployment accelerates data accumulation. Volume can speed up AI learning even when the model assigns lower quality to each individual observation.',
            'Enfoque de EE. UU.: Calidad': 'United States Configuration: Quality',
            'Menos robots pero más sofisticados. Se priorizan datos de alta precisión para impulsar saltos cualitativos en la capacidad de la IA.': 'Fewer but more sophisticated robots. The configuration gives greater weight to high-precision data and to qualitative gains in AI capability.',
            '3. El Enfoque de China: Una Apuesta por el Volumen': '3. China Configuration: An Emphasis on Scale',
            'En la calibración del modelo, China parte de una flota mayor y de una elevada capacidad de despliegue. Aunque el parámetro de diversidad por robot es menor, el volumen agregado acelera la acumulación de datos. Estos valores son supuestos didácticos y no mediciones directas de la calidad nacional de los datos.': 'In this calibration, China starts with a larger fleet and substantial deployment capacity. Although the per-robot diversity parameter is lower, aggregate scale accelerates data accumulation. These values are teaching assumptions, not direct measurements of national data quality.',
            'Parámetro': 'Parameter',
            'Símbolo': 'Symbol',
            'Valor': 'Value',
            'Significado': 'Meaning',
            'Robots Iniciales': 'Initial Robots',
            'Un despliegue inicial dominante.': 'A dominant initial deployment.',
            'Datos por Robot': 'Data per Robot',
            'Mayor generación de datos por unidad.': 'More data generated per unit.',
            'Calidad de Datos': 'Data Quality',
            'Menor calidad de datos individuales.': 'Lower modelled quality per observation.',
            'Tasa de Crecimiento Base': 'Baseline Growth Rate',
            'Crecimiento mensual autónomo más rápido.': 'Faster autonomous monthly growth.',
            'Efecto de la IA': 'AI Effect',
            'Un impacto ligeramente menor de la IA en el crecimiento.': 'A slightly smaller AI effect on growth.',
            'Fricción': 'Friction',
            'Menor tasa de deterioro o pérdida.': 'Lower deterioration or loss rate.',
            '4. La Estrategia de EE. UU.: Foco en Calidad e Innovación': '4. United States Configuration: Quality and Innovation',
            'En la configuración comparativa, Estados Unidos parte de una flota menor, pero recibe un parámetro de diversidad más alto y una mayor sensibilidad del despliegue a la calidad de la IA. También se trata de una hipótesis del modelo, no de una evaluación integral del ecosistema estadounidense.': 'In the comparison configuration, the United States starts with a smaller fleet but is assigned a higher diversity parameter and greater deployment sensitivity to AI quality. This is also a model assumption, not a comprehensive assessment of the U.S. ecosystem.',
            'Una flota inicial más pequeña.': 'A smaller initial fleet.',
            'Menor generación de datos por unidad.': 'Less data generated per unit.',
            'Datos precisos y de alta calidad.': 'High-precision, high-quality data.',
            'Crecimiento mensual autónomo más lento.': 'Slower autonomous monthly growth.',
            'La calidad de la IA tiene un impacto más fuerte.': 'AI quality has a stronger effect.',
            'Mayor tasa de deterioro o pérdida.': 'Higher deterioration or loss rate.',
            '5. El Corazón Matemático del Flywheel': '5. The Mathematical Core of the Flywheel',
            'La dinámica de esta competencia puede entenderse a través de un conjunto de modelos matemáticos interconectados que simulan el crecimiento de los robots (U), los datos acumulados (D) y la calidad de la IA (Q).': 'The model links equations for robot-fleet growth (U), cumulative data (D) and AI quality (Q).',
            'Crecimiento de una Flota Robótica (U)': 'Robot-Fleet Growth (U)',
            'El número de robots crece por una tasa base más el impulso de la calidad de la IA, menos el desgaste natural. La inteligencia de los robots amplifica el crecimiento de la flota.': 'The robot fleet grows according to a baseline rate plus the contribution of AI quality, minus natural attrition. Higher modelled intelligence amplifies fleet growth.',
            'El Motor de Datos (D)': 'The Data Engine (D)',
            'La acumulación de datos está directamente ligada al número de robots desplegados y a la calidad de los datos que generan. Una flota más grande se traduce en una acumulación más rápida.': 'Data accumulation is linked to the number of deployed robots and the assigned quality of the data they generate. A larger fleet produces faster accumulation in the model.',
            'El Camino hacia una IA más Inteligente (Q)': 'The Path to More Capable AI (Q)',
            'La mejora en la calidad de la IA es una función de los datos acumulados y su calidad. A medida que la calidad se acerca a su máximo (1), la mejora se ralentiza.': 'AI quality improves as a function of accumulated data and data quality. Improvement slows as Q approaches its maximum value of 1.',
            '6. Implicaciones Estratégicas: Una Carrera Contra el Tiempo': '6. Strategic Implications: A Race Against Time',
            'Con estos parámetros,': 'With these parameters,',
            'la escala inicial acelera el aprendizaje a corto plazo': 'initial scale accelerates short-term learning',
            '. El resultado cambia si se modifican la diversidad, la obsolescencia, la inversión o la sensibilidad de la adopción a la calidad del modelo.': '. The result changes when diversity, obsolescence, investment or deployment sensitivity to model quality is adjusted.',
            'La lección no es que la cantidad siempre supere a la calidad, sino que escala, diversidad y capacidad de aprendizaje interactúan. Los resultados son escenarios contrafácticos útiles para explorar mecanismos; no constituyen una predicción sobre qué país liderará.': 'The lesson is not that quantity always beats quality, but that scale, diversity and learning capacity interact. The results are counterfactual scenarios for exploring mechanisms; they are not a forecast of which country will lead.',
            'Fuentes': 'Sources',
            'Material elaborado por el profesor Sergio Gevatschnaider': 'Prepared by Professor Sergio Gevatschnaider'
        },
        'Datos Comparativos sobre Robótica.html': {
            'Datos comparativos sobre robótica: China vs. Estados Unidos': 'Comparative Robotics Data: China vs United States',
            'Cambiar tema': 'Change theme',
            'Datos comparativos sobre robótica': 'Comparative Robotics Data',
            'Análisis cuantitativo: China vs. Estados Unidos': 'Quantitative Analysis: China vs United States',
            '1. Volumen y Crecimiento de Robots Industriales': '1. Industrial Robot Volume and Growth',
            'A continuación se presentan los datos cuantitativos clave que ilustran la situación de la robótica industrial en ambas naciones.': 'The following key figures compare industrial robotics in the two countries.',
            'Métrica': 'Metric',
            'Estados Unidos': 'United States',
            'Nuevos robots instalados (último año)': 'New robots installed (latest year)',
            'Total de robots en operación': 'Operational robot stock',
            'Proporción de instalación (China vs. EE. UU.)': 'Installation ratio (China vs United States)',
            'Por cada robot nuevo en EE. UU., China instaló casi nueve.': 'China installed nearly nine new robots for every one installed in the United States.',
            '2. Posición en el Mercado Global (Año 2024)': '2. Position in the Global Market (2024)',
            'Instalaciones anuales (unidades)': 'Annual installations (units)',
            'Variación anual (2024 vs. año anterior)': 'Year-on-year change (2024)',
            'Cuota del mercado mundial de instalaciones nuevas': 'Share of global new installations',
            'Cuota dentro de los 5 principales mercados': 'Share accounted for by the top five markets',
            'El 80% de las instalaciones mundiales se concentró en los cinco principales mercados; China fue el mayor mercado por volumen anual.': 'The five largest markets accounted for 80% of global installations; China was the largest market by annual volume.',
            '3. Producción y Mercado Interno': '3. Domestic Production and Market Structure',
            'Cuota de mercado de robots de producción nacional': 'Domestic manufacturers’ share of the home market',
            '57% del mercado interno (2024)': '57% of the domestic market (2024)',
            'Pocos fabricantes nacionales; predominan las importaciones de Japón y Europa.': 'Few domestic manufacturers; imports from Japan and Europe predominate.',
            'Perfil del ecosistema': 'Ecosystem profile',
            'Mayor participación de proveedores locales y expansión hacia nuevos sectores.': 'A growing local-supplier share and expansion into new sectors.',
            'Amplia red de integradores nacionales de sistemas robóticos.': 'A broad domestic network of robotic-system integrators.',
            'Nota: Por primera vez, las empresas chinas vendieron más robots en su país que todos los proveedores extranjeros juntos.': 'Note: For the first time, Chinese manufacturers sold more robots in their home market than all foreign suppliers combined.',
            '4. Estrategia y Políticas Gubernamentales': '4. Strategy and Government Policy',
            'Comparativa de Estrategias Nacionales': 'Comparison of National Approaches',
            'China: Plan Estratégico "Made in China 2025"': 'China: “Made in China 2025” Strategic Plan',
            'Lanzado en 2015, elevó la robótica a prioridad nacional para transformar al país en una potencia tecnológica. Impulsado por costos laborales crecientes, se centró en la adopción masiva y el fomento de la fabricación nacional.': 'Launched in 2015, the plan made robotics a national priority in China’s push to become a technology powerhouse. Against a backdrop of rising labour costs, it promoted large-scale adoption and domestic manufacturing.',
            'Estados Unidos: estrategia descentralizada': 'United States: a decentralised approach',
            'La política combina programas federales de I+D, defensa y manufactura avanzada con inversión privada. Su estructura es menos centralizada que la planificación industrial china.': 'The policy landscape combines federal R&D, defence and advanced-manufacturing programmes with private investment. Its structure is less centralised than China’s industrial planning.',
            '5. Avances en Robótica Humanoide': '5. Advances in Humanoid Robotics',
            'Desarrollo de Robots Humanoides': 'Humanoid Robot Development',
            'China: desarrollo acelerado y presión sobre los costos': 'China: rapid development and cost pressure',
            'Empresas emergentes, acompañadas por políticas públicas y una amplia base manufacturera, desarrollan humanoides con rapidez. Como referencia comercial, el Unitree G1 se ofrece desde USD 13.500.': 'Start-ups, supported by public policy and a broad manufacturing base, are developing humanoids rapidly. As a commercial reference point, the Unitree G1 is offered from USD 13,500.',
            'Estados Unidos: pioneros y ecosistema de alta inversión': 'United States: pioneers and a capital-intensive ecosystem',
            'El ecosistema incluye pioneros y nuevas empresas con plataformas de distintas capacidades. Los precios publicados no bastan para comparar desempeño, autonomía o costo total de operación.': 'The ecosystem includes established pioneers and newer companies offering platforms with different capabilities. Published prices alone are insufficient to compare performance, autonomy or total cost of ownership.',
            'Fuentes:': 'Sources:',
            'IFR, Estados Unidos 2024': 'IFR, United States 2024',
            'Material elaborado por el profesor Sergio Gevatschnaider.': 'Prepared by Professor Sergio Gevatschnaider.'
        },
        'Simulacion_dataflywheel.html': {
            'Un ciclo autorreforzante de mejora continua impulsado por la IA': 'A self-reinforcing cycle of continuous improvement powered by AI',
            'Uso del Producto': 'Product Use',
            'Los usuarios interactúan generando datos': 'Users generate data through interaction',
            'Recopilación de Datos': 'Data Collection',
            'Captura y análisis de comportamiento': 'Behavioural data capture and analysis',
            'Mejora de IA': 'AI Improvement',
            'Los modelos aprenden y se optimizan': 'Models learn and improve',
            'Producto Mejorado': 'Improved Product',
            'Mejor experiencia impulsa más uso': 'A better experience drives greater use',
            'Ventaja Competitiva': 'Competitive Advantage',
            'Acelerar': 'Accelerate',
            'Reiniciar': 'Reset',
            '¿Cómo funciona el Data Flywheel?': 'How Does the Data Flywheel Work?',
            'Como un volante de inercia mecánico, el data flywheel requiere un esfuerzo inicial para comenzar a girar. Una vez que gana impulso, continúa con velocidad y potencia crecientes. Cada ciclo refuerza el siguiente: más usuarios → más datos → mejor IA → mejor producto → más usuarios. Este efecto acumulativo puede crear una barrera de entrada significativa y ha sido una estrategia central para plataformas como Amazon.': 'Like a mechanical flywheel, a data flywheel requires an initial effort to begin turning. Once it gains momentum, it continues with increasing speed and power. Each cycle reinforces the next: more users → more data → better AI → a better product → more users. This compounding effect can create a significant barrier to entry and has been central to the strategy of platforms such as Amazon.'
        }
    };

    const dictionary = { ...common, ...(dictionaries[fileName] || {}) };
    const originalText = new WeakMap();
    const lastRenderedText = new WeakMap();
    const originalAttributes = new WeakMap();
    let currentLanguage = 'es';
    let translating = false;

    function preserveWhitespace(source, replacement) {
        const leading = source.match(/^\s*/)?.[0] || '';
        const trailing = source.match(/\s*$/)?.[0] || '';
        return `${leading}${replacement}${trailing}`;
    }

    function translateDynamic(value) {
        const normalized = value.replace(/\s+/g, ' ').trim();
        if (!normalized) return normalized;
        if (dictionary[normalized]) return dictionary[normalized];
        if (/^Meses hasta Q\s*≥/i.test(normalized)) {
            return normalized.replace(/^Meses hasta/i, 'Months to reach');
        }
        if (/^\d+\s+meses$/i.test(normalized)) {
            return normalized.replace(/meses$/i, 'months');
        }
        if (/^calidad mes\s+\d+$/i.test(normalized)) {
            return normalized.replace(/^calidad mes/i, 'quality at month');
        }
        return normalized;
    }

    function shouldSkip(node) {
        const parent = node.parentElement;
        return !parent || Boolean(parent.closest('#china-ai-language-switch, script, style, noscript'));
    }

    function translateTextNode(node) {
        if (shouldSkip(node)) return;
        if (!originalText.has(node) || (lastRenderedText.has(node) && node.nodeValue !== lastRenderedText.get(node))) {
            originalText.set(node, node.nodeValue);
        }
        const source = originalText.get(node);
        const nextValue = currentLanguage === 'en'
            ? preserveWhitespace(source, translateDynamic(source))
            : source;
        lastRenderedText.set(node, nextValue);
        if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    }

    function translateElementAttributes(element) {
        if (element.closest('#china-ai-language-switch')) return;
        const attributes = ['aria-label', 'title', 'placeholder'];
        if (!originalAttributes.has(element)) originalAttributes.set(element, new Map());
        const saved = originalAttributes.get(element);
        attributes.forEach((attribute) => {
            if (!element.hasAttribute(attribute)) return;
            if (!saved.has(attribute)) saved.set(attribute, element.getAttribute(attribute));
            const source = saved.get(attribute);
            const nextValue = currentLanguage === 'en' ? translateDynamic(source) : source;
            if (element.getAttribute(attribute) !== nextValue) element.setAttribute(attribute, nextValue);
        });
    }

    function translateTree(root) {
        if (!root) return;
        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
        if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root);
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
            else translateElementAttributes(node);
        }
    }

    function refreshSimulation() {
        requestAnimationFrame(() => {
            const controls = document.querySelectorAll('input, select');
            controls.forEach((control) => {
                control.dispatchEvent(new Event('input', { bubbles: true }));
                control.dispatchEvent(new Event('change', { bubbles: true }));
            });
            window.dispatchEvent(new Event('resize'));
        });
    }

    function setLanguage(language, persist = true) {
        currentLanguage = language === 'en' ? 'en' : 'es';
        translating = true;
        document.documentElement.lang = currentLanguage;
        translateTree(document.body);
        if (!originalText.has(document.head.querySelector('title')?.firstChild) && document.title) {
            const titleNode = document.head.querySelector('title')?.firstChild;
            if (titleNode) originalText.set(titleNode, titleNode.nodeValue);
        }
        const titleNode = document.head.querySelector('title')?.firstChild;
        if (titleNode) translateTextNode(titleNode);
        document.querySelectorAll('#china-ai-language-switch button').forEach((button) => {
            const selected = button.dataset.language === currentLanguage;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        translating = false;
        if (persist) localStorage.setItem(STORAGE_KEY, currentLanguage);
        refreshSimulation();
        window.dispatchEvent(new CustomEvent('china-ai-languagechange', { detail: { language: currentLanguage } }));
    }

    function createLanguageSwitch() {
        const style = document.createElement('style');
        style.textContent = `
            #china-ai-language-switch{position:fixed;top:1rem;right:1rem;z-index:100000;display:flex;align-items:center;gap:.2rem;padding:.28rem;border:1px solid rgba(255,255,255,.34);border-radius:999px;background:rgba(4,20,30,.94);box-shadow:0 8px 28px rgba(0,0,0,.28);font:700 13px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;backdrop-filter:blur(10px)}
            #china-ai-language-switch button{min-width:2.65rem;padding:.55rem .68rem;border:0;border-radius:999px;background:transparent;color:#fff;cursor:pointer;font:inherit;letter-spacing:.04em}
            #china-ai-language-switch button:hover,#china-ai-language-switch button:focus-visible{outline:2px solid #f4c45f;outline-offset:1px}
            #china-ai-language-switch button.is-active{background:#f4c45f;color:#071923}
            @media(max-width:700px){#china-ai-language-switch{top:.6rem;right:.6rem}body{padding-top:4.25rem!important}}
        `;
        document.head.appendChild(style);

        const switcher = document.createElement('div');
        switcher.id = 'china-ai-language-switch';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Selector de idioma / Language selector');
        switcher.innerHTML = '<button type="button" data-language="es" aria-label="Español">ES</button><button type="button" data-language="en" aria-label="English">EN</button>';
        switcher.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-language]');
            if (button) setLanguage(button.dataset.language);
        });
        document.body.appendChild(switcher);
    }

    function installCanvasTranslator() {
        const prototype = window.CanvasRenderingContext2D?.prototype;
        if (!prototype || prototype.__chinaAiI18nInstalled) return;
        const originalFillText = prototype.fillText;
        const originalStrokeText = prototype.strokeText;
        prototype.fillText = function (text, ...args) {
            return originalFillText.call(this, currentLanguage === 'en' && typeof text === 'string' ? translateDynamic(text) : text, ...args);
        };
        prototype.strokeText = function (text, ...args) {
            return originalStrokeText.call(this, currentLanguage === 'en' && typeof text === 'string' ? translateDynamic(text) : text, ...args);
        };
        prototype.__chinaAiI18nInstalled = true;
    }

    function initialise() {
        installCanvasTranslator();
        createLanguageSwitch();
        const observer = new MutationObserver((mutations) => {
            if (translating) return;
            translating = true;
            mutations.forEach((mutation) => {
                if (mutation.type === 'characterData') translateTextNode(mutation.target);
                mutation.addedNodes.forEach(translateTree);
            });
            translating = false;
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        setLanguage(localStorage.getItem(STORAGE_KEY) || 'es', false);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
    else initialise();
})();

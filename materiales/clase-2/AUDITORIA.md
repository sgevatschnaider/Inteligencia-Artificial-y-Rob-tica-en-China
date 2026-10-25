# Revisión de la clase 2 y del repositorio

Revisión: 25 de octubre de 2026. Autor del curso: Sergio Gevatschnaider.

Se estudió la estructura pública del repositorio `sgevatschnaider/Inteligencia-Artificial-y-Rob-tica-en-China`, árbol `c456ae77bd56ff3955d987f9bec502f581f4fd39`, su página principal, README, documentación de empresas y robótica, catálogo de VideoLab, ecuaciones de RobotLab y los índices completos de las presentaciones El androide y Transformación industrial. También se extrajeron textos y notas y se renderizaron las cuatro presentaciones adjuntas (106 diapositivas originales).

## Lo que ya funciona bien

La web combina una portada bilingüe, módulos con visores, documentos temáticos, fuentes, datos, simuladores y una videoteca. Su identidad usa azul profundo, papel claro, jade, coral y dorado. Transformación industrial tiene 47 diapositivas por idioma y funciona como base de la primera clase. El androide tiene 24 diapositivas en español con interfaz bilingüe; una interfaz inglesa no convierte su contenido en inglés. La nueva clase incorpora contenido íntegramente traducido en ambos idiomas.

El androide ya trata cinco capas de la empresa tecnológica, DeepSeek/Qwen, categorías robóticas, Unitree, UBTECH, AgiBot, arquitectura humanoide, VLA, datos y niveles de evidencia. Volver a explicar todo ese recorrido sin una selección produciría redundancia. El nuevo módulo profundiza los mecanismos, añade fundamentos generales de agentes y ofrece una selección docente para una hora, conservando el módulo existente como referencia.

RobotLab separa correctamente el modelo matemático del comportamiento de interfaz. Sus fórmulas originales son q=30sw y W=(150+100s²+80w)/e. Su paso de tiempo corta exactamente al agotarse la batería. VideoLab ya separa catálogo, interfaz, estilos e idioma y carga los reproductores a pedido. Se mantienen esas decisiones: las nuevas funciones son un módulo complementario, no un reemplazo indiscriminado.

## Problemas identificados en los adjuntos

Los diagramas de agentes mezclaban recorridos lineales con ciclos y relaciones de coordinación. Algunas flechas eran demasiado pequeñas, se superponían a elementos o no dejaban claro el sentido. Se reconstruyeron el lazo agente–entorno, el ciclo del agente LLM, el circuito de datos y la coordinación multiagente. Se verificó por render que las puntas terminan en el destino correcto.

La portada del PPT chino tenía textos duplicados debajo de una imagen superpuesta. Se reconstruyó la portada con una única jerarquía de título, subtítulo y autor, y un encuadre que conserva el robot. Las ilustraciones originales se reutilizan y se identifican como conceptuales.

La tipografía disponible no mostraba todos los sinogramas. Se incorporó una fuente con cobertura china en el proceso de render y un subconjunto local para la web. En los PPT el texto sigue editable y usa Noto Sans SC para los caracteres chinos. Se incluye la licencia de la fuente. Los PDF y los lectores conservan el aspecto renderizado sin depender de fuentes instaladas.

El contenido ya advertía contra inferencias exageradas, pero algunas cifras y metas carecían de fecha clara en la diapositiva. Se precisó el caso V3: US$5,576 millones es el costo comunicado de cómputo del entrenamiento oficial bajo una tarifa supuesta. Se evitaron estadísticas demográficas y metas industriales sin fecha claramente verificable. Las afirmaciones sobre G1, Walker S2 e IRON se atribuyen a sus fuentes empresariales, sin tratarlas como auditorías independientes.

## Ampliación conceptual

Fundamentos pasa de 14 a 22 diapositivas por idioma. Agrega PEAS, observabilidad parcial, diferencia entre aprendizaje y feedback, workflow frente a agente, validación de herramientas, contexto/memoria/recuperación, RAG, criterio de parada, permisos, instrucciones hostiles en fuentes, coordinación multiagente y confiabilidad de tareas con varios pasos. Los errores digitales también pueden causar daños graves: se corrigió la simplificación de equipararlos siempre a un archivo equivocado.

China pasa de 39 a 46 diapositivas por idioma. Desarrolla MoE, R1/R1-Zero, perímetros de costo, selección de modelos, posición de Qwen-Agent, arquitectura robótica, VLA, aprendizaje por demostración y simulación, brecha entre simulación y realidad, evaluación de fabricantes, calidad de datos, disponibilidad, tasa de éxito, tareas válidas, costo total y volumen de equilibrio. Incorpora una discusión aplicada sobre servicios basados en conocimiento desde Argentina, identificada como propuesta analítica, no como una previsión comercial.

La profundidad está en los mecanismos y las notas. Las diapositivas conservan mensajes legibles para exposición; las notas explican supuestos, ejemplos, preguntas y límites de evidencia. No se pretende recorrer las 68 diapositivas en una hora.

## La nueva simulación

El laboratorio tiene tres experimentos. Energía conserva las ecuaciones de RobotLab y añade curva con ejes, mínimo analítico, estado de batería, avance temporal, pausa y corte exacto al agotarse la energía. Se aclara que w es intensidad de lote/tarea dentro del modelo y no una ley física sobre kilogramos.

Operación agrega disponibilidad A, éxito r, horas H, inversión, residual, vida económica, costo fijo, tarifa eléctrica y costo por intento. Las tareas válidas son H×A×q×r. El capital se anualiza linealmente. Se muestran composición del costo, sensibilidad a velocidad, dos escenarios guardados en sesión y exportación CSV. Se explicitan las exclusiones: descuento, impuestos, financiación, energía de espera y costos de recarga.

El experimento agente tiene tres casos ficticios: libras frente a kilogramos, un dato ausente y una instrucción hostil en una ficha. El registro distingue objetivo, lectura simulada, comprobación, corrección y entrega. No ejecuta búsquedas ni usa un LLM real. El resultado no se presenta como una recomendación de compra.

## Decisión sobre videos

Conviene mantenerlos aparte. Se creó `videos.html`, con enlaces originales, reproductores a pedido, preguntas de observación y límites de evidencia. Se conecta además con el VideoLab existente para no crear una segunda videoteca general. G1 e IRON conservan los videos del catálogo; Walker S2 remite a su ficha oficial con material empresarial. Qwen-Agent aparece como documentación y no como un video específico comprobado.

Los enlaces de YouTube fueron recuperados y sus títulos concordaban con el catálogo. No se validó reproducción audiovisual dentro de este entorno. La disponibilidad puede variar por región o por decisión del propietario. No se descargan ni redistribuyen videos.

## Integración realizada en el repositorio completo

La clase 2 ya está incorporada después de El androide en la colección de portada. Tiene acceso en la navegación y en el encabezado principal. Los materiales originales conservan sus archivos y secuencia. La portada adapta la imagen y los enlaces al idioma elegido.

El módulo tiene navegación local hacia la biblioteca, El androide, RobotLab y VideoLab. VideoLab incorpora un enlace hacia la ruta docente de clase 2 y conserva sus once recursos. RobotLab enlaza al experimento ampliado de costos y agentes. Se unificó la preferencia de idioma y se corrigió su actualización en enlaces al alternar varias veces entre castellano e inglés.

Se agregaron entradas de clase 2 y de La infraestructura a los tres README. Las lecturas sobre empresas y robótica enlazan al módulo. El lector de investigación conserva correctamente consultas con más de un parámetro.

La revisión detectó y regeneró tres vistas previas vacías del paquete anterior. Las 136 imágenes de la clase fueron decodificadas y recorridas en el navegador. Se incorporaron verificaciones del módulo y de la navegación entre secciones a los controles de GitHub Actions.

Esta versión ya contiene todos los archivos integrados; no requiere un instalador ni copiar fragmentos. La publicación remota es un paso posterior: el repositorio completo se entrega como archivo ZIP.

# English editorial overview

The repository already provides a strong bilingual knowledge base, slide readers, RobotLab and VideoLab. The Android module overlaps with class 2 and should remain a reference rather than being overwritten. The new standalone module connects those resources through a clear teaching route.

The supplied decks were expanded from 14 to 22 agent-foundation slides and from 39 to 46 China slides in each language. Layouts were rebuilt with editable objects, corrected arrow directions, clearer spacing, Chinese glyph support and full presenter notes. The original conceptual covers were retained with improved framing.

Content additions cover PEAS, tool execution, memory and RAG, verification, autonomy, coordination, reliability, MoE, robotic learning, VLA, simulation transfer, operating availability, valid tasks and total cost. Company declarations, research findings and hypothetical examples remain distinguishable.

The lab retains the original RobotLab equations and adds battery-time behavior, operating economics, A/B comparisons, CSV exports and a branching fictional agent exercise. Videos have a dedicated page that complements the existing VideoLab. Playback was not verified in this environment. The complete repository package includes the integrated module, local cross-links, shared language preference, documentation and automated checks. The published GitHub site has not been changed.

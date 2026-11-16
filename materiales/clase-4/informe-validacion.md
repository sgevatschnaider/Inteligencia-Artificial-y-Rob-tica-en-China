# Clase 4: revisión y registro de validación

Revisión: 15/11/2026. Rama de destino: main. Este documento separa pruebas ejecutadas de pendientes.

## Entregables

Cuatro PPTX editables y cuatro PDF (8, 7, 10 y 12 diapositivas), cuatro visores con texto accesible, cinco laboratorios, doce videos seleccionados, guía audiovisual PDF, cuatro guías de estudio y guía docente.

## Cambios en presentaciones

- PPT 1: reconstrucción editable de ocho diapositivas que eran imágenes. Arquitectura SDV, responsabilidades L0-L5 y ejemplo OEE con gráfico nativo y datos Excel integrados.
- PPT 2: reconstrucción editable de siete diapositivas que eran imágenes. Objetivos IMT-2030 distinguidos de prestaciones comerciales, latencia radio frente a extremo a extremo, fase, medición y límites de la ventaja cuántica.
- PPT 3: diez diapositivas rediseñadas con mayor legibilidad. NEO vinculado con información institucional Fudan, AiCE y Void-X con fuentes de sus grupos, límites clínicos y validación explícitos.
- PPT 4: doce diapositivas rediseñadas. Diferenciación de certificados, objetivos de Tianwen-2, unidades de hidrógeno, alcance de EAST y magnitudes de electrólisis AIE.
- Los 37 finales se renderizaron y revisaron individualmente. PPTX y PDF exportados desde los mismos archivos definitivos. No se abrieron en Microsoft PowerPoint.

## Correcciones de simulaciones

- Fábrica: semilla reproducible y exposición a falla durante procesamiento. Conservación de unidades en seis escenarios.
- Cuántica: columnas de circuito alineadas, estado inicial correcto y mediciones invalidadas tras una nueva puerta. Explicación del tiempo M/M/1 y del régimen de sobrecarga heurístico.
- BCI: ROC-AUC con tratamiento correcto de empates.
- Ciencia: corrección de identidad de candidatos que permitía repetir ensayos. Varianza de ruido almacenada por ensayo e incorporada en el proceso gaussiano.
- Aeronaves: eliminación del recorte artificial de demanda, reserva de batería sobre capacidad nominal, fin de turno estable y línea temporal monotónica. Cambiar parámetros reinicia el turno para mantener coherencia de unidades.
- Energía: corrección de llamadas a funciones inexistentes al cambiar pestaña o tema. Escalas de gráficos ajustadas al rango completo permitido.
- Nuevo laboratorio SDV: distancia de respuesta y frenado ideal, controles, gráfico, reinicio y CSV.

## Audiovisuales

La selección final contiene doce videos: 1 en automóvil, 3 en redes/cuántica, 3 en biología/IA y 5 en drones/espacio/energía. Se revisaron títulos, origen y correspondencia temática. Dos enlaces NEO vencidos fueron reemplazados a partir del estudio original v7. Cuatro páginas Huawei devolvieron Service Unavailable/DNS failure en la comprobación en navegador y la página USTC no mostró los videos en vivo: se excluyeron de la selección de reproducción. La nueva charla ITU tiene a Chih-Lin I, de China Mobile Research Institute. Se corrigió el idioma del registro ScienceOne: audio chino, sonido ambiente y segmentos sin audio; ficha en inglés.

## Pruebas ejecutadas antes de publicar

- 31 comprobaciones de modelos en Node VM, con DOM/canvas simulados: conservación de flujo, reproducción por semilla, extremos de controles, H², Bell, estado reducido, reinicio de mediciones, empates AUC, ensayos sin repetición, igual presupuesto, ruido del GP, demanda completa, límites SOC, PNT sin solución y balance de H₂. Este entorno no acredita renderizado ni interacción real.
- Validadores de estructura, geometría y tipografías de los cuatro PPTX, reimportación y gráfico con libro integrado.
- Render de 37 diapositivas finales y revisión visual individual.
- Inicio de reproducción de los recursos audiovisuales en sus sitios de origen.

## Verificación de publicación

Pendiente en esta revisión previa: push, confirmación de commit remoto, deployment y recorrido por la URL pública. El informe será actualizado con la evidencia obtenida.

## Límites de alcance

Los modelos usan datos sintéticos y no son pronósticos ni herramientas de operación real. La disponibilidad futura de plataformas externas no está bajo control del repositorio. La revisión pedagógica fue editorial, no una evaluación con una cohorte real de alumnos.

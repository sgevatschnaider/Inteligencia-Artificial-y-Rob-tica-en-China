# VideoLab — criterios editoriales / Editorial guide

La videoteca es una selección didáctica, **no un repositorio de copias de videos**. Los derechos de los videos y las miniaturas pertenecen a sus creadores y plataformas. Enlaces comprobados durante la curaduría del 19 de octubre de 2026.

## Uso docente (ES)

- Clase 1: mostrar Unitree, contrastar con fábricas pequeñas y comentar la disponibilidad del Walker S2. Pregunta central: ¿cómo se traduce la robótica en productividad real?
- Clase 2: comparar XPENG IRON y Unitree G1. Separar equilibrio, locomoción, manipulación y autonomía; las demostraciones no prueban generalización.
- Clase 3: estudiar la litografía EUV con Branch Education e IBM Research. Distinguir principios físicos, capacidad industrial y restricciones de suministro. El material de IBM ofrece un video enlazado.
- Clase 4: visualizar un robotaxi, introducir drones agrícolas y discutir la falla de Wuhan de marzo de 2026. Equilibrar beneficios y riesgos.

Sugerencia: reproducir un fragmento breve, detener para una pregunta e invitar a distinguir evidencia de publicidad. Verificar disponibilidad y autorizaciones del proveedor antes de proyectar en clase.

## Maintenance (EN)

Update `catalog.js` using objects with `lesson` (1–4), `source`, `year`, `kind` (company, report, explainer), `format` (youtube or external), bilingual `title`, `summary`, `question`, `caveat` and a YouTube `videoId` or an external `url`. YouTube embeds are loaded only on direct user request using youtube-nocookie.com; cards otherwise use standard external links. Keep source attributions, years and evidence limitations accurate. Embedding can be disabled by a video owner: the original YouTube link remains available. External provider pages open in a separate tab.

Files:
- `index.html`: semantic, bilingual landing/gallery markup
- `styles.css`: responsive appearance
- `app.js`: accessible filtering, searching, language handling and on-demand modal
- `catalog.js`: source catalog, editable independently

The main index links to VideoLab; existing slides/PDF/PPTX/simulations are unchanged.

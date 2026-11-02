# Clase 3 / Class 3

[Español](index.html?lang=es) · [English](index.html?lang=en) · [Biblioteca / Library](../../index.html)

Colección incremental. Cada paquete conserva su presentación, notas, fuentes, simulación y videos asociados. El registro de módulos está en `modules.json`.

Incremental collection. Each package includes its presentation, notes, sources, simulation and associated videos. The module registry is `modules.json`.

## PPT 1: China tecnológica / Technological China

[Acceder / Open](ppt-1/index.html) · [Visor / Slides](ppt-1/reader.html) · [Simulador / Simulator](ppt-1/lab.html) · [Videos](ppt-1/videos.html) · [Guía / Guide](ppt-1/guide.html)

35 diapositivas por idioma. PowerPoint editable y PDF en `ppt-1/downloads/`. La interfaz, diapositivas, notas, simulación y fichas audiovisuales están en español e inglés. Los videos mantienen su audio original. La guía DOCX original se conserva en español como documento de origen.

35 slides per language. Editable PowerPoint and PDF are in `ppt-1/downloads/`. Interface, slides, notes, simulation and video descriptions are available in Spanish and English. Videos retain their original audio. The original Spanish DOCX guide is retained as a source document.

Los diagramas revisados distinguen secuencias, apoyos paralelos y retroalimentación. El cómputo es una base transversal de IA. La memoria tiene su propia rama de diseño y fabricación. El bucle operativo de robótica se diferencia del aprendizaje. Los datos de vehículos eléctricos precisan sus denominadores y la inclusión de híbridos enchufables.

Revised diagrams distinguish sequences, parallel inputs and feedback. Computing enables the AI architecture. Memory has its own design and fabrication branch. The robotics operational loop is distinct from learning. Electric car figures specify their denominators and include plug-in hybrids.

## Actualización / Maintenance

- `ppt-1/catalog.json` y `ppt-1/data.js`: texto, notas y vistas del lector. Mantener sincronizados con ambos PPTX/PDF. / Reader text, notes and slide images. Keep aligned with both PPTX/PDF versions.
- `ppt-1/videos.json` y `ppt-1/videos-data.js`: fichas audiovisuales y asociaciones por diapositiva. / Video metadata and slide associations.
- `ppt-1/src/generate_lab.py`: regenera ambas simulaciones autónomas desde `lab-source.html`, preservando las imágenes incrustadas. Ejecutar con Python desde cualquier carpeta. / Regenerates both self-contained laboratories from the source HTML while preserving embedded images. Run with Python from any directory.
- `ppt-1/model.cjs`: ecuaciones para auditoría. Las pruebas de navegador comparan sus resultados con ambas interfaces. / Model equations for auditing. Browser tests compare results with both interfaces.

El modelo es determinista y no calibrado. Los parámetros se mantienen constantes en cada trayectoria 2025–2040. La sensibilidad aplica +10% del rango permitido de cada parámetro y muestra el incremento efectivo. Las capacidades parten de 100 y la exposición utiliza un puntaje separado. El CSV conserva parámetros y trayectorias.

The model is deterministic and uncalibrated. Parameters remain constant along each 2025–2040 trajectory. Sensitivity uses +10% of each parameter's allowed range and displays the effective increment. Capabilities begin at 100, while exposure uses a separate score. CSV retains parameters and trajectories.

## Fuentes verificadas / Checked sources

- [NBS: gasto en I+D de 2025 / 2025 R&D expenditure](https://www.stats.gov.cn/english/PressRelease/202610/t20261019_1965621.html)
- [OMPI / WIPO: ranking corregido de clústeres 2026 / corrected 2026 cluster ranking](https://www.wipo.int/pressroom/en/articles/2026/article_0013.html)
- [OMPI / WIPO: solicitudes PCT publicadas / published PCT applications](https://www.wipo.int/en/ipfactsandfigures/patents)
- [AIE / IEA: Global EV Outlook 2026](https://www.iea.org/reports/global-ev-outlook-2026/executive-summary)

Las fichas especifican límites de verificación de los videos. No se afirma haber comprobado reproducción ni subtítulos en YouTube. / Video entries state verification limits. YouTube playback and caption availability have not been verified.

## Comprobaciones / Checks

Desde la raíz / From the repository root:

```bash
python scripts/validate_repo.py
python scripts/verify_class3.py
node scripts/check_class3_model.cjs
node scripts/check_class3.cjs
```

Las pruebas de navegador necesitan Playwright y Chrome, como el flujo de validación existente. `BROWSER_EXECUTABLE` permite indicar otro Chromium compatible. / Browser checks require Playwright and Chrome, as in the existing validation workflow. `BROWSER_EXECUTABLE` selects another compatible Chromium executable.

## PPT 2: IA china / Chinese AI

[Acceder / Open](ppt-2/index.html) · 44 diapositivas por idioma, laboratorio MoE y agentes, ocho recursos audiovisuales. / 44 slides per language, MoE and agents lab, eight audiovisual resources.

Colección: 217 diapositivas por idioma, cinco laboratorios y treinta y siete referencias audiovisuales. / Collection: 217 slides per language, five laboratories and thirty-seven audiovisual references.

```bash
node scripts/check_ppt2_model.cjs
node scripts/check_class3_ppt2.cjs
```

## PPT 3: Semiconductores / Semiconductors

[Acceder / Open](ppt-3/index.html) · 45 diapositivas por idioma, ocho controles y ocho recursos audiovisuales. / 45 slides per language, eight controls and eight audiovisual references.

## PPT 4: Robótica e IA incorporada / Robotics and embodied AI

[Acceder / Open](ppt-4/index.html) · 45 diapositivas por idioma, ocho parámetros y ocho videos. / 45 slides per language, eight parameters and eight videos.

## PPT 5: Vehículos eléctricos, baterías y fábricas / Electric vehicles, batteries and factories

[Acceder / Open](ppt-5/index.html) · 48 diapositivas por idioma y ocho recursos audiovisuales. / 48 slides per language and eight audiovisual resources.

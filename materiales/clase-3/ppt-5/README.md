# PPT 5 · Vehículos eléctricos, baterías y fábricas inteligentes

Autor / Author: Sergio Gevatschnaider

[Español](index.html?lang=es) · [English](index.html?lang=en)

48 diapositivas por idioma con notas, PPTX editable, PDF, visor, guía web y ocho fichas audiovisuales. Cinco escenarios, ocho parámetros, veinte trimestres relativos y exportaciones CSV/SVG. / 48 slides per language with notes, editable PPTX, PDF, reader, web guide and eight audiovisual cards. Five scenarios, eight parameters, twenty relative quarters and CSV/SVG exports.

El modelo conserva packs: procesadas=conformes+rechazos=packs consumidos. La energía incluye rechazos. OEE es un supuesto A×P×Q. Capacidad, packs×Q y demanda limitan la salida conforme; todas las configuraciones comparten ecuaciones. No se modelan inventarios, recuperación, colas, costos ni emisiones de ciclo de vida. / The model conserves packs: processed=good+rejects=packs consumed. Energy includes rejects. OEE is an assumed A×P×Q. Capacity, packs×Q and demand limit good output; all settings share equations. Inventory, recovery, queues, costs and life-cycle emissions are excluded.

La guía web documenta ecuaciones, cambios y fuentes corregidas, incluido el enlace IFR. El DOCX español conserva el original y los ocho QR comprobados. Los videos conservan audio original; no se ha verificado su reproducción íntegra. / The web guide documents equations, changes and corrected sources including the IFR URL. The Spanish DOCX preserves the original and eight cross-checked QR codes. Videos retain original audio; full playback has not been verified.

## Reproducir / Rebuild

`python src/build_lab.py` reconstruye los HTML autónomos con la imagen original. / Rebuilds the standalone HTML files with the original illustration.

Pruebas / Tests: `node scripts/check_ppt5_model.cjs` y / and `node scripts/check_class3_ppt5.cjs`, desde la raíz del repositorio / from the repository root.

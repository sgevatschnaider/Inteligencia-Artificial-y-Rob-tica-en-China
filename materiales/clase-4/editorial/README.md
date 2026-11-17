# Clase 4 · Edición académica y visual

Referencia: las 47 diapositivas de `materiales/transformacion-industrial`, examinadas sin modificar sus archivos. Aperturas con imagen grande, azul marino y coral; interiores claros; tipografía DejaVu Sans; turquesa y dorado como acentos; gráficos y diagramas nativos editables.

## Fuentes y reproducción

`ppt-N/slides.json` y `slides.en.json` contienen texto proyectado, notas desarrolladas, referencias, datos numéricos y tipo de composición. `scripts/render_class4_editorial.mjs` genera los dos PPTX con Artifact Tool 2.8.158 en el entorno de autoría. `scripts/export_class4_editorial.py` abre esos archivos con LibreOffice y deriva sus PDF y visores. No se usa un renderer diferente para simular el aspecto del PowerPoint.

```bash
node scripts/render_class4_editorial.mjs 1
python scripts/export_class4_editorial.py 1
python scripts/build_class4_en.py
python scripts/verify_class4_editorial.py
```

El entorno de autoría proporciona `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, `CODEX_PRIMARY_RUNTIME_ROOT` y `CODEX_PRIMARY_RUNTIME_PYTHON`. Artifact Tool es una dependencia del entorno de autoría, no un paquete público instalado por GitHub Actions. CI valida los archivos versionados contra los hashes de fuentes, renderer y entregables; no reemplaza los PPTX nativos por la plantilla anterior.

## Hitos

| Módulo | Diapositivas por idioma | Estado |
|---|---:|---|
| 1 · Vehículo y fábrica | 10 | Generado y validado |
| 2 · 6G y cuántica | 10 | Generado y validado |
| 3 · Neurotecnología y biotecnología | 10 (edición previa) | Pendiente de rediseño |
| 4 · Drones, espacio y energía | 12 (edición previa) | Pendiente de rediseño |

Módulo 1: SDV por capas, mapa de proveedores, clasificación SAE, OEE con hipótesis explícitas, cadena de valor, comparación de ventas eléctricas 2025 y cálculo de detención. La ilustración de apertura procede de Clase 1 y se identifica como conceptual. Las notas de ambas versiones desarrollan mecanismos, ejemplos, unidades y limitaciones. Los laboratorios existentes se conservan.

Módulo 2: arquitectura integrada, condiciones de despliegue, amplitud y fase, circuito editable H/CNOT, algoritmos y requisitos, contraste de plataformas chinas y cálculo M/M/1. Fotografía documental de Jiuzhang 4.0 con atribución Xinhua/CAS.

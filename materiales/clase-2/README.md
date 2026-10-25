# Clase 2: modelos, agentes y robótica / Class 2: models, agents and robotics

[Castellano](index.html?lang=es) · [English](index.html?lang=en) · [Biblioteca / Library](../../index.html)

Módulo integrado con dos presentaciones por idioma: agentes (22 diapositivas) y China (46). Incluye notas, lector con búsqueda, cuatro PPTX y cuatro PDF en `downloads/`, laboratorio, selección de videos y guía de 60 minutos.

El laboratorio es un modelo docente hipotético y funciona localmente. Los videos externos requieren conexión y se cargan solo por solicitud del usuario. Las fuentes se identifican por diapositiva. Los PPTX son editables; los PDF conservan la apariencia renderizada. `fonts/` contiene fuentes opcionales y sus licencias.

Para uso local del sitio completo: ejecutar `python -m http.server 8000` desde la raíz y abrir http://localhost:8000/. La clase también puede abrirse directamente desde `index.html`, sin instalar dependencias.

El texto y las notas se mantienen en `src/catalog.json`. `data.js` es la copia usada por el lector sin solicitudes de red. Al editar el contenido, mantener ambos sincronizados y actualizar las vistas de diapositivas y los PPTX/PDF. El modelo matemático está en `model.js` y sus controles en `lab.js`. El HTML de `downloads/Simulador_Clase_2_Superior.html` es una copia autónoma que debe regenerarse si cambia el laboratorio.

Prueba del modelo: `node materiales/clase-2/tests/model.test.cjs` desde la raíz. Revisión editorial: [auditoría](AUDITORIA.md). Verificación del módulo: [resultados](VERIFICACION.md).

## English

Integrated module with two fully translated decks per language: agents (22 slides) and China (46). It includes presenter notes, a searchable reader, four PPTX and PDF files, a hypothetical lab, a separate video guide and a 60-minute teaching route. Shared navigation retains the chosen language across the library, VideoLab and this module. Original materials remain available.

Serve the repository root with Python or open the module directly. Linked third-party videos need Internet. Optional fonts and licenses are included. The published site changes only after these repository files are committed and deployed through the existing workflow.

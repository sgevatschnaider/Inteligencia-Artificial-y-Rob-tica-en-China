# Repositorio completo con clase 2 integrada

Esta carpeta contiene todo el sitio anterior y la clase 2 ya incorporada. No es un parche ni requiere ejecutar un instalador.

Para empezar, abrir `ABRIR_SITIO.html` o `index.html`. La portada incluye el nuevo acceso a clase 2 junto a la colección existente. También puede abrirse directamente `materiales/clase-2/index.html`.

Los cuatro PPTX y PDF nuevos están en `materiales/clase-2/downloads/`: fundamentos de agentes, 22 diapositivas por idioma, y modelos, agentes y robótica en China, 46 por idioma. El módulo incluye notas, lector, búsqueda, laboratorio, videos por separado y guía docente. Las fuentes opcionales están en `materiales/clase-2/fonts/`.

Para probar todas las funciones de los lectores originales y los artículos en una computadora, servir la carpeta con HTTP:

```bash
python -m http.server 8000
```

Luego abrir http://localhost:8000/. La clase 2 y el simulador autónomo pueden funcionar localmente sin este paso. Videos y fuentes externas requieren conexión.

Para actualizar GitHub, copiar los archivos de esta carpeta al repositorio conservando sus rutas, revisar los cambios y confirmar el commit por el procedimiento habitual. Los flujos de GitHub Pages y validación están incluidos y ahora también verifican la clase 2. Este archivo descargable no cambia por sí solo el sitio remoto.

Los materiales de El dragón, El androide, La infraestructura y Transformación industrial conservan todos sus PPTX, PDF, vistas y fuentes. RobotLab mantiene sus ecuaciones y controles; se añadió el enlace al laboratorio ampliado. VideoLab mantiene sus once recursos y suma el acceso a la ruta de clase 2. La preferencia de idioma se comparte entre las secciones.

## English

This is the complete repository with class 2 already integrated, not a patch. Open `ABRIR_SITIO.html` or `index.html`. For all original readers and research articles, serve the root with Python and open http://localhost:8000/.

The new module contains two decks per language, 22 and 46 slides, four PPTX and PDF files, presenter notes, a searchable reader, a hypothetical lab, separate video guidance and a 60-minute teaching route. The original modules remain available. Copy this complete tree into your normal repository workflow to publish it; downloading the archive does not modify the remote site.

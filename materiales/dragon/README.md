# El dragón — 龙

El Estado estratégico y la transformación tecnológica de China.

**Material elaborado por el profesor Sergio Gevatschnaider**

Módulo de diez diapositivas. Corte documental: 20 de octubre de 2026.

## Lectura y descargas

- [Visor en español](index.html)
- [Interfaz del visor en inglés, contenido en español](index.html?lang=en)
- [PDF con texto seleccionable y enlaces a fuentes y notas](presentacion.pdf)
- [PowerPoint editable con notas docentes](presentacion.pptx)
- [Registro completo de fuentes](fuentes.html)

## Contenido y edición

`slides.json` contiene el orden, la transcripción del texto visible, el esquema conceptual, las notas docentes, las fuentes por diapositiva y el registro de referencias. El PowerPoint conserva textos, fechas y comparaciones como objetos editables. Los fondos cinematográficos son ilustraciones conceptuales generadas y recompuestas con IA y no constituyen fotografías documentales, mapas ni evidencia de resultados económicos.

El carácter de portada es **龙**, Unicode **U+9F99**, chino simplificado, pronunciado *lóng*. La forma tradicional es **龍**, U+9F8D. La portada usa texto tipográfico editable en lugar de un carácter dibujado por IA.

La selección regulatoria distingue las fechas de aprobación, publicación y vigencia. Las notas delimitan los ámbitos de aplicación y separan prioridades políticas, compromisos contractuales, resultados e interpretación docente. El XV Plan se contrastó con el documento oficial de la NDRC de marzo de 2026, capítulos 12–14. No se presentan los objetivos del plan como resultados alcanzados.

## Visor

El índice admite búsqueda en transcripciones y notas. Se puede navegar con flechas, Re Pág / Av Pág, Inicio / Fin y F para pantalla completa. Los formatos se seleccionan con pestañas accesibles por teclado. El parámetro `lang=en` cambia la interfaz, sin simular una traducción inglesa del material. `?view=sources#8`, por ejemplo, abre las notas y fuentes de la diapositiva 8.

El estilo base reutiliza `../transformacion-industrial/viewer.css`, sin modificarlo. `viewer.css` agrega la identidad del módulo y ajustes de accesibilidad. El módulo funciona como un sitio estático, sin proceso de compilación ni servicios externos para cargar sus diapositivas. Para usarlo fuera del repositorio se debe conservar esa dependencia y servir los archivos por HTTP, ya que el visor carga JSON con `fetch`.

## Controles del repositorio

Desde la raíz, se ejecutan:

```bash
python scripts/validate_repo.py
node scripts/check_site.cjs
node --check materiales/dragon/viewer.js
python scripts/verify_dragon.py
node scripts/check_dragon.cjs
```

La verificación de PDF requiere `pypdf`. La prueba de navegador requiere Playwright y Chrome. GitHub Actions conserva las verificaciones existentes y añade las del nuevo módulo.

La presentación de Transformación Industrial permanece en su carpeta original, con 47 diapositivas por idioma. Esta entrega no crea enlaces a los módulos futuros del androide o la infraestructura.

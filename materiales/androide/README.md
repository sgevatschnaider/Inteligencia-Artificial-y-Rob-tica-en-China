# El androide — 人形机器人

Módulo 02 de la colección académica: las empresas tecnológicas y la transformación de la inteligencia artificial en China.

**Material elaborado por el profesor Sergio Gevatschnaider**

- [Abrir el visor en castellano](index.html?lang=es)
- [Open the English interface](index.html?lang=en) · Spanish slides and teaching notes
- [PDF](presentacion.pdf)
- [PowerPoint editable](presentacion.pptx)
- [Registro de fuentes](fuentes.html)

## Contenido e idiomas

Las 24 diapositivas, las transcripciones y las notas docentes están en español. La interfaz de navegación está disponible en español e inglés. La portada identifica el humanoide con los sinogramas 人形机器人. El androide funciona como metáfora de un ecosistema empresarial más amplio.

Las imágenes del visor se exportan de la versión final del PowerPoint a través de su PDF correspondiente. Las ilustraciones conceptuales no son fotografías documentales ni evidencia de productos o despliegues reales. Las notas distinguen resultados científicos, especificaciones anunciadas, pruebas, producción y resultados operativos.

## Implementación

`slides.json` vincula cada diapositiva con su imagen WebP, transcripción completa, notas y referencias pertinentes. Se conserva la numeración original de 1 a 24. El visor reutiliza `../dragon/viewer.js` y los estilos de la colección sin modificar el módulo del dragón; `viewer.js` adapta las etiquetas de búsqueda y la navegación de regreso. No requiere compilación ni servicios externos para leer el contenido.

La fuente china local se distribuye con su licencia SIL Open Font License en `fonts/`.

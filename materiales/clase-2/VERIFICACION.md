# Verificación del paquete

Se comprobaron cuatro PPTX: 22, 22, 46 y 46 diapositivas, con notas docentes en todas ellas. Los cuatro archivos pasaron validación de estructura y geometría sin hallazgos. Las tablas y el gráfico de energía son editables. Se exportaron 136 vistas de diapositivas para los lectores y cuatro PDF con igual número de páginas y proporción 16:9.

El modelo se probó con el escenario base, cambios de éxito y eficiencia, mínimo energético, batería agotada y entradas inválidas. El escenario base produce 30 intentos/h, 330 W y 11 Wh/intento. Con los valores económicos iniciales produce 96.900 tareas válidas/año y US$33.268,30 de costo anual. Se confirmó que bajar éxito aumenta costo unitario sin alterar el costo anual cuando el número de intentos queda fijo.

En navegador se probaron el cambio de idioma, los límites del lector, la búsqueda, las tres ramas del ejercicio de agentes, la validación de costos, las comparaciones A/B, la descarga CSV, el HTML autónomo y la apertura local con `file://`. No se registraron errores de JavaScript. Portada, guía, fuentes, videos y laboratorio no presentaron desbordamiento horizontal en una pantalla de 390 px.

El instalador se ensayó sobre una copia del índice recuperado del repositorio. Se verificaron el respaldo, una única sección nueva y la conservación exacta del resto del documento. Las referencias locales del módulo resuelven a archivos presentes.

Los videos externos requieren conexión. No se verificó su reproducción audiovisual ni se ejecutaron las presentaciones en Microsoft PowerPoint. Las fuentes opcionales y los PDF permiten conservar el aspecto si la aplicación local sustituye tipografías.

La prueba matemática se puede repetir con Node.js, sin paquetes adicionales:

```bash
node materiales/clase-2/tests/model.test.cjs
```

## English

All four PPTX files passed package and geometry checks. Every slide has presenter notes. The lab passed numerical and browser tests, including language changes, scenario comparisons, invalid inputs, CSV export, all fictional agent branches and standalone offline use. No JavaScript errors or mobile horizontal overflow were observed in the tested pages. The installer was checked against a local copy of the original index. External video playback and execution in Microsoft PowerPoint were not verified.

## Verificación de la integración completa

La portada se comprobó a 1440, 1024, 768 y 390 píxeles. Se recorrieron las 136 imágenes de clase 2 y sus notas, la navegación entre portada, clase, laboratorio, VideoLab y RobotLab, y la conservación del idioma al alternarlo varias veces. Las tres vistas vacías detectadas se regeneraron antes del empaquetado.

También pasaron las pruebas anteriores de los seis simuladores, los once recursos de VideoLab, RobotLab y el lector de investigación. Los archivos originales de las presentaciones de Transformación industrial (47 por idioma), El dragón (10), El androide (24) y La infraestructura (32) conservaron su integridad. La comprobación del módulo nuevo quedó incluida en GitHub Actions.

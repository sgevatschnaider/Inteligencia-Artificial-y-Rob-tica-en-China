# 📁 Carpeta `recursos/`

### Documentación técnica de archivos auxiliares (HTML, PDF, datasets y assets)

La carpeta **`recursos/`** contiene todos los **archivos complementarios** necesarios para la visualización, demostración, análisis y documentación técnica del proyecto. Su objetivo es centralizar los materiales estáticos y dinámicos que acompañan los módulos principales del repositorio.

---

## 🧱 **Estructura del directorio**

```
recursos/
│
├── html/               # Visualizaciones interactivas, dashboards y demos
├── pdf/                # Informes, documentos oficiales, papers y reportes técnicos
├── data/               # Conjuntos de datos estructurados (CSV, JSON, XLSX)
├── img/                # Imágenes, esquemas, diagramas y gráficos
└── misc/               # Otros archivos auxiliares (scripts, plantillas, exportaciones)
```

---

## 🧩 **Descripción técnica de cada subcarpeta**

### 🔹 **`html/` – Visualizaciones y demos**

Contiene:

* Archivos **HTML estáticos o interactivos**
* Dashboards generados con **Plotly, D3.js o Three.js**
* Visualizaciones embebibles para GitHub Pages

Uso recomendado:

* Publicar estos HTML directamente en **GitHub Pages**
  (ideal para visualizaciones de IA, mapas, timelines dinámicos o simuladores).

---

### 🔹 **`pdf/` – Documentación técnica**

Incluye:

* Papers académicos
* Informes regulatorios (PIPL, AI Plan, Made in China 2025)
* Reportes de industria
* Documentos citados en el repositorio

---

### 🔹 **`data/` – Datasets**

Formato sugerido:

* `.csv` para datasets tabulares
* `.json` para datos jerárquicos
* `.xlsx` para hojas técnicas
* `.parquet` para datos optimizados

Cada dataset debería incluir su **diccionario de variables** en un archivo `.md`.

---

### 🔹 **`img/` – Material gráfico**

Para:

* Infografías
* Diagramas UML
* Esquemas de arquitectura
* Capturas de robots, LLMs, chipsets, sensores, etc.

Buenas prácticas:

* Preferir `.png` o `.svg`
* Mantener nombres descriptivos:
  `ascend_architecture_diagram.svg`, `unitree_b2_photo.png`

---

### 🔹 **`misc/` – Archivos auxiliares**

Puede contener:

* Scripts de conversión
* Plantillas de análisis
* Documentos temporales o exportaciones

---

## ⚙️ **Buenas prácticas para organizar `recursos/`**

* Estructurar los nombres de archivo siguiendo el estándar:
  `tema_subtema_año.ext`
  Ejemplo:
  `politicas_ai_plan_2017.pdf`

* Mantener una jerarquía clara para facilitar la reutilización.

* Evitar archivos sin descripción: cada recurso debe estar **documentado** aquí o dentro de su subcarpeta.

---

## 🌐 **Uso con GitHub Pages (para archivos HTML)**

Si querés visualizar los HTML online:

1. Activá GitHub Pages en
   **Settings → Pages → Deploy from branch**
2. Seleccioná la rama: `main`
3. Carpeta: `/root` o `/docs`
4. Luego accesos así:
   `https://tu-usuario.github.io/tu-repo/recursos/html/archivo.html`

---

## 📌 **Propósito técnico de la carpeta**

La carpeta **`recursos/`** centraliza todo el contenido que **no es código directamente ejecutable**, pero que:

* aporta evidencia,
* enriquece el análisis técnico,
* soporta visualizaciones,
* documenta políticas o datasets,
* o permite reproducibilidad de resultados.

---

## 🛠️ **Contribución**

Si agregás archivos en `recursos/`:

1. Usá nombres descriptivos.
2. Actualizá este README si creás nuevas subcarpetas.
3. Citá las fuentes en el archivo `resources.md` del root.

---

## 📝 **Versión**

Última actualización: **2025**






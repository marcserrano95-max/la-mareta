# La Mareta — web

Web de **La Mareta**, cafetería de especialidad y brunch en C/ Albal, 1 · Paiporta (Valencia).

- `index.html`: la web completa (HTML + CSS + JS en un solo archivo, sin dependencias de compilación).
- `assets/img/`: fotos de los platos, del local y del obrador.
- `referencias/`: vídeo real de la fachada y un fotograma, como referencia para la entrada en 3D o con vídeo.

## Ver en local
Abre `index.html` en el navegador o sirve la carpeta:

    npx serve .

## Secciones
Entrada cinematográfica (la cámara cruza la puerta al hacer scroll) · Los favoritos de la casa · Bebida · Espacio · Historia · Taza roja en 3D · Un día en La Mareta (recorrido horizontal con el scroll) · Opiniones (baraja animada de reseñas reales) · Cómo llegar · Footer.

Colores: crema `#fbf4e8`, espresso `#3a1d12`, rosado `#efc6b4`, rojo taza `#d33a2c`. Tipografías: Inter e Instrument Serif (cursiva).

## Entrada y taza 3D
- `assets/hero/desktop/` y `assets/hero/mobile/`: 120 fotogramas WebP cada una (1600 px y 900 px). El scroll pinta el fotograma en un `<canvas>`; se elige la secuencia por orientación de pantalla.
- `assets/hero/entrada-16x9.mp4` y `entrada-9x16.mp4`: los vídeos de la transición (1080p), generados con Higgsfield (FLUX 3 Video, fotograma inicial + final).
- `assets/3d/taza-roja.glb`: la taza roja en 3D (Higgsfield, Hunyuan3D v3, imagen → 3D), mostrada con model-viewer y girando con el scroll.

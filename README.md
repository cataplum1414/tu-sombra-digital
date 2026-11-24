# Tu sombra digital

**Un trabajo académico independiente para el Máster Universitario en Protección Internacional de los Derechos Humanos de la Universidad de Alcalá.** La experiencia es una historia interactiva de suspense sobre el artículo 12 y el derecho a la intimidad. Transcurre de noche en Alcalá de Henares y muestra cómo una foto, la hora y algunos detalles del entorno pueden revelar información personal.

## Abre la experiencia

**[Visitar Tu sombra digital](https://cataplum1414.github.io/tu-sombra-digital/)**

El enlace también puede utilizarse en el código QR del cartel. La página está pensada para abrirse directamente en el navegador de un móvil; no hace falta instalar una aplicación.

## Qué encontrarás

- **Una historia ramificada:** cuatro escenas y decisiones que cambian el recorrido y el desenlace. La ruta pasa por la Casa Natal de Cervantes, la Plaza de Cervantes y, según lo que elijas, una cafetería o un portal de la calle Cardenal Sandoval y Rojas.
- **Escenas que puedes explorar:** toca personajes y objetos de las imágenes para descubrir pistas, activar efectos de sonido y, si el dispositivo lo permite, una vibración breve. Desliza lateralmente sobre la imagen para inclinar la perspectiva 3D y desplazar sus planos. Las zonas interactivas no añaden iconos sobre la escena.
- **Lluvia sobre el cristal:** las escenas usan [raindrop-fx](https://github.com/SardineFish/raindrop-fx), una biblioteca WebGL2 con licencia MIT, para simular gotas que se deslizan y refractan la fotografía. La lluvia cambia con los riesgos y con los objetos que tocas. En navegadores sin WebGL2 se conserva la imagen y funciona una capa Canvas más ligera.
- **Ambiente que responde a tus decisiones:** la música y la tensión sonora cambian según el rumbo de la historia. El sonido es opcional y se controla desde la cabecera.
- **Una experiencia adaptable:** puedes recorrerla en vertical o girar el móvil para una vista horizontal. Las animaciones respetan la preferencia del dispositivo por reducir el movimiento.
- **Español e inglés:** cambia el idioma desde el control ES/EN.
- **Una reflexión final:** al terminar, encontrarás una explicación breve del artículo 12 de la Declaración Universal de los Derechos Humanos, recomendaciones de privacidad y enlaces a Naciones Unidas, la AEPD y [ATLAS ONU](https://sukimalabs.com/atlasonu).

La historia y las imágenes son una recreación ficticia inspirada en lugares reales de Alcalá de Henares; no documentan hechos ni personas reales. La página no pide acceso a la cámara o a la ubicación y no guarda las decisiones del recorrido.

Este trabajo no está afiliado a la Universidad de Alcalá ni representa una iniciativa o posición oficial de la Universidad. [Conoce el Máster en la página oficial de la UAH](https://derecho.uah.es/es/estudios/estudio/Proteccion-Internacional-de-los-Derechos-Humanos/).

## Abrir el proyecto en tu ordenador

El sitio es estático y no necesita un proceso de compilación. Para probarlo, sirve la carpeta con un servidor local —necesario para que funcionen los módulos de JavaScript— y abre `http://localhost:8000`:

```bash
git clone https://github.com/cataplum1414/tu-sombra-digital.git
cd tu-sombra-digital
python -m http.server 8000
```

También puedes descargar el repositorio como ZIP y ejecutar el servidor desde su carpeta. Si no tienes Python instalado, utiliza cualquier servidor local para sitios estáticos.

## Estructura del repositorio

| Archivo o carpeta | Contenido |
| --- | --- |
| `index.html` | Portada, escenas, decisiones y reflexión sobre el artículo 12. |
| `styles.css` | Diseño adaptable, escenas y efectos visuales. |
| `script.js` | Recorrido, decisiones, interacciones y audio. |
| `language.js` | Textos en español e inglés. |
| `motion.js` | Transiciones de la experiencia. |
| `visit-counter.js` | Integración opcional del contador; permanece desactivada mientras no se configure su servicio. |
| `assets/story/` | Imágenes de las escenas. |
| `assets/audio/` | Música y efectos de sonido. |
| `assets/vendor/` | Biblioteca local de gotas WebGL2 y licencias MIT. |
| `CREDITOS.md` | Créditos, licencias y referencias de diseño. |

Para consultar las fuentes de audio, abre [`assets/audio/FUENTES.md`](assets/audio/FUENTES.md). La atribución y licencia del recurso de justificación de texto se encuentran en [`assets/justif/README.md`](assets/justif/README.md).

## Publicación

GitHub Pages publica el contenido de la rama `main` desde la raíz del repositorio. La dirección pública es [cataplum1414.github.io/tu-sombra-digital](https://cataplum1414.github.io/tu-sombra-digital/).

## Autoría

Proyecto realizado por **Jeisson Osorio Mesa**, quien actualmente cursa el Máster Universitario en Protección Internacional de los Derechos Humanos de la Universidad de Alcalá. Es un trabajo independiente, sin afiliación institucional.

# Tu sombra digital

Micrositio educativo sobre el derecho a la intimidad y la vida privada, reconocido en el artículo 12 de la Declaración Universal de Derechos Humanos.

## Idea

Una investigación breve para móvil que convierte una foto ficticia en un rastro. La persona inspecciona indicios, elige qué hacer y ve cambiar el mapa y el desenlace antes de conocer qué protege el artículo 12. No se solicitan permisos del dispositivo ni se guardan elecciones.

## Archivos

- `index.html`: estructura, texto y referencia al artículo 12.
- `styles.css`: identidad visual, escena ilustrada, animaciones y adaptación móvil.
- `script.js`: decisiones y progresión narrativa.
- `assets/audio/ambiente-cavernas.ogg`: banda sonora ambiental CC0, descargada solo después de tocar el control de audio.
- `signal-field.js`: campo de señal Canvas 2D; se pausa fuera de pantalla y limita resolución y partículas en móviles.
- `CREDITOS.md`: autoría, licencia y referencias de interacción revisadas en GitHub.

## Publicar

El sitio es estático y puede publicarse con GitHub Pages desde la rama `main` y la carpeta raíz. El QR impreso debe apuntar a la URL pública del sitio; no a una ruta local del ordenador.

## Estado

Experiencia interactiva publicada. El caso y las pistas son ficticios; el artículo 12 enlaza a la Declaración Universal en Naciones Unidas.

## Sonido

La banda sonora ambiental procede de un loop CC0. La reproducción se solicita directamente desde el toque en el control de sonido, como requieren los navegadores móviles. Si el navegador no puede descodificar el archivo, se usa una atmósfera sintetizada de respaldo. Los controles indican cuándo está activa.

## Movimiento y compatibilidad

- La secuencia utiliza Motion 14.14.0 desde jsDelivr para coordinar la entrada, el mapa y el cierre. Su biblioteca es MIT: https://github.com/motiondivision/motion
- Si Motion no carga, la historia y las decisiones siguen funcionando; los estilos conservan los barridos y las transiciones esenciales.
- La composición se adapta a móviles estrechos, usa áreas seguras de iOS y conserva una alternativa a `100svh` para navegadores antiguos.
- Respeta la preferencia del sistema por reducir el movimiento. El sonido solo se activa mediante un botón.
- Las pistas, coordenadas y el caso son ficticios; no se solicitan ni recopilan datos del visitante.
- Los tres indicios de la portada son controles táctiles accesibles; tocar uno revela qué información puede aportar. Cada paso de la historia actualiza el fragmento de URL para indicar el destino dentro del recorrido.
- Las ideas de los repositorios [Immersions](https://github.com/bruchansky/immersions), [Bao Scroll Story](https://github.com/architech97/bao-scroll-story), [Aether Worlds](https://github.com/TheNonFungibleHuman/Aether-worlds) y [Night Shift Protocol](https://github.com/char704/Night-Shift-Protocol) se usan como referencias de interacción. No se reutiliza su código ni sus medios.

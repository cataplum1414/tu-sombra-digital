# Tu sombra digital

Micrositio educativo sobre el derecho a la intimidad y la vida privada, reconocido en el artículo 12 de la Declaración Universal de Derechos Humanos.

## Idea

Una experiencia breve para móvil que convierte una foto ficticia en una historia de pistas. La persona toma una decisión, ve cómo cambia el recorrido y termina con una explicación clara del derecho. No se solicitan permisos del dispositivo ni se guardan elecciones.

## Archivos

- `index.html`: estructura, texto y referencia al artículo 12.
- `styles.css`: identidad visual, escena ilustrada, animaciones y adaptación móvil.
- `script.js`: decisiones y progresión narrativa.
- `assets/audio/ambiente-cavernas.ogg`: banda sonora ambiental CC0, descargada solo después de tocar el control de audio.
- `vendor/howler.min.js`: reproductor local Howler.js 2.2.4 con licencia MIT.
- `signal-field.js`: campo de señal Canvas 2D; se pausa fuera de pantalla y limita resolución y partículas en móviles.
- `CREDITOS.md`: autoría, licencia y fuentes de medios y recursos técnicos revisados en GitHub.

## Publicar

El sitio es estático y puede publicarse con GitHub Pages desde la rama `main` y la carpeta raíz. El QR impreso debe apuntar a la URL pública del sitio; no a una ruta local del ordenador.

## Estado

Prototipo inicial. La narrativa y el artículo 12 están preparados para revisión; la identidad institucional, los créditos y el cartel impreso deben completarse antes de distribuir el QR.

## Sonido

La banda sonora ambiental procede de un loop CC0. No se descarga ni reproduce hasta que el visitante activa **Activar ambiente** o pulsa **Iniciar con ambiente**. Si el navegador no puede descodificar el archivo, se usa una atmósfera sintetizada de respaldo. Los dos controles muestran claramente `ON` o `OFF`.

## Movimiento y compatibilidad

- La secuencia utiliza Motion 14.14.0 desde jsDelivr para coordinar la entrada, el mapa y el cierre. Su biblioteca es MIT: https://github.com/motiondivision/motion
- Si Motion no carga, la historia y las decisiones siguen funcionando; los estilos conservan los barridos y las transiciones esenciales.
- La composición se adapta a móviles estrechos, usa áreas seguras de iOS y conserva una alternativa a `100svh` para navegadores antiguos.
- Respeta la preferencia del sistema por reducir el movimiento. El sonido solo se activa mediante un botón.
- Las pistas, coordenadas y el caso son ficticios; no se solicitan ni recopilan datos del visitante.
- Los tres indicios de la portada son controles táctiles accesibles; tocar uno revela qué información puede aportar. Cada paso de la historia actualiza el fragmento de URL para indicar el destino dentro del recorrido.

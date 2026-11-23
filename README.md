# Tu sombra digital

Micrositio educativo sobre el derecho a la intimidad y la vida privada, reconocido en el artículo 12 de la Declaración Universal de Derechos Humanos.

## Idea

Una experiencia breve para móvil que convierte una foto ficticia en una historia de pistas. La persona toma una decisión, ve cómo cambia el recorrido y termina con una explicación clara del derecho. No se solicitan permisos del dispositivo ni se guardan elecciones.

## Archivos

- `index.html`: estructura, texto y referencia al artículo 12.
- `styles.css`: identidad visual, escena ilustrada, animaciones y adaptación móvil.
- `script.js`: decisiones y progresión narrativa.

## Publicar

El sitio es estático y puede publicarse con GitHub Pages desde la rama `main` y la carpeta raíz. El QR impreso debe apuntar a la URL pública del sitio; no a una ruta local del ordenador.

## Estado

Prototipo inicial. La narrativa y el artículo 12 están preparados para revisión; la identidad institucional, los créditos y el cartel impreso deben completarse antes de distribuir el QR.

## Sonido

La página genera su propia atmósfera sonora con Web Audio API: un zumbido tonal suave y textura filtrada, sin pista grabada ni audio de terceros. El sonido empieza solo si la persona activa el control; puede apagarlo en cualquier momento. La página recomienda auriculares a volumen cómodo.

## Movimiento y compatibilidad

- La secuencia utiliza Motion 14.14.0 desde jsDelivr para coordinar la entrada, el mapa y el cierre. Su biblioteca es MIT: https://github.com/motiondivision/motion
- Si Motion no carga, la historia y las decisiones siguen funcionando; los estilos conservan los barridos y las transiciones esenciales.
- La composición se adapta a móviles estrechos, usa áreas seguras de iOS y conserva una alternativa a `100svh` para navegadores antiguos.
- Respeta la preferencia del sistema por reducir el movimiento. El sonido solo se activa mediante un botón.
- Las pistas, coordenadas y el caso son ficticios; no se solicitan ni recopilan datos del visitante.

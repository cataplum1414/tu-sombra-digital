# Créditos de medios y recursos

## Música y efectos

- La ambientación cambia de la calle mojada al café con gente. Una base suave de [Forest Mist Whispers, de Alejandro Magaña (A. M.)](https://mixkit.co/free-stock-music/mood/calm/) gana presencia cuando las decisiones reducen el riesgo; una capa de tonos graves generada con Web Audio añade tensión cuando aumenta.
- Cada efecto coincide con algo visible: obturador al hacer la foto; vibración del móvil al recibir un mensaje; risa o respiración del Cartógrafo; zumbido y parpadeo de la farola en la Plaza de Cervantes y junto a la Puerta de Madrid; pasos sobre el pavimento mojado; campanilla y taza al entrar y sentarte con Paula. La mezcla baja la música y el ambiente durante cada efecto.
- Los efectos al tocar siguen activos aunque se apague la música. Las fuentes y las licencias están en [`assets/audio/FUENTES.md`](assets/audio/FUENTES.md).

## Escenas fotográficas

- `assets/story/cartografo-portada.webp`, `cartografo-horizontal.webp`, `alcala-night.webp`, `alcala-reflection.webp`, `alcala-plaza-exterior.webp`, `alcala-portal.webp` y `alcala-cafe.webp` son recreaciones generadas para esta ficción. Se usaron capturas aportadas por el autor y referencias de ubicación como guía visual. La primera escena muestra la fachada de la Casa Natal de Cervantes y las figuras de bronce; la segunda, los soportales de Calle Mayor; la tercera, la plaza abierta con árboles, soportales y farola. En la ruta del café, Paula está sentada con la protagonista y el Cartógrafo se ve fuera, tras el cristal. La otra ruta continúa por el Paseo de Cardenal Sandoval y Rojas hasta el arco real de la Puerta de Madrid.
- Son imágenes de ficción ambientadas en Alcalá de Henares, no fotografías documentales ni hechos o personas reales. La página lo indica junto a la historia. La protagonista no tiene nombre; Paula es su amiga.
- En la portada, un movimiento lento de cámara y dos pequeños tirones sugieren una presencia que observa; se desactivan si el dispositivo solicita movimiento reducido.
- Las imágenes están en el repositorio para que GitHub Pages no dependa de servicios externos.
- Referencias de ubicación: [Museo Casa Natal de Cervantes, Calle Mayor 48](https://www.turismoalcala.es/turismo/museo-casa-natal-de-cervantes/) y [Puerta de Madrid y recinto amurallado](https://www.turismoalcala.es/turismo/puerta-de-madrid-alcala-de-henares-y-recinto-amurallado/), según Turismo de Alcalá.

## Luz de la portada

- El destello frío e irregular que revela al Cartógrafo toma como referencia visual el parpadeo de [un tubo de neón en una escena de terror](https://youtu.be/VTWng8ZMz4U) y [luces fluorescentes que se encienden a cámara lenta](https://youtu.be/zLxbwZ0avUo). El efecto está recreado en CSS; no se incorpora el vídeo ni su audio.

## Referencias de interacción revisadas en GitHub

Se adaptaron ideas generales de interacción y ritmo narrativo. No se copiaron código, modelos ni medios de estos repositorios.

| Proyecto | Idea aplicada |
| --- | --- |
| [Immersions](https://github.com/bruchansky/immersions) · Apache-2.0 | Explorar pistas con controles directos sobre los objetos. |
| [Bao Scroll Story](https://github.com/architech97/bao-scroll-story) | Transiciones que convierten las escenas en un relato continuo; se conserva el scroll nativo del móvil. |
| [Aether Worlds](https://github.com/TheNonFungibleHuman/Aether-worlds) | Entorno visual generado con CSS y Canvas, con movimiento reducido y una alternativa sin WebGL. |
| [Night Shift Protocol](https://github.com/char704/Night-Shift-Protocol) | Elecciones que alteran la secuencia y revelan consecuencias distintas. |
| [inkjs](https://github.com/inkle/inkjs) · MIT | Narración ramificada con elecciones y consecuencias legibles; la lógica de este sitio sigue siendo JavaScript propio. |
| [WebQuestEngine](https://github.com/WebQuestEngine/WebQuestEngine) · MIT | Referencia para separar escenas tocables y caminos narrativos. El motor está en desarrollo y no se incorpora como dependencia. |
| [Codrops Cinematic Scroll Animations](https://github.com/JosephASG/codrops-cinematic-scroll-animations) · MIT | Referencia de ritmo de cámara, escala y composición. No se usan las imágenes de demostración ni los recursos del tutorial. |
| [smirk-dev/backrooms](https://github.com/smirk-dev/backrooms) | Referencia para usar espacio vacío y silencio como tensión antes del golpe en la puerta; no se copia su código. |
| [LuminoDevelopment/3DHorror](https://github.com/LuminoDevelopment/3DHorror) · MIT | Referencia de impacto visual y sonoro. Su recorrido con teclado y perspectiva en primera persona no es adecuado para este QR móvil, así que no se integra como motor. |
| [Rain-and-Lightning](https://github.com/DreAdeDcoRpSE/Rain-and-Lightning) y [raindrop-fx](https://github.com/SardineFish/raindrop-fx) | Referencias visuales para diferenciar lluvia en movimiento y gotas adheridas al cristal. El efecto de esta web está escrito para el proyecto, sin copiar el código de esos repositorios. |

## Bibliotecas

- [Motion](https://github.com/motiondivision/motion), MIT, anima las transiciones de escenas y el cierre. Se carga desde jsDelivr.
- La historia mantiene controles táctiles y escenas fotográficas locales. No se incorporan modelos 3D ni recursos visuales de los repositorios citados.

Las bibliotecas y los recursos multimedia de sus demos pueden tener licencias distintas. No se incorporaron archivos de los repositorios citados.

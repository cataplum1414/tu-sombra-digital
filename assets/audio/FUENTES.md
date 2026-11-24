# Fuentes y mapa sonoro

La música y los efectos descargados se integran en la historia, no se ofrecen como archivos independientes. La música usa la [licencia gratuita de Mixkit](https://mixkit.co/license/modal/musicFree/); los efectos descargados, su [licencia gratuita de efectos](https://mixkit.co/license/modal/sfxFree/). La vibración del móvil se genera en el navegador con Web Audio y no usa un archivo externo.

| Archivo | Uso dentro de la historia | Fuente |
| --- | --- | --- |
| `soft-hopeful-bed.mp3` | Ruta segura o de riesgo bajo: base cálida y esperanzadora | [Forest Mist Whispers — Alejandro Magaña (A. M.)](https://mixkit.co/free-stock-music/mood/calm/) |
| `echoes.mp3` | Riesgo intermedio: ambiente musical inquietante cuando se acumulan decisiones arriesgadas | [Echoes — Andrew Ev](https://mixkit.co/free-stock-music/mood/eerie/) |
| `piano-horror.mp3` | Riesgo alto: piano y drones de terror para la ruta más peligrosa | [Piano Horror — Francisco Alvear](https://mixkit.co/free-stock-music/mood/scary/) |
| `alcala-night-city.mp3` | Lluvia y ciudad en Calle Mayor, Plaza de Cervantes y la ruta del portal | [Urban city ambience at night](https://mixkit.co/free-sound-effects/rain/) |
| `cafe-crowd.mp3` | Voces y ambiente al entrar en la cafetería | [Restaurant crowd talking ambience](https://mixkit.co/free-sound-effects/ambience/) |
| `camera-shutter.mp3` | Solo cuando la escena indica que se toma o captura una foto | [Camera shutter click](https://mixkit.co/free-sound-effects/camera/) |
| `wet-pavement-steps.mp3` | La protagonista cruza la plaza o vuelve sobre sus pasos; el Cartógrafo se mueve o se aleja por la calle mojada | [Footsteps on heels on the pavement](https://mixkit.co/free-sound-effects/footsteps/) |
| `cartographer-laugh.mp3` | Risa breve al tocar el reflejo del Cartógrafo bajo los soportales de Calle Mayor | [Troll warrior laugh](https://mixkit.co/free-sound-effects/laugh/) |
| `cartographer-breath.mp3` | Respiración áspera al tocar la figura quieta frente al portal | [Creepy demon heavy breathing](https://mixkit.co/free-sound-effects/voices/) |
| `lamp-switch.mp3` | Clic que inicia el fallo del fluorescente en la portada o de la farola junto a la Puerta de Madrid | [Light switch sound](https://mixkit.co/free-sound-effects/light/) |
| `lamp-electric-buzz.mp3` | Zumbido que acompaña el ciclo de apagones y encendidos en la portada o junto a la Puerta de Madrid | [Electricity buzz](https://mixkit.co/free-sound-effects/electricity/) |
| Sonido de vibración del móvil | Dos zumbidos cortos, generados con Web Audio, al tocar el móvil. En Android también activa la vibración física cuando el navegador lo permite. | Generado en el proyecto; sin archivo externo. |
| Lluvia sobre el cristal y fallo de luz | Gotas y lluvia en Canvas; apagones y recuperación de luz en CSS. No usan vídeo ni cámara. | Generado en el proyecto; sin archivo externo. |
| `cafe-doorbell.mp3` | La protagonista se acerca a la entrada iluminada de la cafetería en Plaza de Cervantes | [Modern classic door bell sound](https://mixkit.co/free-sound-effects/doors/) |
| `coffee-cup-setdown.mp3` | Paula desliza y deja la taza sobre la mesa | [Dish placed in a wood table](https://mixkit.co/free-sound-effects/kitchen/) |
| `door-creak.mp3` | El picaporte cede y la puerta del portal se abre unos centímetros; vuelve a sonar si decide entrar | [Creaky door open](https://mixkit.co/free-sound-effects/doors/) |
| `cinematic-suspense-ambience.mp3` | Capa larga de tensión en la Calle Mayor y la ruta de riesgo; se detiene al cambiar de escena | [Cinematic suspense ambience](https://mixkit.co/free-sound-effects/ambience/) |
| `distant-thunder-rumble.mp3` | Trueno lejano en la Plaza de Cervantes cuando la historia ya acumula decisiones de riesgo | [Thunder rumble during a storm](https://mixkit.co/free-sound-effects/ambience/) |

La intensidad sigue el nivel de riesgo de las decisiones. Al elegir opciones seguras, el tema vuelve gradualmente a la base cálida; cuando aumenta el riesgo, cruza a `Echoes` y después a `Piano Horror`. Los temas cambian con un fundido y vuelven a una posición definida al iniciar o reiniciar la historia. Cada efecto baja brevemente la música y el ambiente para que se entienda en móviles. Al entrar en algunas escenas aparecen interrupciones breves: un flash, una vibración, pasos bajo la lluvia o una farola que falla. Los sonidos automáticos solo se reproducen si la persona activó el ambiente. No se apaga el teléfono ni se usan la cámara o la ubicación. La respiración del Cartógrafo frente al portal acompaña únicamente esa ruta. El obturador se reserva para una foto o captura que se publica o guarda.

Se retiraron los golpes de puerta, el tintineo de copa de vino y el pulso cinematográfico genérico: no correspondían a las acciones ni a los lugares de esta historia. El clic y el zumbido acompañan el fallo de luz en la portada y la farola de la Puerta de Madrid. Cada objeto tiene una respuesta propia: pasos o cámara en la primera escena; vibración, mensaje o risa bajo los soportales; campanilla, taza y trueno en la plaza; y el fluorescente o la respiración junto al arco.

Cada escena ahora tiene una secuencia de varias capas espaciadas durante más tiempo. Los efectos largos pueden sonar bajo la música sin cortarse entre sí; al cambiar de escena o apagar el sonido se detienen. La farola titila durante varios segundos con bajones de luz irregulares, un resplandor que se apaga y un zumbido eléctrico sincronizado. En la escena del reflejo, la fotografía hace un desplazamiento breve cuando llega el mensaje. Un movimiento lento de cámara mantiene las fotos vivas sin competir con el texto; se desactiva si el móvil tiene activada la reducción de movimiento.

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
| `cartographer-laugh.mp3` | Risa breve del Cartógrafo al tocar su figura en Calle Mayor y el reflejo | [Troll warrior laugh](https://mixkit.co/free-sound-effects/laugh/) |
| `cartographer-breath.mp3` | Respiración áspera al tocar la figura quieta frente al portal | [Creepy demon heavy breathing](https://mixkit.co/free-sound-effects/voices/) |
| `lamp-switch.mp3` | Clic de interruptor al fallar la farola en la ruta del atajo | [Light switch sound](https://mixkit.co/free-sound-effects/light/) |
| `lamp-electric-buzz.mp3` | Zumbido eléctrico corto sincronizado con los dos parpadeos de la farola | [Electricity buzz](https://mixkit.co/free-sound-effects/electricity/) |
| Sonido de vibración del móvil | Dos zumbidos cortos, generados con Web Audio, al tocar el móvil. En Android también activa la vibración física cuando el navegador lo permite. | Generado en el proyecto; sin archivo externo. |
| Lluvia en pantalla y fallo de farola | Capas visuales CSS que aparecen en escenas de riesgo; no usan vídeo ni cámara. | Generado en el proyecto; sin archivo externo. |
| `cafe-doorbell.mp3` | La protagonista se acerca a la entrada iluminada de la cafetería en Plaza de Cervantes | [Modern classic door bell sound](https://mixkit.co/free-sound-effects/doors/) |
| `coffee-cup-setdown.mp3` | Paula desliza y deja la taza sobre la mesa | [Dish placed in a wood table](https://mixkit.co/free-sound-effects/kitchen/) |
| `door-creak.mp3` | El picaporte cede y la puerta del portal se abre unos centímetros; vuelve a sonar si decide entrar | [Creaky door open](https://mixkit.co/free-sound-effects/doors/) |

La intensidad sigue el nivel de riesgo de las decisiones. Al elegir opciones seguras, el tema vuelve gradualmente a la base cálida; cuando aumenta el riesgo, cruza a `Echoes` y después a `Piano Horror`. Los temas cambian con un fundido y vuelven a una posición definida al iniciar o reiniciar la historia. Cada efecto baja brevemente la música y el ambiente para que se entienda en móviles. Al entrar en algunas escenas aparecen interrupciones breves: un flash, una vibración, pasos bajo la lluvia o una farola que falla. Los sonidos automáticos solo se reproducen si la persona activó el ambiente. No se apaga el teléfono ni se usan la cámara o la ubicación. La respiración del Cartógrafo frente al portal acompaña únicamente esa ruta. El obturador se reserva para una foto o captura que se publica o guarda.

Se retiraron los golpes de puerta, el tintineo de copa de vino y el pulso cinematográfico genérico: no correspondían a las acciones ni a los lugares de esta historia. El interruptor y el zumbido eléctrico acompañan los fallos de la farola en la ruta del atajo. La risa queda reservada al Cartógrafo cuando aparece en Calle Mayor y el reflejo; en el portal, se oye su respiración al tocarlo.

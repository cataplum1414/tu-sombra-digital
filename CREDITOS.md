# Créditos de medios y recursos

## Ambiente sonoro

- **Ancient caverns (horror ambient loop)**, de congusbongus, publicada en OpenGameArt bajo **CC0 1.0**.
- Fuente: https://opengameart.org/content/ancient-caverns-horror-ambient-loop
- Registro de procedencia: https://github.com/euuuuuuan/moonshard-warden-public/blob/main/CREDITS.md
- Licencia CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/
- Archivo incluido: `assets/audio/ambiente-cavernas.ogg` · SHA-256: `5c841ef1a7bacd2a038801ecee0741e200d1cf1cd08f36a6a89cce95bcfb6a8a`
- La pista solo empieza tras tocar uno de los controles de audio. Si el navegador no puede decodificarla, se intenta activar una atmósfera sintetizada de respaldo.

## Escenas fotográficas

- `assets/story/cartografo-portada.webp`, `cartografo-horizontal.webp`, `alcala-night.webp`, `alcala-reflection.webp`, `alcala-portal.webp` y `alcala-cafe.webp` son imágenes creadas con ImageGen para esta ficción interactiva. La portada presenta al Cartógrafo encapuchado en primer plano y tiene encuadres separados para móvil vertical y apaisado.
- En la portada, un movimiento lento de cámara y dos pequeños tirones de imagen sugieren una presencia que observa; se desactivan si el dispositivo solicita movimiento reducido.
- Son recreaciones visuales ambientadas en Alcalá de Henares; no son fotografías documentales ni representan hechos o personas reales. La página lo indica junto a la historia.
- Las imágenes se guardan en el propio repositorio para cargar desde GitHub Pages sin depender de un servicio externo.
- Referencias de ubicación: [Museo Casa Natal de Cervantes, Calle Mayor 48](https://www.turismoalcala.es/turismo/museo-casa-natal-de-cervantes/) y [Puerta de Madrid y recinto amurallado](https://www.turismoalcala.es/turismo/puerta-de-madrid-alcala-de-henares-y-recinto-amurallado/), según Turismo de Alcalá.

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

## Bibliotecas

- [Motion](https://github.com/motiondivision/motion), MIT, anima las transiciones de escenas y el cierre. Se carga desde jsDelivr.
- La historia mantiene controles táctiles y escenas fotográficas locales. No se incorporan modelos 3D ni recursos visuales de los repositorios citados.

Las bibliotecas y los recursos multimedia de sus demos pueden tener licencias distintas. No se incorporaron archivos de los repositorios citados.

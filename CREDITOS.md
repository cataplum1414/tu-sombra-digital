# Créditos de medios y recursos

## Música y efectos

- La ambientación cambia de una calle urbana mojada a un café con gente según la escena; la música de ambiente puede apagarse.
- El obturador marca los momentos de vigilancia; las alertas, los pasos, los golpes de puerta, el ambiente de calle y cafetería y el pulso final son grabaciones integradas desde Mixkit. Se retiró la risa de monstruo para mantener el tono realista de la historia.
- Los efectos al tocar siguen activos aunque se apague la música. Las fuentes y los términos de la licencia están en [`assets/audio/FUENTES.md`](assets/audio/FUENTES.md).

## Escenas fotográficas

- `assets/story/cartografo-portada.webp`, `cartografo-horizontal.webp`, `alcala-night.webp`, `alcala-reflection.webp`, `alcala-plaza-exterior.webp`, `alcala-portal.webp` y `alcala-cafe.webp` son imágenes creadas con ImageGen para esta ficción interactiva. La tercera escena muestra la plaza y la entrada de la cafetería desde fuera; al entrar, la historia pasa al interior.
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

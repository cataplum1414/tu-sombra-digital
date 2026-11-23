# Créditos de medios y recursos

## Ambiente sonoro

- **Ancient caverns (horror ambient loop)**, de congusbongus, publicado en OpenGameArt y distribuido bajo **CC0 1.0**. El archivo OGG de esta página se obtuvo del repositorio público `euuuuuuan/moonshard-warden-public`, que conserva el registro de procedencia y la licencia. La página no reproduce sonido hasta que la persona pulsa **Activar ambiente** o **Iniciar con ambiente**.
- Fuente original: https://opengameart.org/content/ancient-caverns-horror-ambient-loop
- Registro de licencia y procedencia: https://github.com/euuuuuuan/moonshard-warden-public/blob/main/CREDITS.md
- Licencia CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/
- SHA-256 del archivo incluido: `5c841ef1a7bacd2a038801ecee0741e200d1cf1cd08f36a6a89cce95bcfb6a8a`

## Recursos técnicos revisados en GitHub

| Recurso | Licencia publicada por el proyecto | Uso considerado |
| --- | --- | --- |
| [Motion](https://github.com/motiondivision/motion) | MIT | Coreografía de pistas, mapa y escenas; ya forma parte del sitio. |
| [Howler.js](https://github.com/goldfire/howler.js) | MIT | Runtime local en `vendor/`; reproduce el loop con desbloqueo tras toque y gestión de eventos de error en Safari/iOS y Android. |
| [PixiJS](https://github.com/pixijs/pixijs) | MIT | Opción para gráficos 2D de alta frecuencia; evaluada, pero no incluida para conservar carga ligera y funcionamiento sin WebGL. |
| [Three.js](https://github.com/mrdoob/three.js) | MIT | Referencia para recorridos 3D completos; se dejó fuera porque un mundo 3D elevaría peso, consumo y riesgos de rendimiento en móviles de gama baja. |
| [Theatre.js](https://github.com/theatre-js/theatre) | Apache-2.0 para `@theatre/core`; AGPL-3.0 para el editor `@theatre/studio` | Referencia de animación cinematográfica; no se incorporó al sitio publicado. |
| [A Drift](https://github.com/zen-aperios/a-drift) | Revisar las licencias de código y de cada medio antes de reutilizar | Referencia audiovisual: composición continua, sonido optativo y capas de scroll. No se copiaron código ni medios. |
| [Bao Scroll Story](https://github.com/architech97/bao-scroll-story) | Revisar el archivo de licencia antes de reutilizar código o recursos | Referencia de rendimiento: carga diferida, escenas activas solamente, niveles de calidad por dispositivo y scroll nativo en móvil. |

Las bibliotecas y las imágenes/sonidos que usan tienen licencias distintas. La licencia de una biblioteca no licencia automáticamente los archivos multimedia de sus demos.

La versión minificada de Howler.js 2.2.4 se incluye en el repositorio junto a `vendor/HOWLER-LICENSE.txt`; no se solicita a un CDN durante la visita.

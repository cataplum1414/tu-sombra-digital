# Contador de visitas

El contador incrementa una vez por cada carga completa de la página. No deduplica por navegador o dirección IP, así que las visitas desde una misma red Wi-Fi se cuentan por separado.

El sitio estático de GitHub Pages no puede mantener un total compartido. El endpoint de Cloudflare Worker de `counter/` guarda únicamente el entero `visits` en un Durable Object. No lee ni almacena IP, agente de usuario, país, cookies, identificadores ni URL de procedencia. La observabilidad y los registros del Worker están desactivados en `counter/wrangler.toml`. Cloudflare recibe la petición y su IP de origen para prestar el servicio web; esa IP no la usa el código del contador ni se incluye en los registros del Worker.

## Activación

1. Crear o usar una cuenta gratuita de Cloudflare.
2. Desde esta carpeta, iniciar sesión en Wrangler y publicar el Worker:

   ```powershell
   npx wrangler login
   npx wrangler deploy --config counter/wrangler.toml
   ```

3. Copiar la dirección pública del Worker y añadir `/visit`.
4. Pegar esa dirección en `VISIT_COUNTER_ENDPOINT` al inicio de `visit-counter.js` y publicar el cambio del sitio.

Si Cloudflare no está disponible, el contador queda oculto y la historia sigue funcionando. No se muestra un número ficticio.

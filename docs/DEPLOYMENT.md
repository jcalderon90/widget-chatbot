# Guía de despliegue — Garoo Chat Widget

Pasos concretos para publicar el widget en un servidor y usarlo en producción.

---

## 1. Preparar el build

En tu máquina de desarrollo (con Node.js instalado):

```bash
git clone <url-del-repositorio>
cd widget-chatbot
npm install
npm run build:widget
```

Archivo generado:

```
dist/widget/garoo-chat-widget.js
```

Verifica el build:

```bash
npm run typecheck   # sin errores
dir dist\widget     # debe existir garoo-chat-widget.js
```

---

## 2. Subir al servidor

### Qué subir

| Archivo | Obligatorio | Descripción |
|---------|-------------|-------------|
| `garoo-chat-widget.js` | ✅ Sí | Widget embebible |
| `embed-example.html` | ❌ No | Solo referencia (opcional) |

### Qué NO subir

| Carpeta/archivo | Motivo |
|-----------------|--------|
| `node_modules/` | Solo necesario en desarrollo |
| `src/` | Código fuente; no necesario en producción |
| `.env` | Secretos locales |

> El directorio `dist/` está en `.gitignore`. Genera el build localmente o en CI antes de desplegar.

---

## 3. Ubicaciones recomendadas

### Nginx (VPS / Linux)

```bash
# Copiar archivo
sudo mkdir -p /var/www/tu-dominio.com/assets/widget
sudo cp dist/widget/garoo-chat-widget.js /var/www/tu-dominio.com/assets/widget/
```

Configuración Nginx:

```nginx
server {
    listen 443 ssl;
    server_name tu-dominio.com;

    location /assets/widget/ {
        alias /var/www/tu-dominio.com/assets/widget/;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        gzip on;
        gzip_types application/javascript;
    }
}
```

URL final: `https://tu-dominio.com/assets/widget/garoo-chat-widget.js`

### Apache (shared hosting)

```bash
# Subir a public_html
public_html/assets/widget/garoo-chat-widget.js
```

`.htaccess` opcional:

```apache
<Files "garoo-chat-widget.js">
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set Access-Control-Allow-Origin "*"
</Files>
```

### FTP / cPanel

1. File Manager → `public_html/assets/widget/`
2. Upload `garoo-chat-widget.js`
3. Probar URL en el navegador

### CDN (Cloudflare, S3, etc.)

1. Sube `garoo-chat-widget.js` al bucket o CDN.
2. Habilita HTTPS y compresión Brotli/Gzip.
3. Usa la URL del CDN en el `<script src="...">`.

---

## 4. Integrar en tu sitio

Snippet mínimo (pegar antes de `</body>`):

```html
<script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.js"></script>
<script>
  GarooChat.init({
    title: 'Soporte Garoo',
    primaryColor: '#0d9488',
    apiUrl: 'https://api.tu-dominio.com/v1/chat'
  });
</script>
```

### Checklist post-despliegue

- [ ] La URL del script responde 200 (no 404)
- [ ] El widget aparece en la esquina de la página
- [ ] El botón abre/cierra el panel
- [ ] Los mensajes demo funcionan (sin API)
- [ ] La API responde correctamente (con `apiUrl`)
- [ ] No hay errores CORS en la consola
- [ ] Funciona en móvil

---

## 5. Configurar el backend (opcional)

Si usas `apiUrl`, tu servidor debe:

1. Aceptar `POST` con `Content-Type: application/json`
2. Responder `{ "reply": "..." }`
3. Incluir headers CORS para el dominio del sitio

Ejemplo mínimo (Node.js + Express):

```javascript
app.post('/v1/chat', (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Recibido: ${message}` });
});
```

---

## 6. Actualizar el widget

Cuando hagas cambios en el código:

```bash
git pull
npm install          # si cambiaron dependencias
npm run build:widget
# Subir de nuevo garoo-chat-widget.js al servidor
```

Si usas caché agresiva (`max-age=31536000`), considera versionar la URL:

```html
<script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.v0.1.0.js"></script>
```

O invalida caché en tu CDN tras cada despliegue.

---

## 7. CI/CD (opcional)

Ejemplo GitHub Actions para build automático:

```yaml
name: Build Widget

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:widget
      - uses: actions/upload-artifact@v4
        with:
          name: garoo-chat-widget
          path: dist/widget/garoo-chat-widget.js
```

Descarga el artefacto y súbelo a tu servidor, o extiende el workflow con deploy a S3/FTP.

---

## 8. Solución de problemas en producción

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| 404 en el script | Ruta incorrecta | Verifica URL en navegador |
| Widget no visible | JS bloqueado o error previo | Revisa consola (F12) |
| CORS error | API sin headers | Configura `Access-Control-Allow-Origin` |
| Estilos rotos | Caché antigua | Limpia caché CDN / Ctrl+F5 |
| `GarooChat is not defined` | Script no cargó | Verifica orden de `<script>` |

---

## Referencias

- [README.md](../README.md) — documentación general
- [ARCHITECTURE.md](./ARCHITECTURE.md) — detalles técnicos
- [public/embed-example.html](../public/embed-example.html) — ejemplo HTML

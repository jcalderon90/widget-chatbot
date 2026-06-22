# Garoo Chat Widget

Widget de chat embebible construido con **Vite + React + TypeScript**. Se puede insertar en cualquier página web con un único `<script>` y aparece como un botón flotante en la esquina de la pantalla.

---

## Tabla de contenidos

- [Requisitos](#requisitos)
- [Desarrollo local](#desarrollo-local)
- [Generar el build de producción](#generar-el-build-de-producción)
- [Dónde subirlo en tu servidor](#dónde-subirlo-en-tu-servidor)
- [Cómo usarlo en tu web](#cómo-usarlo-en-tu-web)
- [Opciones de configuración](#opciones-de-configuración)
- [API programática](#api-programática)
- [Conectar con tu backend](#conectar-con-tu-backend)
- [Ejemplos de integración](#ejemplos-de-integración)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación adicional](#documentación-adicional)
- [Solución de problemas](#solución-de-problemas)

---

## Requisitos

- **Node.js** 18 o superior
- **npm** 9 o superior

Para usar el widget en producción **no necesitas Node.js en el servidor**. Solo sirves el archivo JavaScript generado como un archivo estático.

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con página demo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). Verás una página de demostración y el widget flotante en la esquina inferior derecha.

Otros comandos útiles:

| Comando | Descripción |
|---------|-------------|
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run build:widget` | Genera el bundle embebible |
| `npm run build:demo` | Genera la página demo estática |
| `npm run preview` | Previsualiza el build de la demo |

---

## Generar el build de producción

```bash
npm run build:widget
```

Esto crea el archivo:

```
dist/widget/garoo-chat-widget.js
```

Ese es **el único archivo que necesitas subir a tu servidor** para que el widget funcione en cualquier sitio web. El bundle incluye React y todos los estilos; no requiere dependencias adicionales en la página host.

> **Nota:** Tras cada cambio en el código, vuelve a ejecutar `npm run build:widget` y reemplaza el archivo en tu servidor.

---

## Dónde subirlo en tu servidor

Sube `garoo-chat-widget.js` a una carpeta accesible por URL pública. Ejemplos según tu infraestructura:

### Opción A — Carpeta estática del dominio (recomendado)

```
/var/www/tu-dominio.com/
└── assets/
    └── widget/
        └── garoo-chat-widget.js
```

URL resultante:

```
https://tu-dominio.com/assets/widget/garoo-chat-widget.js
```

### Opción B — Subdominio dedicado para assets

```
https://cdn.tu-dominio.com/garoo-chat-widget.js
```

Útil si quieres servir el widget desde un CDN o un bucket (S3, Cloudflare R2, etc.).

### Opción C — Mismo servidor, carpeta pública (Apache / Nginx)

**Nginx** — el archivo queda en la raíz pública:

```
/usr/share/nginx/html/widget/garoo-chat-widget.js
```

**Apache** — dentro de `public_html` o `www`:

```
/home/usuario/public_html/widget/garoo-chat-widget.js
```

### Opción D — Hosting compartido (cPanel, Plesk, etc.)

1. Entra al administrador de archivos.
2. Crea una carpeta, por ejemplo `public/widget/`.
3. Sube `garoo-chat-widget.js`.
4. Verifica que la URL responda en el navegador (debe mostrar código JavaScript, no un 404).

### Verificar que funciona

Abre en el navegador la URL directa del archivo:

```
https://tu-dominio.com/assets/widget/garoo-chat-widget.js
```

Si ves el contenido del script (minificado), la ruta es correcta.

### Headers recomendados en el servidor

Configura tu servidor para servir el archivo con caché y compresión:

| Header | Valor sugerido |
|--------|----------------|
| `Content-Type` | `application/javascript` |
| `Cache-Control` | `public, max-age=31536000, immutable` |
| Compresión | Gzip o Brotli habilitado |

**Ejemplo Nginx:**

```nginx
location /assets/widget/ {
    alias /var/www/tu-dominio.com/assets/widget/;
    add_header Cache-Control "public, max-age=31536000, immutable";
    gzip on;
    gzip_types application/javascript;
}
```

**Ejemplo Apache (.htaccess):**

```apache
<Files "garoo-chat-widget.js">
    Header set Cache-Control "public, max-age=31536000, immutable"
</Files>
```

---

## Cómo usarlo en tu web

Copia este código **antes del cierre de `</body>`** en cualquier página HTML:

```html
<script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.js"></script>
<script>
  GarooChat.init({
    title: 'Soporte Garoo',
    subtitle: 'En línea · Respuesta rápida',
    primaryColor: '#0d9488',
    position: 'bottom-right',
    greeting: '¡Hola! ¿En qué podemos ayudarte?',
    placeholder: 'Escribe tu mensaje...',
    apiUrl: 'https://tu-api.com/chat'  // opcional
  });
</script>
```

Reemplaza la URL del `src` por la ruta real donde subiste el archivo.

### Flujo resumido

```
1. npm run build:widget          → genera el .js
2. Subes garoo-chat-widget.js   → a tu servidor / CDN
3. Insertas el <script>         → en las páginas donde quieras el chat
4. GarooChat.init({ ... })       → configuras título, colores, API, etc.
```

### Sin backend (modo demo)

Si **no** pasas `apiUrl`, el widget funciona igual: muestra el mensaje de bienvenida y responde con respuestas simuladas. Ideal para probar la integración visual antes de conectar tu API.

---

## Opciones de configuración

Todas las opciones son opcionales. Si no las indicas, se usan los valores por defecto.

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `title` | `string` | `'Garoo Assistant'` | Título en el header del chat |
| `subtitle` | `string` | `'Suele responder en segundos'` | Subtítulo bajo el título |
| `primaryColor` | `string` | `'#0d9488'` | Color principal (hex). Afecta botón, header y acentos |
| `position` | `'bottom-right'` \| `'bottom-left'` | `'bottom-right'` | Posición del widget en pantalla |
| `greeting` | `string` | `'¡Hola! 👋 ¿En qué puedo ayudarte hoy?'` | Primer mensaje del asistente |
| `placeholder` | `string` | `'Escribe tu mensaje...'` | Texto del campo de entrada |
| `locale` | `'es'` \| `'en'` | `'es'` | Reservado para futuras traducciones |
| `apiUrl` | `string` | `''` (vacío) | URL de tu API de chat. Si está vacío, usa respuestas simuladas |

### Ejemplo con todas las opciones

```html
<script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.js"></script>
<script>
  GarooChat.init({
    title: 'Atención al cliente',
    subtitle: 'Disponible de 9:00 a 18:00',
    primaryColor: '#2563eb',
    position: 'bottom-left',
    greeting: 'Bienvenido. ¿Tienes alguna duda sobre nuestros servicios?',
    placeholder: 'Escribe aquí...',
    apiUrl: 'https://api.tu-dominio.com/v1/chat'
  });
</script>
```

---

## API programática

`GarooChat.init(config)` devuelve una instancia con métodos para controlar el widget desde JavaScript:

```javascript
const chat = GarooChat.init({
  title: 'Soporte',
  primaryColor: '#0d9488'
});

// Abrir el panel de chat
chat.open();

// Cerrar el panel
chat.close();

// Alternar abierto/cerrado
chat.toggle();

// Enviar un mensaje programáticamente
chat.sendMessage('Hola, necesito ayuda con mi pedido');

// Eliminar el widget de la página
chat.destroy();
```

Útil para abrir el chat desde un botón propio de tu sitio:

```html
<button onclick="window.__garooChat?.open()">
  ¿Necesitas ayuda? Chatea con nosotros
</button>

<script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.js"></script>
<script>
  window.__garooChat = GarooChat.init({ title: 'Soporte' });
</script>
```

---

## Conectar con tu backend

Si defines `apiUrl`, cada mensaje del usuario se envía a tu servidor.

### Petición que hace el widget

```
POST {apiUrl}
Content-Type: application/json

{
  "message": "Texto que escribió el usuario"
}
```

### Respuesta esperada

Tu API debe responder con **JSON** y uno de estos campos:

```json
{
  "reply": "Respuesta del bot o agente"
}
```

o alternativamente:

```json
{
  "message": "Respuesta del bot o agente"
}
```

### Ejemplo mínimo en Node.js (Express)

```javascript
import express from 'express';

const app = express();
app.use(express.json());

// CORS: permite peticiones desde tu sitio web
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://tu-sitio-web.com');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.post('/v1/chat', async (req, res) => {
  const { message } = req.body;

  // Aquí integrarías tu lógica: OpenAI, n8n, base de datos, etc.
  const reply = `Recibimos: "${message}". Te responderemos pronto.`;

  res.json({ reply });
});

app.listen(3000);
```

### CORS

Como el widget se ejecuta en el navegador del visitante, tu API debe permitir el origen de la página donde está embebido el chat. Si no configuras CORS, verás errores en la consola del navegador y el widget mostrará un mensaje de error al usuario.

---

## Ejemplos de integración

### HTML estático

Ver también `public/embed-example.html` en este repositorio.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Mi sitio</title>
</head>
<body>
  <h1>Bienvenido a mi web</h1>

  <script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.js"></script>
  <script>
    GarooChat.init({
      title: 'Soporte',
      primaryColor: '#0d9488'
    });
  </script>
</body>
</html>
```

### WordPress

En **Apariencia → Editor de temas → footer.php** (o con un plugin de snippets), antes de `</body>`:

```html
<script src="https://tu-dominio.com/assets/widget/garoo-chat-widget.js"></script>
<script>
  GarooChat.init({
    title: 'Soporte Garoo',
    apiUrl: 'https://api.tu-dominio.com/chat'
  });
</script>
```

### React / Next.js / Vue

En React o frameworks SPA, carga el script una sola vez (por ejemplo en el layout principal o con `useEffect`):

```jsx
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://tu-dominio.com/assets/widget/garoo-chat-widget.js';
  script.async = true;
  script.onload = () => {
    window.GarooChat?.init({
      title: 'Soporte',
      primaryColor: '#0d9488',
      apiUrl: 'https://api.tu-dominio.com/chat'
    });
  };
  document.body.appendChild(script);

  return () => {
    // Opcional: limpiar al desmontar
    script.remove();
  };
}, []);
```

### Varias páginas, un solo script

Sube el archivo **una vez** al servidor y reutiliza la misma URL en todas las páginas. Puedes usar configuraciones distintas por página cambiando los parámetros de `GarooChat.init()`.

---

## Estructura del proyecto

```
widget-chatbot/
├── dist/
│   └── widget/
│       └── garoo-chat-widget.js   ← Archivo para producción (tras build)
├── public/
│   └── embed-example.html         ← Ejemplo mínimo de integración
├── src/
│   ├── demo/                      ← Página demo (solo desarrollo)
│   │   ├── DemoPage.tsx
│   │   ├── demo.css
│   │   └── main.tsx
│   └── widget/                    ← Código del widget embebible
│       ├── index.tsx              ← Entry: expone window.GarooChat
│       ├── mount.tsx              ← Montaje con Shadow DOM
│       ├── config.ts              ← Valores por defecto
│       ├── types.ts               ← Tipos TypeScript
│       ├── hooks/
│       │   └── useChat.ts         ← Lógica de mensajes y API
│       ├── components/            ← UI (header, input, burbujas, etc.)
│       └── styles/
│           └── widget.css         ← Estilos aislados en Shadow DOM
├── index.html                     ← Entrada de la demo en desarrollo
├── vite.config.ts
├── package.json
└── README.md
```

### Características técnicas

- **Shadow DOM:** los estilos del widget no chocan con los de la página host.
- **Bundle IIFE:** un solo archivo, sin necesidad de React en el sitio cliente.
- **Z-index alto:** el widget queda por encima de la mayoría de elementos de la página.
- **Responsive:** se adapta a móvil y escritorio.

---

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [CHANGELOG.md](./CHANGELOG.md) | Historial de versiones y cambios |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitectura técnica, Shadow DOM, build, tipos |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Guía paso a paso de despliegue en servidor |
| [public/embed-example.html](./public/embed-example.html) | Ejemplo HTML mínimo de integración |

---

## Solución de problemas

### El widget no aparece

1. Comprueba que la URL del script carga sin error 404.
2. Abre la consola del navegador (F12) y busca errores de JavaScript.
3. Verifica que llamas a `GarooChat.init()` **después** de cargar el script.
4. Asegúrate de no llamar a `chat.destroy()` por error.

### Error de CORS al enviar mensajes

Tu API debe incluir el header `Access-Control-Allow-Origin` con el dominio de la página donde está el widget (o `*` solo en desarrollo).

### Cambié el código pero no veo cambios en producción

1. Ejecuta de nuevo `npm run build:widget`.
2. Sube el nuevo `garoo-chat-widget.js`.
3. Limpia caché del navegador o usa recarga forzada (Ctrl+F5).

### El script carga pero `GarooChat` es undefined

- El script debe cargarse desde la **misma URL** que configuraste; no uses rutas relativas incorrectas.
- No uses `defer`/`async` en el segundo script de init sin esperar a `onload` del primero, o incluye ambos en orden como en los ejemplos.

### Conflictos con otros scripts

El widget usa el id `garoo-chat-widget-host` en el DOM. Solo puede haber **una instancia** activa por página. Si necesitas reiniciarlo, llama primero a `chat.destroy()` y luego a `GarooChat.init()` de nuevo.

---

## Licencia

Proyecto privado — Garoo Services.

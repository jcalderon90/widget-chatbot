# Arquitectura — Garoo Chat Widget

Documentación técnica del widget embebible para desarrolladores.

---

## Visión general

El proyecto tiene **dos modos de ejecución** controlados por Vite:

| Modo | Comando | Entrada | Salida |
|------|---------|---------|--------|
| Desarrollo / Demo | `npm run dev` | `index.html` → `src/demo/main.tsx` | Servidor local `:5173` |
| Widget embebible | `npm run build:widget` | `src/widget/index.tsx` | `dist/widget/garoo-chat-widget.js` |

El widget de producción es un **bundle autocontenido** que incluye React, React DOM y todos los estilos. No requiere que el sitio host tenga React instalado.

---

## Flujo de montaje

```
Página host
    │
    ▼
<script src="garoo-chat-widget.js">
    │
    ▼
window.GarooChat.init(config)
    │
    ▼
mountWidget()  ──►  Crea #garoo-chat-widget-host en document.body
    │
    ▼
attachShadow({ mode: 'open' })
    │
    ├── <style>  ← widget.css inyectado inline (?inline)
    └── <div>    ← React root
            │
            ▼
        <ChatWidget />
```

### ¿Por qué Shadow DOM?

- Evita que los estilos globales de la página host afecten al widget.
- Evita que los estilos del widget (`Outfit`, colores, z-index) afecten al sitio.
- Permite embeber el widget en sitios con CSS agresivo o frameworks legacy.

### Z-index

El widget usa `z-index: 2147483000` para permanecer visible sobre la mayoría de elementos de terceros (modales, banners, etc.).

---

## Estructura de código

```
src/widget/
├── index.tsx          # Expone GarooChat en window; entry del build IIFE
├── mount.tsx          # Lógica de Shadow DOM + createRoot
├── config.ts          # Valores por defecto y merge de configuración
├── types.ts           # Tipos públicos (WidgetConfig, GarooChatInstance)
├── hooks/
│   └── useChat.ts     # Estado de mensajes, envío, integración API
├── components/
│   ├── ChatWidget.tsx # Orquestador principal
│   ├── ChatLauncher.tsx
│   ├── ChatPanel (inline en ChatWidget)
│   ├── ChatHeader.tsx
│   ├── MessageList.tsx
│   ├── MessageBubble.tsx
│   ├── ChatInput.tsx
│   └── Icons.tsx
└── styles/
    └── widget.css     # Estilos scoped vía Shadow DOM
```

---

## Estado y mensajes

`useChat` gestiona:

1. **Lista de mensajes** — array de `ChatMessage` con id, role, content, timestamp, status.
2. **Mensaje inicial** — el `greeting` de la configuración se inserta como primer mensaje del asistente.
3. **Envío** — al enviar, se añade el mensaje del usuario y se activa `isTyping`.
4. **Respuesta** — según configuración:
   - Con `apiUrl`: `POST` con `{ message: string }`.
   - Sin `apiUrl`: delay simulado + respuesta aleatoria de un pool predefinido.

### Contrato de API

**Request:**

```http
POST /tu-endpoint
Content-Type: application/json

{ "message": "Texto del usuario" }
```

**Response (200):**

```json
{ "reply": "Respuesta del bot" }
```

Alternativa aceptada: `{ "message": "..." }`.

**Errores:** si la petición falla o el status no es 2xx, se muestra un mensaje de error al usuario.

---

## Build (Vite)

Configuración en `vite.config.ts` cuando `mode === 'widget'`:

```typescript
build: {
  lib: {
    entry: 'src/widget/index.tsx',
    name: 'GarooChat',
    formats: ['iife'],
    fileName: () => 'garoo-chat-widget.js',
  },
  cssCodeSplit: false,
}
```

- **IIFE** expone `GarooChat` globalmente sin módulos ES.
- **CSS inline** — `widget.css?inline` se inyecta como `<style>` en el Shadow DOM.
- **Tamaño aproximado** — ~203 KB sin gzip, ~64 KB gzip (incluye React 19).

---

## API pública

### `GarooChat.init(config?: WidgetConfig): GarooChatInstance`

Crea y monta el widget. Si ya existía una instancia, la destruye antes de crear una nueva.

### `GarooChatInstance`

| Método | Descripción |
|--------|-------------|
| `open()` | Abre el panel de chat |
| `close()` | Cierra el panel |
| `toggle()` | Alterna abierto/cerrado |
| `sendMessage(text)` | Envía un mensaje como si lo escribiera el usuario |
| `destroy()` | Desmonta React, elimina el host del DOM |

---

## Tipos TypeScript

```typescript
interface WidgetConfig {
  apiUrl?: string
  title?: string
  subtitle?: string
  primaryColor?: string
  position?: 'bottom-right' | 'bottom-left'
  greeting?: string
  placeholder?: string
  locale?: 'es' | 'en'
}
```

Los tipos están en `src/widget/types.ts` y pueden reutilizarse si integras el widget desde un proyecto TypeScript interno.

---

## Extensibilidad futura

Puntos naturales de extensión:

| Área | Archivo | Idea |
|------|---------|------|
| Backend | `useChat.ts` | WebSocket, streaming SSE, autenticación |
| UI | `components/` | Adjuntos, avatares, rating, formularios |
| i18n | `config.ts` | Traducciones según `locale` |
| Theming | `widget.css` | Modo oscuro, temas por cliente |
| Analytics | `mount.tsx` | Eventos de apertura, mensajes enviados |

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `react` / `react-dom` | UI del widget (incluidos en el bundle) |
| `vite` | Dev server y build |
| `@vitejs/plugin-react` | JSX / Fast Refresh en desarrollo |
| `typescript` | Tipado estático |

No hay dependencias de runtime adicionales (sin librerías de UI, sin axios).

---

## Seguridad

- El widget hace `fetch` al `apiUrl` configurado desde el navegador del usuario → **CORS obligatorio** en el backend.
- No se almacenan tokens ni datos sensibles en el widget por defecto.
- El Shadow DOM es `mode: 'open'` (accesible desde DevTools; no es barrera de seguridad).
- Sanitización de mensajes: el contenido se renderiza como texto React (no `dangerouslySetInnerHTML`).

---

## Referencias

- [README.md](../README.md) — guía de uso e integración
- [DEPLOYMENT.md](./DEPLOYMENT.md) — despliegue en servidor
- [CHANGELOG.md](../CHANGELOG.md) — historial de versiones

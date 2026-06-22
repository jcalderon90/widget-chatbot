# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [0.1.0] — 2026-06-22

### Añadido

- Proyecto base **Vite + React + TypeScript** para widget de chat embebible.
- Widget flotante con botón launcher, panel de chat, burbujas de mensajes e indicador de escritura.
- Aislamiento de estilos mediante **Shadow DOM** (sin conflictos con el CSS del sitio host).
- Build de producción en formato **IIFE** (`dist/widget/garoo-chat-widget.js`).
- API global `window.GarooChat.init()` con configuración personalizable.
- API programática: `open`, `close`, `toggle`, `sendMessage`, `destroy`.
- Modo demo con respuestas simuladas cuando no se configura `apiUrl`.
- Integración con backend vía `POST` JSON (`{ message }` → `{ reply }`).
- Página demo de desarrollo (`npm run dev`) con documentación interactiva.
- Ejemplo de integración en `public/embed-example.html`.
- Documentación completa en `README.md`.
- Documentación técnica en `docs/ARCHITECTURE.md` y `docs/DEPLOYMENT.md`.

### Configuración disponible

- `title`, `subtitle`, `primaryColor`, `position`
- `greeting`, `placeholder`, `locale`
- `apiUrl`

### Scripts npm

- `dev` — servidor de desarrollo
- `build:widget` — bundle embebible
- `build:demo` — build de la página demo
- `typecheck` — verificación TypeScript

[0.1.0]: https://github.com/garoo-services/widget-chatbot/releases/tag/v0.1.0

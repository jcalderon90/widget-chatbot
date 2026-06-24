# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [0.2.0] — 2026-06-24

### Añadido
- **Responsividad Completa en Móviles:** Rediseño a pantalla completa (`100dvw`/`100dvh`) para pantallas angostas ($\le$ 480px) o bajas ($\le$ 520px de alto en landscape).
- **Animaciones Nativas:** Deslizamiento suave desde la parte inferior (`garoo-panel-mobile-in`) en dispositivos móviles.
- **Optimización de Touch Targets:** Incrementado el tamaño interactivo de botones a un estándar accesible (Cerrar: 40px, Input: 44px de alto, Enviar: 44px).
- **Prevención de iOS Auto-Zoom:** Forzada la fuente a 16px en móviles al enfocar campos de texto.
- **Identidad Visual Forest Green:** Paleta de colores actualizada a `#1e443a` (verde bosque), `#eff1f5` (superficie claro) y `#dfe2e8` (bordes finos) basada en la identidad de marca.

### Corregido
- **Error en Variables CSS con Shadow DOM:** Solucionado el fallo de `document.querySelector` que impedía inyectar variables de color de tema dinámico en el Shadow DOM, sustituido por referencias de React (`useRef`).
- **Posición del Launcher en Móvil:** Solucionado el bug en el que el botón launcher se posicionaba en la esquina superior izquierda en pantallas responsivas debido a la especificidad del estilo inline `position: relative`.

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

[0.2.0]: https://github.com/garoo-services/widget-chatbot/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/garoo-services/widget-chatbot/releases/tag/v0.1.0

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Dev server on localhost:5173 (demo page + hot reload)
npm run build:widget  # Production bundle → dist/widget/garoo-chat-widget.js
npm run build:demo    # Demo SPA build
npm run typecheck     # Type-check without emitting
```

No test suite exists. Type-check before every build — `build:widget` runs `tsc --noEmit` automatically.

## Architecture

This repo has two distinct outputs from one codebase:

**1. The embeddable widget** (`src/widget/`) — the deliverable. Built as an IIFE (`dist/widget/garoo-chat-widget.js`) that exposes `window.GarooChat`. Self-contained: React, all styles, and all logic bundled into one file with no runtime dependencies.

**2. The demo page** (`src/demo/`) — dev/docs only. Standard React SPA that imports `src/widget/mount.tsx` directly. Never shipped.

### Widget internals

- **`index.tsx`** — defines `window.GarooChat.init()` and delegates to `mount.tsx`
- **`mount.tsx`** — attaches a Shadow DOM to `document.body`, injects CSS as a `<style>` tag, renders `<ChatWidget>`
- **`types.ts`** — single source of truth for `WidgetConfig` and `ChatMessage` interfaces
- **`config.ts`** — `DEFAULT_CONFIG` (must stay in sync with `WidgetConfig`) and `mergeConfig()`
- **`hooks/useChat.ts`** — all message state and API logic; `fetchN8nReply()` sends the n8n-compatible webhook payload
- **`components/ChatWidget.tsx`** — root component; applies color theming via CSS variables on a Shadow DOM element

### n8n webhook integration

The widget integrates with an n8n webhook at `https://agentsprod.redtec.ai/webhook/hotels-agent`. The payload mirrors the Manychat structure the webhook expects:

```json
{
  "key": "<webhookKey>",
  "body": {
    "id": "<sessionId>",
    "page_id": "<pageId>",
    "last_input_text": "<message>",
    "custom_fields": {
      "propiedad": "ITZ | KAA",
      "canal_ingreso": "widget"
    }
  }
}
```

`canal_ingreso: 'widget'` is hardcoded — the n8n workflow uses this to branch: `widget` → Respond to Webhook (synchronous reply); anything else → Manychat API callback. The session ID is persisted in `localStorage` under `gsid_garoo` to maintain MongoDB conversation history across reloads.

Config fields for the webhook: `apiUrl`, `webhookKey`, `propertyId` (`'ITZ' | 'KAA'`), `pageId`.

### CSS isolation

All styles live in `src/widget/styles/widget.css` and are imported with `?inline` (raw string). `mount.tsx` injects this string into a `<style>` tag inside the Shadow DOM, fully isolating the widget from host-page styles. Never use standard CSS imports inside `src/widget/` — they won't reach the Shadow DOM.

### Theming

`ChatWidget.tsx` reads `config.primaryColor` and derives two variants via `adjustColor()` and `hexToRgba()`, then writes them as CSS variables (`--garoo-primary`, `--garoo-primary-dark`, `--garoo-primary-soft`) onto the Shadow DOM host element. All color usage in `widget.css` references these variables.

---

## Estado actual (pausado 2026-06-22)

### Qué está hecho

La integración widget → n8n está implementada en el widget. Los tres archivos modificados:

- **`src/widget/types.ts`** — añadidos `webhookKey?`, `propertyId?: 'ITZ' | 'KAA'`, `pageId?` a `WidgetConfig`
- **`src/widget/config.ts`** — defaults: `webhookKey: ''`, `propertyId: 'ITZ'`, `pageId: 'widget'`
- **`src/widget/hooks/useChat.ts`** — `fetchBotReply` reemplazado por `fetchN8nReply()` que envía el payload Manychat-compatible; session ID estable via `localStorage` (`gsid_garoo`)

El workflow de n8n (`PRINCIPAL.json` en `E:\1TRABAJO\PROGRAMMING\Proyectos\Agent-Belize\workflows`) también fue modificado manualmente en la GUI para agregar:
- Nodo IF después de "Parse Agent Output" — condición: `canal_ingreso === 'widget'`
- Rama `true` → "Respond to Webhook" (devuelve `{ reply: response_text }` sincrónicamente)
- Rama `false` → flujo Manychat original intacto

### Qué falta

- **Probar end-to-end**: Actualizar `src/demo/DemoPage.tsx` con `apiUrl` y `propertyId` reales, correr `npm run dev`, enviar un mensaje y verificar que llega al n8n y devuelve respuesta.
- **Nota sobre `webhookKey`**: El campo `key` en el webhook n8n se extrae pero no se valida — el workflow lo descarta. Se puede omitir o enviar cualquier valor; no tiene efecto funcional.
- **Build final**: Una vez probado, correr `npm run build:widget` para generar el bundle de producción en `dist/widget/garoo-chat-widget.js`.

### Embedding de producción (cuando esté listo)

```html
<script src="https://tu-cdn.com/garoo-chat-widget.js"></script>
<script>
  GarooChat.init({
    apiUrl: 'https://agentsprod.redtec.ai/webhook/hotels-agent',
    propertyId: 'ITZ',
    title: 'Itzana Resort',
    primaryColor: '#0d9488',
  });
</script>
```

# RedTec Chat — installation on the official sites (Itz'ana & Ka'ana)

Widget version: **v0.3.0**. One snippet per hotel. Both load the same script; only the configuration changes.

## Where to install

Paste the snippet **once in the global site template** (shared footer / layout), just before `</body>`, so the chat appears on **every page** of the site. The conversation follows the guest while they browse: it stays open and keeps its history when they move to another page.

- One snippet per site: Itz'ana site → Itz'ana snippet; Ka'ana site → Ka'ana snippet. Never both on the same site.
- The widget renders inside a Shadow DOM: no CSS conflicts with the site. It adds a floating button at the bottom-right corner.
- Language follows the page's `<html lang>` attribute: English pages show the English interface; `/es/` pages (`lang="es"`) show Spanish. The concierge also answers in whatever language the guest writes.
- The script loads with `defer` and does not block page rendering (~65 KB gzip, served by the jsDelivr CDN).
- No backend or domain registration needed on your side.

## Itz'ana

```html
<!-- RedTec Chat — Itz'ana concierge (v0.3.0) -->
<script src="https://cdn.jsdelivr.net/gh/jcalderon90/widget-chatbot@v0.3.0/release/garoo-chat-widget.js"
        integrity="sha384-xwhvgP6Gt6xOfHjsYM1o3Kki8azVEtpKdN5LtbPRdAVgojREAwdeksHi1zK0NzZN"
        crossorigin="anonymous" defer></script>
<script>
  window.addEventListener('DOMContentLoaded', function () {
    if (!window.GarooChat) return;
    window.GarooChat.init({
      apiUrl: 'https://agentsprod.redtec.ai/webhook/hotels-agent',
      propertyId: 'ITZ',
      title: "Itz'ana Concierge",
      subtitle: { en: 'Online · Replies in seconds', es: 'En línea · Respuesta rápida' },
      greeting: {
        en: "Hi! I'm Kaan, Itz'ana's virtual concierge. How can I help you plan your stay?",
        es: "¡Hola! Soy Kaan, el concierge virtual de Itz'ana. ¿Cómo puedo ayudarte a planear tu estancia?"
      },
      placeholder: { en: 'Type your message...', es: 'Escribe tu mensaje...' },
      primaryColor: '#1e443a'
    });
  });
</script>
```

## Ka'ana

```html
<!-- RedTec Chat — Ka'ana concierge (v0.3.0) -->
<script src="https://cdn.jsdelivr.net/gh/jcalderon90/widget-chatbot@v0.3.0/release/garoo-chat-widget.js"
        integrity="sha384-xwhvgP6Gt6xOfHjsYM1o3Kki8azVEtpKdN5LtbPRdAVgojREAwdeksHi1zK0NzZN"
        crossorigin="anonymous" defer></script>
<script>
  window.addEventListener('DOMContentLoaded', function () {
    if (!window.GarooChat) return;
    window.GarooChat.init({
      apiUrl: 'https://agentsprod.redtec.ai/webhook/hotels-agent',
      propertyId: 'KAA',
      title: "Ka'ana Concierge",
      subtitle: { en: 'Online · Replies in seconds', es: 'En línea · Respuesta rápida' },
      greeting: {
        en: "Hi! I'm Balam, Ka'ana's virtual concierge. How can I help you plan your stay?",
        es: "¡Hola! Soy Balam, el concierge virtual de Ka'ana. ¿Cómo puedo ayudarte a planear tu estancia?"
      },
      placeholder: { en: 'Type your message...', es: 'Escribe tu mensaje...' },
      primaryColor: '#1e443a'
    });
  });
</script>
```

## Optional adjustments

- `primaryColor`: any hex color to match each site's palette (header, button and accents).
- `position: 'bottom-left'` if the bottom-right corner is already used by another element (cookie banner, back-to-top button).
- Do not change `apiUrl` or `propertyId`.

## After installing — quick check

1. Open any page: the round button appears at the bottom-right corner.
2. Open the chat, write a message: the concierge replies in a few seconds.
3. Navigate to another page: the chat keeps the conversation (and stays open if it was open).
4. If the button does not appear: check the browser console for errors and that the snippet is before `</body>`. A Content-Security-Policy on the site must allow `script-src https://cdn.jsdelivr.net` and `connect-src https://agentsprod.redtec.ai`.

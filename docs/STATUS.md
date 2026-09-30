# Estado del proyecto — RedTec Chat Widget

**Última actualización:** 2026-09-30
**Versión del widget:** 0.3.0 (publicada en jsDelivr)

## Resumen

Listo para instalar en los sitios oficiales de Itz'ana (ITZ) y Ka'ana (KAA) vía Milestone. El bundle v0.3.0 está publicado en jsDelivr desde este repo (tag `v0.3.0`) y los snippets finales por hotel están en [`INSTALL-BELIZE.md`](./INSTALL-BELIZE.md), ya enviada al cliente el 2026-09-30. Fase actual: **esperando que Milestone instale**. Hoy el widget sigue corriendo solo en el sitio secundario de Growaton (versión anterior) hasta que Milestone instale.

URL del bundle:

```
https://cdn.jsdelivr.net/gh/jcalderon90/widget-chatbot@v0.3.0/release/garoo-chat-widget.js
```

SRI (`integrity`): `sha384-xwhvgP6Gt6xOfHjsYM1o3Kki8azVEtpKdN5LtbPRdAVgojREAwdeksHi1zK0NzZN`

## Hecho

- ✅ 2026-09-29 — Prueba real contra `https://agentsprod.redtec.ai/webhook/hotels-agent` (`TEST_WIDGET_ITZ_001` / `TEST_WIDGET_KAA_001`): HTTP 200, cada hotel con sus datos, link de reserva prellenado.
- ✅ 2026-09-30 — v0.3.0:
  - Conversación persistente entre páginas (historial en `localStorage`, panel abierto en `sessionStorage`), pedido de Leisure Advisors de tener el chat en todas las páginas acompañando la navegación.
  - Interfaz en inglés/español con `locale: 'auto'` según `<html lang>`; textos de `init()` localizables `{ en, es }`.
  - Sesión e historial separados por `propertyId`; storage bloqueado ya no rompe el widget; timeout de 90 s.
  - Probado en navegador (Playwright) contra producción con `TEST_WIDGET_BROWSER_ITZ_20260930`: textos en inglés, respuesta sin link cuando faltan datos, navegación a otra página conserva conversación y panel abierto, link final prellenado clicable. Sin errores de consola.
- ✅ 2026-09-30 — Guía de instalación (`INSTALL-BELIZE.md`, tag `v0.3.0`) enviada al cliente para trasladar a Milestone.
- ✅ 2026-09-30 — Agente (n8n) en producción: el link de reserva sale una sola vez por conversación y solo cuando ya hay fechas, adultos/niños y habitación; ya no se agrega el sitio web a cada respuesta.
- ⚠️ **Este repo debe seguir público** mientras jsDelivr sirva el bundle desde aquí, y **ningún tag publicado se mueve ni se borra**: los sitios instalados cargan `@v0.3.0`. Versiones nuevas = tag nuevo.
- ✅ CORS: el nodo Webhook de n8n tiene `allowedOrigins: "*"`, no hay que registrar los dominios de Milestone.
- ✅ `utm_source=kaan-chat` en ITZ es el diseño documentado en Agent-Belize (no es un bug).

## Pendientes

| Estado | Tarea | Notas |
|--------|-------|-------|
| 🟡 | Milestone instala los snippets en el template global de cada sitio | Guía enviada al cliente el 2026-09-30; esperando a que la traslade a Milestone y confirme la instalación. Snippets en [`INSTALL-BELIZE.md`](./INSTALL-BELIZE.md). |
| ⬜ | Probar desde los dominios reales de Milestone tras instalar | Carga del script, conversación, navegación entre páginas, link al motor. |
| ⬜ | Probar una reserva hasta el booking engine | El link abre el motor con fechas y huéspedes; no se ha completado una reserva. |
| ⬜ | Decidir si el link debe distinguir el canal widget | Los links traen `utm_medium=manychat` aunque el canal sea `widget` (workflow en n8n). |
| ⬜ | Sitio secundario de Growaton | Sigue con la versión anterior; actualizar su snippet al de `INSTALL-BELIZE.md` si se mantiene activo. |
| ⬜ | RoomTypeID de ITZ para el deep link por habitación | Lado agente (n8n); lo tiene IT del hotel. |

## Notas para pruebas

- Sesión: `localStorage` clave `gsid_garoo_<propertyId>` (ej. `gsid_garoo_ITZ`), enviada como `body.id`.
- Para pruebas usar ids con prefijo `TEST_`: `localStorage.setItem('gsid_garoo_ITZ', 'TEST_...')` antes de cargar la página (o llamar al webhook directo).
- Para reiniciar la conversación visible: borrar `gmsg_garoo_<propertyId>` de `localStorage`.

# Estado del proyecto — RedTec Chat Widget

**Última actualización:** 2026-09-29
**Versión del widget:** 0.2.0

## Resumen

El widget funciona hoy solo en el sitio secundario de Growaton. El cliente (Leisure Advisors / Milestone) quiere instalarlo en los sitios oficiales de Itz'ana (ITZ) y Ka'ana (KAA), con reserva completa en el booking engine. Esta sesión dejó listos los snippets de embed y validó el agente en producción para ambos hoteles. Falta hostear el bundle y definir los dominios de Milestone.

## Hecho en esta sesión

- ✅ Snippets de embed para ITZ y KAA entregados a la sesión "belize" (script `GarooChat.init()`, no iframe; `propertyId` = `ITZ` / `KAA`).
- ✅ Prueba real contra `https://agentsprod.redtec.ai/webhook/hotels-agent` con ids `TEST_WIDGET_ITZ_001` y `TEST_WIDGET_KAA_001`, en inglés, 2 turnos por hotel:
  - HTTP 200 en los 4 turnos, sin errores ni respuestas vacías.
  - Cada hotel responde con sus propios datos (KAA no mezcla datos de ITZ).
  - Ambos entregan link de reserva con fechas y adultos prellenados (ITZ: HotelID=115719; KAA: HotelID=115718).
- ✅ Aclarado: `aEvHbFXnmwofChqs` es el id de la credencial ManyChat en `PRINCIPAL.json`, no un webhook key. El workflow no valida `key`, así que `webhookKey` va vacío.

## Pendientes

| Estado | Tarea | Notas |
|--------|-------|-------|
| ⬜ | Decidir dónde hostear `garoo-chat-widget.js` | El repo no tiene deploy y `dist/` está en `.gitignore`. Recomendado: dominio de RedTec, archivo versionado (`garoo-chat-widget.v0.2.0.js`). Build: `npm run build:widget`. |
| ⬜ | Obtener los dominios de Milestone | Los pide "belize" al cliente. |
| ⬜ | Agregar esos dominios al CORS del webhook | El widget no restringe orígenes; la restricción vive en el nodo Webhook de n8n o en el proxy de `agentsprod.redtec.ai`. No verificado desde este repo. |
| ⬜ | Corregir `utm_source=kaan-chat` en el link de ITZ | Parece copiado de KAA (el de KAA usa `balam-chat`). Ensucia la atribución de ITZ. Es del workflow en n8n. |
| ⬜ | Decidir si el link debe distinguir el canal widget | Ambos links traen `utm_medium=manychat` aunque el canal es `widget`. |
| ⬜ | Textos en inglés del widget | `locale` no se usa en el código. El mensaje de error (`useChat.ts`) y los aria-labels siguen en español fijo. Por ahora se pasan `greeting`, `placeholder`, `subtitle` y `title` por `init()`. |
| ⬜ | Probar reserva completa hasta el booking engine | Solo se probó hasta la entrega del link; no se abrieron los links ni se completó una reserva. |
| ⬜ | Probar desde un dominio real de Milestone tras instalar | Comprobar CORS, carga del script y `session_id` (se guarda por origen en `localStorage`, clave `gsid_garoo`). |

## Notas para pruebas

- El widget no permite fijar `session_id`: usa un UUID en `localStorage` (`gsid_garoo`), enviado como `body.id`.
- Para pruebas usar ids con prefijo `TEST_` (asignar `localStorage.setItem('gsid_garoo', 'TEST_...')` antes de abrir el chat, o llamar al webhook directo).
- Las conversaciones `TEST_WIDGET_ITZ_001` y `TEST_WIDGET_KAA_001` ya tienen historial; para repetir usar ids `_002`.

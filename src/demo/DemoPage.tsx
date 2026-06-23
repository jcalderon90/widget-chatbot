import { useEffect } from 'react'
import { mountWidget } from '../widget/mount'
import type { GarooChatInstance } from '../widget/types'

export function DemoPage() {
  useEffect(() => {
    let widget: GarooChatInstance | null = null

    const timer = setTimeout(() => {
      widget = mountWidget({
        apiUrl: import.meta.env.VITE_WEBHOOK_URL as string,
        propertyId: 'ITZ',
        pageId: 'widget',
        title: 'Garoo Assistant',
        subtitle: 'En línea · Respuesta rápida',
        primaryColor: '#0d9488',
        position: 'bottom-right',
        greeting: '¡Hola! 👋 Soy el asistente de Garoo. ¿En qué puedo ayudarte?',
        placeholder: 'Escribe tu mensaje...',
      })
    }, 400)

    return () => {
      clearTimeout(timer)
      widget?.destroy()
    }
  }, [])

  return (
    <div className="demo">
      <header className="demo__hero">
        <span className="demo__badge">Widget embebible</span>
        <h1>Garoo Chat Widget</h1>
        <p>
          Interfaz de chat lista para integrar en cualquier sitio web. Haz clic en el botón
          flotante de la esquina inferior derecha para probarlo.
        </p>
      </header>

      <section className="demo__section">
        <h2>Integración rápida</h2>
        <p>Agrega este script a tu página web:</p>
        <pre className="demo__code">
          {`<script src="https://tu-dominio.com/garoo-chat-widget.js"></script>
<script>
  GarooChat.init({
    title: 'Soporte',
    primaryColor: '#0d9488',
    apiUrl: 'https://tu-api.com/chat'
  });
</script>`}
        </pre>
      </section>

      <section className="demo__section">
        <h2>Opciones de configuración</h2>
        <ul className="demo__list">
          <li><code>title</code> — Título del chat</li>
          <li><code>subtitle</code> — Subtítulo del header</li>
          <li><code>primaryColor</code> — Color principal del widget</li>
          <li><code>position</code> — <code>bottom-right</code> o <code>bottom-left</code></li>
          <li><code>greeting</code> — Mensaje de bienvenida</li>
          <li><code>placeholder</code> — Placeholder del input</li>
          <li><code>apiUrl</code> — Endpoint POST para respuestas del bot</li>
        </ul>
      </section>

      <section className="demo__section">
        <h2>API del widget</h2>
        <pre className="demo__code">
          {`const chat = GarooChat.init({ ... });

chat.open();
chat.close();
chat.toggle();
chat.sendMessage('Hola');
chat.destroy();`}
        </pre>
      </section>
    </div>
  )
}

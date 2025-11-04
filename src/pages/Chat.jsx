import { Card } from '../components/ui/Card.jsx';
import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore.js';

export default function Chat() {
  const messages = useChatStore((s) => s.messages);
  const subscribe = useChatStore((s) => s.subscribe);
  useEffect(() => {
    const unsub = subscribe();
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [subscribe]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card hover={false} className="md:col-span-1">
        <h3 className="font-display text-xl text-gold-500 mb-4">Conversas</h3>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-black/30 border border-crimson-600/30">Contato #{i+1}</div>
          ))}
        </div>
      </Card>
      <Card hover={false} className="md:col-span-2">
        <div className="h-80 rounded-lg bg-luxury-gray/20 mb-4 p-3 overflow-auto">
          {messages.map((m, idx) => (
            <div key={idx} className="mb-2 text-sm text-gray-300">{m.content || '[mensagem]'}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 px-4 py-3 rounded-lg bg-luxury-black/30 border border-crimson-600/30" placeholder="Mensagem..." />
          <button className="px-4 py-3 rounded-lg bg-gradient-primary text-white">Enviar</button>
        </div>
      </Card>
    </div>
  );
}



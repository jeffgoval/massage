import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { Star } from 'lucide-react';

export function ProfileCard({ profile }) {
  const photos = profile?.photos || [];
  return (
    <Card>
      <div className="h-32 bg-gradient-primary rounded-t-luxury -m-6 mb-0 relative">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-gold-500 bg-gradient-dark shadow-gold overflow-hidden" />
        </div>
      </div>
      <div className="pt-16 px-6 pb-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-display font-light text-luxury-light tracking-wide">
            {profile?.name || 'Nome'}
          </h3>
          {profile?.vip && (
            <Badge variant="vip" icon="⭐">
              VIP
            </Badge>
          )}
        </div>
        <p className="text-gold-500 italic font-display mb-4">
          "{profile?.tagline || 'Tagline elegante'}"
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-gold-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4" />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {profile?.rating || '5.0'} · {profile?.reviews || 0} avaliações
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {photos.slice(0, 3).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-luxury-gray/30" />
          ))}
          <div className="aspect-square rounded-lg bg-luxury-charcoal flex items-center justify-center text-gold-500">
            +{Math.max(0, photos.length - 3)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
            {profile?.age || 25} anos
          </span>
          <span className="px-3 py-1 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
            {profile?.height || '1,68m'} · {profile?.weight || '58kg'}
          </span>
          <span className="px-3 py-1 rounded-full bg-crimson-600/20 text-luxury-light text-xs border border-crimson-600/30">
            {profile?.ethnicity || 'Morena'}
          </span>
        </div>
        <div className="text-center mb-4 p-4 bg-gold-500/5 rounded-lg border border-gold-500/20">
          <div className="text-3xl font-light text-gold-500">R$ {profile?.price || 500}</div>
          <div className="text-sm text-gray-400">por hora</div>
        </div>
        <Button className="w-full">Agendar Sessão Privada</Button>
      </div>
    </Card>
  );
}

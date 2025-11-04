# 🎨 DESIGN SYSTEM - ESPECIFICAÇÕES TÉCNICAS
## Guia Completo para Implementação no VSCode

---

## 📐 GRID & LAYOUT SYSTEM

### Breakpoints (Mobile First)
```javascript
const breakpoints = {
  xs: '320px',   // Smartphones pequenos
  sm: '640px',   // Smartphones grandes
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Desktops grandes
}
```

### Container Widths
```css
.container {
  max-width: 100%;
  padding-left: 1rem;  /* 16px */
  padding-right: 1rem; /* 16px */
}

@media (min-width: 640px) {
  .container { max-width: 640px; padding: 0 1.5rem; }
}
@media (min-width: 768px) {
  .container { max-width: 768px; }
}
@media (min-width: 1024px) {
  .container { max-width: 1024px; padding: 0 2rem; }
}
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

### Grid System
```jsx
// 12-column grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Cards aqui */}
</div>

// Exemplos de uso:
// Mobile: 1 coluna (padrão)
// Tablet: 2 colunas
// Desktop: 3-4 colunas
```

---

## 🎨 COLOR PALETTE (Completo)

### Definição no Tailwind Config
```javascript
// tailwind.config.js
colors: {
  // Cores Premium Principais
  crimson: {
    50:  '#ffe5e5',
    100: '#ffcccc',
    200: '#ff9999',
    300: '#ff6666',
    400: '#ff3333',
    500: '#dc143c',  // Base
    600: '#8b0000',  // Primary dark
    700: '#6b0000',
    800: '#4a0e0e',
    900: '#330a0a',
  },
  
  // Dourado Luxo
  gold: {
    50:  '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#f4e5b8',
    500: '#d4af37',  // Base
    600: '#b8860b',  // Dark gold
    700: '#946e09',
    800: '#785a07',
    900: '#614805',
  },
  
  // Escalas de Cinza/Preto
  luxury: {
    black:    '#000000',
    charcoal: '#1a1a1a',
    gray:     '#2d2d2d',
    medium:   '#4a4a4a',
    light:    '#f4f4f4',
    pearl:    '#fafafa',
  },
  
  // Cores de Estado
  success: {
    light: '#4caf50',
    base:  '#2e7d32',
    dark:  '#1b5e20',
  },
  danger: {
    light: '#f56565',
    base:  '#e53e3e',
    dark:  '#c53030',
  },
  warning: {
    light: '#fbbf24',
    base:  '#f59e0b',
    dark:  '#d97706',
  },
  info: {
    light: '#60a5fa',
    base:  '#3b82f6',
    dark:  '#1e40af',
  }
}
```

### Uso em Componentes
```jsx
// Backgrounds
className="bg-luxury-black"           // Preto puro
className="bg-luxury-charcoal"        // Cinza escuro #1a1a1a
className="bg-crimson-600"            // Vermelho escuro
className="bg-gold-500"               // Dourado

// Gradientes
className="bg-gradient-to-br from-crimson-600 to-crimson-500"
className="bg-gradient-to-r from-gold-500 to-gold-400"
className="bg-gradient-to-b from-luxury-charcoal to-luxury-black"

// Texto
className="text-luxury-light"        // Branco suave
className="text-gold-500"            // Dourado
className="text-crimson-500"         // Vermelho

// Bordas
className="border-crimson-600/30"    // Vermelho com 30% opacidade
className="border-gold-500"          // Dourado sólido
```

---

## 📝 TYPOGRAPHY SYSTEM

### Font Loading (Google Fonts)
```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Font Family Configuration
```javascript
// tailwind.config.js
fontFamily: {
  display: ['Playfair Display', 'Georgia', 'serif'],
  body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
}
```

### Typography Scale
```javascript
fontSize: {
  xs:   ['0.75rem',   { lineHeight: '1rem' }],     // 12px
  sm:   ['0.875rem',  { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem',      { lineHeight: '1.5rem' }],   // 16px
  lg:   ['1.125rem',  { lineHeight: '1.75rem' }],  // 18px
  xl:   ['1.25rem',   { lineHeight: '1.75rem' }],  // 20px
  '2xl': ['1.5rem',   { lineHeight: '2rem' }],     // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
  '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem',     { lineHeight: '1' }],        // 48px
  '6xl': ['3.75rem',  { lineHeight: '1' }],        // 60px
}
```

### Typography Classes (Uso Prático)
```jsx
// Display - Títulos Principais
<h1 className="font-display text-5xl font-light tracking-wider text-luxury-light">
  Experiências Exclusivas
</h1>

// H1 - Títulos de Página
<h2 className="font-display text-4xl font-light tracking-wide text-luxury-light">
  Profissionais VIP
</h2>

// H2 - Títulos de Seção
<h3 className="font-display text-2xl font-normal text-gold-500">
  Categorias Premium
</h3>

// H3 - Subtítulos
<h4 className="font-body text-lg font-semibold text-luxury-light">
  Disponíveis Agora
</h4>

// Body Text
<p className="font-body text-base text-luxury-light leading-relaxed">
  Conteúdo aqui
</p>

// Taglines (Itálico)
<p className="font-display text-lg italic text-gold-500 tracking-wide">
  "O prazer é uma arte refinada"
</p>

// Small Text
<span className="font-body text-sm text-gray-400">
  Informações secundárias
</span>

// Caption
<span className="font-body text-xs text-gray-500 uppercase tracking-widest">
  Legendas
</span>
```

### Font Weights
```jsx
font-light     // 300
font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
```

### Letter Spacing
```jsx
tracking-tighter   // -0.05em
tracking-tight     // -0.025em
tracking-normal    // 0
tracking-wide      // 0.025em
tracking-wider     // 0.05em
tracking-widest    // 0.1em
```

---

## 🔲 SPACING SYSTEM

### Scale (múltiplos de 4px)
```javascript
spacing: {
  0:    '0px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  10:   '40px',
  12:   '48px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  32:   '128px',
  40:   '160px',
}
```

### Uso Prático
```jsx
// Padding
className="p-4"      // 16px em todos os lados
className="px-6"     // 24px horizontal
className="py-8"     // 32px vertical
className="pt-12"    // 48px top
className="pb-6"     // 24px bottom

// Margin
className="m-4"      // 16px em todos os lados
className="mx-auto"  // Centralizar horizontal
className="my-8"     // 32px vertical
className="mt-16"    // 64px top
className="mb-12"    // 48px bottom

// Gap (em flex/grid)
className="gap-4"    // 16px entre items
className="gap-x-6"  // 24px horizontal
className="gap-y-8"  // 32px vertical

// Space Between
className="space-y-4"  // 16px vertical entre children
className="space-x-6"  // 24px horizontal entre children
```

---

## 🎯 BORDER RADIUS

### Scale
```javascript
borderRadius: {
  none: '0',
  sm:   '0.125rem',  // 2px
  base: '0.25rem',   // 4px
  md:   '0.375rem',  // 6px
  lg:   '0.5rem',    // 8px
  xl:   '0.75rem',   // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  luxury: '16px',    // Padrão do design
  full: '9999px',    // Círculo/pill
}
```

### Uso
```jsx
className="rounded-lg"      // 8px (cards pequenos)
className="rounded-luxury"  // 16px (cards principais)
className="rounded-full"    // Circular (avatares, badges)
className="rounded-t-lg"    // Apenas top
className="rounded-b-lg"    // Apenas bottom
```

---

## 🌈 SHADOWS & EFFECTS

### Shadow Scale
```javascript
boxShadow: {
  sm:       '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base:     '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md:       '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg:       '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl:       '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl':    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Custom Premium Shadows
  luxury:   '0 8px 32px rgba(0, 0, 0, 0.4)',
  gold:     '0 4px 15px rgba(212, 175, 55, 0.4)',
  crimson:  '0 4px 15px rgba(139, 0, 0, 0.4)',
  glow:     '0 0 20px rgba(212, 175, 55, 0.3)',
}
```

### Uso
```jsx
className="shadow-luxury"   // Sombra padrão escura
className="shadow-gold"     // Sombra dourada
className="shadow-crimson"  // Sombra vermelha
className="hover:shadow-2xl transition-shadow"  // Efeito hover
```

### Backdrop Blur (Glass Effect)
```jsx
className="backdrop-blur-sm"   // Leve
className="backdrop-blur-md"   // Médio
className="backdrop-blur-lg"   // Forte

// Exemplo completo glass morphism:
className="bg-white/10 backdrop-blur-md border border-white/20"
```

---

## 🔘 BUTTON SYSTEM

### Variantes Completas
```jsx
// Primary Button (Vermelho)
<button className="
  px-8 py-4 rounded-full
  bg-gradient-to-r from-crimson-600 to-crimson-500
  text-white font-display text-base tracking-wide
  shadow-crimson hover:shadow-xl
  transform hover:scale-102 hover:-translate-y-1
  transition-all duration-300
  active:scale-98
">
  Agendar Sessão
</button>

// Gold/Luxury Button
<button className="
  px-8 py-4 rounded-full
  bg-gradient-to-r from-gold-500 to-gold-400
  text-black font-display text-base tracking-wide
  shadow-gold hover:shadow-xl
  transform hover:scale-102 hover:-translate-y-1
  transition-all duration-300
">
  Acesso VIP
</button>

// Outline Button
<button className="
  px-8 py-4 rounded-full
  bg-transparent border-2 border-gold-500
  text-gold-500 font-display text-base tracking-wide
  hover:bg-gold-500 hover:text-black
  transition-all duration-300
">
  Ver Galeria
</button>

// Ghost Button (Glass)
<button className="
  px-8 py-4 rounded-full
  bg-white/5 backdrop-blur-sm
  border border-white/20
  text-luxury-light font-display text-base
  hover:bg-white/10 hover:border-white/40
  transition-all duration-300
">
  Contato Discreto
</button>

// Icon Button
<button className="
  w-12 h-12 rounded-full
  bg-black/30 backdrop-blur-sm
  flex items-center justify-center
  hover:bg-black/50
  transition-all duration-300
">
  <HeartIcon className="w-5 h-5 text-white" />
</button>

// Button Sizes
// Small
className="px-4 py-2 text-sm"
// Medium (default)
className="px-8 py-4 text-base"
// Large
className="px-10 py-5 text-lg"
// Full width
className="w-full px-8 py-4"
```

---

## 🃏 CARD SYSTEM

### Base Card
```jsx
<div className="
  bg-gradient-to-br from-luxury-charcoal to-luxury-black
  rounded-luxury p-6
  shadow-luxury border border-crimson-600/30
  hover:shadow-crimson hover:border-crimson-600/60
  hover:-translate-y-2
  transition-all duration-300
">
  {/* Content */}
</div>
```

### Profile Card (Completo)
```jsx
<div className="bg-gradient-to-br from-luxury-charcoal to-luxury-black 
                rounded-luxury overflow-hidden shadow-luxury 
                border border-crimson-600/30
                hover:-translate-y-2 hover:shadow-crimson 
                hover:border-crimson-600/60
                transition-all duration-300">
  
  {/* Header com Gradient */}
  <div className="h-32 bg-gradient-to-r from-crimson-600 to-crimson-500 
                  relative">
    {/* Avatar */}
    <div className="absolute -bottom-12 left-6">
      <div className="w-24 h-24 rounded-full border-4 border-gold-500 
                    shadow-gold overflow-hidden bg-luxury-gray
                    hover:scale-105 transition-transform">
        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
    
    {/* Favorite Button */}
    <button className="absolute top-4 right-4 w-10 h-10 rounded-full 
                     bg-black/30 backdrop-blur-sm hover:bg-black/50
                     flex items-center justify-center
                     transition-all">
      <HeartIcon className="w-5 h-5 text-white" />
    </button>
  </div>
  
  {/* Body */}
  <div className="pt-16 px-6 pb-6">
    {/* Nome e Badge */}
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-2xl font-display font-light text-luxury-light 
                   tracking-wide">
        Isabella
      </h3>
      <span className="inline-flex items-center gap-2 px-3 py-1.5 
                     rounded-full bg-gradient-to-r from-gold-500 to-gold-400 
                     text-black text-xs font-semibold shadow-gold">
        ⭐ VIP
      </span>
    </div>
    
    {/* Tagline */}
    <p className="text-gold-500 italic font-display text-base mb-4">
      "O prazer é uma arte que domino"
    </p>
    
    {/* Rating */}
    <div className="flex items-center gap-2 mb-4">
      <div className="flex text-gold-500">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <span className="text-sm text-gray-400">
        5.0 · 89 avaliações
      </span>
    </div>
    
    {/* Gallery Preview */}
    <div className="grid grid-cols-4 gap-2 mb-4">
      {photos.slice(0, 3).map((photo, i) => (
        <div key={i} className="aspect-square rounded-lg overflow-hidden
                              cursor-pointer hover:opacity-80 transition">
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="aspect-square rounded-lg bg-luxury-gray 
                    flex items-center justify-center text-gold-500 
                    cursor-pointer hover:bg-luxury-medium transition">
        <span className="text-sm font-semibold">+6</span>
      </div>
    </div>
    
    {/* Info Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="px-3 py-1 rounded-full bg-crimson-600/20 
                     text-luxury-light text-xs border border-crimson-600/30">
        25 anos
      </span>
      <span className="px-3 py-1 rounded-full bg-crimson-600/20 
                     text-luxury-light text-xs border border-crimson-600/30">
        1,68m · 58kg
      </span>
      <span className="px-3 py-1 rounded-full bg-crimson-600/20 
                     text-luxury-light text-xs border border-crimson-600/30">
        Morena
      </span>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-4 mb-4 p-4 
                  bg-black/30 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-light text-gold-500">100%</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Satisfação
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-light text-gold-500">2h</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Tempo médio
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-light text-gold-500">VIP</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Categoria
        </div>
      </div>
    </div>
    
    {/* Preço */}
    <div className="text-center mb-4 p-4 bg-gold-500/5 rounded-lg 
                  border border-gold-500/20">
      <div className="text-3xl font-light text-gold-500">R$ 500</div>
      <div className="text-sm text-gray-400">por hora</div>
    </div>
    
    {/* Status Badges */}
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="inline-flex items-center gap-1 px-3 py-1.5 
                     rounded-full bg-gradient-to-r from-crimson-600 to-crimson-500 
                     text-white text-xs font-semibold">
        🔥 Mais Procurada
      </span>
      <span className="inline-flex items-center gap-1 px-3 py-1.5 
                     rounded-full bg-green-500/20 text-green-400 
                     border border-green-500 text-xs font-semibold">
        ✓ Disponível
      </span>
    </div>
    
    {/* CTA Button */}
    <button className="w-full px-8 py-4 rounded-full
                     bg-gradient-to-r from-crimson-600 to-crimson-500
                     text-white font-display text-base tracking-wide
                     shadow-crimson hover:shadow-xl
                     transform hover:scale-102 hover:-translate-y-1
                     transition-all duration-300">
      Agendar Sessão Privada
    </button>
  </div>
</div>
```

---

## 📝 FORM ELEMENTS

### Input Field
```jsx
<div className="mb-6">
  <label className="block mb-2 text-luxury-light font-body text-sm 
                  font-medium">
    Nome Completo
  </label>
  <input
    type="text"
    placeholder="Digite seu nome"
    className="w-full px-4 py-3 rounded-lg
             bg-luxury-black/30 border border-crimson-600/30
             text-luxury-light font-body
             placeholder:text-gray-500
             focus:outline-none focus:border-gold-500
             focus:ring-2 focus:ring-gold-500/20
             transition-all duration-300"
  />
  {/* Error state */}
  <p className="mt-1 text-sm text-crimson-500">
    Este campo é obrigatório
  </p>
</div>
```

### Select Field
```jsx
<select className="w-full px-4 py-3 rounded-lg
                 bg-luxury-black/30 border border-crimson-600/30
                 text-luxury-light font-body
                 focus:outline-none focus:border-gold-500
                 focus:ring-2 focus:ring-gold-500/20
                 cursor-pointer
                 transition-all duration-300">
  <option value="">Selecione uma opção</option>
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</select>
```

### Textarea
```jsx
<textarea
  rows={4}
  placeholder="Descreva suas preferências..."
  className="w-full px-4 py-3 rounded-lg
           bg-luxury-black/30 border border-crimson-600/30
           text-luxury-light font-body
           placeholder:text-gray-500
           focus:outline-none focus:border-gold-500
           focus:ring-2 focus:ring-gold-500/20
           resize-none
           transition-all duration-300"
/>
```

### Checkbox
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="w-5 h-5 rounded border-2 border-gold-500
             text-gold-500 focus:ring-2 focus:ring-gold-500/20
             bg-luxury-black/30"
  />
  <span className="text-luxury-light font-body text-sm">
    Aceito os termos e condições
  </span>
</label>
```

### Radio Button
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="radio"
    name="option"
    className="w-5 h-5 border-2 border-gold-500
             text-gold-500 focus:ring-2 focus:ring-gold-500/20
             bg-luxury-black/30"
  />
  <span className="text-luxury-light font-body text-sm">
    Opção 1
  </span>
</label>
```

---

## 🏷️ BADGES & TAGS

### Badge Variants
```jsx
// VIP Badge
<span className="inline-flex items-center gap-2 px-3 py-1.5 
               rounded-full bg-gradient-to-r from-gold-500 to-gold-400 
               text-black text-xs font-semibold shadow-gold">
  ⭐ VIP
</span>

// Exclusive Badge
<span className="inline-flex items-center gap-2 px-3 py-1.5 
               rounded-full bg-gradient-to-r from-crimson-600 to-crimson-500 
               text-white text-xs font-semibold shadow-crimson">
  🔥 Exclusivo
</span>

// Verified Badge
<span className="inline-flex items-center gap-2 px-3 py-1.5 
               rounded-full bg-white/10 border border-gold-500 
               text-gold-500 text-xs font-semibold">
  ✓ Verificada
</span>

// Available Badge
<span className="inline-flex items-center gap-2 px-3 py-1.5 
               rounded-full bg-green-500/20 border border-green-500 
               text-green-400 text-xs font-semibold">
  • Disponível Agora
</span>
```

### Info Tags
```jsx
<span className="px-3 py-1 rounded-full 
               bg-crimson-600/20 border border-crimson-600/30 
               text-luxury-light text-xs">
  📍 São Paulo - Centro
</span>
```

---

## ⚡ ANIMATIONS & TRANSITIONS

### Framer Motion Variants
```jsx
// Card hover animation
const cardVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Button animation
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98 }
};

// Fade in animation
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Stagger children
const container = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### CSS Transitions
```css
/* Transitions suaves padrão */
.transition-smooth {
  transition: all 0.3s ease;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Loading skeleton */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  animation: shimmer 2s infinite;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 0%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 100%
  );
  background-size: 1000px 100%;
}
```

---

## 📱 MOBILE OPTIMIZATIONS

### Touch Targets
```jsx
// Mínimo 44x44px para touch
className="min-w-[44px] min-h-[44px]"

// Aumentar área de toque
className="p-4"  // Adiciona padding interno
```

### Mobile Navigation
```jsx
// Bottom navigation bar
<nav className="fixed bottom-0 left-0 right-0 
              bg-luxury-charcoal/95 backdrop-blur-lg
              border-t border-crimson-600/30
              safe-area-inset-bottom">
  <div className="flex justify-around items-center h-16">
    {/* Nav items */}
  </div>
</nav>
```

### Responsive Utilities
```jsx
// Esconder em mobile
className="hidden md:block"

// Mostrar apenas em mobile
className="block md:hidden"

// Ajustar tamanho
className="text-sm md:text-base lg:text-lg"

// Ajustar padding
className="p-4 md:p-6 lg:p-8"

// Grid responsivo
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
```

---

## 🎭 LOADING STATES

### Skeleton Loader
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-48 bg-luxury-gray/30 rounded-luxury"></div>
  <div className="h-4 bg-luxury-gray/30 rounded w-3/4"></div>
  <div className="h-4 bg-luxury-gray/30 rounded w-1/2"></div>
</div>
```

### Spinner
```jsx
<div className="w-8 h-8 border-4 border-gold-500/30 
              border-t-gold-500 rounded-full 
              animate-spin">
</div>
```

---

## ♿ ACCESSIBILITY

### Focus States
```jsx
className="focus:outline-none focus:ring-2 focus:ring-gold-500 
         focus:ring-offset-2 focus:ring-offset-luxury-black"
```

### Screen Reader Only
```jsx
<span className="sr-only">Descrição para leitores de tela</span>
```

### ARIA Labels
```jsx
<button aria-label="Adicionar aos favoritos">
  <HeartIcon />
</button>
```

---

**Arquivo criado para referência rápida durante o desenvolvimento** ✨
**Use com: VSCode + Tailwind CSS IntelliSense Extension** 🚀

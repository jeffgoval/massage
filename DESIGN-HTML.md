<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design System Premium - Massagens Sensuais</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Playfair Display', 'Georgia', serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #0a0a0a;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .header {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #8b0000 100%);
            color: #f4f4f4;
            padding: 80px 20px;
            text-align: center;
            margin-bottom: 60px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 Q300,60 600,30 T1200,50 L1200,120 L0,120 Z" fill="rgba(139,0,0,0.1)"/></svg>') repeat-x bottom;
            opacity: 0.3;
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 15px;
            font-weight: 300;
            letter-spacing: 3px;
            position: relative;
            z-index: 1;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            font-style: italic;
            font-family: 'Georgia', serif;
            position: relative;
            z-index: 1;
        }

        .section {
            background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
            border-radius: 16px;
            padding: 50px;
            margin-bottom: 40px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(139, 0, 0, 0.2);
        }

        .section-title {
            font-size: 2.2rem;
            margin-bottom: 35px;
            color: #f4f4f4;
            border-bottom: 2px solid #8b0000;
            padding-bottom: 15px;
            font-weight: 300;
            letter-spacing: 2px;
        }

        .subsection-title {
            font-size: 1.5rem;
            margin: 35px 0 25px;
            color: #d4af37;
            font-weight: 400;
        }

        /* Paleta de Cores Premium */
        .color-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
            margin-top: 25px;
        }

        .color-card {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .color-swatch {
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 300;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            font-size: 1.1rem;
            letter-spacing: 1px;
        }

        .color-info {
            padding: 18px;
            background: #1a1a1a;
        }

        .color-name {
            font-weight: 400;
            margin-bottom: 8px;
            color: #f4f4f4;
            font-size: 0.95rem;
        }

        .color-value {
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            color: #888;
        }

        /* Tipografia Premium */
        .type-example {
            margin: 25px 0;
            padding: 30px;
            background: rgba(139, 0, 0, 0.05);
            border-radius: 12px;
            border-left: 3px solid #8b0000;
        }

        .type-label {
            font-size: 0.8rem;
            color: #d4af37;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            font-family: 'Arial', sans-serif;
        }

        /* Botões Premium */
        .button-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-top: 25px;
        }

        .btn {
            padding: 16px 32px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 400;
            cursor: pointer;
            transition: all 0.4s ease;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            letter-spacing: 1px;
            font-family: 'Georgia', serif;
        }

        .btn-primary {
            background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(139, 0, 0, 0.4);
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #a00000 0%, #ff1744 100%);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(139, 0, 0, 0.6);
        }

        .btn-secondary {
            background: transparent;
            color: #d4af37;
            border: 2px solid #d4af37;
        }

        .btn-secondary:hover {
            background: #d4af37;
            color: #000;
            transform: translateY(-3px);
        }

        .btn-luxury {
            background: linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%);
            color: #000;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        .btn-luxury:hover {
            background: linear-gradient(135deg, #e5c048 0%, #fff5cc 100%);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
        }

        .btn-discreet {
            background: rgba(255, 255, 255, 0.05);
            color: #f4f4f4;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }

        .btn-discreet:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.4);
        }

        /* Cards de Perfil Premium */
        .profile-card {
            background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            transition: all 0.4s ease;
            margin-bottom: 30px;
            border: 1px solid rgba(139, 0, 0, 0.3);
        }

        .profile-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 48px rgba(139, 0, 0, 0.4);
            border-color: rgba(139, 0, 0, 0.6);
        }

        .profile-header {
            background: linear-gradient(135deg, #000000 0%, #8b0000 100%);
            height: 150px;
            position: relative;
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border: 4px solid #d4af37;
            position: absolute;
            bottom: -60px;
            left: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        .profile-body {
            padding: 75px 30px 30px;
        }

        .profile-name {
            font-size: 1.8rem;
            font-weight: 300;
            color: #f4f4f4;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }

        .profile-tagline {
            color: #d4af37;
            margin-bottom: 20px;
            font-style: italic;
            font-size: 1.05rem;
        }

        .profile-rating {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
        }

        .stars {
            color: #d4af37;
            font-size: 1.2rem;
        }

        .rating-text {
            color: #888;
            font-size: 0.95rem;
        }

        .profile-info {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        .info-tag {
            background: rgba(139, 0, 0, 0.2);
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.85rem;
            color: #f4f4f4;
            border: 1px solid rgba(139, 0, 0, 0.3);
        }

        .profile-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: 300;
            color: #d4af37;
            display: block;
        }

        .stat-label {
            font-size: 0.8rem;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .profile-price {
            font-size: 1.8rem;
            font-weight: 300;
            color: #d4af37;
            margin-bottom: 20px;
            text-align: center;
            padding: 15px;
            background: rgba(212, 175, 55, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .vip-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%);
            color: #000;
            padding: 6px 14px;
            border-radius: 25px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
        }

        /* Formulários Premium */
        .form-group {
            margin-bottom: 25px;
        }

        .form-label {
            display: block;
            margin-bottom: 10px;
            font-weight: 400;
            color: #f4f4f4;
            font-size: 0.95rem;
        }

        .form-input {
            width: 100%;
            padding: 14px 18px;
            border: 1px solid rgba(139, 0, 0, 0.3);
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: rgba(0, 0, 0, 0.3);
            color: #f4f4f4;
            font-family: 'Georgia', serif;
        }

        .form-input::placeholder {
            color: #666;
        }

        .form-input:focus {
            outline: none;
            border-color: #d4af37;
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
            background: rgba(0, 0, 0, 0.5);
        }

        .form-select {
            width: 100%;
            padding: 14px 18px;
            border: 1px solid rgba(139, 0, 0, 0.3);
            border-radius: 8px;
            font-size: 1rem;
            background: rgba(0, 0, 0, 0.3);
            color: #f4f4f4;
            cursor: pointer;
            font-family: 'Georgia', serif;
        }

        /* Filtros Premium */
        .filter-container {
            background: rgba(0, 0, 0, 0.4);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 25px;
            border: 1px solid rgba(139, 0, 0, 0.2);
        }

        .filter-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
        }

        /* Badges Premium */
        .badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .badge-exclusive {
            background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(139, 0, 0, 0.4);
        }

        .badge-vip {
            background: linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%);
            color: #000;
            box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
        }

        .badge-verified {
            background: rgba(255, 255, 255, 0.1);
            color: #d4af37;
            border: 1px solid #d4af37;
        }

        .badge-available {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
            border: 1px solid #4caf50;
        }

        /* Sistema de Grid */
        .grid-example {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 20px;
            margin-top: 20px;
        }

        .grid-item {
            background: rgba(139, 0, 0, 0.1);
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            font-weight: 400;
            color: #f4f4f4;
            border: 1px solid rgba(139, 0, 0, 0.2);
        }

        .col-3 { grid-column: span 3; }
        .col-4 { grid-column: span 4; }
        .col-6 { grid-column: span 6; }
        .col-8 { grid-column: span 8; }
        .col-12 { grid-column: span 12; }

        /* Ícones */
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 25px;
            margin-top: 25px;
        }

        .icon-item {
            text-align: center;
            padding: 25px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            border: 1px solid rgba(139, 0, 0, 0.2);
            transition: all 0.3s ease;
        }

        .icon-item:hover {
            background: rgba(139, 0, 0, 0.1);
            border-color: rgba(139, 0, 0, 0.4);
        }

        .icon {
            font-size: 2.5rem;
            margin-bottom: 12px;
            color: #d4af37;
        }

        .icon-label {
            color: #f4f4f4;
            font-size: 0.9rem;
        }

        /* Espaçamentos */
        .spacing-example {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
        }

        .spacing-box {
            background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
            color: white;
            padding: 20px;
            border-radius: 4px;
            text-align: center;
            font-weight: 400;
        }

        /* Notas */
        .note {
            background: rgba(139, 0, 0, 0.1);
            border-left: 4px solid #8b0000;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
            color: #f4f4f4;
        }

        .note-title {
            font-weight: 500;
            color: #d4af37;
            margin-bottom: 8px;
            font-size: 1.05rem;
        }

        .luxury-note {
            background: rgba(212, 175, 55, 0.05);
            border-left: 4px solid #d4af37;
        }

        /* Responsivo */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .section {
                padding: 30px 20px;
            }

            .color-grid,
            .button-grid {
                grid-template-columns: 1fr;
            }

            .profile-stats {
                grid-template-columns: 1fr;
            }
        }

        /* Efeitos de Luxo */
        .shimmer {
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(212, 175, 55, 0.2) 50%, 
                transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .glow {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        /* Gallery Preview */
        .gallery-preview {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }

        .gallery-item {
            aspect-ratio: 1;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 2rem;
            border: 1px solid rgba(139, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .gallery-item:hover {
            border-color: #d4af37;
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>DESIGN SYSTEM PREMIUM</h1>
        <p class="subtitle">Elegância, Sofisticação & Discrição</p>
    </div>

    <div class="container">
        <!-- Paleta de Cores Premium -->
        <div class="section">
            <h2 class="section-title">Paleta de Cores Premium</h2>
            <p style="color: #888; margin-bottom: 20px;">Cores escolhidas para transmitir sofisticação, sensualidade e exclusividade.</p>
            
            <h3 class="subsection-title">Cores Principais</h3>
            <div class="color-grid">
                <div class="color-card">
                    <div class="color-swatch" style="background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);">Vermelho Sensual</div>
                    <div class="color-info">
                        <div class="color-name">Crimson Red</div>
                        <div class="color-value">#8b0000 → #dc143c</div>
                        <div class="color-value">Gradiente Premium</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch" style="background: #d4af37;">Dourado Luxo</div>
                    <div class="color-info">
                        <div class="color-name">Gold Luxury</div>
                        <div class="color-value">#d4af37</div>
                        <div class="color-value">rgb(212, 175, 55)</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch" style="background: #000000;">Preto Elegante</div>
                    <div class="color-info">
                        <div class="color-name">Deep Black</div>
                        <div class="color-value">#000000</div>
                        <div class="color-value">rgb(0, 0, 0)</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch" style="background: #1a1a1a; color: #f4f4f4;">Cinza Sofisticado</div>
                    <div class="color-info">
                        <div class="color-name">Charcoal Gray</div>
                        <div class="color-value">#1a1a1a</div>
                        <div class="color-value">rgb(26, 26, 26)</div>
                    </div>
                </div>
            </div>

            <h3 class="subsection-title">Cores de Acento</h3>
            <div class="color-grid">
                <div class="color-card">
                    <div class="color-swatch" style="background: #f4f4f4; color: #000;">Branco Pérola</div>
                    <div class="color-info">
                        <div class="color-name">Pearl White</div>
                        <div class="color-value">#f4f4f4</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch" style="background: #4a0e0e;">Bordô Profundo</div>
                    <div class="color-info">
                        <div class="color-name">Deep Burgundy</div>
                        <div class="color-value">#4a0e0e</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch" style="background: #2d2d2d; color: #f4f4f4;">Cinza Médio</div>
                    <div class="color-info">
                        <div class="color-name">Medium Gray</div>
                        <div class="color-value">#2d2d2d</div>
                    </div>
                </div>
                <div class="color-card">
                    <div class="color-swatch" style="background: #b8860b;">Ouro Escuro</div>
                    <div class="color-info">
                        <div class="color-name">Dark Gold</div>
                        <div class="color-value">#b8860b</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tipografia Premium -->
        <div class="section">
            <h2 class="section-title">Tipografia de Luxo</h2>
            <p style="color: #888; margin-bottom: 20px;">Fonte: Playfair Display (serifa elegante) + Georgia como fallback</p>

            <div class="type-example">
                <div class="type-label">DISPLAY - TÍTULOS PRINCIPAIS</div>
                <h1 style="font-size: 3rem; font-weight: 300; color: #f4f4f4; letter-spacing: 3px;">Experiências Exclusivas</h1>
                <p style="margin-top: 12px; color: #888;">font-size: 3rem (48px) | font-weight: 300 | letter-spacing: 3px</p>
            </div>

            <div class="type-example">
                <div class="type-label">H1 - TÍTULOS DE SEÇÃO</div>
                <h2 style="font-size: 2.2rem; font-weight: 300; color: #f4f4f4; letter-spacing: 2px;">Profissionais VIP</h2>
                <p style="margin-top: 12px; color: #888;">font-size: 2.2rem (35px) | font-weight: 300 | letter-spacing: 2px</p>
            </div>

            <div class="type-example">
                <div class="type-label">H2 - SUBTÍTULOS</div>
                <h3 style="font-size: 1.5rem; font-weight: 400; color: #d4af37;">Atendimento Premium</h3>
                <p style="margin-top: 12px; color: #888;">font-size: 1.5rem (24px) | font-weight: 400</p>
            </div>

            <div class="type-example">
                <div class="type-label">BODY - TEXTO PRINCIPAL</div>
                <p style="font-size: 1rem; color: #f4f4f4; line-height: 1.8;">Desfrute de momentos únicos e inesquecíveis com profissionais altamente qualificadas. Cada sessão é personalizada para proporcionar a máxima satisfação e bem-estar.</p>
                <p style="margin-top: 12px; color: #888;">font-size: 1rem (16px) | line-height: 1.8</p>
            </div>

            <div class="type-example">
                <div class="type-label">TAGLINE - TEXTO ITALIANO</div>
                <p style="font-size: 1.1rem; color: #d4af37; font-style: italic; letter-spacing: 1px;">O prazer é uma arte refinada</p>
                <p style="margin-top: 12px; color: #888;">font-size: 1.1rem (18px) | italic | letter-spacing: 1px</p>
            </div>
        </div>

        <!-- Botões Premium -->
        <div class="section">
            <h2 class="section-title">Botões Exclusivos</h2>
            
            <div class="button-grid">
                <div>
                    <button class="btn btn-primary">Agendar Sessão</button>
                    <p style="margin-top: 12px; color: #888; font-size: 0.9rem;">Ação principal - Gradiente vermelho</p>
                </div>
                <div>
                    <button class="btn btn-luxury">Acesso VIP</button>
                    <p style="margin-top: 12px; color: #888; font-size: 0.9rem;">Serviços premium - Gradiente dourado</p>
                </div>
                <div>
                    <button class="btn btn-secondary">Ver Galeria</button>
                    <p style="margin-top: 12px; color: #888; font-size: 0.9rem;">Ações secundárias - Outline dourado</p>
                </div>
                <div>
                    <button class="btn btn-discreet">Contato Discreto</button>
                    <p style="margin-top: 12px; color: #888; font-size: 0.9rem;">Ações sutis - Glass morphism</p>
                </div>
            </div>
        </div>

        <!-- Card de Perfil Premium -->
        <div class="section">
            <h2 class="section-title">Card de Perfil VIP</h2>
            
            <div class="profile-card" style="max-width: 450px;">
                <div class="profile-header">
                    <div class="profile-avatar">👤</div>
                </div>
                <div class="profile-body">
                    <div class="profile-name">
                        Isabella <span class="vip-badge">⭐ VIP</span>
                    </div>
                    <div class="profile-tagline">"O prazer é uma arte que domino"</div>
                    
                    <div class="profile-rating">
                        <span class="stars">★★★★★</span>
                        <span class="rating-text">5.0 · 89 avaliações verificadas</span>
                    </div>

                    <div class="gallery-preview">
                        <div class="gallery-item">📷</div>
                        <div class="gallery-item">📷</div>
                        <div class="gallery-item">📷</div>
                        <div class="gallery-item">+6</div>
                    </div>
                    
                    <div class="profile-info">
                        <span class="info-tag">25 anos</span>
                        <span class="info-tag">1,68m · 58kg</span>
                        <span class="info-tag">Morena · Olhos castanhos</span>
                    </div>

                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-value">100%</span>
                            <span class="stat-label">Satisfação</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">2h</span>
                            <span class="stat-label">Tempo médio</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">VIP</span>
                            <span class="stat-label">Categoria</span>
                        </div>
                    </div>
                    
                    <div class="profile-price">R$ 500 / hora</div>

                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                        <span class="badge badge-exclusive">🔥 Mais Procurada</span>
                        <span class="badge badge-available">✓ Disponível Agora</span>
                        <span class="badge badge-verified">📸 Fotos Verificadas</span>
                    </div>
                    
                    <button class="btn btn-primary" style="width: 100%;">Agendar Sessão Privada</button>
                </div>
            </div>

            <div class="note luxury-note" style="margin-top: 30px;">
                <div class="note-title">💎 Elementos de Exclusividade</div>
                <p>• Badge VIP destacado em dourado<br>
                • Galeria de fotos em preview<br>
                • Estatísticas de satisfação<br>
                • Descrições físicas detalhadas<br>
                • Tagline personalizada sedutora<br>
                • Indicadores de disponibilidade em tempo real</p>
            </div>
        </div>

        <!-- Formulários Premium -->
        <div class="section">
            <h2 class="section-title">Formulários Discretos</h2>
            
            <div style="max-width: 550px;">
                <div class="form-group">
                    <label class="form-label">Nome (pode ser discreto)</label>
                    <input type="text" class="form-input" placeholder="Como gostaria de ser chamado">
                </div>

                <div class="form-group">
                    <label class="form-label">Contato Preferencial</label>
                    <input type="text" class="form-input" placeholder="WhatsApp, Telegram ou e-mail">
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo de Experiência</label>
                    <select class="form-select">
                        <option>Selecione sua preferência</option>
                        <option>Massagem Sensual Completa</option>
                        <option>Tantric Experience</option>
                        <option>Nuru Massage</option>
                        <option>Body to Body Premium</option>
                        <option>Experiência Personalizada</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Preferências Especiais</label>
                    <textarea class="form-input" rows="4" placeholder="Descreva suas expectativas e preferências de forma discreta..."></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Investimento Estimado</label>
                    <select class="form-select">
                        <option>Selecione a faixa de investimento</option>
                        <option>R$ 300 - R$ 500 / hora</option>
                        <option>R$ 500 - R$ 800 / hora</option>
                        <option>R$ 800 - R$ 1.200 / hora</option>
                        <option>Acima de R$ 1.200 / hora</option>
                        <option>Pacotes especiais</option>
                    </select>
                </div>

                <button class="btn btn-primary" style="width: 100%;">Solicitar Atendimento Discreto</button>
            </div>
        </div>

        <!-- Filtros Premium -->
        <div class="section">
            <h2 class="section-title">Sistema de Filtros Avançado</h2>
            
            <div class="filter-container">
                <h3 style="margin-bottom: 20px; color: #d4af37; font-weight: 300;">Encontre Sua Experiência Ideal</h3>
                <div class="filter-row">
                    <div class="form-group">
                        <label class="form-label">Localização</label>
                        <input type="text" class="form-input" placeholder="Bairro ou região">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Biotipo</label>
                        <select class="form-select">
                            <option>Todos os tipos</option>
                            <option>Magra</option>
                            <option>Atlética</option>
                            <option>Curvilínea</option>
                            <option>Plus Size</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Etnia</label>
                        <select class="form-select">
                            <option>Todas</option>
                            <option>Branca</option>
                            <option>Morena</option>
                            <option>Negra</option>
                            <option>Oriental</option>
                            <option>Latina</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Idade</label>
                        <select class="form-select">
                            <option>Qualquer idade</option>
                            <option>18 - 25 anos</option>
                            <option>26 - 35 anos</option>
                            <option>36 - 45 anos</option>
                            <option>45+ anos</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Especialidade</label>
                        <select class="form-select">
                            <option>Todas especialidades</option>
                            <option>Tantric Experience</option>
                            <option>Nuru Massage</option>
                            <option>Body to Body</option>
                            <option>Lingam/Yoni</option>
                            <option>Experiência Premium</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Investimento</label>
                        <select class="form-select">
                            <option>Qualquer valor</option>
                            <option>Até R$ 400</option>
                            <option>R$ 400 - R$ 700</option>
                            <option>R$ 700 - R$ 1.000</option>
                            <option>Acima de R$ 1.000</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Disponibilidade</label>
                        <select class="form-select">
                            <option>Qualquer horário</option>
                            <option>Disponível agora</option>
                            <option>Manhã (6h-12h)</option>
                            <option>Tarde (12h-18h)</option>
                            <option>Noite (18h-00h)</option>
                            <option>Madrugada (00h-6h)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Categoria</label>
                        <select class="form-select">
                            <option>Todas categorias</option>
                            <option>⭐ VIP Exclusive</option>
                            <option>👑 Elite Premium</option>
                            <option>💎 Luxury Diamond</option>
                            <option>🔥 Mais Procuradas</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-luxury" style="margin-top: 20px; width: 100%;">Aplicar Filtros</button>
            </div>
        </div>

        <!-- Badges Premium -->
        <div class="section">
            <h2 class="section-title">Badges e Indicadores</h2>
            
            <h3 class="subsection-title">Badges de Status</h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 25px;">
                <span class="badge badge-vip">⭐ VIP Exclusive</span>
                <span class="badge badge-exclusive">👑 Elite Premium</span>
                <span class="badge badge-vip">💎 Luxury Diamond</span>
                <span class="badge badge-exclusive">🔥 Mais Procurada</span>
                <span class="badge badge-available">✓ Disponível Agora</span>
                <span class="badge badge-verified">📸 Fotos Verificadas</span>
            </div>

            <h3 class="subsection-title">Tags Informativas</h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <span class="info-tag">🏠 Atende em local próprio</span>
                <span class="info-tag">🚗 Atende em hotéis</span>
                <span class="info-tag">⚡ Resposta em 5min</span>
                <span class="info-tag">💳 Aceita cartão</span>
                <span class="info-tag">🌃 Atende 24h</span>
                <span class="info-tag">🥂 Open bar disponível</span>
                <span class="info-tag">🛁 Hidromassagem</span>
                <span class="info-tag">💆 Óleos aromáticos</span>
            </div>
        </div>

        <!-- Ícones Premium -->
        <div class="section">
            <h2 class="section-title">Ícones e Símbolos</h2>
            <p style="color: #888; margin-bottom: 20px;">Sugestão: Lucide Icons ou Font Awesome Pro para ícones elegantes</p>
            
            <div class="icon-grid">
                <div class="icon-item">
                    <div class="icon">👑</div>
                    <p class="icon-label">Elite</p>
                </div>
                <div class="icon-item">
                    <div class="icon">⭐</div>
                    <p class="icon-label">VIP</p>
                </div>
                <div class="icon-item">
                    <div class="icon">💎</div>
                    <p class="icon-label">Premium</p>
                </div>
                <div class="icon-item">
                    <div class="icon">🔥</div>
                    <p class="icon-label">Popular</p>
                </div>
                <div class="icon-item">
                    <div class="icon">📍</div>
                    <p class="icon-label">Localização</p>
                </div>
                <div class="icon-item">
                    <div class="icon">💬</div>
                    <p class="icon-label">Chat Discreto</p>
                </div>
                <div class="icon-item">
                    <div class="icon">🔒</div>
                    <p class="icon-label">Privacidade</p>
                </div>
                <div class="icon-item">
                    <div class="icon">📸</div>
                    <p class="icon-label">Galeria</p>
                </div>
                <div class="icon-item">
                    <div class="icon">🥂</div>
                    <p class="icon-label">Amenidades</p>
                </div>
                <div class="icon-item">
                    <div class="icon">✓</div>
                    <p class="icon-label">Verificado</p>
                </div>
            </div>
        </div>

        <!-- Sistema de Grid -->
        <div class="section">
            <h2 class="section-title">Sistema de Grid</h2>
            <p style="color: #888;">Grid de 12 colunas com espaçamento de 20px</p>
            
            <div class="grid-example">
                <div class="grid-item col-12">12 colunas - Banner principal</div>
            </div>
            <div class="grid-example">
                <div class="grid-item col-8">8 colunas - Conteúdo principal</div>
                <div class="grid-item col-4">4 colunas - Sidebar filtros</div>
            </div>
            <div class="grid-example">
                <div class="grid-item col-4">Card perfil</div>
                <div class="grid-item col-4">Card perfil</div>
                <div class="grid-item col-4">Card perfil</div>
            </div>
        </div>

        <!-- Espaçamentos -->
        <div class="section">
            <h2 class="section-title">Espaçamentos Elegantes</h2>
            <p style="color: #888;">Sistema baseado em múltiplos de 4px para harmonia visual</p>
            
            <div style="margin-top: 25px;">
                <div class="spacing-example">
                    <div class="spacing-box" style="padding: 12px;">12px - XS</div>
                </div>
                <div class="spacing-example">
                    <div class="spacing-box" style="padding: 16px;">16px - SM</div>
                </div>
                <div class="spacing-example">
                    <div class="spacing-box" style="padding: 20px;">20px - MD</div>
                </div>
                <div class="spacing-example">
                    <div class="spacing-box" style="padding: 24px;">24px - LG</div>
                </div>
                <div class="spacing-example">
                    <div class="spacing-box" style="padding: 32px;">32px - XL</div>
                </div>
                <div class="spacing-example">
                    <div class="spacing-box" style="padding: 48px;">48px - 2XL</div>
                </div>
            </div>
        </div>

        <!-- Princípios Premium -->
        <div class="section">
            <h2 class="section-title">Princípios de Design Premium</h2>
            
            <div class="note luxury-note">
                <div class="note-title">1. Sofisticação Visual</div>
                <p>• Paleta escura com acentos em dourado e vermelho<br>
                • Gradientes suaves e elegantes<br>
                • Tipografia serifada clássica (Playfair Display)<br>
                • Efeitos de glass morphism e shimmer</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">2. Sensualidade Elegante</div>
                <p>• Imagens e previews de galeria em destaque<br>
                • Descrições físicas detalhadas mas respeitosas<br>
                • Taglines personalizadas e sedutoras<br>
                • Iluminação e contraste que destacam beleza</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">3. Exclusividade e Status</div>
                <p>• Sistema VIP/Elite/Premium bem definido<br>
                • Badges dourados para profissionais top<br>
                • Preços apresentados como "investimento"<br>
                • Experiências personalizadas destacadas</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">4. Discrição e Privacidade</div>
                <p>• Comunicação discreta via chat criptografado<br>
                • Opção de perfis anônimos para clientes<br>
                • Pagamentos seguros e discretos<br>
                • Política de privacidade reforçada</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">5. Experiência Premium</div>
                <p>• Filtros avançados (biotipo, etnia, especialidade)<br>
                • Agendamento online sofisticado<br>
                • Sistema de reviews verificados<br>
                • Galeria de fotos profissionais<br>
                • Indicadores de disponibilidade em tempo real</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">6. Público Exigente</div>
                <p>• Interface intuitiva mas sofisticada<br>
                • Informações completas e transparentes<br>
                • Qualidade fotográfica profissional<br>
                • Atendimento personalizado premium<br>
                • Amenidades de luxo destacadas (hidro, óleos, drinks)</p>
            </div>
        </div>

        <!-- Diferenças Chave -->
        <div class="section">
            <h2 class="section-title">Diferenças vs Design Terapêutico</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-top: 20px;">
                <div>
                    <h3 style="color: #667eea; margin-bottom: 15px;">Design Terapêutico</h3>
                    <ul style="color: #888; line-height: 2;">
                        <li>Cores frias e relaxantes (roxo/azul)</li>
                        <li>Ênfase em certificações profissionais</li>
                        <li>Foco em saúde e bem-estar</li>
                        <li>Imagens corporativas</li>
                        <li>Linguagem técnica/clínica</li>
                        <li>Preços por sessão</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: #d4af37; margin-bottom: 15px;">Design Sensual Premium</h3>
                    <ul style="color: #888; line-height: 2;">
                        <li>Cores quentes e sedutoras (vermelho/dourado)</li>
                        <li>Ênfase em exclusividade e status VIP</li>
                        <li>Foco em prazer e experiência</li>
                        <li>Galerias de fotos glamourosas</li>
                        <li>Linguagem elegante e sugestiva</li>
                        <li>Investimento por experiência</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Elementos Adicionais -->
        <div class="section">
            <h2 class="section-title">Elementos Exclusivos Premium</h2>
            
            <div class="note luxury-note">
                <div class="note-title">📸 Sistema de Galeria</div>
                <p>• Previews de 4-6 fotos no card<br>
                • Lightbox elegante para visualização completa<br>
                • Fotos profissionais em alta resolução<br>
                • Selo "Fotos Verificadas" em destaque<br>
                • Possibilidade de fotos privadas para VIP</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">💬 Chat Discreto</div>
                <p>• Mensagens criptografadas end-to-end<br>
                • Indicador de "digitando..."<br>
                • Possibilidade de enviar fotos<br>
                • Histórico de conversas<br>
                • Notificações discretas</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">⭐ Sistema de Reviews</div>
                <p>• Avaliações apenas de clientes verificados<br>
                • Comentários moderados para discrição<br>
                • Rating em estrelas + descrição<br>
                • Destaque para reviews premium<br>
                • Opção de review anônimo</p>
            </div>

            <div class="note luxury-note">
                <div class="note-title">🎯 Recomendações IA</div>
                <p>• "Profissionais que combinam com você"<br>
                • Baseado em preferências e histórico<br>
                • Algoritmo de matching sofisticado<br>
                • Sugestões personalizadas<br>
                • "Experiências similares"</p>
            </div>
        </div>
    </div>

    <div style="background: linear-gradient(135deg, #000000 0%, #8b0000 100%); color: #f4f4f4; padding: 60px 20px; text-align: center; margin-top: 80px;">
        <p style="font-size: 1.3rem; margin-bottom: 12px; font-weight: 300; letter-spacing: 2px;">DESIGN SYSTEM PREMIUM v2.0</p>
        <p style="opacity: 0.8; font-style: italic;">Elegância, Sofisticação & Experiências Exclusivas</p>
        <p style="margin-top: 20px; font-size: 0.9rem; color: #d4af37;">Criado para um público exigente que valoriza qualidade e discrição</p>
    </div>
</body>
</html>
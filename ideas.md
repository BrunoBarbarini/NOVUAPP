# Alinhavo — Site de Pitch para Investidores e Parceiros

## Brainstorm de abordagens

1. **Ateliê Editorial** — Estética de revista de moda impressa encontra o ofício da costura: papel cru, tinta profunda, serifa editorial, linhas de alinhavo (tracejados) como motivo gráfico. Probabilidade: 0.06
2. **Neon Circular** — Dark mode com verdes neon e glow, vibe tech/startup de clima. Probabilidade: 0.03
3. **Brutalismo Tropical** — Cores saturadas brasileiras, tipografia enorme, blocos crus e grids quebrados. Probabilidade: 0.04

## Escolha: Ateliê Editorial

**Design Movement:** Editorial print design (revistas de moda como The Gentlewoman / Fantastic Man) cruzado com craft vernacular de ateliê de costura brasileiro. Sofisticação de material impresso — não "site de startup".

**Core Principles:**
1. O papel é o palco: fundo cor de linho cru (quase branco quente), tinta quase-preta esverdeada; profundidade vem de textura e hierarquia, não de sombras pesadas.
2. A linha de costura é o sistema gráfico: tracejados (alinhavos), pontos de marcação, etiquetas de papel costuradas — usados como separadores, marcadores e ornamentos funcionais.
3. Assimetria editorial: colunas desalinhadas, números gigantes na margem, texto em medida estreita; nada de tudo-centralizado.
4. Dados com dignidade tipográfica: números de mercado tratados como manchetes de capa, tabelas como fichas técnicas de ateliê.

**Color Philosophy:** Base "linho" oklch(0.965 0.008 85) — calor de tecido natural, remete a algodão cru e papel kraft claro. Tinta "grafite-oliva" oklch(0.24 0.02 130). Assinatura: **verde-agulha** oklch(0.45 0.11 150) — verde profundo de fio de linha encerado, que fala sustentabilidade sem clichê de "eco-green" saturado. Acento quente: **laranja-linha** oklch(0.66 0.19 40) (linha de arremate em jeans) usado com extrema parcimônia para CTAs e destaques numéricos.

**Layout Paradigm:** Grid editorial de 12 colunas usado assimetricamente: seções alternam entre "spread" (texto à esquerda, evidência à direita), margens com numeração de capítulo vertical (01, 02, 03...) como caderno de encadernação, e blocos full-bleed de cor para momentos-chave (a oportunidade, o ask). Navegação superior fina com wordmark à esquerda e CTA "Falar com o fundador" à direita.

**Signature Elements:**
1. Linha de alinhavo tracejada (SVG dashed path) que "costura" as seções — inclusive animada no hero.
2. Etiquetas/tags de papel (swing tags) com furo e barbante para métricas e badges ("R$ 314,9 bi", "0 players nacionais").
3. Numeração de capítulos vertical na margem esquerda de cada seção (como marcas de talhe de alfaiate).

**Interaction Philosophy:** Discreta e material — hovers que sublinham com tracejado, cards que levantam 2px como papel, contadores numéricos que "costuram" até o valor final ao entrar na viewport. Nada de parallax pesado.

**Animation:** Entradas com fade + translateY(12px), ease-out cubic-bezier(0.23,1,0.32,1), 300-500ms, stagger 60ms. Linha tracejada do hero desenhada com stroke-dashoffset. Contadores numéricos animados uma única vez. Respeitar prefers-reduced-motion.

**Typography System:** Display: **Fraunces** (serifa com personalidade de impresso, opsz alto, itálicos expressivos) para manchetes e números. Corpo/UI: **Archivo** (grotesca brasileira-friendly, neutra e firme) para texto corrido, labels e tabelas. Mono opcional: **Spline Sans Mono** para dados/tabelas financeiras. Hierarquia: manchetes Fraunces 600 com itálico em palavras-chave; labels Archivo uppercase tracking-wide 11-12px.

**Brand Essence:** Alinhavo — a infraestrutura brasileira de reparo e ajuste de roupas (modelo SOJO): conveniência de app, hub de costureiras, parcerias B2B. Para investidores e marcas que querem entrar na moda circular. Adjetivos: artesanal, lúcido, ambicioso.

**Brand Voice:** Confiante e editorial, com números na frente. Sem jargão de pitch vazio. Exemplos: "Costureiras existem em toda esquina. O que não existia era a infraestrutura." / "R$ 314,9 bilhões em roupas vendidas por ano. Nenhuma plataforma para mantê-las vivas."

**Wordmark & Logo:** "alinhavo" em Fraunces minúscula, com o traço do "h" atravessado por uma linha tracejada; símbolo: agulha estilizada formando um "A" com fio tracejado — gerado como PNG transparente para header e favicon.

**Signature Brand Color:** Verde-agulha oklch(0.45 0.11 150).

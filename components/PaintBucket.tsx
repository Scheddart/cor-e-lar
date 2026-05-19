'use client'

interface PaintBucketProps {
  paintColor: string
  className?: string
}

/**
 * Balde de tinta Cor & Lar — versão 3D realista
 * Baseada no produto real da marca: corpo plástico branco,
 * faixa pintada laranja+vermelho+azul, alça de arame preto,
 * tampa aberta com tinta visível no topo.
 */
export default function PaintBucket({ paintColor, className = '' }: PaintBucketProps) {
  return (
    <svg
      viewBox="0 0 480 540"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Corpo do balde — sombreado cilíndrico */}
        <linearGradient id="cylinderBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9C9C99" />
          <stop offset="8%" stopColor="#D8D8D5" />
          <stop offset="22%" stopColor="#F2F2EF" />
          <stop offset="45%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#FFFFFF" />
          <stop offset="82%" stopColor="#EFEFEC" />
          <stop offset="93%" stopColor="#C8C8C5" />
          <stop offset="100%" stopColor="#8A8A87" />
        </linearGradient>

        {/* Tampa branca plástica */}
        <linearGradient id="lidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8F8F6" />
          <stop offset="40%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D4D4D1" />
        </linearGradient>

        {/* Borda interna da tampa (a parte que fica visível por cima) */}
        <linearGradient id="lidRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8A8A5" />
          <stop offset="50%" stopColor="#F0F0ED" />
          <stop offset="100%" stopColor="#9C9C99" />
        </linearGradient>

        {/* Tinta visível no topo (cor da paleta) */}
        <radialGradient id="paintSurface" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor={lighten(paintColor, 0.25)} />
          <stop offset="55%" stopColor={paintColor} />
          <stop offset="100%" stopColor={darken(paintColor, 0.4)} />
        </radialGradient>

        {/* Sombra do interior do balde */}
        <radialGradient id="paintShadow" cx="50%" cy="50%" r="55%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="90%" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>

        {/* Brilho/reflexo na tinta */}
        <linearGradient id="paintShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Alça de arame */}
        <linearGradient id="handleMetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="50%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>

        {/* Sombra projetada no chão */}
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
          <stop offset="60%" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Clip-path pra texto/faixas seguirem a curvatura do balde */}
        <clipPath id="bodyClip">
          <path d="M 96 165 L 384 165 L 392 510 Q 392 518, 384 518 L 96 518 Q 88 518, 88 510 Z" />
        </clipPath>
      </defs>

      {/* SOMBRA NO CHÃO */}
      <ellipse cx="240" cy="520" rx="170" ry="18" fill="url(#floorShadow)" />

      {/* ALÇA — atrás do balde */}
      <g>
        {/* Arame curvo */}
        <path
          d="M 110 150 Q 110 92, 240 92 Q 370 92, 370 150"
          fill="none"
          stroke="url(#handleMetal)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Pequena reflexão de luz na alça */}
        <path
          d="M 130 138 Q 150 100, 240 96"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Clipes metálicos (encaixe da alça no balde) */}
        <ellipse cx="108" cy="156" rx="8" ry="6" fill="#2A2A2A" />
        <ellipse cx="372" cy="156" rx="8" ry="6" fill="#2A2A2A" />
        <ellipse cx="108" cy="156" rx="5" ry="3" fill="#0A0A0A" />
        <ellipse cx="372" cy="156" rx="5" ry="3" fill="#0A0A0A" />
      </g>

      {/* CORPO DO BALDE — formato cilíndrico levemente cônico */}
      <path
        d="M 96 165 L 384 165 L 392 510 Q 392 518, 384 518 L 96 518 Q 88 518, 88 510 Z"
        fill="url(#cylinderBody)"
      />

      {/* FAIXAS DE PINCELADA DA MARCA — laranja, vermelho, azul */}
      <g clipPath="url(#bodyClip)">
        {/* LARANJA — faixa superior */}
        <path
          d="M 70 215
             C 130 200, 200 200, 240 210
             C 280 220, 350 215, 410 205
             L 410 248
             C 350 252, 280 250, 240 245
             C 200 240, 130 245, 70 252 Z"
          fill="#F28C28"
        />
        {/* Pequena variação de tom */}
        <path
          d="M 70 222
             C 130 210, 200 212, 240 220
             C 280 228, 350 222, 410 215
             L 410 225
             C 350 230, 280 228, 240 224
             C 200 220, 130 224, 70 232 Z"
          fill="#FFA855"
          opacity="0.6"
        />

        {/* VERMELHO — faixa do meio */}
        <path
          d="M 60 305
             C 140 295, 200 298, 240 305
             C 285 312, 350 305, 415 295
             L 418 360
             C 350 368, 285 362, 240 358
             C 200 354, 140 358, 60 365 Z"
          fill="#D62828"
        />
        <path
          d="M 60 312
             C 140 305, 200 308, 240 315
             C 285 322, 350 315, 415 305
             L 415 325
             C 350 332, 285 326, 240 322
             C 200 318, 140 322, 60 332 Z"
          fill="#EF4444"
          opacity="0.55"
        />

        {/* AZUL ROYAL — faixa inferior */}
        <path
          d="M 55 425
             C 140 415, 200 418, 240 425
             C 285 432, 355 425, 420 415
             L 420 518
             L 60 518 Z"
          fill="#1F4FBF"
        />
        <path
          d="M 55 433
             C 140 423, 200 426, 240 433
             C 285 440, 355 433, 420 423
             L 420 448
             C 355 458, 285 450, 240 445
             C 200 440, 140 445, 55 455 Z"
          fill="#3A6FE0"
          opacity="0.6"
        />
      </g>

      {/* CENTRO BRANCO — área do logo */}
      <path
        d="M 110 258
           Q 240 250, 380 258
           L 376 305
           Q 240 296, 112 305 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 105 370
           Q 240 360, 385 370
           L 380 420
           Q 240 410, 110 420 Z"
        fill="#FFFFFF"
      />

      {/* LOGO "COR & LAR" */}
      <text
        x="240"
        y="338"
        textAnchor="middle"
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fontSize="38"
        fontWeight="700"
        fill="#0E1B3C"
        letterSpacing="1.5"
      >
        COR &amp; LAR
      </text>

      {/* "TINTAS" */}
      <text
        x="240"
        y="402"
        textAnchor="middle"
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fontSize="20"
        fill="#0E1B3C"
        letterSpacing="7"
      >
        TINTAS
      </text>

      {/* PINCELZINHO atrás do "COR & LAR" */}
      <g transform="translate(295, 325) rotate(-8)">
        <rect x="0" y="-3" width="22" height="6" rx="1.5" fill="#8B4513" />
        <rect x="20" y="-4" width="6" height="8" fill="#9C9C9C" />
        <path
          d="M 26 -5 L 38 -8 L 40 -2 L 38 4 L 26 6 Z"
          fill="#D62828"
        />
      </g>

      {/* TAMPA + TINTA NO TOPO */}
      {/* Tampa (anel branco mais largo) */}
      <ellipse cx="240" cy="165" rx="148" ry="22" fill="url(#lidGrad)" />
      <ellipse cx="240" cy="163" rx="148" ry="22" fill="none" stroke="#999" strokeWidth="0.5" />

      {/* Borda interna metálica/plástica */}
      <ellipse cx="240" cy="162" rx="128" ry="18" fill="url(#lidRim)" />

      {/* TINTA — superfície (cor da paleta) */}
      <ellipse cx="240" cy="161" rx="120" ry="16" fill="url(#paintSurface)" />

      {/* Sombra interna da tinta nas bordas */}
      <ellipse cx="240" cy="161" rx="120" ry="16" fill="url(#paintShadow)" />

      {/* Brilho/reflexo na superfície da tinta */}
      <ellipse cx="200" cy="155" rx="50" ry="5" fill="rgba(255,255,255,0.5)" />
      <ellipse cx="210" cy="158" rx="70" ry="3" fill="url(#paintShine)" />

      {/* RIM SUPERIOR DA TAMPA (linha de luz) */}
      <ellipse
        cx="240"
        cy="150"
        rx="148"
        ry="22"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.2"
      />

      {/* Pequena saliência lateral da tampa (botão de pressão) */}
      <rect x="383" y="158" width="14" height="9" rx="2" fill="#C0C0BD" />
      <rect x="384" y="159" width="12" height="3" rx="1" fill="#E8E8E5" />

      {/* SOMBRA SOB A TAMPA NO CORPO */}
      <ellipse cx="240" cy="180" rx="142" ry="6" fill="rgba(0,0,0,0.12)" />
    </svg>
  )
}

// Helpers
function lighten(hex: string, amount: number): string {
  return shift(hex, amount)
}
function darken(hex: string, amount: number): string {
  return shift(hex, -amount)
}
function shift(hex: string, amount: number): string {
  const m = hex.replace('#', '').match(/.{2}/g)
  if (!m) return hex
  const [r, g, b] = m.map((x) => parseInt(x, 16))
  const adj = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (amount > 0 ? (255 - v) * amount : v * amount))))
  return `rgb(${adj(r)}, ${adj(g)}, ${adj(b)})`
}

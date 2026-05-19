'use client'

interface PaintBucketProps {
  paintColor: string
  className?: string
}

/**
 * Balde de tinta Cor & Lar — SVG inline com:
 * - Corpo branco
 * - Faixa de pincelada azul/vermelha/laranja (marca)
 * - Logo "COR & LAR" e "TINTAS"
 * - Alça preta curva
 * - Tampa removida com tinta visível no topo (cor da paleta)
 * - Sombra projetada embaixo
 */
export default function PaintBucket({ paintColor, className = '' }: PaintBucketProps) {
  return (
    <svg
      viewBox="0 0 320 380"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Gradiente do corpo branco do balde — sombra à esquerda/luz à direita */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D8D8D6" />
          <stop offset="20%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#F0F0EE" />
          <stop offset="100%" stopColor="#C8C8C5" />
        </linearGradient>

        {/* Gradiente da tinta visível no topo */}
        <radialGradient id="paintGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={paintColor} stopOpacity="1" />
          <stop offset="80%" stopColor={paintColor} stopOpacity="1" />
          <stop offset="100%" stopColor={paintColor} stopOpacity="0.85" />
        </radialGradient>

        {/* Gradiente da borda metálica da tampa */}
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E6" />
          <stop offset="50%" stopColor="#F8F8F6" />
          <stop offset="100%" stopColor="#B0B0AE" />
        </linearGradient>

        {/* Sombra interna da tinta */}
        <radialGradient id="paintInnerShadow" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>

        {/* Sombra projetada embaixo do balde */}
        <radialGradient id="dropShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Filtro de blur para sombra */}
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* SOMBRA PROJETADA NO CHÃO */}
      <ellipse cx="160" cy="365" rx="115" ry="14" fill="url(#dropShadow)" />

      {/* ALÇA (atrás do balde) */}
      <path
        d="M 80 90 Q 80 50, 160 50 Q 240 50, 240 90"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Pinos de fixação da alça */}
      <circle cx="78" cy="92" r="5" fill="#0E1B3C" />
      <circle cx="242" cy="92" r="5" fill="#0E1B3C" />

      {/* CORPO DO BALDE — formato trapezoidal levemente curvado */}
      <path
        d="M 72 95 L 248 95 L 252 350 Q 252 355, 247 355 L 73 355 Q 68 355, 68 350 Z"
        fill="url(#bodyGrad)"
        stroke="#A8A8A6"
        strokeWidth="0.8"
      />

      {/* TOPO DO BALDE — tampa aberta com tinta */}
      <ellipse cx="160" cy="95" rx="88" ry="14" fill="url(#rimGrad)" stroke="#888" strokeWidth="0.6" />
      {/* Tinta visível dentro */}
      <ellipse cx="160" cy="95" rx="82" ry="11" fill="url(#paintGrad)" />
      {/* Sombra interna da tinta */}
      <ellipse cx="160" cy="95" rx="82" ry="11" fill="url(#paintInnerShadow)" />
      {/* Brilho na tinta */}
      <ellipse cx="140" cy="91" rx="35" ry="3.5" fill="rgba(255,255,255,0.4)" />

      {/* FAIXA DE PINCELADA DA MARCA (laranja/vermelho/azul) */}
      <g>
        {/* Vermelho */}
        <path
          d="M 70 175 Q 110 168, 160 173 T 250 175 L 250 195 Q 200 188, 160 193 T 70 195 Z"
          fill="#D62828"
          opacity="0.92"
        />
        {/* Laranja por cima */}
        <path
          d="M 70 165 Q 110 158, 160 163 T 250 165 L 250 182 Q 200 175, 160 180 T 70 182 Z"
          fill="#F28C28"
          opacity="0.9"
        />
        {/* Azul royal por baixo */}
        <path
          d="M 70 195 Q 110 190, 160 195 T 250 195 L 250 215 Q 200 208, 160 213 T 70 215 Z"
          fill="#1F4FBF"
          opacity="0.92"
        />
      </g>

      {/* PINCEL ESTILIZADO no fim da pincelada */}
      <g transform="translate(225, 180) rotate(-15)">
        {/* Cabo de madeira */}
        <rect x="0" y="-4" width="30" height="8" rx="2" fill="#8B4513" />
        {/* Ferrule metálico */}
        <rect x="28" y="-5" width="8" height="10" fill="#888" />
        {/* Cerdas */}
        <path d="M 36 -7 L 50 -10 L 52 -3 L 50 4 L 36 7 Z" fill="#D62828" />
      </g>

      {/* LOGO "COR & LAR" */}
      <text
        x="160"
        y="262"
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="#0E1B3C"
        letterSpacing="1"
      >
        COR &amp; LAR
      </text>

      {/* "TINTAS" pequeno em baixo */}
      <text
        x="160"
        y="290"
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="16"
        fill="#0E1B3C"
        letterSpacing="6"
      >
        TINTAS
      </text>

      {/* Reflexo na lateral direita do balde */}
      <path
        d="M 240 105 L 245 340 Q 247 345, 248 345 L 250 100 Z"
        fill="rgba(255,255,255,0.4)"
      />

      {/* Sombra na lateral esquerda do balde */}
      <path
        d="M 72 105 L 78 340 Q 76 345, 75 345 L 72 100 Z"
        fill="rgba(0,0,0,0.08)"
      />
    </svg>
  )
}

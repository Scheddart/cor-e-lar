'use client'

interface LogoProps {
  variant?: 'full' | 'compact'
  className?: string
}

export default function Logo({ variant = 'compact', className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <svg
        viewBox="0 0 280 110"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Cor & Lar Tintas"
      >
        {/* Outer oval background */}
        <ellipse
          cx="140"
          cy="55"
          rx="135"
          ry="48"
          fill="#F5EDE0"
          stroke="#0A0A0A"
          strokeWidth="2.5"
        />

        {/* Inner subtle ring */}
        <ellipse
          cx="140"
          cy="55"
          rx="128"
          ry="42"
          fill="none"
          stroke="#0A0A0A"
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Top decorative red brush stroke */}
        <path
          d="M 25 38 Q 80 30, 140 38 T 255 38"
          stroke="#E63B14"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* COR & LAR text */}
        <text
          x="140"
          y="62"
          textAnchor="middle"
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="34"
          fontWeight="700"
          fill="#0A0A0A"
          letterSpacing="2"
        >
          COR &amp; LAR
        </text>

        {/* Bottom decorative blue brush stroke */}
        <path
          d="M 25 72 Q 80 78, 140 72 T 255 72"
          stroke="#1C4A8A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* TINTAS text */}
        <text
          x="140"
          y="93"
          textAnchor="middle"
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="14"
          fill="#0A0A0A"
          letterSpacing="6"
        >
          TINTAS
        </text>
      </svg>
    )
  }

  // Compact horizontal version for navbar
  return (
    <svg
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cor & Lar Tintas"
    >
      <ellipse
        cx="100"
        cy="30"
        rx="96"
        ry="26"
        fill="#F5EDE0"
        stroke="#0A0A0A"
        strokeWidth="1.5"
      />
      <path
        d="M 15 22 Q 55 18, 100 22 T 185 22"
        stroke="#E63B14"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="100"
        y="35"
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#0A0A0A"
        letterSpacing="1.5"
      >
        COR &amp; LAR
      </text>
      <path
        d="M 15 40 Q 55 44, 100 40 T 185 40"
        stroke="#1C4A8A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="100"
        y="52"
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="8"
        fill="#0A0A0A"
        letterSpacing="4"
      >
        TINTAS
      </text>
    </svg>
  )
}

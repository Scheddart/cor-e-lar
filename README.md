# Cor & Lar Tintas

Site institucional premium da **Cor & Lar Tintas**, primeira loja conceito Tintas Maza no Brasil, localizada em Leme, SP.

> "Onde a Cor Ganha Vida" — Tintas premium para transformar cada espaço.

## Sobre

- **Endereço:** Av. Dr. Hermínio Ometto, 1505 — Jardim Alvorada, Leme, SP
- **Telefone:** (19) 3573-2828
- **Instagram:** [@corelartintas](https://www.instagram.com/corelartintas/)

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** para estilo
- **React Three Fiber** + **Three.js** + **GLSL shaders** customizados (hero com simulação de paint pour via domain warping FBM)
- **GSAP** + **ScrollTrigger** para animações de scroll, contadores e stagger
- **Lenis** para smooth scroll integrado ao GSAP ticker
- **Framer Motion** para micro-interações
- **Lucide React** para ícones

## Como rodar

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Seções

1. **Hero** — WebGL paint shader animado + título Bebas Neue
2. **Sobre** — Contadores animados (27+ anos, 100% cores, 500+ produtos, 1ª loja conceito)
3. **Produtos** — 4 categorias (Imobiliária, Automotiva, Industrial, Solventes)
4. **Serviços** — Consultoria, mistura computadorizada, entrega, suporte
5. **Galeria** — Paletas de cores curadas por ambiente
6. **Contato** — Google Maps embed, WhatsApp, Instagram

## Build

```bash
npm run build
npm start
```

## Performance

- LCP target: < 2.5s
- Initial JS (gzip): < 200KB
- 60fps desktop / 30fps mobile mínimo no shader
- `prefers-reduced-motion` respeitado (fallbacks estáticos)

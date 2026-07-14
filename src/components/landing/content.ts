export type Persona = 'personal' | 'business';

export interface StepItem {
  title: string;
  description: string;
}

export interface PersonaContent {
  heroTitle: [string, string];
  heroSub: string;
  videoLabel: string;
  videoSrc: string;
  stepsTitle: string;
  stepsSub: string;
  steps: StepItem[];
}

export const PERSONAS: Record<Persona, PersonaContent> = {
  personal: {
    heroTitle: ['Your universal', 'crypto wallet'],
    heroSub:
      'Pay for anything with any token — UniCard handles cross-chain routing automatically. One balance, every chain.',
    videoLabel: 'Demo recording · 2:14',
    videoSrc: '/videos/wallet-demo.mp4',
    stepsTitle: 'The easiest way to pay with crypto',
    stepsSub:
      'Sign in with your email, pay with assets on any supported chain, and access your purchase in seconds.',
    steps: [
      {
        title: 'Sign in with Email',
        description:
          'Use your email to get started. No wallet setup, passwords, or recovery phrases.',
      },
      {
        title: 'Universal Account',
        description:
          "Your account is prepared automatically — you don't need to configure anything.",
      },
      {
        title: 'Pay with Any Asset',
        description:
          'Pay using the crypto you already have. We handle routing, swaps, and settlement automatically.',
      },
      {
        title: 'Access Your Purchase',
        description:
          'Your payment settles securely, and your purchase is delivered instantly.',
      },
    ],
  },
  business: {
    heroTitle: ['Accept any token.', 'Settle on Arbitrum.'],
    heroSub:
      'The chain-abstracted checkout engine — customers pay with any asset on any chain, you settle in USDC on Arbitrum.',
    videoLabel: 'Checkout demo · 1:48',
    videoSrc: '/videos/checkout-demo.mp4',
    stepsTitle: 'The Stripe checkout of Web3',
    stepsSub:
      'Integrate UniCard in minutes. Your buyers pay with any asset on any chain. You receive USDC on Arbitrum with full on-chain proof.',
    steps: [
      {
        title: 'List your item',
        description:
          'Add your event, membership, or digital product — we give you a shareable UniCard checkout URL.',
      },
      {
        title: 'Buyer clicks your link',
        description:
          'They land on our checkout page pre-loaded with your item. We handle login, wallet creation, and payment.',
      },
      {
        title: 'They pay from any chain',
        description:
          'USDC on Base, ETH on Mainnet, USDT on Polygon — Particle Universal Accounts route and settle automatically.',
      },
      {
        title: 'You get USDC + on-chain proof',
        description:
          'Settlement arrives on Arbitrum One. Buyer gets a verifiable pass. You get an Arbiscan receipt.',
      },
    ],
  },
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is EIP-7702 — and is it reversible?',
    answer:
      'EIP-7702 lets your regular wallet (EOA) act as a smart account through a delegation transaction. UniCard uses it so you can pay from a single balance across chains, with each payment routed through the best token and network. The delegation is fully reversible — you can revoke it at any time and your EOA stays a standard EOA.',
  },
  {
    question: 'Which chains and tokens are supported?',
    answer:
      'You can pay from any chain supported by Particle Universal Accounts — including Ethereum Mainnet, Arbitrum, Base, Polygon, and Solana — using major assets like USDC, USDT, ETH, and SOL. Whatever you pay with, settlement always arrives as USDC on Arbitrum One.',
  },
  {
    question: 'Who holds my keys?',
    answer:
      "You do. UniCard is non-custodial: your wallet is created by Magic and tied to your Google, Apple, or email login. Neither UniCard nor the seller can access or move your funds — and the EIP-7702 upgrade doesn't change that.",
  },
  {
    question: 'How does cross-chain routing work?',
    answer:
      "When you pay, your Universal Account looks at your balances across all chains, picks the cheapest token and route, and executes the swaps and transfers automatically. There are no bridges to click through and nothing to configure — one tap on your side, one settlement on the seller's.",
  },
  {
    question: 'What does settling in USDC on Arbitrum mean for merchants?',
    answer:
      'You always receive a single asset on a single chain — USDC on Arbitrum One — no matter what your buyer paid with. That means no exposure to volatile tokens, one treasury to manage, and every settlement comes with a webhook and an Arbiscan-verifiable on-chain receipt.',
  },
  {
    question: 'Do I need gas tokens on every chain?',
    answer:
      'No. Gas is abstracted away by the Universal Account — network fees are covered from the payment itself, so you never need to top up ETH, SOL, or any other gas token on any chain.',
  },
];

/**
 * Global Animation Library
 * Tailored animations for each business line aesthetic
 */

import { css } from '@emotion/react';

// =====================================
// STUDIO ANIMATIONS - Elegant & Refined
// =====================================
export const studioAnimations = css`
  @keyframes fadeInSlow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes imageZoomSlow {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes panImage {
    0%, 100% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(1.05) translateY(-3%);
    }
  }
`;

// =========================================
// PHOTOBOOTH ANIMATIONS - Playful & Bouncy
// =========================================
export const photoboothAnimations = css`
  @keyframes scaleAndFadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scaleAndFadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes rubberBand {
    from {
      transform: scale(1);
    }
    10%, 20% {
      transform: scaleX(1.25) scaleY(0.75);
    }
    30%, 50%, 70%, 90% {
      transform: scaleX(0.75) scaleY(1.25);
    }
    40%, 60%, 80% {
      transform: scaleX(1.15) scaleY(0.85);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes confetti-fall {
    from {
      opacity: 1;
      transform: translateY(-10px) rotate(0deg);
    }
    to {
      opacity: 0;
      transform: translateY(100px) rotate(360deg);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// =========================================
// DIGITAL ANIMATIONS - Tech & Geometric
// =========================================
export const digitalAnimations = css`
  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDownAndFade {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }

  @keyframes gridFlip {
    from {
      opacity: 0;
      transform: perspective(1000px) rotateY(-90deg);
    }
    to {
      opacity: 1;
      transform: perspective(1000px) rotateY(0deg);
    }
  }

  @keyframes neonGlow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(0, 224, 255, 0.5), 
                   0 0 20px rgba(0, 208, 132, 0.3);
    }
    50% {
      text-shadow: 0 0 20px rgba(0, 224, 255, 0.8),
                   0 0 40px rgba(0, 208, 132, 0.6);
    }
  }

  @keyframes dataReveal {
    from {
      opacity: 0;
      clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
    }
    to {
      opacity: 1;
      clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0 100%);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// ==========================================
// COFFEE ANIMATIONS - Warm & Organic
// ==========================================
export const coffeeAnimations = css`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes liquidSwirl {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-2px) rotate(1deg);
    }
    50% {
      transform: translateY(-4px) rotate(0deg);
    }
    75% {
      transform: translateY(-2px) rotate(-1deg);
    }
  }

  @keyframes steamRise {
    from {
      opacity: 0;
      transform: translateY(20px) scaleX(0.8);
    }
    to {
      opacity: 0;
      transform: translateY(-60px) scaleX(1.2);
    }
  }

  @keyframes warmGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(217, 119, 6, 0.2);
    }
    50% {
      box-shadow: 0 0 30px rgba(217, 119, 6, 0.4);
    }
  }

  @keyframes gentleSway {
    0%, 100% {
      transform: translateX(0) rotate(0deg);
    }
    50% {
      transform: translateX(2px) rotate(0.5deg);
    }
  }
`;

// ================================================
// SHARED UTILITY ANIMATIONS
// ================================================
export const utilityAnimations = css`
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes skeleton-loading {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

// Animation duration constants
export const animationDurations = {
  studio: {
    fast: '0.3s',
    normal: '0.6s',
    slow: '0.8s',
    verySlow: '1.2s',
  },
  photobooth: {
    fast: '0.25s',
    normal: '0.4s',
    slow: '0.6s',
    verySlow: '0.9s',
  },
  digital: {
    fast: '0.35s',
    normal: '0.5s',
    slow: '0.7s',
    verySlow: '1s',
  },
  coffee: {
    fast: '0.4s',
    normal: '0.6s',
    slow: '0.9s',
    verySlow: '1.2s',
  },
};

// Easing functions
export const easings = {
  studioEaseOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  photoboothBouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  digitalSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  coffeeSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

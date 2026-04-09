/**
 * Themed Typography Components
 * Each styled according to current business line theme
 */

'use client';

import { useKygooTheme } from '@/src/contexts/ThemeContext';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

// Base styled components using theme variables
const H1Styled = styled.h1`
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 700;
  font-family: var(--font-display);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  animation: var(--entrance, fade-in-slow 0.8s ease-out);
`;

const H2Styled = styled.h2`
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 600;
  font-family: var(--font-display);
  line-height: 1.2;
  margin-bottom: 0.8rem;
  animation: slide-in-from-left 0.6s ease-out;
`;

const H3Styled = styled.h3`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 600;
  font-family: var(--font-body);
  line-height: 1.3;
  margin-bottom: 0.6rem;
`;

const ParagraphStyled = styled.p`
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-muted-foreground);
  margin-bottom: 1rem;

  strong {
    color: var(--color-foreground);
    font-weight: 600;
  }
`;

const SubtitleStyled = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 500;
  color: var(--color-accent);
  font-family: var(--font-display);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
`;

const CaptionStyled = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

// Exported components
export const H1 = ({ children, className }: { children: ReactNode; className?: string }) => (
  <H1Styled className={className}>{children}</H1Styled>
);

export const H2 = ({ children, className }: { children: ReactNode; className?: string }) => (
  <H2Styled className={className}>{children}</H2Styled>
);

export const H3 = ({ children, className }: { children: ReactNode; className?: string }) => (
  <H3Styled className={className}>{children}</H3Styled>
);

export const Paragraph = ({ children, className }: { children: ReactNode; className?: string }) => (
  <ParagraphStyled className={className}>{children}</ParagraphStyled>
);

export const Subtitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <SubtitleStyled className={className}>{children}</SubtitleStyled>
);

export const Caption = ({ children, className }: { children: ReactNode; className?: string }) => (
  <CaptionStyled className={className}>{children}</CaptionStyled>
);

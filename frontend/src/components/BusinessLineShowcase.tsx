/**
 * Business Line Navigator & Showcase
 * Interactive hero section showcasing all 4 business lines
 * Each line has its distinctive aesthetic and animations
 */

'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useKygooTheme } from '@/src/contexts/ThemeContext';
import { getAllThemes, BusinessLine } from '@/src/config/themes';
import { useState, useEffect } from 'react';
import { H1, Subtitle, Paragraph } from './Typography';

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-background) 100%);
`;

const NavDots = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 2rem 1rem;
  background: rgba(0, 0, 0, 0.02);
  backdrop-filter: var(--effect-blur);
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 1.5rem 0.5rem;
  }
`;

const NavDot = styled(motion.button)<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
  background: ${props => (props.active ? 'var(--color-accent)' : 'transparent')};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.3);
  }

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
    border-width: 1.5px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentInner = styled(motion.div)`
  max-width: 900px;
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const VisualShowcase = styled(motion.div)`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.2);
  box-shadow: var(--effect-shadow);

  @media (max-width: 968px) {
    height: 300px;
    font-size: 4rem;
  }

  @media (max-width: 768px) {
    height: 250px;
    font-size: 2.5rem;
    border-radius: 8px;
  }
`;

const CTA = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: var(--color-accent);
  color: var(--color-background);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const DescriptionBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

interface BusinessLineShowcaseProps {
  onLineChange?: (line: BusinessLine) => void;
}

export function BusinessLineShowcase({ onLineChange }: BusinessLineShowcaseProps) {
  const { currentTheme, switchTheme, businessLine } = useKygooTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const themes = getAllThemes();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4 },
    },
  };

  const handleDotClick = (index: number) => {
    const line = themes[index].businessLine;
    setActiveIndex(index);
    switchTheme(line);
    onLineChange?.(line);
  };

  const theme = themes[activeIndex];

  return (
    <HeroContainer>
      {/* Navigation Dots */}
      <NavDots>
        {themes.map((t, idx) => (
          <NavDot
            key={t.businessLine}
            active={activeIndex === idx}
            onClick={() => handleDotClick(idx)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            title={t.name}
          />
        ))}
      </NavDots>

      {/* Content */}
      <ContentWrapper>
        <ContentInner
          key={theme.businessLine}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content */}
          <DescriptionBox variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Subtitle>{theme.subtitle}</Subtitle>
            </motion.div>

            <motion.div variants={itemVariants}>
              <H1>{theme.name}</H1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paragraph>
                Discover excellence in every detail. We provide premium services tailored to create
                unforgettable experiences for your special moments.
              </Paragraph>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <CTA
                href={`/${theme.businessLine}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Explore
                <span>→</span>
              </CTA>

              <CTA
                href="#contact"
                style={{
                  background: 'transparent',
                  color: 'var(--color-accent)',
                  border: '2px solid var(--color-accent)',
                }}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Contact
              </CTA>
            </motion.div>
          </DescriptionBox>

          {/* Visual Showcase */}
          <VisualShowcase
            key={`showcase-${theme.businessLine}`}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {['📷', '📸', '💻', '☕'][activeIndex]}
          </VisualShowcase>
        </ContentInner>
      </ContentWrapper>
    </HeroContainer>
  );
}

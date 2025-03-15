
import React, { useEffect, useRef } from 'react';
import { useBond } from '@/context/BondContext';

const ThemeElements: React.FC = () => {
  const { currentTheme } = useBond();
  const containerRef = useRef<HTMLDivElement>(null);

  const getThemeSymbol = () => {
    switch (currentTheme) {
      case 'spring':
        return '🌸';
      case 'summer':
        return '☀️';
      case 'autumn':
        return '🍂';
      case 'winter':
        return '❄️';
      case 'blossom':
        return '🌺';
      default:
        return '🌸';
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing elements
    containerRef.current.innerHTML = '';
    
    // Create new elements based on theme
    const symbol = getThemeSymbol();
    const count = 20;
    
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      element.textContent = symbol;
      element.style.left = `${Math.random() * 100}%`;
      element.style.opacity = '0';
      element.style.animationDelay = `${Math.random() * 8}s`;
      element.style.fontSize = `${Math.random() * 20 + 10}px`;
      containerRef.current.appendChild(element);
    }
  }, [currentTheme]);

  return <div ref={containerRef} className="floating-elements" />;
};

export default ThemeElements;

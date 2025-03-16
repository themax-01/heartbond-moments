
import React, { useEffect, useRef, useState } from 'react';
import { useBond } from '@/context/BondContext';

const ThemeElements: React.FC = () => {
  const { currentTheme, setCurrentTheme } = useBond();
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoTransition, setAutoTransition] = useState(true);

  // Get theme elements for the current theme
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

  // Automatic theme transition
  useEffect(() => {
    if (!autoTransition) return;

    const themes = ['spring', 'summer', 'autumn', 'winter', 'blossom'];
    const currentIndex = themes.indexOf(currentTheme);
    
    const transitionInterval = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % themes.length;
      setCurrentTheme(themes[nextIndex] as any);
    }, 60000); // Change theme every 1 minute
    
    return () => clearTimeout(transitionInterval);
  }, [currentTheme, setCurrentTheme, autoTransition]);

  // Load auto transition preference from localStorage
  useEffect(() => {
    const savedPref = localStorage.getItem('autoThemeTransition');
    if (savedPref !== null) {
      setAutoTransition(savedPref === 'true');
    }
  }, []);

  // Update floating elements when theme changes
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

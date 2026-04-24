/**
 * Color Contrast Testing for WCAG 2.1 AA Compliance
 * Requirements: 8.2, 8.8
 * 
 * WCAG 2.1 AA Standards:
 * - Normal text (< 18pt or < 14pt bold): 4.5:1 minimum contrast ratio
 * - Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum contrast ratio
 * - Focus indicators: 3:1 minimum contrast ratio
 */

import { describe, it, expect } from 'vitest';

// Color contrast calculation utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbaToRgb(rgba: string, bgColor: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  // Parse rgba(r, g, b, a) format
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) {
    throw new Error(`Invalid rgba format: ${rgba}`);
  }
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = match[4] ? parseFloat(match[4]) : 1;
  
  // Alpha blend with background
  return {
    r: Math.round((1 - a) * bgColor.r + a * r),
    g: Math.round((1 - a) * bgColor.g + a * g),
    b: Math.round((1 - a) * bgColor.b + a * b)
  };
}

function getLuminance(r: number, g: number, b: number): number {
  // Convert RGB to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color Contrast - WCAG 2.1 AA Compliance', () => {
  // Background colors used in the design
  const backgrounds = {
    black: { r: 10, g: 10, b: 10 }, // #0a0a0a
    darkGray: { r: 17, g: 17, b: 17 }, // #111111
    darkSection: { r: 15, g: 15, b: 15 }, // #0f0f0f
    glassLight: rgbaToRgb('rgba(255, 255, 255, 0.03)', { r: 10, g: 10, b: 10 }),
    glassMedium: rgbaToRgb('rgba(255, 255, 255, 0.05)', { r: 10, g: 10, b: 10 }),
    glassStrong: rgbaToRgb('rgba(255, 255, 255, 0.08)', { r: 10, g: 10, b: 10 }),
    glassHover: rgbaToRgb('rgba(255, 255, 255, 0.1)', { r: 10, g: 10, b: 10 }),
  };

  // Text colors used in the design
  const textColors = {
    white: { r: 255, g: 255, b: 255 }, // #ffffff
    gray300: { r: 209, g: 213, b: 219 }, // #d1d5db (text-gray-300)
    gray400: { r: 156, g: 163, b: 175 }, // #9ca3af (text-gray-400)
    gray500: { r: 107, g: 114, b: 128 }, // #6b7280 (text-gray-500)
    whiteTransparent70: rgbaToRgb('rgba(255, 255, 255, 0.7)', { r: 10, g: 10, b: 10 }),
    whiteTransparent80: rgbaToRgb('rgba(255, 255, 255, 0.8)', { r: 10, g: 10, b: 10 }),
    whiteTransparent50: rgbaToRgb('rgba(255, 255, 255, 0.5)', { r: 10, g: 10, b: 10 }),
    blue400: { r: 96, g: 165, b: 250 }, // #60a5fa
    green300: { r: 134, g: 239, b: 172 }, // #86efac
    red300: { r: 252, g: 165, b: 165 }, // #fca5a5
  };

  // Focus indicator colors
  const focusColors = {
    blue500: { r: 59, g: 130, b: 246 }, // #3b82f6
    blueTransparent: rgbaToRgb('rgba(59, 130, 246, 0.1)', { r: 10, g: 10, b: 10 }),
  };

  describe('Normal Text (4.5:1 minimum)', () => {
    it('should have sufficient contrast for white text on black background', () => {
      const ratio = getContrastRatio(textColors.white, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeGreaterThan(15); // Should be very high
    });

    it('should have sufficient contrast for gray-300 text on black background', () => {
      const ratio = getContrastRatio(textColors.gray300, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for gray-400 text on black background', () => {
      const ratio = getContrastRatio(textColors.gray400, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for white 80% opacity text on black background', () => {
      const ratio = getContrastRatio(textColors.whiteTransparent80, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for white 70% opacity text on black background', () => {
      const ratio = getContrastRatio(textColors.whiteTransparent70, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for white text on glass backgrounds', () => {
      const ratioLight = getContrastRatio(textColors.white, backgrounds.glassLight);
      const ratioMedium = getContrastRatio(textColors.white, backgrounds.glassMedium);
      const ratioStrong = getContrastRatio(textColors.white, backgrounds.glassStrong);
      
      expect(ratioLight).toBeGreaterThanOrEqual(4.5);
      expect(ratioMedium).toBeGreaterThanOrEqual(4.5);
      expect(ratioStrong).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for navigation links (white 70% opacity)', () => {
      const ratio = getContrastRatio(textColors.whiteTransparent70, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for form placeholders (white 50% opacity)', () => {
      const ratio = getContrastRatio(textColors.whiteTransparent50, backgrounds.black);
      // Placeholders can have lower contrast (not required by WCAG), but we test anyway
      // If this fails, we should increase opacity
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Large Text (3:1 minimum)', () => {
    it('should have sufficient contrast for hero title (large text)', () => {
      const ratio = getContrastRatio(textColors.white, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });

    it('should have sufficient contrast for section headings (large text)', () => {
      const ratio = getContrastRatio(textColors.white, backgrounds.darkSection);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });

    it('should have sufficient contrast for service card titles (large text)', () => {
      const ratio = getContrastRatio(textColors.white, backgrounds.glassLight);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Interactive Elements', () => {
    it('should have sufficient contrast for button text', () => {
      // Primary button: white text on accessible blue gradient
      const blueGradientStart = { r: 82, g: 106, b: 214 }; // #526ad6 (accessible)
      const ratio = getContrastRatio(textColors.white, blueGradientStart);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for link hover states', () => {
      const ratio = getContrastRatio(textColors.blue400, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for success messages', () => {
      const successBg = rgbaToRgb('rgba(34, 197, 94, 0.2)', { r: 10, g: 10, b: 10 });
      const ratio = getContrastRatio(textColors.green300, successBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for error messages', () => {
      const errorBg = rgbaToRgb('rgba(239, 68, 68, 0.2)', { r: 10, g: 10, b: 10 });
      const ratio = getContrastRatio(textColors.red300, errorBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Focus Indicators (3:1 minimum)', () => {
    it('should have sufficient contrast for focus outline against black background', () => {
      const ratio = getContrastRatio(focusColors.blue500, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });

    it('should have sufficient contrast for focus outline against glass backgrounds', () => {
      const ratioLight = getContrastRatio(focusColors.blue500, backgrounds.glassLight);
      const ratioMedium = getContrastRatio(focusColors.blue500, backgrounds.glassMedium);
      
      expect(ratioLight).toBeGreaterThanOrEqual(3);
      expect(ratioMedium).toBeGreaterThanOrEqual(3);
    });

    it('should have sufficient contrast for focus background on navigation links', () => {
      const ratio = getContrastRatio(focusColors.blueTransparent, backgrounds.black);
      // Focus background should be visible but doesn't need high contrast
      expect(ratio).toBeGreaterThan(1);
    });
  });

  describe('Technology Tags and Badges', () => {
    it('should have sufficient contrast for tech tag text', () => {
      const tagBg = backgrounds.glassLight;
      const ratio = getContrastRatio(textColors.white, tagBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for tech tag hover state', () => {
      // Tech tags on hover use accessible primary gradient
      const gradientStart = { r: 82, g: 106, b: 214 }; // #526ad6 (accessible)
      const ratio = getContrastRatio(textColors.white, gradientStart);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Service Cards', () => {
    it('should have sufficient contrast for service card titles', () => {
      const ratio = getContrastRatio(textColors.white, backgrounds.glassLight);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for service card descriptions', () => {
      const ratio = getContrastRatio(textColors.whiteTransparent80, backgrounds.glassLight);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for service card hover state', () => {
      const ratio = getContrastRatio(textColors.white, backgrounds.glassHover);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Form Elements', () => {
    it('should have sufficient contrast for form labels', () => {
      const ratio = getContrastRatio(textColors.whiteTransparent80, backgrounds.black);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for form input text', () => {
      const inputBg = rgbaToRgb('rgba(255, 255, 255, 0.05)', { r: 10, g: 10, b: 10 });
      const ratio = getContrastRatio(textColors.white, inputBg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for form input focus state', () => {
      const inputBgFocus = rgbaToRgb('rgba(255, 255, 255, 0.08)', { r: 10, g: 10, b: 10 });
      const ratio = getContrastRatio(textColors.white, inputBgFocus);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Contrast Ratio Summary', () => {
    it('should log all contrast ratios for documentation', () => {
      console.log('\n=== Color Contrast Analysis ===\n');
      
      console.log('Normal Text on Black Background:');
      console.log(`  White (#ffffff): ${getContrastRatio(textColors.white, backgrounds.black).toFixed(2)}:1`);
      console.log(`  Gray-300 (#d1d5db): ${getContrastRatio(textColors.gray300, backgrounds.black).toFixed(2)}:1`);
      console.log(`  Gray-400 (#9ca3af): ${getContrastRatio(textColors.gray400, backgrounds.black).toFixed(2)}:1`);
      console.log(`  White 80% opacity: ${getContrastRatio(textColors.whiteTransparent80, backgrounds.black).toFixed(2)}:1`);
      console.log(`  White 70% opacity: ${getContrastRatio(textColors.whiteTransparent70, backgrounds.black).toFixed(2)}:1`);
      console.log(`  White 50% opacity: ${getContrastRatio(textColors.whiteTransparent50, backgrounds.black).toFixed(2)}:1`);
      
      console.log('\nFocus Indicators:');
      console.log(`  Blue-500 (#3b82f6) on black: ${getContrastRatio(focusColors.blue500, backgrounds.black).toFixed(2)}:1`);
      
      console.log('\nInteractive Elements:');
      console.log(`  Blue-400 (#60a5fa) on black: ${getContrastRatio(textColors.blue400, backgrounds.black).toFixed(2)}:1`);
      
      console.log('\n');
    });
  });
});

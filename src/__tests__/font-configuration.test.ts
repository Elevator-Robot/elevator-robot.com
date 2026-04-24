/**
 * Font Configuration Tests
 * Task 15.1: Configure custom fonts
 * 
 * Validates:
 * - All custom fonts are properly declared with @font-face
 * - font-display: swap is configured for performance (Requirement 9.6)
 * - Font files exist in the public directory
 * - Tailwind font utilities are configured
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Custom Font Configuration - Task 15.1', () => {
  const fontsCSS = readFileSync(join(process.cwd(), 'src/fonts.css'), 'utf-8');
  const tailwindConfig = readFileSync(join(process.cwd(), 'tailwind.config.js'), 'utf-8');

  describe('Font Face Declarations', () => {
    it('should declare NeoBold font with font-display: swap', () => {
      expect(fontsCSS).toContain("font-family: 'NeoBold'");
      expect(fontsCSS).toMatch(/font-family:\s*'NeoBold'[\s\S]*?font-display:\s*swap/);
    });

    it('should declare BIN Bold font with font-display: swap', () => {
      expect(fontsCSS).toContain("font-family: 'BIN Bold'");
      expect(fontsCSS).toMatch(/font-family:\s*'BIN Bold'[\s\S]*?font-display:\s*swap/);
    });

    it('should declare IDEBold font with font-display: swap', () => {
      expect(fontsCSS).toContain("font-family: 'IDEBold'");
      expect(fontsCSS).toMatch(/font-family:\s*'IDEBold'[\s\S]*?font-display:\s*swap/);
    });

    it('should declare Kobold font with font-display: swap', () => {
      expect(fontsCSS).toContain("font-family: 'Kobold'");
      expect(fontsCSS).toMatch(/font-family:\s*'Kobold'[\s\S]*?font-display:\s*swap/);
    });

    it('should declare Modular font with font-display: swap', () => {
      expect(fontsCSS).toContain("font-family: 'Modular'");
      expect(fontsCSS).toMatch(/font-family:\s*'Modular'[\s\S]*?font-display:\s*swap/);
    });
  });

  describe('Font Files Existence', () => {
    it('should have NeoBold font files', () => {
      expect(existsSync(join(process.cwd(), 'public/fonts/NeoBold/NeoBold.woff2'))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public/fonts/NeoBold/NeoBold.woff'))).toBe(true);
    });

    it('should have BIN Bold font files', () => {
      expect(existsSync(join(process.cwd(), 'public/fonts/BIN Bold/BIN Bold.woff2'))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public/fonts/BIN Bold/BIN Bold.woff'))).toBe(true);
    });

    it('should have IDEBold font files', () => {
      expect(existsSync(join(process.cwd(), 'public/fonts/IDEBold/IDEBold.woff2'))).toBe(true);
    });

    it('should have Kobold font files', () => {
      expect(existsSync(join(process.cwd(), 'public/fonts/Kobold/Kobold.woff2'))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public/fonts/Kobold/Kobold.woff'))).toBe(true);
    });

    it('should have Modular font files', () => {
      expect(existsSync(join(process.cwd(), 'public/fonts/Modular/Modular.woff2'))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public/fonts/Modular/Modular.woff'))).toBe(true);
    });
  });

  describe('Tailwind Configuration', () => {
    it('should configure font-neo utility class', () => {
      expect(tailwindConfig).toContain("'neo': ['NeoBold', 'sans-serif']");
    });

    it('should configure font-bin utility class', () => {
      expect(tailwindConfig).toContain("'bin': ['BIN Bold', 'sans-serif']");
    });

    it('should configure font-ide utility class', () => {
      expect(tailwindConfig).toContain("'ide': ['IDEBold', 'monospace']");
    });

    it('should configure font-kobold utility class', () => {
      expect(tailwindConfig).toContain("'kobold': ['Kobold', 'sans-serif']");
    });

    it('should configure font-modular utility class', () => {
      expect(tailwindConfig).toContain("'modular': ['Modular', 'sans-serif']");
    });
  });

  describe('Performance Optimization', () => {
    it('should use font-display: swap for all fonts to prevent FOIT', () => {
      const fontDisplayMatches = fontsCSS.match(/font-display:\s*swap/g);
      expect(fontDisplayMatches).toHaveLength(5); // All 5 fonts should have font-display: swap
    });

    it('should use woff2 format (modern, compressed) as primary', () => {
      expect(fontsCSS).toContain("format('woff2')");
    });

    it('should provide woff fallback for older browsers', () => {
      expect(fontsCSS).toContain("format('woff')");
    });
  });

  describe('Font Import', () => {
    it('should import fonts.css in main.tsx', () => {
      const mainTSX = readFileSync(join(process.cwd(), 'src/main.tsx'), 'utf-8');
      expect(mainTSX).toMatch(/import\s+["']\.\/fonts\.css["']/);
    });
  });
});

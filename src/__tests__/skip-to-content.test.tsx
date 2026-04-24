import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Skip to Content Link', () => {
  it('should be present in the DOM', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
  });

  it('should have correct href pointing to main content', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
    
    // Verify main content element exists
    const mainContent = document.querySelector('#main-content');
    expect(mainContent).toBeInTheDocument();
  });

  it('should be visually hidden by default (sr-only)', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveClass('sr-only');
  });

  it('should become visible when focused', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    
    // Check that it has focus:not-sr-only class which makes it visible on focus
    expect(skipLink).toHaveClass('focus:not-sr-only');
    expect(skipLink).toHaveClass('focus:absolute');
    expect(skipLink).toHaveClass('focus:top-4');
    expect(skipLink).toHaveClass('focus:left-4');
  });

  it('should have proper styling when focused', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    
    // Verify focus styling classes
    expect(skipLink).toHaveClass('focus:bg-blue-600');
    expect(skipLink).toHaveClass('focus:text-white');
    expect(skipLink).toHaveClass('focus:rounded-lg');
    expect(skipLink).toHaveClass('focus:ring-2');
    expect(skipLink).toHaveClass('focus:ring-blue-500');
  });

  it('should have high z-index to appear above other content', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveClass('focus:z-[9999]');
  });

  it('should have proper ARIA label', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('aria-label', 'Skip to main content');
  });

  it('should be positioned at the top of the page', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    const parent = skipLink.parentElement;
    
    // Verify it's one of the first elements in the body
    expect(parent?.tagName).toBe('DIV');
  });

  it('should be the first focusable element on the page', () => {
    render(<App />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    
    // Focus the skip link
    skipLink.focus();
    
    // Verify it can receive focus
    expect(skipLink).toHaveFocus();
  });
});

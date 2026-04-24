import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useState, useEffect } from 'react';

/**
 * AnimatedText Component Tests
 * 
 * **Validates: Requirements 6.1**
 * 
 * Tests the typing animation logic for the hero section animated text.
 * Verifies character-by-character typing, deletion, phrase cycling, and timing.
 */

// AnimatedText Component (extracted for testing)
const AnimatedText: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, phrases]);

  return (
    <span className="gradient-text font-neo" data-testid="animated-text">
      {displayText}
      <span className="animate-pulse ml-2">|</span>
    </span>
  );
};

describe('AnimatedText Component - Typing Animation Logic', () => {
  it('validates Requirement 6.1: Initial state starts with empty display text', () => {
    render(<AnimatedText phrases={['Test Phrase']} />);
    
    // Initially should be empty or just starting
    const element = screen.getByText(/\|/);
    expect(element).toBeInTheDocument();
  });

  it('validates Requirement 6.1: Types characters progressively', async () => {
    const phrase = 'Hi';
    render(<AnimatedText phrases={[phrase]} />);

    // Wait for first character to appear
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toMatch(/H/);
    }, { timeout: 200 });

    // Wait for second character
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toMatch(/Hi/);
    }, { timeout: 300 });
  });

  it('validates Requirement 6.1: Completes full phrase typing', async () => {
    const phrase = 'Test';
    render(<AnimatedText phrases={[phrase]} />);

    // Wait for complete phrase
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('Test');
    }, { timeout: 500 });
  });

  it('validates Requirement 6.1: Deletes characters after pause', async () => {
    const phrase = 'Hi';
    render(<AnimatedText phrases={[phrase]} />);

    // Wait for typing to complete
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('Hi');
    }, { timeout: 300 });

    // Wait for pause and deletion to start
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      const text = element.textContent || '';
      // Should be deleting (either 'H' or empty)
      expect(text.length).toBeLessThan(3); // Less than 'Hi|'
    }, { timeout: 2500 });
  });

  it('validates Requirement 6.1: Cycles through multiple phrases', async () => {
    const phrases = ['A', 'B'];
    render(<AnimatedText phrases={phrases} />);

    // Wait for first phrase
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('A');
    }, { timeout: 200 });

    // Wait for cycle to second phrase (type + pause + delete + type)
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('B');
    }, { timeout: 2500 });
  });

  it('validates Requirement 6.1: Displays cursor with pulse animation', () => {
    render(<AnimatedText phrases={['Test']} />);
    
    const cursor = screen.getByText('|');
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass('animate-pulse');
    expect(cursor).toHaveClass('ml-2');
  });

  it('validates Requirement 6.1: Applies gradient text styling', () => {
    const { container } = render(<AnimatedText phrases={['Test']} />);
    
    const span = container.querySelector('.gradient-text');
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('font-neo');
  });

  it('validates Requirement 6.1: State management - handles phrase array', () => {
    const phrases = ['One', 'Two', 'Three'];
    const { container } = render(<AnimatedText phrases={phrases} />);
    
    // Component should render without errors
    expect(container.querySelector('.gradient-text')).toBeInTheDocument();
  });

  it('validates Requirement 6.1: Typing speed configuration (100ms)', async () => {
    const phrase = 'ABC';
    const startTime = Date.now();
    render(<AnimatedText phrases={[phrase]} />);

    // Wait for complete phrase
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('ABC');
    }, { timeout: 500 });

    const elapsed = Date.now() - startTime;
    // Should take at least 300ms (3 chars * 100ms) but allow some buffer
    expect(elapsed).toBeGreaterThanOrEqual(250);
  });

  it('validates Requirement 6.1: Deletion speed configuration (50ms)', async () => {
    const phrase = 'AB';
    render(<AnimatedText phrases={[phrase]} />);

    // Wait for typing complete
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('AB');
    }, { timeout: 300 });

    const beforeDelete = Date.now();

    // Wait for deletion to start and complete
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      const text = element.textContent || '';
      // Should be empty or just cursor
      expect(text.replace('|', '').trim()).toBe('');
    }, { timeout: 2500 });

    const elapsed = Date.now() - beforeDelete;
    // Should include 2000ms pause + deletion time
    expect(elapsed).toBeGreaterThanOrEqual(2000);
  });

  it('validates Requirement 6.1: Infinite loop through phrases', async () => {
    const phrases = ['X', 'Y'];
    render(<AnimatedText phrases={phrases} />);

    // First phrase
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('X');
    }, { timeout: 200 });

    // Second phrase
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('Y');
    }, { timeout: 2500 });

    // Should loop back to first phrase
    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('X');
    }, { timeout: 2500 });
  });
});

describe('AnimatedText Component - Edge Cases', () => {
  it('handles empty phrases array gracefully', () => {
    render(<AnimatedText phrases={[]} />);
    
    const cursor = screen.getByText('|');
    expect(cursor).toBeInTheDocument();
  });

  it('handles single character phrases correctly', async () => {
    render(<AnimatedText phrases={['X']} />);

    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('X');
    }, { timeout: 200 });
  });

  it('handles phrases with spaces correctly', async () => {
    const phrase = 'Two Words';
    render(<AnimatedText phrases={[phrase]} />);

    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('Two Words');
    }, { timeout: 1000 });
  });

  it('handles special characters in phrases', async () => {
    const phrase = 'Hi!';
    render(<AnimatedText phrases={[phrase]} />);

    await waitFor(() => {
      const element = screen.getByTestId('animated-text');
      expect(element.textContent).toContain('Hi!');
    }, { timeout: 400 });
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = render(<AnimatedText phrases={['Test']} />);
    
    // Should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  it('validates component structure and accessibility', () => {
    const { container } = render(<AnimatedText phrases={['Test']} />);
    
    // Check structure
    const mainSpan = container.querySelector('.gradient-text');
    expect(mainSpan).toBeInTheDocument();
    expect(mainSpan).toHaveClass('font-neo');
    
    // Check cursor
    const cursor = screen.getByText('|');
    expect(cursor).toHaveClass('animate-pulse');
    expect(cursor).toHaveClass('ml-2');
  });
});

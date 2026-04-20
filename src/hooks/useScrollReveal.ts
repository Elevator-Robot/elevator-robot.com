import { useEffect } from 'react';
import { useRUM } from './useRUM';

/**
 * Custom hook that sets up IntersectionObserver to reveal elements on scroll
 * @param threshold - Percentage of element visibility required to trigger (default: 0.1)
 */
export function useScrollReveal(threshold: number = 0.1): void {
  const { recordEvent } = useRUM();

  useEffect(() => {
    // Select all elements with 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    const trackedSections = new Set<string>();

    // Create IntersectionObserver with specified threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Add 'active' class when element enters viewport
          if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Track section view (only once per section)
            const sectionId = entry.target.closest('section')?.id;
            if (sectionId && !trackedSections.has(sectionId)) {
              trackedSections.add(sectionId);
              recordEvent('section_view', { section: sectionId });
            }
          }
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    // Observe all reveal elements
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    // Cleanup: disconnect observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [threshold, recordEvent]);
}

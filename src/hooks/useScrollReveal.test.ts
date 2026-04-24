import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useScrollReveal } from './useScrollReveal';

describe('useScrollReveal', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockIntersectionObserver: any;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Create mock functions
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock IntersectionObserver as a class constructor
    mockIntersectionObserver = vi.fn(function(callback) {
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
        root: null,
        rootMargin: '0px',
        thresholds: [0.1],
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  it('should set up IntersectionObserver with default threshold', () => {
    // Add elements with 'reveal' class
    document.body.innerHTML = `
      <div class="reveal">Element 1</div>
      <div class="reveal">Element 2</div>
    `;

    renderHook(() => useScrollReveal());

    // Verify IntersectionObserver was created with correct config
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    // Verify all reveal elements are observed
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });

  it('should set up IntersectionObserver with custom threshold', () => {
    document.body.innerHTML = '<div class="reveal">Element</div>';

    renderHook(() => useScrollReveal(0.5));

    // Verify custom threshold is used
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );
  });

  it('should add "active" class when element enters viewport', () => {
    document.body.innerHTML = '<div class="reveal">Element</div>';
    const element = document.querySelector('.reveal') as HTMLElement;

    let observerCallback: IntersectionObserverCallback;
    mockIntersectionObserver = vi.fn(function(callback) {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
      };
    });
    global.IntersectionObserver = mockIntersectionObserver as any;

    renderHook(() => useScrollReveal());

    // Simulate element entering viewport
    const entries: IntersectionObserverEntry[] = [
      {
        isIntersecting: true,
        target: element,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 0.5,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
      },
    ];

    observerCallback!(entries, {} as IntersectionObserver);

    // Verify 'active' class was added
    expect(element.classList.contains('active')).toBe(true);
  });

  it('should not add "active" class when element is not intersecting', () => {
    document.body.innerHTML = '<div class="reveal">Element</div>';
    const element = document.querySelector('.reveal') as HTMLElement;

    let observerCallback: IntersectionObserverCallback;
    mockIntersectionObserver = vi.fn(function(callback) {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
      };
    });
    global.IntersectionObserver = mockIntersectionObserver as any;

    renderHook(() => useScrollReveal());

    // Simulate element NOT entering viewport
    const entries: IntersectionObserverEntry[] = [
      {
        isIntersecting: false,
        target: element,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
      },
    ];

    observerCallback!(entries, {} as IntersectionObserver);

    // Verify 'active' class was NOT added
    expect(element.classList.contains('active')).toBe(false);
  });

  it('should disconnect observer on unmount', () => {
    document.body.innerHTML = '<div class="reveal">Element</div>';

    const { unmount } = renderHook(() => useScrollReveal());

    // Unmount the hook
    unmount();

    // Verify observer was disconnected
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple elements entering viewport', () => {
    document.body.innerHTML = `
      <div class="reveal">Element 1</div>
      <div class="reveal">Element 2</div>
      <div class="reveal">Element 3</div>
    `;
    const elements = Array.from(document.querySelectorAll('.reveal'));

    let observerCallback: IntersectionObserverCallback;
    mockIntersectionObserver = vi.fn(function(callback) {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
      };
    });
    global.IntersectionObserver = mockIntersectionObserver as any;

    renderHook(() => useScrollReveal());

    // Simulate all elements entering viewport
    const entries: IntersectionObserverEntry[] = elements.map((element) => ({
      isIntersecting: true,
      target: element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0.5,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0,
    }));

    observerCallback!(entries, {} as IntersectionObserver);

    // Verify all elements have 'active' class
    elements.forEach((element) => {
      expect(element.classList.contains('active')).toBe(true);
    });
  });

  it('should not observe elements without "reveal" class', () => {
    document.body.innerHTML = `
      <div class="reveal">Reveal Element</div>
      <div class="other">Other Element</div>
    `;

    renderHook(() => useScrollReveal());

    // Should only observe the one element with 'reveal' class
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });
});

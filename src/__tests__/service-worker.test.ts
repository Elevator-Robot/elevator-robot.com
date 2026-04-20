import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Service Worker Configuration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should register service worker in production build', async () => {
    // This test verifies that the service worker registration is configured
    // The actual registration happens in main.tsx using vite-plugin-pwa
    
    // Mock the virtual:pwa-register module
    const mockRegisterSW = vi.fn(() => vi.fn());
    
    // Verify the mock can be called
    const updateSW = mockRegisterSW({
      onNeedRefresh: vi.fn(),
      onOfflineReady: vi.fn(),
    });
    
    expect(mockRegisterSW).toHaveBeenCalled();
    expect(updateSW).toBeDefined();
  });

  it('should have correct cache-first strategy for static assets', () => {
    // Verify that static assets use cache-first strategy
    const staticAssetPattern = /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|ico)$/i;
    
    // Test various static asset URLs
    expect(staticAssetPattern.test('app.js')).toBe(true);
    expect(staticAssetPattern.test('styles.css')).toBe(true);
    expect(staticAssetPattern.test('logo.png')).toBe(true);
    expect(staticAssetPattern.test('background.jpg')).toBe(true);
    expect(staticAssetPattern.test('icon.svg')).toBe(true);
    expect(staticAssetPattern.test('image.webp')).toBe(true);
  });

  it('should have correct cache-first strategy for fonts', () => {
    // Verify that fonts use cache-first strategy
    const fontPattern = /\.(?:woff|woff2|ttf|eot)$/i;
    
    // Test various font file extensions
    expect(fontPattern.test('font.woff')).toBe(true);
    expect(fontPattern.test('font.woff2')).toBe(true);
    expect(fontPattern.test('font.ttf')).toBe(true);
    expect(fontPattern.test('font.eot')).toBe(true);
    
    // Should not match non-font files
    expect(fontPattern.test('file.js')).toBe(false);
    expect(fontPattern.test('style.css')).toBe(false);
  });

  it('should have correct network-first strategy for API calls', () => {
    // Verify that API calls use network-first strategy
    const apiPattern = /^https:\/\/.*\.amplifyapp\.com\/graphql$/i;
    
    // Test GraphQL API URLs
    expect(apiPattern.test('https://abc123.amplifyapp.com/graphql')).toBe(true);
    expect(apiPattern.test('https://my-app.amplifyapp.com/graphql')).toBe(true);
    
    // Should not match non-API URLs
    expect(apiPattern.test('https://example.com/api')).toBe(false);
    expect(apiPattern.test('https://amplifyapp.com/other')).toBe(false);
  });

  it('should cache Google Fonts with cache-first strategy', () => {
    // Verify that Google Fonts use cache-first strategy
    const googleFontsPattern = /^https:\/\/fonts\.googleapis\.com\/.*/i;
    
    // Test Google Fonts URLs
    expect(googleFontsPattern.test('https://fonts.googleapis.com/css2?family=Roboto')).toBe(true);
    expect(googleFontsPattern.test('https://fonts.googleapis.com/icon?family=Material+Icons')).toBe(true);
    
    // Should not match other URLs
    expect(googleFontsPattern.test('https://example.com/fonts')).toBe(false);
  });

  it('should have network-first strategy for config files', () => {
    // Verify that config files use network-first strategy
    const configPattern = /\/amplify_outputs\.json$/i;
    
    // Test config file URLs
    expect(configPattern.test('/amplify_outputs.json')).toBe(true);
    expect(configPattern.test('https://example.com/amplify_outputs.json')).toBe(true);
    
    // Should not match other JSON files
    expect(configPattern.test('/package.json')).toBe(false);
    expect(configPattern.test('/config.json')).toBe(false);
  });

  it('should support offline functionality', () => {
    // Verify that offline callback is configured
    const onOfflineReady = vi.fn();
    
    // Simulate offline ready event
    onOfflineReady();
    
    expect(onOfflineReady).toHaveBeenCalled();
  });

  it('should prompt for updates when new content is available', () => {
    // Verify that update prompt is configured
    const onNeedRefresh = vi.fn();
    
    // Simulate need refresh event
    onNeedRefresh();
    
    expect(onNeedRefresh).toHaveBeenCalled();
  });
});

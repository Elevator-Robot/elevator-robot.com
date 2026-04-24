import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('ARIA Labels and Roles', () => {
  it('should have proper landmark roles for main sections', () => {
    render(<App />);
    
    // Check for navigation landmark
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    
    // Check for main content landmark
    const main = document.querySelector('main#main-content');
    expect(main).toBeInTheDocument();
    
    // Check for banner role (hero section)
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    
    // Check for region roles on sections
    const servicesRegion = screen.getByRole('region', { name: /what we do/i });
    expect(servicesRegion).toBeInTheDocument();
    
    const aboutRegion = screen.getByRole('region', { name: /building the future/i });
    expect(aboutRegion).toBeInTheDocument();
    
    const contactRegion = screen.getByRole('region', { name: /let's build something/i });
    expect(contactRegion).toBeInTheDocument();
  });

  it('should have ARIA labels on all interactive elements', () => {
    render(<App />);
    
    // Check navigation links
    const servicesLink = screen.getAllByRole('link', { name: /navigate to services section/i })[0];
    expect(servicesLink).toBeInTheDocument();
    
    const aboutLink = screen.getAllByRole('link', { name: /navigate to about section/i })[0];
    expect(aboutLink).toBeInTheDocument();
    
    // Check mobile menu button
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should have ARIA labels on icon-only buttons', () => {
    render(<App />);
    
    // Check mobile menu button (icon-only)
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toHaveAttribute('aria-label');
    
    // Check social media links (icon-only)
    const githubLinks = screen.getAllByRole('link', { name: /visit elevator robot on github/i });
    expect(githubLinks.length).toBeGreaterThan(0);
    githubLinks.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
    });
    
    const xLinks = screen.getAllByRole('link', { name: /visit elevator robot on x/i });
    expect(xLinks.length).toBeGreaterThan(0);
    xLinks.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
    });
  });

  it('should have proper heading hierarchy', () => {
    render(<App />);
    
    // Check for h1 (site title in navigation)
    const h1 = screen.getByRole('heading', { level: 1, name: /elevator robot/i });
    expect(h1).toBeInTheDocument();
    
    // Check for h2 headings in sections
    const servicesHeading = screen.getByRole('heading', { level: 2, name: /what we do/i });
    expect(servicesHeading).toBeInTheDocument();
    
    const aboutHeading = screen.getByRole('heading', { level: 2, name: /building the future/i });
    expect(aboutHeading).toBeInTheDocument();
    
    const contactHeading = screen.getByRole('heading', { level: 2, name: /let's build something/i });
    expect(contactHeading).toBeInTheDocument();
  });

  it('should have ARIA labels on service cards', () => {
    render(<App />);
    
    // Check for service card articles with proper labels
    const apiCard = screen.getByRole('article', { name: /api development/i });
    expect(apiCard).toBeInTheDocument();
    
    const cloudCard = screen.getByRole('article', { name: /cloud infrastructure/i });
    expect(cloudCard).toBeInTheDocument();
    
    const automationCard = screen.getByRole('article', { name: /automation/i });
    expect(automationCard).toBeInTheDocument();
  });

  it('should have skip-to-content link for keyboard users', () => {
    render(<App />);
    
    // Check for skip link
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('sr-only');
  });

  it('should have proper form labels', () => {
    render(<App />);
    
    // Check contact form labels - use more specific selectors
    const nameInput = screen.getByLabelText(/^name$/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('aria-required', 'true');
    
    const emailInput = screen.getByRole('textbox', { name: /^email$/i });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    
    const messageInput = screen.getByLabelText(/^message$/i);
    expect(messageInput).toBeInTheDocument();
    expect(messageInput).toHaveAttribute('aria-required', 'true');
  });

  it('should have aria-hidden on decorative elements', () => {
    render(<App />);
    
    // Check that decorative SVG icons have aria-hidden
    const decorativeIcons = document.querySelectorAll('.service-icon-3d svg');
    decorativeIcons.forEach(icon => {
      expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('should have complementary role on YouTube playlist', () => {
    render(<App />);
    
    // Check for complementary landmark (YouTube playlist)
    const complementary = screen.getByRole('complementary', { name: /background music playlist/i });
    expect(complementary).toBeInTheDocument();
  });

  it('should have proper dialog roles and labels', () => {
    render(<App />);
    
    // Check mobile menu dialog
    const mobileMenuDialog = screen.getByRole('dialog', { name: /mobile navigation menu/i });
    expect(mobileMenuDialog).toBeInTheDocument();
    expect(mobileMenuDialog).toHaveAttribute('aria-modal', 'true');
  });
});

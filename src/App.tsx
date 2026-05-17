import { useState, useEffect, lazy, Suspense } from "react";
import { useRUM } from './hooks/useRUM';

// Lazy load non-critical components
const ContactForm = lazy(() => import('./components/ContactForm').then(module => ({ default: module.ContactForm })));
const ServiceCard = lazy(() => import('./components/ServiceCard').then(module => ({ default: module.ServiceCard })));
const ContactFormSection = lazy(() => import('./components/ContactFormSection').then(module => ({ default: module.ContactFormSection })));
const YouTubeEmbed = lazy(() => import('./components/YouTubeEmbed').then(module => ({ default: module.YouTubeEmbed })));
const MonitoringTest = lazy(() => import('./pages/MonitoringTest'));

// Animated Text Component
const AnimatedText: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const longestPhrase = phrases.reduce((longest, phrase) => (
    phrase.length > longest.length ? phrase : longest
  ), phrases[0] || "");

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
    <span className="animated-text-shell gradient-text font-neo">
      <span className="animated-text-sizer" aria-hidden="true">
        {longestPhrase}
        <span className="ml-2">|</span>
      </span>
      <span className="animated-text-live">
        {displayText}
        <span className="animate-pulse ml-2">|</span>
      </span>
    </span>
  );
};

// Scroll Reveal Hook
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
    });

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      observer.observe(el);
      
      // Check if element is already in viewport on mount
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        el.classList.add('active');
      }
    });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
};

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const showContact = false; // Feature flag for contact button
  const { recordEvent } = useRUM();
  
  // Check if monitoring test page should be shown (development only)
  const [showMonitoringTest, setShowMonitoringTest] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('test') === 'monitoring') {
      setShowMonitoringTest(true);
    }
  }, []);
  
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1);

      document.documentElement.style.setProperty("--elevator-progress", `${progress}`);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    updateScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Smooth scroll behavior for navigation links
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = id ? document.getElementById(id) : null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Track navigation click
          recordEvent('navigation_click', { destination: id });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, [recordEvent]);

  const toggleContact = () => {
    const newState = !isContactOpen;
    setIsContactOpen(newState);
    // Track contact form open/close
    recordEvent('contact_form_toggle', { opened: newState });
  };



  // Show monitoring test page if requested
  if (showMonitoringTest) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><span className="text-white">Loading...</span></div>}>
        <MonitoringTest />
      </Suspense>
    );
  }

  return (
    <div className="bg-black text-white relative site-shell">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      {/* Background image with overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: 'url(/background-optimized.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#080811]/70 to-black/90"></div>
      </div>

      {/* Content wrapper with z-index */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className={`nav-modern ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-2xl font-bold gradient-text font-['Audiowide']" role="heading" aria-level={1}>Elevator Robot</div>
            <span className="text-gray-500 text-sm font-['Audiowide']" aria-hidden="true">|</span>
            <div className="text-sm text-gray-400 font-['Audiowide']">Software Studio</div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="link-underline font-['Audiowide']" aria-label="Navigate to Services section">Services</a>
            <a href="#about" className="link-underline font-['Audiowide']" aria-label="Navigate to About section">About</a>
            <a href="#contact" className="link-underline font-['Audiowide']" aria-label="Navigate to Contact section">Let's Talk</a>
            
            {showContact && (
              <div className="relative">
                <button onClick={toggleContact} className="link-underline font-['Audiowide']" aria-label="Open contact form" aria-expanded={isContactOpen}>Contact</button>
                
                {/* Contact Form Popup Bubble - Lazy Loaded */}
                <Suspense fallback={<div className="absolute top-full right-0 mt-4 w-[400px] h-[300px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-card flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>}>
                  <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
                </Suspense>
              </div>
            )}
          </div>

          {/* Mobile Navigation - Only "Let's Talk" */}
          <div className="md:hidden">
            <a href="#contact" className="link-underline font-['Audiowide'] text-sm" aria-label="Navigate to Contact section">Let's Talk</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content">
      {/* Hero Section with Animated Background */}
      <section className="hero-elevator relative min-h-screen flex items-center justify-center" role="banner" aria-label="Hero section">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-image-layer"
          style={{
            backgroundImage: 'url(/background-optimized.png)',
            filter: 'brightness(0.58) saturate(1.2)'
          }}
          aria-hidden="true"
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 hero-overlay" aria-hidden="true"></div>
        
        {/* Content */}
        <div className="relative z-10 px-6 max-w-7xl w-full hero-grid">
          <div className="hero-copy">
          <div className="mb-12 space-y-6">
            <div className="hero-title-wrap">
              <h1 className="hero-title-flash font-['Audiowide']">
                <span className="hero-static">Elevate Your</span>
                <span className="gradient-text">
                  <AnimatedText phrases={[
                    "Software",
                    "Automation",
                    "Client Experience"
                  ]} />
                </span>
              </h1>
            </div>
            
            <p className="hero-lede font-['Audiowide']">
              We build polished web products, APIs, cloud systems, and automation that make your company look sharper, move faster, and win better clients.
            </p>
          </div>

          <div className="hero-cta-row">
            <a href="#contact" className="cta-primary font-['Audiowide']" onClick={() => recordEvent('hero_cta_click', { destination: 'contact' })}>
              Start a Project
            </a>
            <a href="#services" className="cta-secondary font-['Audiowide']" onClick={() => recordEvent('hero_cta_click', { destination: 'services' })}>
              See Capabilities
            </a>
          </div>

          {/* Featured Project - Brain In Cup */}
          <div className="mt-14 featured-project-wrap">
            <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-['Audiowide']">Featured Project</p>
            
            <a
              href="https://brainincup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group featured-project-card"
              aria-label="Visit Brain In Cup project (opens in new tab)"
              onClick={() => recordEvent('external_link_click', { destination: 'brainincup', location: 'hero' })}
            >
              <div className="logo-orb-modern" style={{ width: '80px', height: '80px', flexShrink: 0 }} aria-hidden="true">
                <img 
                  src="/images/brainincup-logo-optimized.png"
                  alt="Brain In Cup logo"
                  className="w-full h-full object-cover rounded-full p-2"
                  width="80"
                  height="80"
                  loading="lazy"
                />
              </div>
              
              <div className="text-left flex-1 min-w-0">
                <h3 className="text-3xl font-bold mb-2 gradient-text font-['Audiowide']">Brain In Cup</h3>
                <p className="text-gray-300 font-['Audiowide']">A vivid interactive product experience built to be remembered</p>
              </div>
              
              <svg className="w-8 h-8 text-blue-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Additional Links */}
          <div className="mt-12 flex justify-center gap-6">
            <a 
              href="https://github.com/Elevator-Robot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Visit Elevator Robot on GitHub (opens in new tab)"
              onClick={() => recordEvent('external_link_click', { destination: 'github', location: 'hero' })}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-['Audiowide']">GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/company/elevatorrobot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Visit Elevator Robot on LinkedIn (opens in new tab)"
              onClick={() => recordEvent('external_link_click', { destination: 'linkedin', location: 'hero' })}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="font-['Audiowide']">LinkedIn</span>
            </a>
          </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-revolutionary section-dark relative" role="region" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 id="services-heading" className="text-5xl md:text-6xl font-bold mb-6 gradient-text font-['Audiowide']">
              What We Do
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Specialized in building scalable, innovative software solutions
            </p>
          </div>

          <div className="services-revolutionary">
            <Suspense fallback={<div className="text-center text-gray-400">Loading services...</div>}>
              <ServiceCard
                titleId="service-api-title"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title="Revenue-Ready Web Apps"
                description="Polished interfaces, customer portals, and product experiences that help clients trust your business from the first click"
              />

              <ServiceCard
                titleId="service-ai-workflows-title"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7a3 3 0 106 0 3 3 0 00-6 0zM15 17a3 3 0 106 0 3 3 0 00-6 0zM3 17a3 3 0 106 0 3 3 0 00-6 0zM11 8.5l4 6M9 16h6" />
                  </svg>
                }
                title="AI Workflow Automation"
                description="Agent chains, graph-based workflows, and AI-assisted operations designed around real business steps instead of demos"
              />

              <ServiceCard
                titleId="service-cloud-title"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                }
                title="Cloud Systems"
                description="Fast APIs, secure AWS infrastructure, observability, and deployment pipelines built to support real growth"
              />

              <ServiceCard
                titleId="service-automation-title"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="Internal Tools"
                description="Dashboards, admin panels, and operational systems that replace manual handoffs and give teams a cleaner way to work"
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-revolutionary relative" role="region" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="about-revolutionary">
            <div className="about-content reveal">
              <h2 id="about-heading" className="about-title font-['Audiowide']">
                From first impression to launch floor
              </h2>
              <p className="about-text">
                Elevator Robot is a boutique software studio for businesses that need their digital presence to sell trust immediately. We turn rough ideas, dated workflows, and underwhelming websites into sharp systems clients can believe in.
              </p>
              <p className="about-text">
                The work is equal parts product strategy, engineering, and showmanship: clear UX, reliable infrastructure, memorable motion, and pragmatic automation that keeps paying off after launch.
              </p>
              <div className="tech-stack">
                <span className="tech-tag">Discovery</span>
                <span className="tech-tag">Prototype</span>
                <span className="tech-tag">Build</span>
                <span className="tech-tag">Launch</span>
              </div>
            </div>
            <div className="terminal-window reveal" aria-label="Code demonstration">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="terminal-button close"></span>
                  <span className="terminal-button minimize"></span>
                  <span className="terminal-button maximize"></span>
                </div>
                <div className="terminal-title">~/elevator-robot</div>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-command">npm run build</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-output">✓ Building production bundle...</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-output">✓ Optimizing assets...</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-output">✓ Running tests...</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-output success">✓ Build successful!</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Lazy Loaded */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-400">Loading contact form...</span></div>}>
        <ContactFormSection />
      </Suspense>
      </main>

      {/* Fixed YouTube Playlist - Bottom Right - Lazy Loaded */}
      <Suspense fallback={null}>
        <YouTubeEmbed />
      </Suspense>
      </div> {/* Close content wrapper */}
    </div>
  );
}

export default App;

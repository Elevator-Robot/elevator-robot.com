import { useState, useEffect, FormEvent, useRef } from "react";
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';

// Animated Text Component
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
    <span className="gradient-text">
      {displayText}
      <span className="animate-pulse ml-2">|</span>
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
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// Mouse Follower
const useMouseFollower = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ref.current.style.setProperty('--mouse-x', `${x}%`);
      ref.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const element = ref.current;
    element?.addEventListener('mousemove', handleMouseMove);
    return () => element?.removeEventListener('mousemove', handleMouseMove);
  }, [ref]);
};

function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const cardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  
  cardRefs.forEach(ref => useMouseFollower(ref));
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const client = generateClient();
      await client.graphql({
        query: mutations.sendMessage,
        variables: formData
      });
      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`nav-modern ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-bold gradient-text">Elevator Robot</div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('tools')} className="link-underline">Tools</button>
            <div className="relative">
              <button onClick={toggleContact} className="link-underline">Contact</button>
              
              {/* Contact Form Popup Bubble */}
              <div 
                className={`absolute top-full right-0 mt-4 w-[400px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-top-right ${
                  isContactOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 1002 }}
              >
                {/* Arrow */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-black/95 border-l border-t border-white/10 transform rotate-45"></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold gradient-text">Get in Touch</h3>
                    <button 
                      onClick={() => setIsContactOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500 text-sm"
                    />
                    
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500 text-sm"
                    />
                    
                    <textarea
                      rows={3}
                      required
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none text-white placeholder-gray-500 text-sm"
                    />
                    
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform font-semibold text-sm"
                    >
                      {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>

                    {submitStatus === 'success' && (
                      <div className="text-center p-2 bg-green-500/20 border border-green-500 rounded-xl">
                        <p className="text-green-300 text-xs">✅ Message sent!</p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="text-center p-2 bg-red-500/20 border border-red-500 rounded-xl">
                        <p className="text-red-300 text-xs">❌ Failed to send</p>
                      </div>
                    )}
                  </form>

                  <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs">
                    <a href="mailto:hello@elevatorrobot.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Email
                    </a>
                    <a 
                      href="https://github.com/Elevator-Robot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="md:hidden relative z-[1001] w-10 h-10 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
            <button onClick={() => scrollToSection('tools')} className="hover:text-blue-400 transition-colors">Tools</button>
            <button onClick={toggleContact} className="hover:text-blue-400 transition-colors">Contact</button>
          </div>

          {/* Mobile Contact Form */}
          {isContactOpen && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
              <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold gradient-text">Get in Touch</h3>
                  <button 
                    onClick={() => setIsContactOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500"
                  />
                  
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500"
                  />
                  
                  <textarea
                    rows={4}
                    required
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none text-white placeholder-gray-500"
                  />
                  
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform font-semibold"
                  >
                    {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="text-center p-3 bg-green-500/20 border border-green-500 rounded-xl">
                      <p className="text-green-300">✅ Message sent successfully!</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="text-center p-3 bg-red-500/20 border border-red-500 rounded-xl">
                      <p className="text-red-300">❌ Failed to send</p>
                    </div>
                  )}
                </form>

                <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
                  <a href="mailto:hello@elevatorrobot.com" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Email
                  </a>
                  <a 
                    href="https://github.com/Elevator-Robot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero with Floating Content */}
      <section className="hero-modern">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        
        <div className="relative z-10 px-6 max-w-7xl mx-auto h-full flex flex-col">
          {/* Hero Content - Top */}
          <div className="text-center pt-20 pb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 stagger-item">
              <AnimatedText phrases={[
                "AI Tools for Creators",
                "Write Better Content",
                "Generate Precise Images",
                "Empower Creativity"
              ]} />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 stagger-item max-w-3xl mx-auto">
              Build amazing things with our suite of AI-powered creative tools
            </p>
          </div>

          {/* Floating Tool Cards - Bottom */}
          <div className="flex-1 flex items-end pb-16">
            <div className="w-full space-y-6 reveal">
              {/* Top Row: Image Studio & Text Studio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Studio */}
                <div ref={cardRefs[0]} className="project-card-modern stagger-item">
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Image Studio</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      AI image generation with base image support for precise control
                    </p>
                    <a 
                      href="https://studio.elevatorrobot.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
                    >
                      Try It Now <span>→</span>
                    </a>
                  </div>
                </div>

                {/* Text Studio */}
                <div ref={cardRefs[1]} className="project-card-modern stagger-item">
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Text Studio</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      Context-aware AI writing with document upload and research
                    </p>
                    <a 
                      href="https://studio.elevatorrobot.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
                    >
                      Try It Now <span>→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Brain In Cup - Full Width */}
              <a 
                href="https://brainincup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block stagger-item"
              >
                <div className="glass-card hover:scale-105 transition-all p-6">
                  <div className="flex items-center gap-6">
                    <div className="logo-orb-modern" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                      <img 
                        src="/images/brainincup-logo.png"
                        alt="Brain In Cup"
                        className="w-full h-full object-cover rounded-full p-2"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">Brain In Cup</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        All-in-one AI workspace 😎
                      </p>
                    </div>

                    <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center pb-8">
            <a 
              href="https://github.com/Elevator-Robot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold gradient-text mb-4">Elevator Robot</div>
            <p className="text-gray-400">Building AI tools for creators</p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8">
            <a 
              href="https://brainincup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Brain In Cup
            </a>
            <a 
              href="https://github.com/Elevator-Robot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://twitter.com/elevatorrobot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
          
          <div className="text-center text-gray-500 text-sm border-t border-white/5 pt-8">
            © 2025 Elevator Robot. Built with ❤️ and ☕
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

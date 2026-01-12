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
    setIsMenuOpen(false);
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
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-modern">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 stagger-item">
            <AnimatedText phrases={[
              "AI Tools for Creators",
              "Write Better Content",
              "Generate Precise Images",
              "Empower Creativity"
            ]} />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 stagger-item max-w-3xl mx-auto">
            Build amazing things with our suite of AI-powered creative tools
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center stagger-item">
            <a 
              href="https://brainincup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic"
            >
              <span>Try Brain In Cup →</span>
            </a>
            <button 
              onClick={() => scrollToSection('tools')}
              className="btn-magnetic"
              style={{ background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}
            >
              <span>Explore Tools</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="section-modern relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Tools for Creators
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Specialized AI tools designed to enhance your creative workflow
            </p>
          </div>

          <div className="bento-grid reveal">
            {/* Image Studio */}
            <div ref={cardRefs[0]} className="project-card-modern stagger-item">
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Image Studio</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Collaborative AI image generation with spaces and galleries. Use base images for precise control over your AI-generated art.
                </p>
                <a 
                  href="https://studio.elevatorrobot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Try It Now <span>→</span>
                </a>
              </div>
            </div>

            {/* Text Studio */}
            <div ref={cardRefs[1]} className="project-card-modern stagger-item">
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Text Studio</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Context-aware AI writing with document upload and research capabilities. Write better content with intelligent context understanding.
                </p>
                <a 
                  href="https://studio.elevatorrobot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Try It Now <span>→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 reveal">
            <a 
              href="https://brainincup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-6 p-6 glass-card hover:scale-105 transition-all max-w-2xl"
            >
              <div className="logo-orb-modern" style={{ width: '80px', height: '80px' }}>
                <img 
                  src="/images/brainincup-logo.png"
                  alt="Brain In Cup"
                  className="w-full h-full object-cover rounded-full p-2"
                />
              </div>
              
              <div className="text-left flex-1">
                <h4 className="text-xl font-bold mb-2">Brain In Cup</h4>
                <p className="text-gray-400 text-sm">
                  All-in-one AI workspace combining image generation, text generation, and chat
                </p>
              </div>
              
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
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

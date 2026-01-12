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
            <button onClick={() => scrollToSection('about')} className="link-underline">About</button>
            <button onClick={() => scrollToSection('tools')} className="link-underline">Tools</button>
            <button onClick={() => scrollToSection('contact')} className="link-underline">Contact</button>
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
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">About</button>
            <button onClick={() => scrollToSection('tools')} className="hover:text-blue-400 transition-colors">Tools</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition-colors">Contact</button>
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

          <div className="text-center mt-16 reveal">
            <a 
              href="https://github.com/Elevator-Robot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-modern relative bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-400">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="glass-card reveal">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500"
              />
              
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500"
              />
              
              <textarea
                rows={5}
                required
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-all resize-none text-white placeholder-gray-500"
              />
              
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="btn-magnetic w-full"
              >
                <span>{submitStatus === 'loading' ? 'Sending...' : 'Send Message'}</span>
              </button>

              {submitStatus === 'success' && (
                <div className="text-center p-4 bg-green-500/20 border border-green-500 rounded-2xl">
                  <p className="text-green-300">✅ Message sent successfully!</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="text-center p-4 bg-red-500/20 border border-red-500 rounded-2xl">
                  <p className="text-red-300">❌ Failed to send. Please try again.</p>
                </div>
              )}
            </form>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-8 text-center reveal">
            <div>
              <p className="text-gray-400 mb-2">Email</p>
              <a href="mailto:hello@elevatorrobot.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                hello@elevatorrobot.com
              </a>
            </div>
            <div>
              <p className="text-gray-400 mb-2">GitHub</p>
              <a 
                href="https://github.com/Elevator-Robot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Elevator-Robot
              </a>
            </div>
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

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
    <span className="gradient-text font-neo">
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
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const showContact = false; // Feature flag for contact button
  
  const cardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  
  cardRefs.forEach(ref => useMouseFollower(ref));
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Background image with overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/background.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Content wrapper with z-index */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className={`nav-modern ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold gradient-text font-['Audiowide']">Elevator Robot</div>
            <span className="text-gray-500 text-sm font-['Audiowide']">|</span>
            <div className="text-sm text-gray-400 font-['Audiowide']">Software Studio</div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {showContact && (
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
                    <h3 className="text-xl font-bold gradient-text font-['Audiowide']">Get in Touch</h3>
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
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform font-semibold text-sm font-['Audiowide']"
                    >
                      {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>

                    {submitStatus === 'success' && (
                      <div className="text-center p-2 bg-green-500/20 border border-green-500 rounded-xl">
                        <p className="text-green-300 text-xs font-['Audiowide']">✅ Message sent!</p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="text-center p-2 bg-red-500/20 border border-red-500 rounded-xl">
                        <p className="text-red-300 text-xs font-['Audiowide']">❌ Failed to send</p>
                      </div>
                    )}
                  </form>

                  <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs font-['Audiowide']">
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
            )}
          </div>

        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.png)',
            filter: 'brightness(0.6)'
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="mb-12 space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">
                <AnimatedText phrases={[
                  "Crafting Software",
                  "Creating Experiences",
                  "Pushing Boundaries"
                ]} />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-['Audiowide']">
              A software studio building innovative products and experiences
            </p>
          </div>

          {/* Featured Project - Brain In Cup */}
          <div className="mt-16">
            <p className="text-sm text-gray-400 mb-6 uppercase tracking-wider font-['Audiowide']">Featured Project</p>
            
            <a
              href="https://brainincup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-6 px-8 py-6 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl transition-all hover:scale-105 hover:border-blue-400/50"
            >
              <div className="logo-orb-modern" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                <img 
                  src="/images/brainincup-logo.png"
                  alt="Brain In Cup"
                  className="w-full h-full object-cover rounded-full p-2"
                />
              </div>
              
              <div className="text-left flex-1">
                <h3 className="text-3xl font-bold mb-2 gradient-text font-['Audiowide']">Brain In Cup</h3>
                <p className="text-gray-400 font-['Audiowide']">An interactive interface with consciousness</p>
              </div>
              
              <svg className="w-8 h-8 text-blue-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-['Audiowide']">GitHub</span>
            </a>
            
            <a 
              href="https://x.com/aphexlog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all hover:scale-105"
              aria-label="X (formerly Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Fixed YouTube Playlist - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
        <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black/90 backdrop-blur-sm">
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded text-xs text-white/80 z-10 font-['Audiowide']">
            🎵 Vibe Playlist
          </div>
          <iframe 
            className="w-80 h-48"
            src="https://www.youtube.com/embed/videoseries?si=HPH4YqbyRTiUCcUE&amp;list=PL_FQk-lMytvI8hwX4q6SJ0XvLr5mxa0DQ" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          />
        </div>
      </div>
      </div> {/* Close content wrapper */}
    </div>
  );
}

export default App;

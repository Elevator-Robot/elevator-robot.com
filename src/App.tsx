import { useState, FormEvent, useEffect, useRef } from "react";
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';

// Advanced Typewriter Effect with Multiple Lines
interface AdvancedTypewriterProps {
  phrases: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
}

const AdvancedTypewriter: React.FC<AdvancedTypewriterProps> = ({ 
  phrases, 
  speed = 100, 
  deleteSpeed = 50, 
  pauseTime = 2000,
  className = "" 
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentPhraseIndex, isDeleting, phrases, speed, deleteSpeed, pauseTime]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse ml-1 text-blue-400">|</span>
    </span>
  );
};

// Revolutionary 3D Card Component
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const Card3D: React.FC<Card3DProps> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

// Floating Particles Component
const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white rounded-full opacity-20"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animation: `particle-drift ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Advanced Scroll Animation Hook
const useAdvancedScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          if (entry.intersectionRatio > 0.5) {
            element.classList.add('animate-in-full');
          } else {
            element.classList.add('animate-in-partial');
          }
          
          // Add staggered animation to children
          const children = element.querySelectorAll('.stagger-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.advanced-animate');
    animateElements.forEach(el => observer.observe(el));

    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, []);
};

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use advanced scroll animations
  useAdvancedScrollAnimation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const client = generateClient();
      
      console.log('Sending message with client:', client);
      console.log('Form data:', { name: formData.name, email: formData.email, message: formData.message });
      
      const response = await client.graphql({
        query: mutations.sendMessage,
        variables: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });

      console.log('Message sent successfully:', response);
      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "" });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if it's a credentials issue
      if (error && typeof error === 'object' && 'name' in error && error.name === 'NoCredentials') {
        console.error('AWS credentials not configured. Make sure amplify_outputs.json is properly configured.');
      }
      
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
      </div>

      {/* Side Navigation */}
      <nav className={`fixed top-0 left-0 z-50 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-r border-white border-opacity-20 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="nav-logo text-xl">Elevator Robot</div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="block h-0.5 w-full bg-white rotate-45 translate-y-0"></span>
                <span className="block h-0.5 w-full bg-white -rotate-45 -translate-y-0"></span>
              </div>
            </button>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => {
                scrollToSection('about');
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left py-4 px-4 text-lg font-medium text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 hover:translate-x-2"
            >
              About
            </button>
            <button 
              onClick={() => {
                scrollToSection('services');
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left py-4 px-4 text-lg font-medium text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 hover:translate-x-2"
            >
              Services
            </button>
            <button 
              onClick={() => {
                scrollToSection('contact');
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left py-4 px-4 text-lg font-medium text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 hover:translate-x-2"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className={`transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-80' : 'translate-x-0'}`}>
        
        {/* Revolutionary Navigation */}
        <nav className="nav-container">
          <div className="flex items-center justify-between w-full">
            <div className="nav-logo">Elevator Robot</div>
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('about')} className="nav-link">
                About
              </button>
              <button onClick={() => scrollToSection('services')} className="nav-link">
                Services
              </button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">
                Contact
              </button>
            </div>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block h-0.5 w-full bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

      {/* Revolutionary Hero Section */}
      <section className="hero-revolution">
        {/* Advanced Background System */}
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
        
        {/* 3D Grid Background */}
        <div className="grid-3d"></div>
        
        {/* Floating Particles */}
        <FloatingParticles />

        {/* Hero Content */}
        <div className="hero-content-revolutionary">
          <h1 className="hero-title-revolutionary">
            <AdvancedTypewriter 
              phrases={[
                "We Build the Future",
                "AI Revolution Starts Here",
                "Innovation Beyond Limits",
                "Your Digital Transformation"
              ]}
              speed={150}
              deleteSpeed={75}
              pauseTime={3000}
            />
          </h1>
          
          <p className="hero-subtitle">
            Cutting-edge AI solutions and web applications that transform businesses and create extraordinary digital experiences.
          </p>
          
          <div className="hero-cta-group">
            <button 
              className="cta-primary"
              onClick={() => scrollToSection('contact')}
            >
              Start Your Project
            </button>
            <button 
              className="cta-secondary"
              onClick={() => scrollToSection('about')}
            >
              Explore Our Services
            </button>
          </div>
        </div>


      </section>

      {/* Revolutionary About Section */}
      <section id="about" className="section-revolutionary section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-revolutionary advanced-animate">
            <div className="about-content">
              <h2 className="about-title stagger-child">
                Innovation Meets Excellence
              </h2>
              <p className="about-text stagger-child">
                We build digital solutions that matter. Whether you need a stunning website to sell your products, 
                a custom web application, or advanced AI integration, we'll work with you to bring your vision to life.
              </p>
              <p className="about-text stagger-child">
                As both developers and web designers, we create everything from e-commerce sites and business websites 
                to cutting-edge AI applications. We focus on building solutions that drive real results for your business.
              </p>


            </div>

            <div className="skills-3d stagger-child">
              <div className="skill-orb">
                <div>AI/ML</div>
              </div>
              <div className="skill-orb">
                <div>Web Dev</div>
              </div>
              <div className="skill-orb">
                <div>Design</div>
              </div>
              <div className="skill-orb">
                <div>Innovation</div>
              </div>
              <div className="skill-orb">
                <div>Strategy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Services Section */}
      <section id="services" className="section-revolutionary section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 advanced-animate">
            <h2 className="about-title text-white stagger-child">
              Our Services
            </h2>
            <p className="hero-subtitle text-white stagger-child">
              We don't just build applications - we craft digital experiences that define the future
            </p>
          </div>

          <div className="services-revolutionary advanced-animate">
            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">AI-Powered Applications</h3>
                <p className="service-description-3d">
                  Custom AI solutions that learn, adapt, and evolve with your business needs. 
                  From machine learning models to intelligent automation.
                </p>
              </div>
            </Card3D>

            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">Next-Gen Web Experiences</h3>
                <p className="service-description-3d">
                  Revolutionary web applications with cutting-edge 3D graphics, immersive interactions, 
                  and performance that sets new industry standards.
                </p>
              </div>
            </Card3D>

            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">Digital Transformation</h3>
                <p className="service-description-3d">
                  Complete business transformation through technology. We reimagine processes, 
                  workflows, and customer experiences from the ground up.
                </p>
              </div>
            </Card3D>

            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">Innovation Labs</h3>
                <p className="service-description-3d">
                  Experimental projects that push the boundaries of what's possible. 
                  From blockchain to AR/VR, we explore tomorrow's technology today.
                </p>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* Revolutionary Contact Section */}
      <section id="contact" className="contact-revolutionary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="contact-container advanced-animate">
            <div className="contact-info">
              <h2 className="about-title stagger-child">
                Ready to Build the Future?
              </h2>
              <p className="about-text stagger-child">
                Let's discuss your vision and transform it into reality. 
                Every revolutionary project starts with a single conversation.
              </p>
              
              <div className="mt-8 stagger-child">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-300">hello@elevator-robot.com</p>
                    <p className="text-gray-400 text-sm mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="contact-form-revolutionary stagger-child">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="form-group-revolutionary">
                  <input
                    type="text"
                    id="name"
                    required
                    className="form-input-revolutionary"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group-revolutionary">
                  <input
                    type="email"
                    id="email"
                    required
                    className="form-input-revolutionary"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group-revolutionary">
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="form-input-revolutionary resize-none"
                    placeholder="Tell us about your vision, goals, and what you'd like to build..."
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="submit-btn-revolutionary"
                >
                  {submitStatus === 'loading' ? 'Sending...' : 'Start Your Project'}
                </button>

                {submitStatus === 'success' && (
                  <div className="text-center p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                    <p className="text-green-300 font-medium">
                      🚀 Message sent successfully! We'll be in touch within 24 hours.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="text-center p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                    <p className="text-red-300 font-medium">
                      ❌ Failed to send message. Please try again or email us directly.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Footer */}
      <footer className="bg-black bg-opacity-50 backdrop-blur-lg py-12 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="nav-logo text-3xl mb-4">Elevator Robot</div>
            <p className="text-gray-400 mb-6">
              Building the future, one innovation at a time.
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 Elevator Robot. All rights reserved. | Designed & Developed with ❤️ and ☕
            </p>
          </div>
        </div>
      </footer>

      </div> {/* End Main Content Wrapper */}
    </div>
  );
}

export default App;

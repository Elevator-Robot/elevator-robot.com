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
                scrollToSection('projects');
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left py-4 px-4 text-lg font-medium text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 hover:translate-x-2"
            >
              Projects
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
              <button onClick={() => scrollToSection('projects')} className="nav-link">
                Projects
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
                "AI Tools for Creators",
                "Write Better Content",
                "Generate Precise Images",
                "Empower Creativity"
              ]}
              speed={150}
              deleteSpeed={75}
              pauseTime={3000}
            />
          </h1>
          
          <p className="hero-subtitle">
            A software studio creating AI-integrated applications for creators.
          </p>
          
          <div className="hero-cta-group">
            <a 
              href="https://brainincup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Try Brain In Cup
            </a>
            <button 
              className="cta-secondary"
              onClick={() => scrollToSection('about')}
            >
              Explore Our Projects
            </button>
          </div>
        </div>


      </section>

      {/* Projects & About Section - Merged */}
      <section id="about" className="section-revolutionary section-gradient" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro Text */}
          <div className="text-center mb-12 advanced-animate">
            <h2 className="about-title text-white stagger-child">
              A Software Studio
            </h2>
            <p className="hero-subtitle text-white stagger-child max-w-3xl mx-auto">
              We create AI-integrated applications for creators. 
              Our tools combine cutting-edge technology with thoughtful design to empower people to create amazing things.
            </p>
          </div>

          {/* Projects Grid with Floating Bubbles */}
          <div className="mb-16">
            <div className="skills-3d stagger-child" style={{ overflow: 'visible', marginBottom: '4rem' }}>
              <div className="skill-orb">
                <div>AI/ML</div>
              </div>
              <div className="skill-orb">
                <div>React</div>
              </div>
              <a 
                href="https://brainincup.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="skill-orb group relative"
                style={{ 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                  border: '2px solid rgba(59, 130, 246, 0.5)'
                }}
              >
                <div style={{ padding: '10px' }}>
                  <img 
                    src="/images/brainincup-logo.png" 
                    alt="Brain In Cup" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                {/* Tooltip */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-300 pointer-events-none" style={{ zIndex: 9999 }}>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-white border-opacity-30">
                    <div className="text-base font-bold whitespace-nowrap">Brain In Cup</div>
                    <div className="text-xs opacity-90 text-center">AI Workspace →</div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2">
                    <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-purple-600"></div>
                  </div>
                </div>
              </a>
              <div className="skill-orb">
                <div>Design</div>
              </div>
              <div className="skill-orb">
                <div>UX</div>
              </div>
            </div>
          </div>

          {/* Project Cards */}
          <div className="text-center mb-12 advanced-animate" id="projects">
            <h3 className="text-3xl font-bold text-white stagger-child">
              Our Projects
            </h3>
          </div>

          <div className="services-revolutionary advanced-animate">
            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">Brain In Cup</h3>
                <p className="service-description-3d">
                  Your all-in-one AI workspace. Generate images, write with AI, and chat with advanced models—all in one place. 
                  Built with React, AWS Amplify, and integrated with Anthropic, OpenAI, and Stability AI.
                </p>
                <a 
                  href="https://brainincup.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Try It Now →
                </a>
              </div>
            </Card3D>

            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">Image Studio</h3>
                <p className="service-description-3d">
                  Collaborative AI image generation with spaces, galleries, and real-time updates. 
                  Use base images for precise control over your AI-generated art.
                </p>
                <a 
                  href="https://studio.elevatorrobot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Try It Now →
                </a>
              </div>
            </Card3D>

            <Card3D className="service-card-3d stagger-child">
              <div className="service-card-face">
                <div className="service-icon-3d">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 className="service-title-3d">Text Studio</h3>
                <p className="service-description-3d">
                  Context-aware AI writing with document upload and web research capabilities. 
                  Write better content with intelligent context understanding and research integration.
                </p>
                <a 
                  href="https://studio.elevatorrobot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Try It Now →
                </a>
              </div>
            </Card3D>
          </div>

          <div className="text-center mt-12 advanced-animate stagger-child">
            <a 
              href="https://github.com/Elevator-Robot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Community Contact Section */}
      <section id="contact" className="contact-revolutionary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="contact-container advanced-animate">
            <div className="contact-info">
              <h2 className="about-title stagger-child">
                Get in Touch
              </h2>
              <p className="about-text stagger-child">
                Have questions, feedback, or ideas? We'd love to hear from you. 
                Whether you've found a bug or want to contribute, reach out to us.
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
                    <p className="text-gray-300">hello@elevatorrobot.com</p>
                    <p className="text-gray-400 text-sm mt-1">We typically respond within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">GitHub</p>
                    <a 
                      href="https://github.com/Elevator-Robot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      github.com/Elevator-Robot
                    </a>
                    <p className="text-gray-400 text-sm mt-1">Contributions welcome</p>
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
                    placeholder="Your name"
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
                    placeholder="Your message, feedback, or questions..."
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="submit-btn-revolutionary"
                >
                  {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="text-center p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                    <p className="text-green-300 font-medium">
                      ✅ Message sent successfully! We'll get back to you soon.
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

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 backdrop-blur-lg py-12 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="nav-logo text-3xl mb-4">Elevator Robot</div>
            <p className="text-gray-400 mb-6">
              Building AI tools for creators.
            </p>
            <div className="flex justify-center gap-6 mb-6">
              <a 
                href="https://brainincup.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Brain In Cup
              </a>
              <a 
                href="https://github.com/Elevator-Robot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://twitter.com/elevatorrobot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Twitter
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 Elevator Robot. All rights reserved. | Built with ❤️ and ☕
            </p>
          </div>
        </div>
      </footer>

      </div> {/* End Main Content Wrapper */}
    </div>
  );
}

export default App;

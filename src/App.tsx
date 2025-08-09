import { useState, FormEvent } from "react";
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import { SendMessageMutation } from './graphql/API';

const client = generateClient();

interface GraphQLError {
  errors?: Array<{ message: string }>;
  networkError?: { message: string };
  message?: string;
}

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setSubmitStatus('loading');

    try {
      const response = await client.graphql<SendMessageMutation>({
        query: mutations.sendMessage,
        variables: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        },
        authMode: 'apiKey'
      });

      if ('data' in response && response.data?.sendMessage) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error('GraphQL Response:', response);
        throw new Error('Failed to send message - no data returned');
      }
    } catch (error: unknown) {
      const graphqlError = error as GraphQLError;
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        graphqlErrors: graphqlError.errors,
        networkError: graphqlError.networkError,
        response: graphqlError
      };

      console.error('Error details:', errorDetails);

      let errorMessage = 'Failed to send message';
      if (graphqlError.errors?.[0]?.message) {
        errorMessage = graphqlError.errors[0].message;
      } else if (graphqlError.networkError?.message) {
        errorMessage = graphqlError.networkError.message;
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error('Error sending email:', errorMessage);
      setSubmitStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const updatedData = {
      ...formData,
      [id]: value
    };
    setFormData(updatedData);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Elevator Robot</h1>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-dark hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-dark hover:text-primary transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-dark hover:text-primary transition-colors"
            >
              Contact Us
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary/10 via-blue-50 to-secondary-light overflow-hidden">
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-dark leading-tight">
            We Build the Future: <span className="text-primary">Custom AI Solutions</span> for Your Business
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Tailored AI and web applications designed to deliver results.
          </p>
          <button
            onClick={() => scrollToSection('contact')}
            className="bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-dark mb-6">About Us</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Elevator Robot, we specialize in creating tailored AI and web applications that bring your ideas to life. We focus on innovative, AI-driven solutions and experimental projects that set you apart. Whether you need a smart chatbot or a full AI-powered platform, we deliver with precision and creativity.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-blue/20 rounded-full flex items-center justify-center">
                <div className="w-60 h-60 bg-gradient-to-br from-primary/30 to-blue/30 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-primary/40 rounded-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-dark mb-4">Our Services</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer cutting-edge solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI-Powered Applications */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-dark mb-3">AI-Powered Applications</h4>
              <p className="text-gray-600">Custom AI tools and systems built for your specific needs and requirements.</p>
            </div>

            {/* Chatbots & Virtual Assistants */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-dark mb-3">Chatbots & Virtual Assistants</h4>
              <p className="text-gray-600">Intelligent bots to automate interactions and enhance customer experience.</p>
            </div>

            {/* Web & API Development */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-dark mb-3">Web & API Development</h4>
              <p className="text-gray-600">Scalable, secure, and fast solutions built with modern technologies.</p>
            </div>

            {/* Innovation Projects */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-dark mb-3">Innovation Projects</h4>
              <p className="text-gray-600">Experimental and cutting-edge builds that push the boundaries of technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-dark mb-4">Get in Touch</h3>
            <p className="text-lg text-gray-600">
              Ready to elevate your business with AI? Let's discuss your project.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-dark mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-dark mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project..."
                />
              </div>
              
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">Message sent successfully!</p>
                  <p className="text-green-600 text-sm mt-1">We'll get back to you within 1 business day.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Failed to send message. Please try again.</p>
                </div>
              )}
            </form>
            
            <div className="text-center mt-6 text-gray-600">
              <p className="text-sm">We'll get back to you within 1 business day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">© 2025 Elevator Robot. Building the future with AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
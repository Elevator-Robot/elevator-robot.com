import { useState, FormEvent } from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import { useRUM } from '../hooks/useRUM';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { recordEvent, recordError } = useRUM();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    const startTime = Date.now();

    try {
      const client = generateClient();
      await client.graphql({
        query: mutations.sendMessage,
        variables: formData
      });
      
      const responseTime = Date.now() - startTime;
      
      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus('idle'), 5000);
      
      // Track successful form submission
      recordEvent('contact_form_submit', {
        success: true,
        responseTime
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      console.error('Error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      
      // Track failed form submission
      recordEvent('contact_form_submit', {
        success: false,
        responseTime
      });
      
      // Record the error
      recordError(error as Error);
    }
  };

  return (
    <div 
      className={`absolute top-full right-0 mt-4 w-[400px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-card shadow-2xl overflow-hidden transition-all duration-300 origin-top-right ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}
      style={{ zIndex: 1002 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-form-title"
    >
      {/* Arrow */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-black/95 border-l border-t border-white/10 transform rotate-45" aria-hidden="true"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 id="contact-form-title" className="text-xl font-bold gradient-text font-['Audiowide']">Get in Touch</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label="Close contact form"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="contact-name" className="sr-only">Your name</label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-500 text-sm"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="contact-email" className="sr-only">Your email</label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-500 text-sm"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="contact-message" className="sr-only">Your message</label>
            <textarea
              id="contact-message"
              rows={3}
              required
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-white placeholder-gray-500 text-sm"
              aria-required="true"
            />
          </div>
          
          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="w-full px-4 py-2.5 text-white rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-transform font-semibold text-sm font-['Audiowide'] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--primary-gradient)' }}
            aria-label={submitStatus === 'loading' ? 'Sending message' : 'Send message'}
          >
            {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <div className="text-center p-2 bg-green-500/20 border border-green-500 rounded-xl" role="alert" aria-live="polite">
              <p className="text-green-300 text-xs font-['Audiowide']">✅ Message sent!</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="text-center p-2 bg-red-500/20 border border-red-500 rounded-xl" role="alert" aria-live="polite">
              <p className="text-red-300 text-xs font-['Audiowide']">❌ Failed to send</p>
            </div>
          )}
        </form>

        <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs font-['Audiowide']">
          <a href="mailto:hello@elevatorrobot.com" className="text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded transition-colors" aria-label="Email Elevator Robot">
            Email
          </a>
          <a 
            href="https://github.com/Elevator-Robot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded transition-colors"
            aria-label="Visit Elevator Robot on GitHub (opens in new tab)"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

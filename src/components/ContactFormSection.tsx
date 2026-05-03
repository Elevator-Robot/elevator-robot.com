import { useState, FormEvent } from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';

export const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
    <section id="contact" className="contact-revolutionary reveal" role="region" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 id="contact-heading" className="text-5xl md:text-6xl font-bold mb-6 gradient-text font-['Audiowide']">
            Let's Talk
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ready to start your next project? Get in touch and let's discuss how we can help.
          </p>
        </div>

        <div className="contact-container">
          <div className="contact-info reveal">
            <div className="contact-kicker font-['Audiowide']">Start a Project</div>
            <h3 className="contact-info-title font-['Audiowide']">Bring the idea. We'll shape the build.</h3>
            <p className="contact-info-copy">
              Share what you are trying to launch, automate, or improve. We will turn the rough shape into a practical build plan.
            </p>
            <div className="contact-proof-grid" aria-label="What to expect">
              <div>
                <strong>01</strong>
                <span>Scope</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Plan</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Build</span>
              </div>
            </div>
            <div className="contact-links">
              <a 
                href="mailto:hello@elevatorrobot.com" 
                className="contact-link"
                aria-label="Email Elevator Robot at hello@elevatorrobot.com"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-['Audiowide']">hello@elevatorrobot.com</span>
              </a>
              <a 
                href="https://github.com/Elevator-Robot"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                aria-label="Visit Elevator Robot on GitHub (opens in new tab)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-['Audiowide']">GitHub</span>
              </a>
            </div>
          </div>

          <div className="contact-form-revolutionary reveal">
            <div className="contact-form-header">
              <div>
                <span className="contact-form-eyebrow font-['Audiowide']">Project Details</span>
                <h3 className="contact-form-title font-['Audiowide']">Tell us what you want to make</h3>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group-revolutionary">
                <label htmlFor="contact-form-name" className="form-label-revolutionary font-['Audiowide']">Name</label>
                <input
                  id="contact-form-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input-revolutionary"
                  aria-required="true"
                />
              </div>

              <div className="form-group-revolutionary">
                <label htmlFor="contact-form-email" className="form-label-revolutionary font-['Audiowide']">Email</label>
                <input
                  id="contact-form-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input-revolutionary"
                  aria-required="true"
                />
              </div>

              <div className="form-group-revolutionary">
                <label htmlFor="contact-form-message" className="form-label-revolutionary font-['Audiowide']">Message</label>
                <textarea
                  id="contact-form-message"
                  rows={5}
                  required
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input-revolutionary resize-none"
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="submit-btn-revolutionary font-['Audiowide']"
                aria-label={submitStatus === 'loading' ? 'Sending message' : 'Send message'}
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="contact-alert contact-alert-success" role="alert" aria-live="polite">
                  <p className="font-['Audiowide']">Message sent successfully.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="contact-alert contact-alert-error" role="alert" aria-live="polite">
                  <p className="font-['Audiowide']">Failed to send message. Please try again.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState, FormEvent } from "react";
import { generateClient } from 'aws-amplify/api';
import { GraphQLQuery } from '@aws-amplify/api';
import * as mutations from './graphql/mutations';
import { SendMessageMutation } from './graphql/API';

const client = generateClient();


function App() {
  const [visibleSection, setVisibleSection] = useState(""); // Tracks which section is visible
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const response = await client.graphql<GraphQLQuery<SendMessageMutation>>({
        query: mutations.sendMessage,
        variables: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });

      if (response.data?.sendMessage) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const toggleSection = (section: string) => {
    setVisibleSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-lg font-bold w-full z-10 sticky top-0 bg-secondary-light text">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary text-center">Elevator Robot</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark h-screen flex flex-col justify-center items-center text-center text-white">
        <div>
          <h2 className="text-4xl font-bold mb-4">Bring Your Vision to Life</h2>
          <p className="text-xl mb-6">Your partners in innovation, we build your Applications and you build your business.</p>
          <div className="flex space-x-4 justify-center">
            <button
              className="bg-secondary-light text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
              onClick={() => toggleSection("about")}
            >
              About Us ➔
            </button>
            <button
              className="bg-secondary-light text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
              onClick={() => toggleSection("services")}
            >
              Services ➔
            </button>
            <button
              className="bg-secondary-light text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
              onClick={() => toggleSection("contact")}
            >
              Contact Us ➔
            </button>
          </div>
        </div>

        {/* Sliding Sections */}
        {["contact", "about", "services"].map((section) => (
          <div
            key={section}
            className={` mt-4 w-full max-w-lg bg-secondary-light rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${visibleSection === section
              ? "max-h-[700px] opacity-100 visible"
              : "max-h-1 opacity-0 invisible"
              }`}
          >
            <div className="p-2 border-spacing-48 border-b-orange-50"> {/* Increased padding for cleaner formatting */}
              {section === "contact" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-dark mb-6">Get in Touch</h3>
                  <form onSubmit={handleFormSubmit}>
                    <div className="space-y-6 text-gray-dark text-justify">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-dark">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="mt-2 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border-4 bg-accent-light"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-2 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border-4 bg-accent-light"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-dark">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="mt-2 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border-4 bg-accent-light"
                          value={formData.message}
                          onChange={handleInputChange}

                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-4 px-8 rounded-md hover:bg-primary-light transition-colors"
                      >
                        {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                      </button>
                      {submitStatus === 'success' && (
                        <p className="mt-4 text-green-600 font-medium">Message sent successfully!</p>
                      )}
                      {submitStatus === 'error' && (
                        <p className="mt-4 text-red-600 font-medium">Failed to send message. Please try again.</p>
                      )}
                    </div>
                  </form>
                </>
              )}
              {section === "about" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-dark mb-6">About Us</h3>
                  <p className="text-gray-dark text-lg leading-relaxed text-justify p-2">
                    At Elevator Robot, we specialize in crafting comprehensive digital solutions tailored to your unique needs. Our expertise spans the development of full-stack websites, robust backend APIs, and cutting-edge AI/ML applications, including generative AI chatbots. We are committed to delivering innovative and efficient solutions that drive success for your business.


                  </p>

                </>
              )}
              {section === "services" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-dark mb-6">Our Expertise</h3>
                  <ul className="text-gray-dark text-lg text-left leading-relaxed list-disc list-inside space-y-2 p-2">
                    <li>
                      <strong>Custom Software Development:</strong> Crafting tailored applications that meet your unique business needs.
                    </li>
                    <li>
                      <strong>Cloud Infrastructure Solutions:</strong> Designing and managing scalable, secure cloud environments.
                    </li>
                    <li>
                      <strong>AI and Machine Learning Integration:</strong> Implementing intelligent systems to enhance decision-making and efficiency.
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;

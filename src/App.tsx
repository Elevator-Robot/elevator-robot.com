import { useState, FormEvent } from "react";
import { generateClient } from 'aws-amplify/api';
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
    } catch (error: any) {
      // Log detailed error information
      const errorDetails = {
        message: error.message,
        graphqlErrors: error?.errors,
        networkError: error?.networkError,
        response: error?.response
      };
      
      console.error('Error details:', errorDetails);
      
      // Try to get the most relevant error message
      let errorMessage = 'Failed to send message';
      if (error?.errors?.[0]?.message) {
        errorMessage = error.errors[0].message;
      } else if (error?.networkError?.message) {
        errorMessage = error.networkError.message;
      } else if (error?.message) {
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
          <h2 className="text-4xl font-bold mb-4">Elevate Your Business with Intelligent AI Solutions</h2>
          <p className="text-xl mb-6">Unlock the power of artificial intelligence to drive innovation, efficiency, and growth.</p>
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
                    At Elevator Robot, we are pioneers in the development of cutting-edge AI applications that revolutionize the way businesses operate. Our team of expert engineers and data scientists specialize in crafting intelligent, adaptive systems that seamlessly integrate with your existing infrastructure. From advanced machine learning models to intuitive natural language interfaces, we bring your vision to life, empowering you to make data-driven decisions and unlock new opportunities for growth.
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
                      <strong>AI-Powered Solutions:</strong> Harnessing the power of artificial intelligence to create intelligent, adaptive systems that drive innovation and efficiency across your organization.
                    </li>
                    <li>
                      <strong>Machine Learning and Data Analytics:</strong> Leveraging advanced algorithms and data science techniques to uncover valuable insights and optimize your business processes.
                    </li>
                    <li>  
                      <strong>Natural Language Processing and Chatbots:</strong> Developing sophisticated conversational interfaces that enable seamless, human-like interactions between your customers and your brand.
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

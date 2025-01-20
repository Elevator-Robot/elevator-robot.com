import { useState } from "react";

function App() {
  const [visibleSection, setVisibleSection] = useState(""); // Tracks which section is visible

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const toggleSection = (section: string) => {
    setVisibleSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-lg font-bold w-full z-10 sticky top-0 bg-primary-alt text">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary text-center">Elevator Robot</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark h-screen flex flex-col justify-center items-center text-center text-white">
        <div>
          <h2 className="text-4xl font-bold mb-4">Bring Your Vision to Life</h2>
          <p className="text-xl mb-6">Transform your ideas into innovative, scalable solutions designed to make an impact.</p>
          <div className="flex space-x-4 justify-center">
            <button
              className="bg-primary-alt text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
              onClick={() => toggleSection("about")}
            >
              About Us ➔
            </button>
            <button
              className="bg-primary-alt text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
              onClick={() => toggleSection("services")}
            >
              Services ➔
            </button>
            <button
              className="bg-primary-alt text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
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
            className={` mt-4 w-full max-w-lg bg-primary-alt rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${visibleSection === section
              ? "max-h-[700px] opacity-100 visible"
              : "max-h-1 opacity-0 invisible"
              }`}
          >
            <div className="p-3 border-spacing-48 border-b-orange-50"> {/* Increased padding for cleaner formatting */}
              {section === "contact" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-dark mb-6">Get in Touch</h3>
                  <form onSubmit={handleFormSubmit}>
                    <div className="space-y-6 text-gray-dark">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-dark">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="mt-2 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border-4"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-2 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border-4"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-dark">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="mt-2 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border-4"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-4 px-8 rounded-md hover:bg-primary-light transition-colors"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </>
              )}
              {section === "about" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-dark mb-6">About Us</h3>
                  <p className="text-gray-dark text-lg leading-relaxed">
                    We specialize in building innovative AWS-based solutions tailored to your business needs.
                  </p>
                </>
              )}
              {section === "services" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-dark mb-6">Our Services</h3>
                  <ul className="text-gray-dark text-lg leading-relaxed list-disc list-inside space-y-2">
                    <li>Custom software development</li>
                    <li>Cloud infrastructure solutions</li>
                    <li>AI and machine learning integration</li>
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

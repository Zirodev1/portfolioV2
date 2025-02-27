import { useState } from "react";
import SideBar from "../components/sidebar.component";

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Form status state
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation
  const isFormValid = () => {
    // Basic validation
    if (!formData.name.trim()) return false;
    if (!formData.email.trim()) return false;
    if (!formData.message.trim()) return false;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: "Please fill all fields correctly." },
      });
      return;
    }

    setStatus({
      submitted: false,
      submitting: true,
      info: { error: false, msg: null },
    });

    try {
      // Send data to the backend API
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: data.message || "Your message has been sent successfully!" },
        });

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error.message || "An error occurred. Please try again later." },
      });
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="border-b w-full h-max border-gray-700">
        <main className="max-w-[800px] px-12 pt-12 pb-40 mx-auto flex-col items-center justify-center">
          <div className="mb-14">
            <h1 className="mb-3">Let&apos;s Chat</h1>
            <p className="text-gray-400">
              If you would like to talk about potential projects, send a message or email me directly at
            </p>
            <p className="text-blue-400 hover:underline">
              <a href="mailto:lee.acevedo786@gmail.com">lee.acevedo786@gmail.com</a>
            </p>
          </div>

          {status.submitted ? (
            <div className="bg-green-900 bg-opacity-20 border border-green-500 text-green-300 p-6 rounded-md mb-8">
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p>{status.info.msg}</p>
              <button 
                onClick={() => setStatus({ submitted: false, submitting: false, info: { error: false, msg: null } })}
                className="mt-4 bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.info.error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-md">
                  {status.info.msg}
                </div>
              )}
              
              <div className="mb-3 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-44 p-3 mb-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={status.submitting}
                className={`w-full bg-blue-600 text-white py-3 rounded-md transition-colors ${
                  status.submitting 
                    ? "opacity-70 cursor-not-allowed" 
                    : "hover:bg-blue-700"
                }`}
              >
                {status.submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContactPage;
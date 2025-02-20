import { ContactForm, NotificationType } from "../types/index.ts";
import { React, useState } from "react";
import API_URL from "./ApiConfig";
import { Send, AlertCircle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const [notification, setNotification] = useState<NotificationType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setNotification("success");
      setFormData({ name: "", email: "", message: "" });

      // Auto-clear success notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setNotification("error");

      // Auto-clear error notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-form" className="mx-auto px-4 py-2 -mb-2">
      <h1 className="text-2xl font-semibold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300">
        Contact Me
      </h1>

      {notification && (
        <div
          className={`mb-6 p-3 rounded-lg max-w-sm mx-auto flex items-center gap-2 transition-all duration-300 ${
            notification === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
          }`}
        >
          {notification === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm">
            {notification === "success"
              ? "Message sent successfully!"
              : "Failed to send message. Please try again."}
          </span>
        </div>
      )}

      <div
        className="max-w-md mx-auto rounded-lg overflow-hidden
                  bg-white dark:bg-gray-900 shadow-md
                  border border-gray-200 dark:border-gray-700"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 text-sm bg-transparent 
                       border border-gray-300 dark:border-gray-700 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 text-sm bg-transparent 
                       border border-gray-300 dark:border-gray-700 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 text-sm bg-transparent 
                       border border-gray-300 dark:border-gray-700 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-gray-100"
              placeholder="Your message..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-2 flex items-center justify-center gap-2
                       bg-gradient-to-r from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300
                       text-white dark:text-gray-950 rounded-md
                       hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent dark:border-t-transparent rounded-full"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

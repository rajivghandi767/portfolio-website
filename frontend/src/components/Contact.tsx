import { ContactForm, NotificationType } from "../types/index.ts";
import { React, useState } from "react";
import API_URL from "./ApiConfig";

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
    } catch (error) {
      console.error("Error sending message:", error);
      setNotification("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-form" className="pt-2 max-w-3xl mx-auto px-8 md:px-16">
      <h1 className="p-2 font-semibold text-xl text-center">Contact</h1>

      {notification && (
        <div
          className={`mb-3 p-2 rounded text-sm text-center max-w-xs mx-auto ${
            notification === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {notification === "success"
            ? "Message sent successfully!"
            : "Failed to send message. Please try again."}
        </div>
      )}

      {/* Made the form container narrower with max-w-xs */}
      <div
        className="w-full max-w-xs mx-auto rounded shadow-sm p-4 
                    bg-white dark:bg-stone-900 border-2 border-black dark:border-white"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border-2 border-black dark:border-white rounded 
                       bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border-2 border-black dark:border-white rounded 
                       bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm">
              Message
            </label>
            <textarea
              id="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full p-1.5 text-sm border-2 border-black dark:border-white rounded 
                       bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Your message..."
            />
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm bg-black dark:bg-white text-white dark:text-black 
                       rounded hover:bg-gray-800 dark:hover:bg-gray-200 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

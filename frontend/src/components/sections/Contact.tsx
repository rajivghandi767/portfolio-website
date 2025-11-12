// src/components/sections/Contact.tsx
import { useState, useEffect, useCallback } from "react";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { ContactForm, ContactResponse, NotificationType } from "../../types";
import apiService from "../../services/api";

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const [notification, setNotification] = useState<NotificationType>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { id, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    },
    []
  );

  const resetForm = useCallback((): void => {
    setFormData({ name: "", email: "", message: "" });
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setNotification("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.contact.send(formData);

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      if ("data" in response && response.data) {
        setNotification("success");
        resetForm();
        const contactResponse = response.data as ContactResponse;
        if (contactResponse?.notifications && import.meta.env.DEV) {
          console.log("Notification status:", contactResponse.notifications);
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error sending message:", error);
      }
      setNotification("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNotificationContent = () => {
    if (notification === "success") {
      return {
        icon: (
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-green-400" />
        ),
        message: "Message sent successfully!",
        className:
          "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-200 border border-green-300 dark:border-green-800",
      };
    } else {
      return {
        icon: (
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
        ),
        message: "Failed to send message. Please try again.",
        className:
          "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800",
      };
    }
  };

  const notificationContent = notification ? getNotificationContent() : null;

  return (
    <div id="contact-form" className="mx-auto px-4 py-2 -mb-2">
      <h1 className="text-2xl font-semibold text-center mb-8">Contact Me</h1>

      {notificationContent && (
        <div
          className={`mb-6 p-3 rounded-lg max-w-sm mx-auto flex items-center gap-2 transition-all duration-300 ${notificationContent.className}`}
          role="alert"
          aria-live="polite"
        >
          {notificationContent.icon}
          <span className="text-sm font-medium">
            {notificationContent.message}
          </span>
        </div>
      )}

      <div className="card max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 text-sm bg-transparent border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 text-sm bg-transparent border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              required
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={4}
              className="w-full p-2 text-sm bg-transparent border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="Your message..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full p-2 flex items-center justify-center gap-2 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full"></div>
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

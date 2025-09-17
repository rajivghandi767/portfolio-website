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

    // Basic validation
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

      // Check if response has error property
      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      // Check if response has data property and is successful
      if ("data" in response && response.data) {
        setNotification("success");
        resetForm();

        // Optional: Log notification status for debugging
        const contactResponse = response.data as ContactResponse;
        if (contactResponse?.notifications) {
          console.log("Notification status:", contactResponse.notifications);
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNotification("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNotificationContent = () => {
    if (notification === "success") {
      return {
        icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
        message: "Message sent successfully!",
        className:
          "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900",
      };
    } else {
      return {
        icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
        message: "Failed to send message. Please try again.",
        className:
          "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900",
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
          <span className="text-sm">{notificationContent.message}</span>
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
              className="w-full p-2 text-sm bg-transparent 
                       border border-default rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Your name"
              aria-describedby="name-error"
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
              className="w-full p-2 text-sm bg-transparent 
                       border border-default rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your.email@example.com"
              aria-describedby="email-error"
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
              className="w-full p-2 text-sm bg-transparent 
                       border border-default rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Your message..."
              aria-describedby="message-error"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full p-2 flex items-center justify-center gap-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="submit-status"
            >
              {isSubmitting ? (
                <>
                  <div
                    className="animate-spin h-4 w-4 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full"
                    aria-hidden="true"
                  ></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
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

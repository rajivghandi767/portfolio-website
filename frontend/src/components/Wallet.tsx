import { Card } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig";
import { CreditCard, ExternalLink } from "lucide-react";

const Wallet = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const cardsResponse = await fetch(`${API_URL}/cards`);
      if (!cardsResponse.ok) {
        throw new Error(`HTTP error! status: ${cardsResponse.status}`);
      }
      const cardsData: Card[] = await cardsResponse.json();
      setCards(cardsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setError(error instanceof Error ? error.message : "Failed to load cards");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Helper function to construct thumbnail URL - handles all potential states
  const getThumbnailUrl = (
    thumbnailPath: string | null | undefined
  ): string => {
    if (!thumbnailPath) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ECard Image Unavailable%3C/text%3E%3C/svg%3E";
    }

    // Check if the path is already an absolute URL
    if (
      thumbnailPath.startsWith("http://") ||
      thumbnailPath.startsWith("https://")
    ) {
      return thumbnailPath;
    }

    // Remove leading slash from thumbnail path if it exists
    const cleanPath = thumbnailPath.startsWith("/")
      ? thumbnailPath.slice(1)
      : thumbnailPath;

    // Remove trailing slash from API_URL if it exists
    const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

    return `${baseUrl}/${cleanPath}`;
  };

  return (
    <div id="wallet" className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300">
        Credit Card Collection
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-2xl mx-auto">
          {error}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          No cards available at this time.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden
                       border border-gray-200 dark:border-gray-700 transition-all duration-300
                       hover:shadow-xl hover:scale-102"
            >
              <div className="w-full h-32 overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <img
                  src={getThumbnailUrl(card.thumbnail)}
                  alt={card.card_name}
                  className="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105 p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback to credit card icon
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const iconElement = document.createElement("div");
                      iconElement.className =
                        "flex items-center justify-center w-full h-full";
                      iconElement.innerHTML = `
                        <div class="w-12 h-12 text-gray-400 dark:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        </div>
                      `;
                      parent.appendChild(iconElement);
                    }
                  }}
                />
              </div>

              <div className="flex flex-col flex-grow p-3">
                {/* Card title - fixed height with ellipsis */}
                <h2
                  className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r 
                              from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300
                              h-10 line-clamp-2 flex items-center"
                >
                  {card.card_name || "Unnamed Card"}
                </h2>

                {/* Card annual fee - fixed height */}
                <div className="h-6 flex items-center">
                  <p className="text-xs text-gray-700 dark:text-gray-300 truncate w-full">
                    {card.annual_fee
                      ? `Annual Fee: ${card.annual_fee}`
                      : "No Annual Fee"}
                  </p>
                </div>

                {/* Description area - bullet points */}
                <div className="h-16 overflow-y-auto my-1 px-1">
                  {card.description ? (
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {/* Split description by commas, semicolons, or line breaks and create bullet points */}
                      {card.description
                        .split(/[,;\n]+/)
                        .filter((point) => point.trim().length > 0)
                        .map((point, index) => (
                          <li key={index} className="truncate">
                            {point.trim()}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                      No description available
                    </p>
                  )}
                </div>

                {/* Referral link - fixed position at bottom */}
                <div className="mt-auto pt-2 h-6 flex items-center">
                  {card.referral_link ? (
                    <a
                      href={card.referral_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 
                               hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>Referral</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-600">
                      No referral available
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wallet;

import { Card } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "./ApiConfig";
import { CreditCard, ExternalLink, ChevronRight, X } from "lucide-react";

const Wallet = ({ limit = 4 }: { limit?: number }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getData();
  }, []);

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

  // The approach is different based on whether we're on the main page or dedicated wallet page
  // For the main page component (default), show only cards with IDs 1-4 up to the limit
  // For the dedicated wallet page (when limit is set higher or undefined), show all cards

  // Check if we're on the dedicated wallet page (route-based, can be detected by checking props)
  const isWalletPage = window.location.pathname === "/wallet";

  // Filter cards to only show IDs 1-4 on the main page, or all cards on the wallet page
  const displayedCards = isWalletPage
    ? cards // Show all cards on the wallet page
    : cards.filter((card) => card.id >= 1 && card.id <= 4).slice(0, limit); // Show only featured cards (IDs 1-4) on main page

  // Determine if we should show the "See More" button
  const shouldShowSeeMore = !isWalletPage && cards.length > limit;

  // Handle card click to open modal
  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div id="wallet" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/wallet"
          className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-300 hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-100 transition-all duration-200"
        >
          Credit Card Collection
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-black border border-red-200 dark:border-red-900 rounded-lg max-w-2xl mx-auto">
          {error}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center text-black dark:text-gray-400 p-8">
          No cards available at this time.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {displayedCards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col h-full bg-white dark:bg-black rounded-lg shadow-md overflow-hidden
                         border-2 border-black dark:border-gray-800 transition-all duration-300
                         hover:shadow-xl hover:scale-102 cursor-pointer"
                onClick={() => handleCardClick(card)}
              >
                <div className="w-full h-32 overflow-hidden bg-gradient-to-r from-white to-gray-100 dark:from-black dark:to-black">
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
                          <div class="w-12 h-12 text-black dark:text-gray-600">
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
                              from-black to-gray-900 dark:from-white dark:to-gray-300
                              h-10 line-clamp-2 flex items-center"
                  >
                    {card.card_name || "Unnamed Card"}
                  </h2>

                  {/* Card annual fee - fixed height */}
                  <div className="h-6 flex items-center">
                    <p className="text-xs text-black dark:text-gray-300 truncate w-full">
                      {card.annual_fee
                        ? `Annual Fee: ${card.annual_fee}`
                        : "No Annual Fee"}
                    </p>
                  </div>

                  {/* Description area - bullet points */}
                  <div className="h-16 overflow-y-auto my-1 px-1">
                    {card.description ? (
                      <ul className="list-disc list-inside text-xs text-black dark:text-gray-400 space-y-1">
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
                      <p className="text-xs text-black dark:text-gray-500 italic">
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
                        className="flex items-center gap-1 text-xs text-black dark:text-gray-300
                                 hover:text-gray-800 dark:hover:text-white transition-colors"
                      >
                        <span>Referral</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-600 dark:text-gray-600">
                        No referral available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shouldShowSeeMore && (
            <div className="flex justify-center mt-8">
              <Link
                to="/wallet"
                className="flex items-center gap-2 text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors px-4 py-2 border-2 border-black dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <span>See More Cards</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}

      {/* Card Detail Modal */}
      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-black dark:border-gray-800">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-900 dark:from-white dark:to-gray-300">
                {selectedCard.card_name || "Unnamed Card"}
              </h3>
              <button
                onClick={closeModal}
                className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 flex-grow">
              <div className="flex flex-col md:flex-row md:space-x-6">
                {/* Card Image */}
                <div className="w-full md:w-1/2 h-48 mb-4 md:mb-0 bg-gradient-to-r from-white to-gray-100 dark:from-gray-900 dark:to-black rounded-lg flex items-center justify-center p-4">
                  <img
                    src={getThumbnailUrl(selectedCard.thumbnail)}
                    alt={selectedCard.card_name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const iconElement = document.createElement("div");
                        iconElement.className =
                          "w-32 h-32 text-black dark:text-gray-600";
                        iconElement.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        `;
                        parent.appendChild(iconElement);
                      }
                    }}
                  />
                </div>

                {/* Card Details */}
                <div className="w-full md:w-1/2">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Annual Fee
                    </h4>
                    <p className="text-black dark:text-gray-400">
                      {selectedCard.annual_fee
                        ? selectedCard.annual_fee
                        : "No Annual Fee"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Card Benefits
                    </h4>
                    {selectedCard.description ? (
                      <ul className="list-disc list-inside space-y-2 text-black dark:text-gray-400">
                        {selectedCard.description
                          .split(/[,;\n]+/)
                          .filter((point) => point.trim().length > 0)
                          .map((point, index) => (
                            <li key={index}>{point.trim()}</li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-500 italic">
                        No details available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-black dark:border-gray-800 p-4 flex justify-end items-center">
              {selectedCard.referral_link ? (
                <a
                  href={selectedCard.referral_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
                >
                  <span>Apply via Referral</span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span className="text-xs text-gray-600 dark:text-gray-500 italic">
                  No referral link available
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;

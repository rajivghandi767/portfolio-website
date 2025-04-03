// src/components/sections/Wallet.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card as CardType } from "../../types";
import { ExternalLink, ChevronRight, X } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";

interface WalletProps {
  limit?: number;
}

const Wallet = ({ limit = 4 }: WalletProps) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch cards using our custom hook
  const {
    data: cards,
    isLoading,
    error,
  } = useApi<CardType[]>(() => apiService.cards.getAll());

  // Check if we're on the dedicated wallet page
  const isWalletPage = window.location.pathname === "/wallet";

  // Filter cards to only show featured cards on the main page, or all cards on the wallet page
  const displayedCards = isWalletPage
    ? cards || []
    : (cards || [])
        .filter((card) => card.id >= 1 && card.id <= 4)
        .slice(0, limit);

  // Determine if we should show the "See More" button
  const shouldShowSeeMore = !isWalletPage && (cards?.length || 0) > limit;

  // Handle card click to open modal
  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  return (
    <div id="wallet" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link to="/wallet" className="text-2xl font-semibold text-center">
          Credit Card Collection
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-900">
            {error}
          </div>
        </div>
      ) : !cards || cards.length === 0 ? (
        <div className="text-center p-8">No cards available at this time.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {displayedCards.map((card) => (
              <CreditCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>

          {shouldShowSeeMore && (
            <div className="flex justify-center mt-8">
              <Link to="/wallet">
                <button className="btn btn-outline flex items-center gap-2 px-4 py-2">
                  <span>See More Cards</span>
                  <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          )}
        </>
      )}

      {/* Card Detail Modal */}
      {selectedCard && showModal && (
        <CardDetailModal
          card={selectedCard}
          isOpen={showModal}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Credit Card component
const CreditCard = ({
  card,
  onClick,
}: {
  card: CardType;
  onClick: () => void;
}) => {
  // Get thumbnail URL using imageUtils
  const thumbnailUrl = imageUtils.getImageUrl(card.thumbnail, "card");

  // Split description into bullet points
  const bulletPoints = card.description
    ? card.description
        .split(/[,;\n]+/)
        .filter((point) => point.trim().length > 0)
        .slice(0, 3) // Limit to 3 points for the card view
    : [];

  return (
    <div className="card hover-scale cursor-pointer" onClick={onClick}>
      <div className="card-image-container w-full h-32 overflow-hidden p-2 flex items-center justify-center">
        <img
          src={thumbnailUrl}
          alt={card.card_name || "Credit Card"}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-sm h-10 line-clamp-2 flex items-center">
          {card.card_name || "Unnamed Card"}
        </h2>

        <div className="h-6 flex items-center">
          <p className="text-xs truncate w-full">
            {card.annual_fee
              ? `Annual Fee: ${card.annual_fee}`
              : "No Annual Fee"}
          </p>
        </div>

        <div className="h-16 overflow-y-auto my-1 px-1">
          {bulletPoints.length > 0 ? (
            <ul className="list-disc list-inside text-xs space-y-1">
              {bulletPoints.map((point, index) => (
                <li key={index} className="truncate">
                  {point.trim()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs italic">No description available</p>
          )}
        </div>

        <div className="mt-auto pt-2 h-6 flex items-center">
          {card.referral_link ? (
            <a
              href={card.referral_link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()} // Prevent modal from opening
            >
              <span>Referral</span>
              <ExternalLink size={10} />
            </a>
          ) : (
            <span className="text-xs">No referral available</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Detail Modal component
const CardDetailModal = ({
  card,
  isOpen,
  onClose,
}: {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Get image URL using imageUtils
  const imageUrl = imageUtils.getImageUrl(card.thumbnail, "card");

  // Split description into bullet points
  const bulletPoints = card.description
    ? card.description
        .split(/[,;\n]+/)
        .filter((point) => point.trim().length > 0)
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-default">
          <h3 className="text-lg font-semibold">
            {card.card_name || "Card Details"}
          </h3>
          <button onClick={onClose} className="hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row md:space-x-6 p-4 overflow-y-auto">
          {/* Card Image */}
          <div className="card-image-container w-full md:w-1/2 h-48 mb-4 md:mb-0 rounded-lg flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt={card.card_name || "Credit Card"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Card Details */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Annual Fee</h4>
              <p>{card.annual_fee ? card.annual_fee : "No Annual Fee"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Card Benefits</h4>
              {bulletPoints.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {bulletPoints.map((point, index) => (
                    <li key={index}>{point.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No details available</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t-2 border-default p-4 flex justify-end items-center">
          {card.referral_link ? (
            <a
              href={card.referral_link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              <span>Apply via Referral</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-xs italic">No referral link available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

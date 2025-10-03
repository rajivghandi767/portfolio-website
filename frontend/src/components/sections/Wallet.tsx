import { useState } from "react";
import { Link } from "react-router-dom";
import { Card as CardType } from "../../types";
import { ExternalLink, ChevronRight, X } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";

const Wallet = ({ limit = 4 }: { limit?: number }) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const {
    data: cards,
    isLoading,
    error,
  } = useApi<CardType[]>(() => apiService.cards.getAll());
  const isWalletPage = window.location.pathname === "/wallet";

  return (
    <div id="wallet" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link to="/wallet" className="text-2xl font-semibold text-center">
          Credit Card Collection
        </Link>
      </div>

      <DataLoader<CardType>
        isLoading={isLoading}
        error={error}
        data={cards}
        emptyMessage="My latest card collection is being revamped 🤭. Stay tuned for updates!"
      >
        {(allCards) => {
          const displayedCards = isWalletPage
            ? allCards
            : allCards.slice(0, limit);
          const shouldShowSeeMore = !isWalletPage && allCards.length > limit;

          return (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {displayedCards.map((card) => (
                  <CreditCard
                    key={card.id}
                    card={card}
                    onClick={() => setSelectedCard(card)}
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
          );
        }}
      </DataLoader>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
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
  const thumbnailUrl = imageUtils.getImageUrl(card.image_url, "card");

  return (
    <div
      className="card hover-scale cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="card-image-container w-full aspect-[1.58] p-4 flex items-center justify-center">
        <img
          src={thumbnailUrl}
          alt={card.card_name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow text-center">
        <h2 className="text-base font-semibold">{card.card_name}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {card.annual_fee ? `Annual Fee: ${card.annual_fee}` : "No Annual Fee"}
        </p>

        <div
          className="card-prose-preview my-4 prose prose-sm dark:prose-invert text-left"
          dangerouslySetInnerHTML={{ __html: card.description || "" }}
        />

        <div className="mt-auto pt-4 border-t border-default">
          {card.referral_link ? (
            <a
              href={card.referral_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Referral</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              No referral link
            </span>
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
  if (!isOpen) return null;
  const imageUrl = imageUtils.getImageUrl(card.image_url, "card");

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b-2 border-default">
          <h3 className="text-lg font-semibold">{card.card_name}</h3>
          <button onClick={onClose} className="hover:text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-6 p-4 overflow-y-auto">
          <div className="w-full md:w-1/2 h-48 mb-4 md:mb-0 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={card.card_name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Annual Fee</h4>
              <p>{card.annual_fee || "No Annual Fee"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Card Benefits</h4>
              <div
                className="prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html:
                    card.description ||
                    "<p class='italic'>No details available</p>",
                }}
              />
            </div>
          </div>
        </div>
        <div className="border-t-2 border-default p-4 flex justify-end items-center">
          {card.referral_link && (
            <a
              href={card.referral_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              <span>Apply via Referral</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

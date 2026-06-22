import { useState } from "react";
import { Link } from "react-router-dom";
import { Card as CardType } from "../../types";
import { ExternalLink, ChevronRight, X } from "../common/Icons";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";
import { CardSkeleton } from "../common/Skeleton";

/**
 * Wallet Component
 * 
 * Highly educational note: This component serves as the main container for the credit card collection.
 * It demonstrates how to fetch and render data while maintaining loading and error states via the
 * `DataLoader` component. The use of an optional `limit` prop allows this component to be highly
 * reusable—functioning as a brief preview on the homepage when limited, or a full page when unlimited.
 */
const Wallet = ({ limit = 4 }: { limit?: number }) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const isWalletPage = window.location.pathname === "/wallet";
  const {
    data: cards,
    isLoading,
    error,
  } = useApi<CardType[]>(() => apiService.cards.getAll(isWalletPage ? undefined : { limit }));

  return (
    <div id="wallet" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/wallet"
          className="text-2xl font-semibold text-center hover:underline"
        >
          Credit Card Collection
        </Link>
      </div>

      <DataLoader<CardType>
        isLoading={isLoading}
        error={error}
        data={cards}
        emptyMessage="My latest card collection is being revamped 🤭. Stay tuned for updates!"
        skeleton={
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {Array.from({ length: limit }).map((_, i) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <CardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        }
      >
        {(allCards) => {
          const shouldShowSeeMore = !isWalletPage;

          return (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {allCards.map((card, index) => (
                  <CreditCard
                    key={card.id}
                    card={card}
                    isEager={index < limit}
                    onClick={() => setSelectedCard(card)}
                  />
                ))}
              </div>
              {shouldShowSeeMore && (
                <div className="flex justify-center mt-8">
                  <Link to="/wallet">
                    <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 px-4 py-2 bg-transparent border-2 border-gray-200 dark:border-neutral-800 text-brand-light dark:text-brand-dark hover:border-brand-light dark:hover:border-brand-dark gap-2">
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

/**
 * CreditCard Component
 * 
 * Highly educational note: This is a presentational component that renders an individual card.
 * Notice the `isEager` prop. In performance optimization, above-the-fold images should be loaded eagerly
 * to improve Largest Contentful Paint (LCP), while off-screen images should be deferred using lazy loading.
 */
const CreditCard = ({
  card,
  isEager = false,
  onClick,
}: {
  card: CardType;
  isEager?: boolean;
  onClick: () => void;
}) => {
  const thumbnailUrl = imageUtils.getImageUrl(card.image_url, "card");

  return (
    <div
      className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer flex flex-col group"
      onClick={onClick}
    >
      <div className="bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center w-full aspect-[4/3] overflow-hidden relative">
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-110"
          aria-hidden="true"
        />
        <img
          src={thumbnailUrl}
          alt={card.card_name}
          width={card.image_width}
          height={card.image_height}
          loading={isEager ? "eager" : "lazy"}
          decoding={isEager ? "sync" : "async"}
          className="absolute inset-0 w-full h-full object-contain z-10 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow text-center">
        <h2 className="text-base font-semibold">{card.card_name}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {card.annual_fee ? `Annual Fee: ${card.annual_fee}` : "No Annual Fee"}
        </p>

        <div
          className="my-4 prose prose-sm dark:prose-invert text-left"
          dangerouslySetInnerHTML={{ __html: card.description || "" }}
        />

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-neutral-800">
          {card.referral_link ? (
            <a
              href={card.referral_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-sm hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Referral</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              No referral link
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * CardDetailModal Component
 * 
 * Highly educational note: This component renders a modal overlay for card details.
 * Notice how `onClick` is used on the backdrop to trigger `onClose`, but it strictly checks
 * `e.target === e.currentTarget` to prevent click events inside the modal content from bubbling up
 * and accidentally closing the modal. This pattern is essential for accessible and robust modal designs.
 */
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
      <div className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative">
        
        {/* Full width hero image spanning the top */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-110"
            aria-hidden="true"
          />
          <img
            src={imageUrl}
            alt={card.card_name}
            width={card.image_width}
            height={card.image_height}
            className="absolute inset-0 w-full h-full object-contain z-10"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex flex-col overflow-y-auto">
          {/* Header Title */}
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0">
            <h3 className="text-2xl font-semibold">{card.card_name}</h3>
          </div>

          <div className="p-6 flex flex-col">
            <div className="mb-6">
              <h4 className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Annual Fee</h4>
              <p className="text-lg font-medium">{card.annual_fee ?? "No Annual Fee"}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Card Benefits</h4>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    card.description ||
                    "<p class='italic'>No details available</p>",
                }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 p-4 flex justify-end items-center flex-shrink-0">
          {card.referral_link && (
            <a
              href={card.referral_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors duration-200 rounded-md font-medium px-4 py-2 text-sm gap-2"
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

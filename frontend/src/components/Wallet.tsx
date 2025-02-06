import { Card } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig.tsx";

const Wallet = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const getData = async (): Promise<void> => {
    try {
      const cardsResponse = await fetch(`${API_URL}/cards`);
      const cardsData: Card[] = await cardsResponse.json();
      setCards(cardsData);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div id="wallet" className="m-3">
      <h1 className="p-3 font-semibold text-2xl text-center mx-auto">Wallet</h1>
      <div className="lg:mx-auto lg:w-4/6 grid grid-rows md:grid-cols-3 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="mx-auto border-2 w-64 border-black dark:border-white rounded-md"
          >
            <img className="" src="" alt={card.card_name} />
            <div className="p-2">
              <h1 className="mb-2 text-s font-medium border-b-2 border-black dark:border-white">
                {card.card_name}
              </h1>
              <h2 className="text-xs">{card.annual_fee}</h2>
              <h1 className="text-sm text-blue-500 hover:text-blue-700 transition cursor-pointer">
                <a href={card.referral_link} target="_blank" rel="noreferrer">
                  Referral Link
                </a>
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;

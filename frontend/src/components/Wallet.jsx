import React from "react";
import { useEffect, useState } from "react";
import API_URL from "./ApiConfig";

const Wallet = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const cardsResponse = await fetch(`${API_URL}${"/cards"}`);
    const cardsData = await cardsResponse.json();
    setCards(cardsData);

    console.log(cardsData);
  };

  const cardList = cards.map((card) => (
    <div className="mx-auto border-2 w-64 border-black dark:border-white rounded-md">
      <img className="" src="" />
      <div className="p-2">
        <h1 className="mb-2 text-s font-medium border-b-2 border-black dark:border-white">
          {card.card_name}
        </h1>
        <h2 className="text-xs">{card.annual_fee}</h2>

        {/* <p className="pt-1 text-sm">{card.description}</p> */}
        <h1 className="text-sm text-blue-500 hover:text-blue-700 transition cursor-pointer">
          <a href={card.referral_link} target="_blank" rel="noreferrer">
            Referral Link
          </a>
        </h1>
      </div>
    </div>
  ));

  return (
    <div id="wallet" className="m-3">
      <h1 className="p-3 font-semibold text-2xl text-center mx-auto">Wallet</h1>
      <div className="lg:mx-auto lg:w-4/6 grid grid-rows md:grid-cols-3 gap-2">
        {cardList}
      </div>
    </div>
  );
};

export default Wallet;

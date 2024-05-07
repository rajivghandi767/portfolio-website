import React from "react";
import { useEffect, useState } from "react";

const Wallet = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const cardsResponse = await fetch("http://localhost:8000/cards");
    const cardsData = await cardsResponse.json();
    setCards(cardsData);

    console.log(cardsData);
  };

  const cardList = cards.map((card) => (
    <div className="flex border-2 border-black dark:border-white p-2 m-auto">
      <img className="object-fill square-full w-40 h-40" src="" />
      <div className="p-4">
        <h5 className="mb-2 text-s font-medium border-b-2 border-black dark:border-white">
          {card.card_name}
        </h5>
        <h5 className="text-xs">{card.annual_fee}</h5>
        <p className="pt-1 text-xs">{card.description}</p>
        <h5 className="pt-1 text-blue-500 hover:text-blue-700 transition cursor-pointer">
          <a href={card.referral_link}>Referral Link</a>
        </h5>
      </div>
    </div>
  ));

  return (
    <div id="wallet" className="m-3">
      <h1 className="p-2 text-3xl text-center">Wallet</h1>
      <div className="container grid grid-cols-3 gap-3">{cardList}</div>
    </div>
  );
};

export default Wallet;

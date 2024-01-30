import React from "react";

const cards = ["CSP", "Bilt", "CSR", "Cap1"];

const Wallet = () => {
  const cardList = cards.map((item) => (
    <div className="flex space-between border rounded-lg p-2 m-auto shadow">
      <img
        className="object-fill square-full w-40 h-40"
        src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg"
      />
      <div className="p-4">
        <h5 className="mb-2 text-2xl font-medium border-b-2">Credit Card</h5>
        <p className="pt-3">Description and benefits of card</p>
      </div>
    </div>
  ));

  return (
    <div id="wallet" className="h-screen">
      <div className="m-8">
        <h1 className="text-4xl text-center">Wallet</h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mx-5">{cardList}</div>
    </div>
  );
};

export default Wallet;

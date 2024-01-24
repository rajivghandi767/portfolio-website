import React from "react";

const cards = [];

const Wallet = () => {
  // const cardList = cards.map((item) => <li>{item}</li>);

  // return (
  //   <div>
  //     <ul>{cardList}</ul>
  //   </div>
  // );
  return (
    <div className="w-2/4 mx-auto mt-5 mb-2">
      <div>
        <h1 className="text-4xl mb-3">Wallet</h1>
      </div>

      <div class="flex items-center justify-center px-5">
        <a
          href="#"
          class="flex flex-col items-center rounded-lg overflow-hidden border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row"
        >
          <img
            class="w-full object-cover md:h-auto md:w-48 md:rounded-none"
            src="https://via.placeholder.com/640x360"
            alt=""
          />
          <div class="flex flex-col justify-between p-4 leading-normal">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Introduction to React
            </h5>
            <p class="mb-3 font-normal text-gray-700">
              React is a popular frontend library used for creating UI
              components.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Wallet;

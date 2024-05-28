import React from "react";

const Contact = () => {
  return (
    <div id="contact-form" className="pt-3">
      <h1 className="p-1 text-3xl text-center mx-auto">Contact</h1>

      <div className="flex mx-auto items-center justify-center border-2 border-black size-fit dark:border-white p-3">
        <form>
          <label className="text-xl">
            Name
            <br />
            <input
              id="name"
              type="text"
              className="border-2 border-black p-0.5 dark:border-white"
              placeholder="Name"
            />
          </label>
          <br />
          <label className="text-xl">
            Email
            <br />
            <input
              id="email"
              type="email"
              className="border-2 border-black p-0.5 dark:border-white"
              placeholder="name@example.com"
            />
          </label>
          <br />
          <label className="text-xl">
            Message
            <br />
            <textarea
              id="message"
              className="border-2 border-black p-0.5 dark:border-white"
              placeholder="Type message here..."
            />
          </label>
          <br />
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-black dark:border border-white hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

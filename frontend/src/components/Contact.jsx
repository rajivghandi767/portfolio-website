import React from "react";

const Contact = () => {
  return (
    <div id="contact-form" className="pt-3">
      <h1 className="p-1 text-2xl text-center mx-auto">Contact</h1>

      <div className="flex mx-auto items-center justify-center border-2 border-black size-fit dark:border-white p-3 rounded-md">
        <form action="" method="POST">
          <label className="text-l">
            Name
            <br />
            <input
              id="name"
              type="text"
              className="border-2 border-black p-0.5 dark:border-white rounded-md"
              placeholder="Name"
            />
          </label>
          <br />
          <label className="text-l">
            Email
            <br />
            <input
              id="email"
              type="email"
              className="border-2 border-black p-0.5 dark:border-white rounded-md"
              placeholder="name@example.com"
            />
          </label>
          <br />
          <label className="text-l">
            Message
            <br />
            <textarea
              id="message"
              className="border-2 border-black p-0.5 dark:border-white rounded-md"
              placeholder="Type message here..."
            />
          </label>
          <br />
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-2 bg-black dark:border border-white hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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

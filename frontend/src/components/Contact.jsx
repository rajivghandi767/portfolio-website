import React from "react";

const Contact = () => {
  return (
    <>
      <div id="contact" className="pt-3">
        <h1 className="p-2 text-3xl text-center">Contact</h1>

        <div className="flex item-center w-2/3 border-2 border-black dark:border-white p-3">
          <form>
            <label className="text-xl">
              Name
              <br />
              <input type="text" className="border rounded" />
            </label>
            <br />
            <label className="text-xl">
              Email
              <br />
              <input type="email" className="border rounded " />
            </label>
            <br />
            <label className="text-xl">
              Message
              <br />
              <input type="text" className="border rounded" />
            </label>
            <br />
            <button
              type="submit"
              className="flex mx-auto m-2 bg-black dark:border border-white hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;

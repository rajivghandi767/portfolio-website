import React from "react";

const Contact = () => {
  return (
    <>
      <div id="contact" className="m-3">
        <h1 className="p-2 text-4xl text-center">Contact</h1>

        <div className="flex items-center justify-center w-1/4 mx-auto space-between border rounded-lg p-3 shadow">
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
              <input type="email" className="border rounded" />
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
              className="flex mx-auto m-2 bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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

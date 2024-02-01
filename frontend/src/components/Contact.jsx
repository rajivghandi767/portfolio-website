import React from "react";

const Contact = () => {
  return (
    <>
      <div id="contact" classname="md:h-screen">
        <div className="m-8">
          <h1 className="text-4xl text-center">Contact</h1>
        </div>
        <div className="flex justify-center m-4">
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

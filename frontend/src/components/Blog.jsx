import React from "react";
import { useEffect, useState } from "react";

const Blog = () => {
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const blogResponse = await fetch("http://localhost:8000/post");
    const blogData = await blogResponse.json();
    setBlog(blogData);

    console.log(blogData);
  };

  const eachPost = ["Article 1", "Article 1", "Article 1"];

  const blogPosts = eachPost.map((item) => (
    <div className="flex space-between border rounded-lg p-2 m-auto shadow">
      <img
        className="object-fill w-64 h-64"
        src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg"
      />
      <div className="p-4">
        <h5 className="mb-2 text-2xl font-medium border-b-2">Blog Title</h5>
        <p className="pt-3">
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </p>
      </div>
    </div>
  ));
  return (
    <div id="blog" className="md:h-screen">
      <div className="m-8">
        <h1 className="text-4xl text-center">Blog Posts</h1>
      </div>
      <div className="grid grid-row-1 gap-4 mx-5">{blogPosts}</div>
    </div>
  );
};

export default Blog;

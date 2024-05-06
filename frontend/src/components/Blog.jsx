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

  const blogPosts = blog.map((post) => (
    <div className="flex justify-center space-between border-2 border-black dark:border-white p-2 m-auto shadow">
      <img className="object-fill w-64 h-64" src={post.image} />
      <div className="p-4">
        <h5 className="mb-2 text-xl font-medium border-b-2 border-black dark:border-white">
          {post.title}
        </h5>
        <p className="pt-3">{post.body}</p>
      </div>
    </div>
  ));
  return (
    <div id="blog" className="m-3">
      <h1 className="p-2 text-3xl text-center">Blog Posts</h1>
      <div className="grid grid-row-1 gap-4 mx-5">{blogPosts}</div>
    </div>
  );
};

export default Blog;

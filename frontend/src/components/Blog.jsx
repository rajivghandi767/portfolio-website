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
    <div className="mx-5 border-2 border-black dark:border-white">
      <img className="object-cover object-top" src={post.image} />
      <div className="p-4">
        <h5 className="mb-2 text-xl font-medium border-b-2 border-black dark:border-white">
          {post.title}
        </h5>
        <p className="pt-3">{post.body}</p>
      </div>
    </div>
  ));
  return (
    <div id="blog" className="mx-auto">
      <h1 className="p-1 text-3xl text-center mx-auto">Blog Posts</h1>
      <div className="grid grid-rows gap-2">{blogPosts}</div>
    </div>
  );
};

export default Blog;

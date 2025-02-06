import { BlogPost } from "../types/index";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig";

const Blog = () => {
  const [blog, setBlog] = useState<BlogPost[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    // Add return type
    try {
      const blogResponse = await fetch(`${API_URL}/post`);
      const blogData: BlogPost[] = await blogResponse.json();
      setBlog(blogData);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  return (
    <div id="blog" className="mx-auto">
      <h1 className="p-3 font-semibold text-2xl text-center mx-auto">
        Blog Posts
      </h1>
      <div className="grid grid-rows gap-2">
        {blog.map((post) => (
          <div
            key={post.id}
            className="mx-5 md:mx-auto p-2 justify-center items-center md:flex md:w-5/6 lg:w-3/4 border-2 border-black dark:border-white"
          >
            <img
              className="object-cover object-top"
              src={post.image}
              alt={post.title}
            />
            <div className="p-4">
              <h5 className="mb-2 text-xl font-medium border-b-2 border-black dark:border-white">
                {post.title}
              </h5>
              <p className="pt-3 line-clamp-3">{post.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

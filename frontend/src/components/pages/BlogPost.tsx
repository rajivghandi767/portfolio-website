// src/components/pages/BlogPost.tsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { BlogPost as BlogPostType } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";

// This component is for viewing an individual blog post
const BlogPost = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch post data using our custom hook
  const {
    data: post,
    isLoading,
    error,
  } = useApi<BlogPostType>(() => apiService.blog.getOne(id || ""), [id]);

  // Scroll to top when post loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Process content to handle images and format text
  const processContent = (content: string): React.ReactNode[] => {
    // Simple parser to identify image tags and text blocks
    const imgRegex = /\!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="mb-4">
            {content.slice(lastIndex, match.index)}
          </p>
        );
      }

      // Add the image using imageUtils
      const alt = match[1] || "";
      const src = imageUtils.getImageUrl(match[2], "blogPost");
      parts.push(
        <figure key={`img-${match.index}`} className="my-6">
          <img
            src={src}
            alt={alt}
            className="mx-auto rounded-lg shadow-md max-h-96 object-cover border border-default"
          />
          {alt && (
            <figcaption className="text-center text-sm mt-2">{alt}</figcaption>
          )}
        </figure>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="mb-4">
          {content.slice(lastIndex)}
        </p>
      );
    }

    return parts;
  };

  return (
    <div className="max-w-3xl mx-auto pt-6 pb-2 px-4">
      <div className="flex justify-between items-center">
        <Link
          to="/blog"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to All Posts</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh] py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error || !post ? (
        <div className="min-h-[60vh] py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-8 rounded-lg border border-red-200 dark:border-red-900 text-center">
              <h2 className="text-xl font-bold mb-4">
                {error || "Post not found"}
              </h2>
              <p>
                We couldn't load this blog post. Please try again later or
                return to the blog.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <article className="mt-6 card p-6">
          <h1 className="text-3xl font-semibold mb-6">{post.title}</h1>

          <div className="flex flex-wrap gap-4 items-center text-sm mb-8">
            {post.author && (
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{post.author}</span>
              </div>
            )}

            {post.created_at && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <time dateTime={new Date(post.created_at).toISOString()}>
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
          </div>

          {/* Hero image */}
          {post.image && (
            <div className="mb-8">
              <img
                src={imageUtils.getImageUrl(post.image, "blogPost")}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-md border border-default"
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose max-w-none">{processContent(post.body)}</div>

          {/* Tags if available */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-default">
              <h3 className="text-sm font-semibold mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs border border-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation between posts could be added here */}
        </article>
      )}
    </div>
  );
};

export default BlogPost;

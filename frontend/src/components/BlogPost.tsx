import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogPost as BlogPostType } from "../types/index";
import API_URL from "./ApiConfig";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Banner from "./Banner";
import Footer from "./Footer";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode } = useTheme(); // Access theme context

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/post/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BlogPostType = await response.json();
        setPost(data);
        setError(null);

        // Scroll to top when post loads
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load blog post"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Process content to handle images
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
          <p
            key={`text-${lastIndex}`}
            className="mb-4 text-gray-800 dark:text-gray-300"
          >
            {content.slice(lastIndex, match.index)}
          </p>
        );
      }

      // Add the image
      const alt = match[1] || "";
      const src = getImageUrl(match[2]);
      parts.push(
        <figure key={`img-${match.index}`} className="my-6">
          <img
            src={src}
            alt={alt}
            className="mx-auto rounded-lg shadow-md max-h-96 object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              // Use consistent placeholder styling with monospace font to match portfolio theme
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EInline Image Unavailable%3C/text%3E%3C/svg%3E";
              // Prevent infinite error loop
              target.onerror = null;
            }}
          />
          {alt && (
            <figcaption className="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">
              {alt}
            </figcaption>
          )}
        </figure>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p
          key={`text-${lastIndex}`}
          className="mb-4 text-gray-800 dark:text-gray-300"
        >
          {content.slice(lastIndex)}
        </p>
      );
    }

    return parts;
  };

  // Helper function to get proper image URL
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) {
      // Return SVG placeholder with consistent styling matching Projects component
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
    }

    // If the path is already a full URL, return it as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Remove any leading slashes
    const cleanPath = imagePath.replace(/^\/+/, "");

    // Get the base URL (without any path)
    const baseUrl = API_URL.split("/").slice(0, 3).join("/");

    // Construct the full URL
    return `${baseUrl}/${cleanPath}`;
  };

  // Use layout similar to the main Layout component for consistency
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen m-auto font-mono scroll-smooth text-gray-950 dark:text-gray-50 pt-2 pb-2">
      <div className="block sticky top-0 z-50">
        <Banner isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>

      <main className="pb-16">
        <div className="max-w-3xl mx-auto pt-6 pb-2 px-4">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors w-fit"
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : error || !post ? (
          <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg text-center">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                  {error || "Post not found"}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We couldn't load this blog post. Please try again later or
                  return to the blog.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <article className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
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
                  src={getImageUrl(post.image)}
                  alt={post.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // Use consistent placeholder styling with monospace font to match portfolio theme
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EFeature Image Unavailable%3C/text%3E%3C/svg%3E";
                    // Prevent infinite error loop
                    target.onerror = null;
                  }}
                />
              </div>
            )}

            {/* Article content */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {processContent(post.body)}
            </div>

            {/* Tags if available */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

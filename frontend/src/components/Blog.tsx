import { BlogPost } from "../types/index";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "./ApiConfig";
import { ArrowRight, ChevronRight } from "lucide-react";

const Blog = ({ limit = 3 }: { limit?: number }) => {
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const blogResponse = await fetch(`${API_URL}/post`);
      if (!blogResponse.ok) {
        throw new Error(`HTTP error! status: ${blogResponse.status}`);
      }
      const blogData: BlogPost[] = await blogResponse.json();
      setBlog(blogData);
      setError(null);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load blog posts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get proper image URL
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) {
      // Return SVG placeholder with consistent styling matching Projects component
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EPost Image Unavailable%3C/text%3E%3C/svg%3E";
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

  // Determine which posts to display based on limit and showAll flag
  const displayedPosts = showAll ? blog : blog.slice(0, limit);

  // Determine if we should show the "See More" button
  const shouldShowSeeMore = !showAll && blog.length > limit;

  return (
    <div id="blog" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/blog"
          className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-950 to-gray-800 dark:from-gray-50 dark:to-white hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-300 transition-all duration-200"
        >
          Blog Posts
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-2xl mx-auto">
          {error}
        </div>
      ) : blog.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          No blog posts available at this time.
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto space-y-6">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden
                       border border-gray-200 dark:border-gray-700 transition-all duration-300
                       hover:shadow-lg md:flex"
              >
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Use consistent placeholder styling with monospace font to match portfolio theme
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EPost Image Unavailable%3C/text%3E%3C/svg%3E";
                      // Prevent infinite error loop
                      target.onerror = null;
                    }}
                  />
                </div>

                <div className="p-6 md:w-2/3 flex flex-col">
                  <Link
                    to={`/blog/${post.id}`}
                    className="mb-3 text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r 
                           from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300
                           hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-300
                           transition-all duration-200"
                  >
                    {post.title}
                  </Link>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.body}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString()
                        : "No date available"}
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 
                             hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
                    >
                      <span>Read more</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shouldShowSeeMore && (
            <div className="flex justify-center mt-8">
              <Link
                to="/blog"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors px-4 py-2 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <span>See More Posts</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;

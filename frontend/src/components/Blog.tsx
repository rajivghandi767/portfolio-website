import { BlogPost } from "../types/index";
import { React, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API_URL from "./ApiConfig";
import { ArrowRight, ChevronRight } from "lucide-react";

const Blog = ({ limit = 3 }: { limit?: number }) => {
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const location = useLocation(); // Add this to check the current route

  useEffect(() => {
    getData();
    // If we're on the dedicated blog page, show all posts
    if (location.pathname === "/blog") {
      setShowAll(true);
    }
  }, [location.pathname]); // Add location dependency

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

  // Function to handle "See More" click
  const handleSeeMoreClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault(); // Prevent navigation on homepage
      setShowAll(true); // Show all posts
    }
    // On other pages, let the Link component handle navigation
  };

  // Determine which posts to display based on limit and showAll flag
  const displayedPosts = showAll ? blog : blog.slice(0, limit);

  // Determine if we should show the "See More" button (only on homepage when limited)
  const shouldShowSeeMore =
    !showAll && blog.length > limit && location.pathname === "/";

  return (
    <div id="blog" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/blog"
          className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-300 hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-100 transition-all duration-200"
          onClick={handleSeeMoreClick}
        >
          Blog Posts
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-black border border-red-200 dark:border-red-900 rounded-lg max-w-2xl mx-auto">
          {error}
        </div>
      ) : blog.length === 0 ? (
        <div className="text-center text-black dark:text-gray-400 p-8">
          No blog posts available at this time.
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto space-y-6">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden
                       border-2 border-black dark:border-gray-800 transition-all duration-300
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
                           from-black to-gray-900 dark:from-white dark:to-gray-300
                           hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-100
                           transition-all duration-200"
                  >
                    {post.title}
                  </Link>

                  <p className="text-sm text-black dark:text-gray-300 mb-4 line-clamp-3">
                    {post.body}
                  </p>

                  <div className="mt-auto pt-4 border-t border-black dark:border-gray-800 flex justify-between items-center">
                    <div className="text-xs text-black dark:text-gray-400">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString()
                        : "No date available"}
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-sm text-black dark:text-gray-300 
                             hover:text-gray-800 dark:hover:text-white transition-colors group"
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
                className="flex items-center gap-2 text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors px-4 py-2 border-2 border-black dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900"
                onClick={handleSeeMoreClick}
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

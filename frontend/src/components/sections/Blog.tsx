// src/components/sections/Blog.tsx
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../types";
import { ArrowRight, ChevronRight } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";

interface BlogProps {
  limit?: number;
}

// This component is for the home page preview
const Blog = ({ limit = 3 }: BlogProps) => {
  // Fetch blog posts using our custom hook
  const {
    data: posts,
    isLoading,
    error,
  } = useApi<BlogPost[]>(() => apiService.blog.getAll());

  // Determine which posts to display based on limit
  const displayedPosts = (posts || []).slice(0, limit);

  // Determine if we should show the "See More" button
  const shouldShowSeeMore = (posts?.length || 0) > limit;

  return (
    <div id="blog" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link to="/blog" className="text-2xl font-semibold text-center">
          Blog Posts
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-900">
            {error}
          </div>
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="text-center p-8">
          No blog posts available at this time.
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto space-y-6">
            {displayedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {shouldShowSeeMore && (
            <div className="flex justify-center mt-8">
              <Link to="/blog">
                <button className="btn btn-outline flex items-center gap-2 px-4 py-2">
                  <span>See All Posts</span>
                  <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Separate component for each blog post card
const BlogPostCard = ({ post }: { post: BlogPost }) => {
  // Convert relative image path to full URL
  const imageUrl = imageUtils.getImageUrl(post.image, "blogPost");

  // Format date
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString()
    : "No date available";

  return (
    <div className="card hover-scale md:flex">
      <div className="card-image-container md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 md:w-2/3 flex flex-col">
        <Link to={`/blog/${post.id}`}>
          <h2 className="mb-3 text-xl font-medium hover:text-primary transition-all duration-200">
            {post.title}
          </h2>
        </Link>

        <p className="mb-4 line-clamp-3 text-sm">{post.body}</p>

        <div className="mt-auto pt-4 border-t border-default flex justify-between items-center">
          <div className="text-xs">{formattedDate}</div>

          <Link
            to={`/blog/${post.id}`}
            className="flex items-center gap-1 text-sm hover:text-primary transition-colors group"
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
  );
};

export default Blog;

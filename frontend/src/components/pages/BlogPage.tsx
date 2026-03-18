import { useState } from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../types";
import { ArrowRight, Search, Calendar } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: posts,
    isLoading,
    error,
  } = useApi<BlogPost[]>(() => apiService.blog.getAll());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-brand-light dark:text-brand-dark">
        All Blog Posts
      </h1>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Replaced .border-default and .focus:ring-primary
            className="w-full p-2 pl-10 bg-transparent border border-gray-200 dark:border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light dark:focus:ring-brand-dark text-brand-light dark:text-brand-dark placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      <DataLoader<BlogPost>
        isLoading={isLoading}
        error={error}
        data={posts}
        emptyMessage="No blog posts available at this time."
      >
        {(allPosts) => {
          const filteredPosts = allPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (post.tags &&
                post.tags.some((tag) =>
                  tag.toLowerCase().includes(searchTerm.toLowerCase()),
                )),
          );

          if (filteredPosts.length === 0) {
            return (
              <div className="text-center p-8 text-gray-500">
                No blog posts found matching your search.
              </div>
            );
          }

          return (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          );
        }}
      </DataLoader>
    </div>
  );
};

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const imageUrl = imageUtils.getImageUrl(post.image_url, "blogPost");

  const formattedDate = post.created_on
    ? new Date(post.created_on).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date available";

  return (
    // Replaced .card and .hover-scale
    <div className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] md:flex">
      {/* Replaced .card-image-container */}
      <div className="bg-white dark:bg-neutral-900 flex items-center justify-center md:w-1/3 h-60 md:h-auto overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 md:w-2/3 flex flex-col">
        <div className="flex items-center gap-2 text-xs mb-2 text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>

        <Link to={`/blog/${post.id}`}>
          <h2 className="text-2xl font-semibold mb-3 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors">
            {post.title}
          </h2>
        </Link>

        <div
          className="text-sm mb-4 prose prose-sm dark:prose-invert max-w-none line-clamp-4"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                // Replaced .border-default
                className="px-2 py-1 bg-gray-100 dark:bg-neutral-900 text-xs rounded-full border border-gray-200 dark:border-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <Link
            to={`/blog/${post.id}`}
            className="flex items-center gap-1 text-sm hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors group"
          >
            <span>Read full post</span>
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

export default BlogPage;

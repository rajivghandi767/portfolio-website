import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlogPost } from "../../types";
import { Search } from "../common/Icons";
import { BlogPostCard } from "../common/BlogPostCard";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import DataLoader from "../common/DataLoader";
import { BlogPostSkeleton } from "../common/Skeleton";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const params: Record<string, string> = {};
  if (searchTerm) params.search = searchTerm;
  if (activeTag) params.categories__name = activeTag;

  const {
    data: posts,
    isLoading,
    error,
  } = useApi<BlogPost[]>(() => apiService.blog.getAll(params), [searchTerm, activeTag]);

  const {
    data: tags = [],
  } = useApi<string[]>(() => apiService.blog.getTags());

  const toggleTag = (tag: string) => {
    if (activeTag === tag) {
      searchParams.delete("tag");
    } else {
      searchParams.set("tag", tag);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-brand-light dark:text-brand-dark">
        All Blog Posts
      </h1>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto mb-4">
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

        {(tags || []).length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {(tags || []).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  activeTag === tag 
                    ? "bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark border-brand-light dark:border-brand-dark" 
                    : "bg-transparent border-gray-200 dark:border-neutral-800 text-brand-light dark:text-brand-dark hover:border-gray-400 dark:hover:border-neutral-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <DataLoader<BlogPost>
        isLoading={isLoading}
        error={error}
        data={posts}
        emptyMessage="No blog posts available at this time."
        skeleton={
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <BlogPostSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        }
      >
        {(filteredPosts) => {
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



export default BlogPage;

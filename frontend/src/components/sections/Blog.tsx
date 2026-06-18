import { Link } from "react-router-dom";
import { BlogPost, PageProps } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import DataLoader from "../common/DataLoader";
import { BlogPostCard } from "../common/BlogPostCard";
import { ChevronRight } from "../common/Icons";

const Blog = ({ limit = 3 }: PageProps) => {
  const {
    data: posts,
    isLoading,
    error,
  } = useApi<BlogPost[]>(() => apiService.blog.getAll());

  return (
    <div id="blog" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/blog"
          className="text-2xl font-semibold text-center hover:underline"
        >
          Blog Posts
        </Link>
      </div>

      <DataLoader<BlogPost>
        isLoading={isLoading}
        error={error}
        data={posts}
        emptyMessage="Coming Soon!"
      >
        {(allPosts) => {
          const displayedPosts = allPosts.slice(0, limit);
          const shouldShowSeeMore = allPosts.length > limit;

          return (
            <>
              <div className="max-w-4xl mx-auto space-y-6">
                {displayedPosts.map((post, index) => (
                  <BlogPostCard key={post.id} post={post} isEager={index < limit} />
                ))}
              </div>

              {shouldShowSeeMore && (
                <div className="flex justify-center mt-8">
                  <Link to="/blog">
                    <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 px-4 py-2 bg-transparent border-2 border-gray-200 dark:border-neutral-800 text-brand-light dark:text-brand-dark hover:border-brand-light dark:hover:border-brand-dark gap-2">
                      <span>See All Posts</span>
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>
              )}
            </>
          );
        }}
      </DataLoader>
    </div>
  );
};



export default Blog;

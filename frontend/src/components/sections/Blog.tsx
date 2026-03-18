import { Link } from "react-router-dom";
import { BlogPost, PageProps } from "../../types";
import { ArrowRight, ChevronRight } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";

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
                {displayedPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
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

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const imageUrl = imageUtils.getImageUrl(post.image_url, "blogPost");
  const formattedDate = post.created_on
    ? new Date(post.created_on).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";

  return (
    <div className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] md:flex">
      <div className="bg-white dark:bg-neutral-900 flex items-center justify-center md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 md:w-2/3 flex flex-col">
        <Link to={`/blog/${post.id}`}>
          <h2 className="mb-3 text-xl font-medium hover:text-neutral-500 dark:hover:text-neutral-400 transition-all">
            {post.title}
          </h2>
        </Link>
        <div
          className="mb-4 line-clamp-3 text-sm prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="flex items-center gap-1 text-sm hover:text-neutral-500 dark:hover:text-neutral-400 group"
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

// src/components/sections/Blog.tsx
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
        <Link to="/blog" className="text-2xl font-semibold text-center">
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
                    <button className="btn btn-outline flex items-center gap-2 px-4 py-2">
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

// BlogPostCard Component
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
          <h2 className="mb-3 text-xl font-medium hover:text-primary transition-all">
            {post.title}
          </h2>
        </Link>
        <div
          className="mb-4 line-clamp-3 text-sm prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        <div className="mt-auto pt-4 border-t border-default flex justify-between items-center">
          <div className="text-xs">{formattedDate}</div>
          <Link
            to={`/blog/${post.id}`}
            className="flex items-center gap-1 text-sm hover:text-primary group"
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

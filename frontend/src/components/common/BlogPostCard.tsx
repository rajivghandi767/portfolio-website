import { Link } from "react-router-dom";
import { BlogPost } from "../../types";
import { Calendar } from "./Icons";
import imageUtils from "../../utils/imageUtils";

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const formattedDate = new Date(
    post.publish_date || post.created_on || "",
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] flex group">
      <div className="w-1/3 sm:w-1/3 aspect-[4/3] flex-shrink-0 overflow-hidden relative">
        <img
          src={imageUtils.getImageUrl(post.image_url, "blogCard")}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 sm:p-6 w-2/3 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs mb-1 sm:mb-2 text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>

        <Link to={`/blog/${post.slug || post.id}`}>
          <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 leading-tight hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors">
            {post.title}
          </h2>
        </Link>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-neutral-900 text-[10px] sm:text-xs rounded-full border border-gray-200 dark:border-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors z-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div
          className="text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-4 prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </div>
  );
};

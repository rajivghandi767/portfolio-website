import { useState } from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../types";
import { ArrowRight, Search, Calendar } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";

// Main blog page component
const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all blog posts
  const {
    data: posts,
    isLoading,
    error,
  } = useApi<BlogPost[]>(() => apiService.blog.getAll());

  // Filter posts by search term if needed
  const filteredPosts = posts
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.tags &&
            post.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">
        All Blog Posts
      </h1>

      {/* Search input */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 bg-transparent border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
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
                  tag.toLowerCase().includes(searchTerm.toLowerCase())
                ))
          );

          if (filteredPosts.length === 0) {
            return (
              <div className="text-center p-8">
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

// Blog post card component for the blog page view
const BlogPostCard = ({ post }: { post: BlogPost }) => {
  // Get image URL using imageUtils
  const imageUrl = imageUtils.getImageUrl(post.image_url, "blogPost");

  // Format date
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date available";

  // Get a preview of the content (first few lines)
  const previewContent =
    post.body.length > 300 ? post.body.substring(0, 300) + "..." : post.body;

  return (
    <div className="card hover-scale md:flex">
      <div className="card-image-container md:w-1/3 h-60 md:h-auto overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 md:w-2/3 flex flex-col">
        <div className="flex items-center gap-2 text-xs mb-2">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>

        <Link to={`/blog/${post.id}`}>
          <h2 className="text-2xl font-semibold mb-3 hover:text-primary transition-colors">
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
                className="px-2 py-1 bg-gray-100 dark:bg-black text-xs rounded-full border border-default"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <Link
            to={`/blog/${post.id}`}
            className="flex items-center gap-1 text-sm hover:text-primary transition-colors group"
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

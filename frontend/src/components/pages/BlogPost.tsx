import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { BlogPost as BlogPostType } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader"; // Import DataLoader

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch post data using our custom hook
  const {
    data: post,
    isLoading,
    error,
  } = useApi<BlogPostType>(() => apiService.blog.getOne(id || ""), [id]);

  // Scroll to top when post loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // The 'data' from DataLoader will be an array, but our API returns a single object.
  // We wrap it in an array to make it compatible with the DataLoader.
  const postArray = post ? [post] : [];

  return (
    <div className="max-w-3xl mx-auto pt-6 pb-2 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/blog"
          className="flex items-center gap-2 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to All Posts</span>
        </Link>
      </div>

      <DataLoader<BlogPostType>
        isLoading={isLoading}
        error={error}
        data={postArray}
        emptyMessage="This blog post could not be found."
      >
        {(posts) => {
          const singlePost = posts[0]; // Get the single post from the array
          return (
            <article className="card p-6">
              <h1 className="text-3xl font-semibold mb-6">
                {singlePost.title}
              </h1>

              <div className="flex flex-wrap gap-4 items-center text-sm mb-8">
                {singlePost.author && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{singlePost.author}</span>
                  </div>
                )}
                {singlePost.created_on && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <time
                      dateTime={new Date(singlePost.created_on).toISOString()}
                    >
                      {new Date(singlePost.created_on).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </time>
                  </div>
                )}
              </div>

              {singlePost.image_url && (
                <div className="mb-8">
                  <img
                    src={imageUtils.getImageUrl(
                      singlePost.image_url,
                      "blogPost",
                    )}
                    alt={singlePost.title}
                    className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-md border border-default"
                  />
                </div>
              )}

              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: singlePost.body }}
              />

              {singlePost.tags && singlePost.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-default">
                  <h3 className="text-sm font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {singlePost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs border border-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        }}
      </DataLoader>
    </div>
  );
};

export default BlogPost;

import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "../common/Icons";
import { BlogPost as BlogPostType } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";
import { Modal } from "../common/Modal";

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    data: post,
    isLoading,
    error,
  } = useApi<BlogPostType>(() => apiService.blog.getPreview(slug ?? "", token), [slug, token]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Ensure all links in the dynamically injected HTML open in a new tab
  // and attach lightbox functionality to images
  useEffect(() => {
    if (post) {
      // Use setTimeout to ensure the DOM has fully rendered the dangerouslySetInnerHTML content
      setTimeout(() => {
        const proseContainer = document.querySelector('.prose');
        if (proseContainer) {
          const links = proseContainer.querySelectorAll('a');
          links.forEach((link) => {
            // Only modify external links (optional, but good practice)
            if (link.hostname !== window.location.hostname) {
              link.setAttribute('target', '_blank');
              link.setAttribute('rel', 'noopener noreferrer');
            }
          });

          // Lightbox event delegation handled by the wrapper div onClick now
        }
      }, 0);
    }
  }, [post]);

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
        emptyMessage="This draft post could not be found or you are not authorized to view it."
      >
        {(posts) => {
          const singlePost = posts[0];
          return (
            <article className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm p-6 relative">
              <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                DRAFT PREVIEW
              </div>
              <h1 className="text-3xl font-semibold mb-6 pr-24">
                {singlePost.title}
              </h1>

              <div className="flex flex-wrap gap-4 items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
                {singlePost.author && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{singlePost.author}</span>
                  </div>
                )}
                {(singlePost.publish_date || singlePost.created_on) && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <time
                      dateTime={new Date(singlePost.publish_date || singlePost.created_on!).toISOString()}
                    >
                      {new Date(singlePost.publish_date || singlePost.created_on!).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </time>
                  </div>
                )}
              </div>

              {singlePost.image_url && (
                <div 
                  className="mb-8 w-full flex justify-center cursor-pointer"
                  onClick={() => setLightboxImage(imageUtils.getImageUrl(singlePost.image_url, "blogPost"))}
                >
                  <img
                    src={imageUtils.getImageUrl(
                      singlePost.image_url,
                      "blogPost",
                    )}
                    alt={singlePost.title || "Blog post image"}
                    width={singlePost.image_width}
                    height={singlePost.image_height}
                    className="max-w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              )}

              <div
                className="prose max-w-none dark:prose-invert prose-a:break-words prose-img:cursor-pointer"
                dangerouslySetInnerHTML={{ __html: singlePost.body }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'IMG') {
                    setLightboxImage((target as HTMLImageElement).src);
                  }
                }}
              />

              {singlePost.tags && singlePost.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {singlePost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-neutral-900 rounded-full text-xs border border-gray-200 dark:border-neutral-800"
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

      <Modal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        variant="lightbox"
      >
        {lightboxImage && (
          <img
            src={lightboxImage}
            alt="Expanded blog image"
            className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default BlogPreview;

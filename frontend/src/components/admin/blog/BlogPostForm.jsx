import { Link, useNavigate, useParams } from "react-router-dom";
import blogBanner from "../../../imgs/blogBanner.png";
import { uploadImage } from "../../../common/aws";
import { useContext, useRef, useState, useLayoutEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../../../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../../tools.component";
import axios from "axios";
import PropTypes from 'prop-types';

// Check if we already have an editor instance
let globalEditorInstance = null;

// Auto-save interval (in milliseconds)
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Character limit for description
const characterLimit = 200;
const tagLimit = 10;

// Add this list of categories based on your MongoDB schema
const BLOG_CATEGORIES = [
  'Web Development',
  'Frontend',
  'Backend',
  'DevOps',
  'Tutorials',
  'Career'
];

const BlogPostForm = ({ post, onSubmit }) => {
  // Initial blog state based on props or default values
  const initialBlogState = post ? {
    title: post.title || "",
    banner: post.thumbnail || post.banner || "",
    content: post.content || null,
    tags: post.tags || [],
    des: post.excerpt || post.des || "",
    id: post._id || post.id || null,
    slug: post.slug || "",
    status: post.status || "draft",
    category: post.category || "Web Development",
    // Debug props
    _id: post._id,
    mongodb_fields: {
      updatedAt: post.updatedAt,
      createdAt: post.createdAt
    }
  } : {
    title: "",
    banner: "",
    content: null,
    tags: [],
    des: "",
    id: null,
    slug: "",
    status: "draft",
    category: "Web Development"
  };

  // Local state
  const [localBlog, setLocalBlog] = useState(initialBlogState);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showPublishOptions, setShowPublishOptions] = useState(false);
  const autoSaveTimerRef = useRef(null);

  // Get EditorContext if available
  const editorContext = useContext(EditorContext);

  // Determine which context to use (global or local)
  const blog = editorContext?.blog || localBlog;
  const setBlog = editorContext?.setBlog || setLocalBlog;
  const setTextEditor = editorContext?.setTextEditor || (() => {});
  // We'll use setEditorState in external editor context if available, otherwise we handle UI locally
  // (This variable is conditionally used when we have the EditorContext)

  // Safe access to blog properties with fallbacks
  const title = blog?.title || "";
  const banner = blog?.banner || "";
  const content = blog?.content || null;
  const tags = blog?.tags || [];
  const des = blog?.des || "";

  const { blog_id } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const editorElementId = useRef(`textEditor-${Date.now()}`);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!editorRef.current || !isEditorReady || !title) return;
    
    try {
      const data = await editorRef.current.save();
      
      // Check if we have enough content to save
      if ((title || banner) && data?.blocks?.length) {
        const draftData = {
          title,
          banner,
          des,
          content: data,
          tags,
          draft: true,
          category: blog.category || 'Web Development', // Include category in auto-save
          id: blog_id || blog?.id
        };
        
        console.log("Autosaving with data:", draftData);
        
        // Save to MongoDB without authentication headers
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/blog/autosave`, 
          draftData
          // No auth headers for testing
        );
        
        if (response.data.success) {
          setLastSaved(new Date());
          console.log("Auto-saved successfully at", new Date().toLocaleTimeString());
          console.log("Server response:", response.data);
        }
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [title, banner, des, tags, blog_id, blog?.id, blog.category, isEditorReady]);

  // Set up auto-save timer
  useLayoutEffect(() => {
    if (autoSaveEnabled && isEditorReady) {
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
      
      // Set up new timer
      autoSaveTimerRef.current = setInterval(performAutoSave, AUTO_SAVE_INTERVAL);
      
      // Auto-save when title or banner changes
      if (title || banner) {
        const saveTimer = setTimeout(performAutoSave, 2000);
        return () => clearTimeout(saveTimer);
      }
    }
    
    // Clean up
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [title, banner, autoSaveEnabled, isEditorReady, performAutoSave]);

  // Editor initialization with better control over lifecycle
  useLayoutEffect(() => {
    // Don't create a new instance if one already exists in the document
    if (globalEditorInstance || document.querySelector('[data-editorjs-initialized]')) {
      console.log("Editor instance already exists, skipping initialization");
      return;
    }

    let editorInstance = null;
    const editorElement = document.getElementById("textEditor");

    if (editorElement && !editorRef.current) {
      console.log("Initializing editor with ID:", editorElementId.current);
      // Mark the container as having an initialized editor
      editorElement.setAttribute('data-editorjs-initialized', 'true');
      
      try {
        editorInstance = new EditorJS({
          holder: "textEditor",
          data: content,
          tools: tools,
          placeholder: "Let's write an awesome story",
          autofocus: true,
          onChange: () => {
            // Content changed, consider it for auto-saving
            if (autoSaveEnabled) {
              // Debounce auto-save to avoid too frequent saves
              if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
              }
              autoSaveTimerRef.current = setInterval(performAutoSave, AUTO_SAVE_INTERVAL);
            }
          },
          onReady: () => {
            editorRef.current = editorInstance;
            globalEditorInstance = editorInstance;
            setIsEditorReady(true);
            console.log("Editor initialized successfully");
          },
        });

        setTextEditor(editorInstance);
      } catch (error) {
        console.error("Error initializing editor:", error);
      }
    }

    // Cleanup function
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
      
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
          globalEditorInstance = null;
          console.log("Editor destroyed");
        } catch (e) {
          console.error("Error destroying editor", e);
        }
      }
    };
  }, [content, performAutoSave, setTextEditor]);

  // Function to handle banner image upload
  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");

      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
            setBlog({ ...blog, banner: url });
            
            // Trigger auto-save when banner is uploaded
            if (title) {
              setTimeout(performAutoSave, 1000);
            }
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err?.message || "Upload failed");
        });
    }
  };

  // Function to handle title change
  const handleTitleChange = (e) => {
    let input = e.target;

    if (input) {
      try {
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
      } catch (error) {
        console.error("Error adjusting textarea height", error);
      }

      setBlog({ ...blog, title: input.value });
    }
  };

  // Function to handle errors in image loading (fallback to default banner)
  const handleError = (e) => {
    let img = e.target;
    img.src = blogBanner;
  };

  // Toggle auto-save
  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
    if (!autoSaveEnabled) {
      toast.success("Auto-save enabled");
    } else {
      toast.error("Auto-save disabled");
    }
  };

  // Function to handle publishing the blog with additional options dialog
  const handlePublishEvent = () => {
    if (!banner) {
      return toast.error("Upload a blog banner to publish it");
    }

    if (!title) {
      return toast.error("Write a blog title to publish it");
    }

    // Check if we have content before proceeding
    if (editorRef.current && isEditorReady) {
      editorRef.current
        .save()
        .then((data) => {
          if (data?.blocks?.length) {
            // First update the blog content in state
            setBlog({ ...blog, content: data });
            
            // Show the publish options dialog instead of publishing directly
            setShowPublishOptions(true);
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.error("Error saving the content:", err);
          toast.error("Failed to save the content. Please try again.");
        });
    } else {
      toast.error("Editor is not ready. Please try again later.");
    }
  };

  // Function to actually publish after showing options dialog
  const publishBlog = () => {
    if (!title || !banner) {
      return;
    }

    // Validate description
    if (!des.length) {
      return toast.error(
        `Write a description within the ${characterLimit} character limit to publish`
      );
    }

    // Validate tags
    if (!tags.length) {
      return toast.error("Enter at least 1 tag to help rank your blog");
    }

    let loadingToast = toast.loading("Publishing...");
    
    // Get the latest content
    editorRef.current
      .save()
      .then((content) => {
        // Prepare blog object for publishing
        let blogObj = {
          title,
          banner,
          des,
          content,
          tags,
          excerpt: des,
          thumbnail: banner,
          draft: false,
          status: "published",
          category: blog.category || post?.category || "Web Development",
        };

        // Determine the appropriate URL and method
        const postId = blog?.id || blog?._id || post?._id || post?.id;
        const saveUrl = postId
          ? `${import.meta.env.VITE_API_URL}/blog/${postId}`
          : `${import.meta.env.VITE_API_URL}/blog`;
        
        const method = postId ? 'put' : 'post';
        
        console.log(`Publishing blog to ${saveUrl} with method ${method}`, blogObj);
        
        // Make API call
        axios({
          method: method,
          url: saveUrl,
          data: blogObj
        })
          .then((response) => {
            console.log("Publish response:", response.data);
            toast.dismiss(loadingToast);
            toast.success("Published ��");
            setShowPublishOptions(false);

            // If we have an onSubmit callback, call it
            if (onSubmit && typeof onSubmit === 'function') {
              onSubmit({...blogObj, id: postId});
            } else {
              // Otherwise navigate to the blog list
              setTimeout(() => {
                navigate("/dashboard/blogs");
              }, 500);
            }
          })
          .catch((error) => {
            console.error("Error publishing blog:", error);
            toast.dismiss(loadingToast);
            toast.error(error.response?.data?.error || "Error publishing blog");
          });
      })
      .catch((err) => {
        console.error("Error saving content for publish:", err);
        toast.dismiss(loadingToast);
        toast.error("Failed to save content for publishing");
      });
  };

  // Function to handle saving the blog as a draft
  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title) {
      return toast.error("Write a blog title before saving it as a draft");
    }

    console.log("Starting save draft process for blog post:", title);
    let loadingToast = toast.loading("Saving Draft....");

    e.target.classList.add("disable");

    if (editorRef.current && isEditorReady) {
      console.log("Editor is ready, saving content");
      editorRef.current
        .save()
        .then((content) => {
          console.log("Editor content saved:", JSON.stringify(content).substring(0, 100) + "...");
          // If onSubmit prop exists, use it for admin dashboard integration
          if (onSubmit && typeof onSubmit === 'function') {
            console.log("Using onSubmit handler");
            const blogData = {
              id: blog.id || post?.id,
              _id: blog._id || post?._id,
              title: title,
              thumbnail: banner,
              content: content,
              tags: tags,
              excerpt: des,
              slug: blog.slug || post?.slug,
              status: "draft",
              category: blog.category || post?.category || "Web Development"
            };
            
            console.log("Blog data for onSubmit:", blogData);
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            onSubmit(blogData);
          } else {
            // Original API endpoint logic
            console.log("Using direct API endpoint");
            let blogObj = {
              title,
              banner,
              des,
              content,
              tags,
              draft: true,
              category: blog.category || 'Web Development', // Include selected category
            };
            
            console.log("Blog data for API:", blogObj);
            const saveUrl = blog_id 
              ? `${import.meta.env.VITE_API_URL}/blog/update/${blog_id}`
              : `${import.meta.env.VITE_API_URL}/blog/create`;
            
            console.log("Saving to URL:", saveUrl);
            
            // API call without authentication headers
            axios
              .post(saveUrl, blogObj)
              .then((response) => {
                console.log("Save response:", response.data);
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                toast.success("Saved 👍");
                setLastSaved(new Date());

                setTimeout(() => {
                  navigate("/dashboard/blogs?tab=draft");
                }, 500);
              })
              .catch((error) => {
                console.error("Save error:", error.response || error);
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                return toast.error(error.response?.data?.error || "Error saving draft");
              });
          }
        })
        .catch((err) => {
          console.error("Error saving the editor content:", err);
          e.target.classList.remove("disable");
          toast.dismiss(loadingToast);
          toast.error("Failed to save the content. Please try again.");
        });
    } else {
      console.error("Editor not ready");
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      toast.error("Editor is not ready. Please try again later.");
    }
  };

  // Format the last saved time
  const formattedLastSaved = lastSaved 
    ? `Last saved: ${lastSaved.toLocaleTimeString()}`
    : "Not saved yet";

  // Handle tag adding
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        } else {
          toast.error(`Max tag limit is ${tagLimit}`);
        }
      }

      e.target.value = "";
    }
  };

  // Remove a tag
  const removeTag = (tagIndex) => {
    let newTags = [...tags];
    newTags.splice(tagIndex, 1);
    setBlog({ ...blog, tags: newTags });
  };

  return (
    <>
      <Toaster />
      {/* Publish Options Dialog */}
      {showPublishOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Publish Blog Post</h2>
              <button 
                onClick={() => setShowPublishOptions(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4 mb-4">
                <img src={banner} alt="Blog banner" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-medium mt-2 leading-tight line-clamp-2 text-white">
                {title}
              </h1>
              <p className="line-clamp-3 text-lg leading-7 mt-4 text-gray-300">
                {des}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">Description</p>
              <textarea
                maxLength={characterLimit}
                value={des}
                onChange={(e) => setBlog({ ...blog, des: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white resize-none h-24"
                placeholder="Write a short description (will be used as excerpt)"
              ></textarea>
              <p className="mt-1 text-gray-400 text-sm text-right">
                {characterLimit - des.length} characters left
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">Category</p>
              <select
                value={blog.category || "Web Development"}
                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white"
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-gray-400 text-sm">
                Selecting the right category helps readers find your content
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Tags - (Helps in searching and ranking your blog post)
              </p>
              <div className="relative bg-gray-700 border border-gray-600 rounded-md p-3">
                <input
                  type="text"
                  placeholder="Tag"
                  className="bg-gray-700 mb-2 p-2 w-full focus:outline-none text-white"
                  onKeyDown={handleKeyDown}
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-600 text-white"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(i)} 
                        className="ml-1 focus:outline-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-gray-400 text-sm text-right">
                {tagLimit - tags.length} tags left
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPublishOptions(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={publishBlog}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-white">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 mb-6">
          <Link to="/admin/blog" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <p className="text-xl font-medium">
            {title || "New Blog Post"}
          </p>
          <div className="flex gap-4">
            <div className="text-sm text-gray-400 self-center mr-2">
              {formattedLastSaved}
            </div>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${autoSaveEnabled ? 'bg-green-700' : 'bg-gray-700'}`}
              onClick={toggleAutoSave}
            >
              {autoSaveEnabled ? 'Auto-save on' : 'Auto-save off'}
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md" onClick={handlePublishEvent}>
              Publish
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[900px] w-full px-6">
          <div className="relative aspect-video hover:opacity-80 bg-gray-800 border-4 border-gray-700 rounded-lg overflow-hidden mb-8">
            <label htmlFor="uploadBanner" className="cursor-pointer block w-full h-full">
              {banner ? (
                <img
                  src={banner}
                  alt="Blog Banner"
                  className="w-full h-full object-cover"
                  onError={handleError}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">Click to upload banner image</span>
                </div>
              )}
              <input
                id="uploadBanner"
                type="file"
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={handleBannerUpload}
              />
            </label>
          </div>

          <div className="flex justify-between items-center mb-8">
            <input
              value={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full outline-none bg-transparent border-b border-gray-700 py-2 px-1"
              onChange={handleTitleChange}
            />
            
            <div className="flex-shrink-0 ml-4">
              <select
                value={blog.category || "Web Development"}
                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                className="bg-gray-800 border border-gray-700 text-white py-2 px-3 rounded-md"
              >
                <option value="" disabled>Select Category</option>
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div id="textEditor" className="min-h-[300px] text-white"></div>
          </div>
        </div>
      </div>
    </>
  );
};

// PropTypes for the component
BlogPostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    banner: PropTypes.string,
    content: PropTypes.object,
    tags: PropTypes.array,
    excerpt: PropTypes.string,
    des: PropTypes.string,
    slug: PropTypes.string,
    category: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  }),
  onSubmit: PropTypes.func
};

// Default props
BlogPostForm.defaultProps = {
  post: null,
  onSubmit: null
};

export default BlogPostForm;

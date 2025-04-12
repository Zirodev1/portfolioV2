import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/BlogPostCard";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: " ",
};

const ProfilePage = () => {
  let { username: profileId } = useParams();

  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState("");

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let {
    userAuth: { username },
  } = useContext(UserContext);

  const fetchUserProfile = async () => {
    setLoading(true); // Start loading
    try {
      const { data: user } = await axios.post(
        `${import.meta.env.VITE_API_URL}/get-profile`,
        { username: profileId }
      );

      if (user) {
        setProfile(user);
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
      } else {
        console.error("No user found for the provided username");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBlogs = async ({ page = 1, user_id }) => {
    try {
      // Ensure that user_id is available
      if (!user_id) {
        console.error("User ID is undefined");
        return;
      }
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/search-blogs`, {
        author: user_id,
        page,
      });
  
      if (data?.blogs) {
        let formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });
  
        if (formattedData) {
          formattedData.user_id = user_id;
          setBlogs(formattedData);
        } else {
          console.error("No formatted data found, assigning raw blogs data.");
          setBlogs({ results: data.blogs, user_id: user_id });
        }
      } else {
        console.error("No blogs found for this user:", user_id);
        setBlogs({ results: [] });
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };
  useEffect(() => {
    if (profileId !== profileLoaded) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setBlogs(null);
    setProfileLoaded("");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : profile_username ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
            <img
              src={profile_img}
              alt={`${fullname}'s profile`}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />

            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>

            <p>
              {total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId === username ? (
                <Link to="/blog/settings/edit-profile" className="btn-light rounded-md">
                  Edit Profile
                </Link>
              ) : (
                " "
              )}
            </div>

            <AboutUser
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
            >
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => (
                    <div
                      key={i}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                      }}
                    >
                      <BlogPostCard content={blog} author={blog.author?.personal_info} />
                    </div>
                  ))
                ) : (
                  <NoDataMessage message="No blogs published" />
                )}
                <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
              </>

              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <NoDataMessage message="User not found" /> // This can be a 404 page
      )}
    </>
  );
};

export default ProfilePage;

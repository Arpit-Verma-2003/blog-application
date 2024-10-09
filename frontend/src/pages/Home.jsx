import React, { useEffect, useState } from "react";
import Blogcard from "../components/Blogcard";
import { getBlogs } from "../../Api/Api";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Home = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const category = searchParams.get("category") || "all";
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      const response = await getBlogs(category, 1, 9, searchQuery);
      setBlogs(response.data);
      setPage(1);
      setHasMore(response.data.length === 9);
      setLoading(false);
    };
    fetchData();
  }, [category, navigate, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadMoreLoading(true);
      const response = await getBlogs(category, page, 9, searchQuery);
      setBlogs((prevBlogs) => [...prevBlogs, ...response.data]);
      setHasMore(response.data.length === 9);
      setLoadMoreLoading(false);
    };
    if (page > 1) {
      fetchData();
    }
  }, [page, category, searchQuery]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {blogs && blogs.length > 0 ? (
            blogs.map((x, i) => {
              return (
                <Blogcard
                  key={i}
                  blogData={x}
                  showDelete={false}
                  showEdit={false}
                />
              );
            })
          ) : (
            <p>No Blogs Found :(</p>
          )}
        </div>
      )}
      {hasMore && (
        <div className="mt-4">
          {loadMoreLoading ? (
            <Spinner />
          ) : (
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Home;

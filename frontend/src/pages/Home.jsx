import React, { useEffect, useState } from 'react'
import Blogcard from '../components/Blogcard'
import { getBlogs } from '../../Api/Api'
import { useSearchParams ,useNavigate } from "react-router-dom";
const Home = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [blogs,setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const category = searchParams.get('category') || 'all';
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const response = await getBlogs(category, 1);
      if (!response.valid) {
        navigate('/login');
      } else {
        setBlogs(response.data);
        setPage(1);
        setHasMore(response.data.length === 9);
      }
    };

    fetchData();
  }, [category, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBlogs(category, page);

      if (!response.valid) {
        navigate('/login');
      } else {
        setBlogs(prevBlogs => [...prevBlogs, ...response.data]);
        setHasMore(response.data.length === 9);
      }
    };

    if (page > 1) {
      fetchData();
    }
  }, [page,category]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  return (
    <>  
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-3'>
          {blogs && blogs.map((x,i)=>{
            return <Blogcard key={i} blogData = {x} showDelete={false}/>
          })}
        </div>
        {hasMore && (
        <button onClick={loadMore} className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>
          Load More
        </button>
      )}
    </>
  )
}

export default Home

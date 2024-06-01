import { useState, useEffect, useRef } from 'react';
import api from "../api/axios";
import { format } from 'date-fns';
import "../../styles/posts.scss";
import { Link } from "react-router-dom";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const loadingRef = useRef(false); // Prevents multiple calls

    const fetchPosts = async(page) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setIsLoading(true);
        try {
            const response = await api.get(`/posts/all?page=${page}`);
            setPosts(prevPosts => {
                const uniquePosts = new Set(prevPosts.map(post => post._id));
                const filteredNewPosts = response.data.posts.filter(post => !uniquePosts.has(post._id));
                return [...prevPosts, ...filteredNewPosts];
            });
        } catch (err) {
            if (err.response) {
                console.error(err.response.data);
                console.error(err.response.status);
                console.error(err.response.headers);
            } else {
                console.error(err.message);
            }
        }
        loadingRef.current = false;
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 5) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="all-posts">
            <div className="all-post-title">
                <h1>All Posts</h1>
                <h4>I wonder how many posts will actually get published, and how many will sit in my DB.</h4>
            </div>
            <div className="posts-container">
                {posts.map((post) => (
                    <div className="post" key={post._id}>
                        <Link to={`/post/${post._id}`}>
                            <img src={post.imgurl} alt={post.title} />
                        </Link>
                        <div className="text">
                            <h4>{post.title}</h4>
                            <p>{post.snippet}</p>
                        </div>
                    </div>
                ))}
                {isLoading && <p>Loading More Posts...</p>}
            </div>
        </div>
    );
};

export default Posts;

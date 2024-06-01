import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from "react-router-dom";
import { format } from "date-fns";

const BlogPosts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isModalActive, setIsModalActive] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPosts = async (page) => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.get(`/admin/dashboard`, { params: { page, limit: 20 } });
            setPosts(prevPosts => {
                const uniquePosts = new Set(prevPosts.map(post => post._id));
                const filteredNewPosts = response.data.posts.filter(post => !uniquePosts.has(post._id));
                return [...prevPosts, ...filteredNewPosts];
            });
            setTotalPages(response.data.totalPages);
        } catch (err) {
            if (err.response) {
                console.error(err.response.data);
                console.error(err.response.status);
                console.error(err.response.headers);
            } else {
                console.error(err.message);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight) {
            // Limit page number to total available pages
            setPage(prevPage => { 
                console.log("prev page" + prevPage);
                return Math.min(prevPage + 1, totalPages); 
            });
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => { window.removeEventListener("scroll", handleScroll) };
    }, [totalPages]);

    const togglePostStatus = async (postId, currentStatus) => {
        const newStatus = currentStatus === 'Publish' ? "Don't Publish" : 'Publish';
        try {
            const response = await axiosPrivate.patch(`/admin/dashboard/${postId}/status`, { status: newStatus });
            setPosts(posts.map(post => post._id === postId ? { ...post, status: response.data.post.status } : post));
        } catch (err) {
            console.error('Error updating post status:', err);
        }
    };

    const confirmDeletePost = (postId) => {
        setPostToDelete(postId);
        setIsModalActive(true);
    };

    const deletePost = async () => {
        if (!postToDelete) return;
        try {
            await axiosPrivate.delete(`/admin/post/${postToDelete}/delete`);
            setPosts(posts.filter(post => post._id !== postToDelete));
            setIsModalActive(false);
            setPostToDelete(null);
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    return (
        <>
            <div className="blogposts">
                <h1>Blogposts</h1>

                <div className="posts-container">
                    <h2>Blogposts</h2>
                    {posts.map((post) => (
                        <div className="post" key={post._id}>
                            <div className="left-modal">
                                <h4>{post.title}</h4>
                                <p>{post.snippet}</p>
                            </div>
                            <div className="right-modal">
                                <ul>
                                    <li>{post.author?.username}</li>
                                    <li>{post.date ? format(new Date(post.date), "dd MMMM yyyy") : "N/A"}</li>
                                    <li className="link"><Link to={`/admin/dashboard/${post._id}/comments`}>Comments</Link></li>
                                    <li className="link"><Link to={`/admin/post/${post._id}/update`}>Edit</Link></li>
                                    <li className="status" onClick={() => togglePostStatus(post._id, post.status)}>{post.status}</li>
                                    <li className="delete">
                                        <span id="trash" className="material-symbols-outlined" onClick={() => confirmDeletePost(post._id)}>delete</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                    {isLoading && <p>Loading More Posts...</p>}
                </div>
            </div>
            {isModalActive && (
                <div className="modal"> 
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setIsModalActive(false)}>
                            <span className="material-symbols-outlined">cancel</span>
                        </button>
                        
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this post?</p>
                        <div className="button-row">
                            <button onClick={deletePost}>Yes, delete</button>
                            <button onClick={() => setIsModalActive(false)}>Cancel</button>
                        </div>                   
                    </div>
                </div>
            )}
        </>
    );
}

export default BlogPosts;

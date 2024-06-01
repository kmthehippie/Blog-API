import "../../styles/home.scss";
import api from "../api/axios";
import { useState, useEffect } from "react";
import PostCard from "./reusable/Post-Card";

const Home = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    const fetchPosts = async () => {
        try {
            const response = await api.get("/posts");
            setData(response.data.posts);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Error fetching posts. Please try again later.");
            setLoading(false);
        }
    };
    
    useEffect(() => {
        
        fetchPosts();
    }, []);

    return (
        <div className="home">
            <div className="home-head">
                <h1>I am KM</h1>
                <h4>Here is where I share my thoughts and experiences</h4>
            </div>
            
            <img className="hero-img" src="https://images.pexels.com/photos/547115/pexels-photo-547115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
            
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="post-cards-container">
                    {Array.isArray(data) && data.length > 0 ? (
                        <PostCard data={data} />
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;

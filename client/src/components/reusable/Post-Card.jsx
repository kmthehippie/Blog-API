import React from 'react'
import "../../../styles/post-card.scss"
import { Link } from "react-router-dom"

function PostCard({data}) {

    const fallBackImg = "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg"

  return (
    <div className="display-posts">
    {data.map((item, index)=>(
        <div className='post-card' key={index}>
            <Link to={`/post/${item._id}`}>
            <img 
                src={item.imgurl} 
                alt={item.title} 
                onError={(e) => e.target.src = fallBackImg}/>
                <div className="text">
                <h4>
            {item.title}
            </h4>
            <p>
                {item.snippet}
            </p>
                </div>
                </Link>   
        </div>
    ))}
    </div>
  )
}

export default PostCard
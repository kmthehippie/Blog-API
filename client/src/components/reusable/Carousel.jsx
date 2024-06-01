import {useState } from 'react'
import useWindowWidth from "../../hooks/windowWidth";
import { format } from 'date-fns';


const Carousel = ({data}) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <p>No data available</p>;
    }

    const [startIndex, setStartIndex] = useState(0);
    const windowWidth = useWindowWidth();
    
    const blocksPerRow = () => {
        if (windowWidth < 550) return 1;
        if (windowWidth < 850) return 2;
        return 3;
    };

    const nextBlocks = () => {
        setStartIndex(prev => Math.min(prev + blocksPerRow(), data.length - 1));
    };
    
    const prevBlocks = () => {
        setStartIndex(prev => Math.max(prev - blocksPerRow(), 0));
    };
  return (
    <div className="carousel">   
    <button className="prev-btn" onClick={prevBlocks} disabled={startIndex === 0}>
        <span className="material-symbols-outlined">arrow_back</span>
    </button>
    <div className="block-carousel">
        {data.slice(startIndex, startIndex + blocksPerRow()).map((post) => (
            <div className="block" key={post._id}>
                <img className="image" src={post.imgurl}/>
                <p className="title">{post.title.toUpperCase()}</p>
                <p className="snippet">{post.snippet}</p>
                {post.date ? (
                    <p className="date">{format(new Date(post.date), 'dd MMMM yyyy')}</p>
                ) : (
                    <p className="date">No date available</p>
                )}
            </div>
        ))}
    </div>
    <button className="next-btn" onClick={nextBlocks} disabled={startIndex + blocksPerRow() >= data.length}>
        <span className="material-symbols-outlined">arrow_forward</span>
    </button>
    </div>
  )
}

export default Carousel
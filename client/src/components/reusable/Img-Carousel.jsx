import { useState } from 'react';


const ImageCarousel = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };
    return (
        <div className="image-carousel">
            <button className="prev-btn"onClick={prevSlide}><span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="slide">
                <img src={slides[currentIndex].imageUrl} alt={`Slide ${currentIndex}`} />
                <div className="text">{slides[currentIndex].text}</div>
            </div>
            <div className="navigation-dots">
                {slides.map((slide, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
            <button className="next-btn"onClick={nextSlide}><span className="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>
    );
};

export default ImageCarousel;

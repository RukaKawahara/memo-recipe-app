import React, { useState } from 'react';
import styles from './ImageCarousel.module.scss';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt = '画像',
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  if (images.length === 0) {
    return (
      <div className={`${styles.carousel} ${className || ''}`}>
        <div className={styles.noImage}>
          <img src="/images/noimage.png" alt="画像がありません" />
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`${styles.carousel} ${className || ''}`}>
        <div className={styles.singleImage}>
          <img src={images[0]} alt={alt} />
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  return (
    <div className={`${styles.carousel} ${className || ''}`}>
      <div className={styles.carouselContainer}>
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className={`${styles.carouselButton} ${styles.prev}`}
            aria-label="前の画像"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path>
            </svg>
          </button>
        )}

        <div className={styles.imageWrapper}>
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className={`${styles.carouselImage} ${
              direction === 'right' ? styles.slideInRight : styles.slideInLeft
            }`}
          />
        </div>

        {currentIndex < images.length - 1 && (
          <button
            onClick={goToNext}
            className={`${styles.carouselButton} ${styles.next}`}
            aria-label="次の画像"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path>
            </svg>
          </button>
        )}
      </div>

      <div className={styles.indicators}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ''
            }`}
            aria-label={`画像 ${index + 1} に移動`}
          />
        ))}
      </div>

      <div className={styles.counter}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageCarousel;

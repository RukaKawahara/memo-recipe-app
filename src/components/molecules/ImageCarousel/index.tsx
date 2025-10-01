import React, { useState } from 'react';
import styles from './ImageCarousel.module.scss';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import Icon from '../../atoms/Icon';

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
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // タッチイベントのハンドラー
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      goToNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      goToPrevious();
    }
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
            <Icon name="arrow-left" size={24} />
          </button>
        )}

        <div
          className={styles.imageWrapper}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {isLoading && (
            <div className={styles.loadingSpinner}>
              <LoadingSpinner size="large" />
            </div>
          )}
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className={`${styles.carouselImage} ${
              direction === 'right' ? styles.slideInRight : styles.slideInLeft
            } ${isLoading ? styles.loading : ''}`}
            onLoad={handleImageLoad}
          />
        </div>

        {currentIndex < images.length - 1 && (
          <button
            onClick={goToNext}
            className={`${styles.carouselButton} ${styles.next}`}
            aria-label="次の画像"
          >
            <Icon name="arrow-right" size={24} />
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

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './BannerCarousel.module.css';

interface Banner {
  id: number;
  image_url: string;
  order_index: number;
}

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className={styles.heroBanner}>
        <div className={styles.bannerPlaceholder}>
          <h1>Próteses Médicas em Impressão 3D</h1>
          <p>Tecnologia de ponta para soluções personalizadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.heroBanner}>
      <div className={styles.bannerCarousel}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.bannerSlide} ${index === currentIndex ? styles.active : ''}`}
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <Image
              src={banner.image_url}
              alt={`Banner ${index + 1}`}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className={styles.bannerDots}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

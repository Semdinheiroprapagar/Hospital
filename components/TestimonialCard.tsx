'use client';

import styles from './TestimonialCard.module.css';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  role: string | null;
  created_at: string;
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`${styles.testimonialCard} card scroll-slide-left ${isVisible ? 'visible' : ''}`}
    >
      <div className={styles.quoteIcon}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V30H10V20Z"
            fill="var(--accent)"
            opacity="0.2"
          />
          <path
            d="M22 20C22 14.477 26.477 10 32 10V14C28.686 14 26 16.686 26 20H30V30H22V20Z"
            fill="var(--accent)"
            opacity="0.2"
          />
        </svg>
      </div>
      <p className={styles.testimonialContent}>{testimonial.content}</p>
      <div className={styles.testimonialAuthor}>
        <p className={styles.authorName}>{testimonial.name}</p>
        {testimonial.role && <p className={styles.authorRole}>{testimonial.role}</p>}
      </div>
    </div>
  );
}

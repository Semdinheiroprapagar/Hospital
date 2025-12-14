'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './PostCard.module.css';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function PostCard({ post }: { post: Post }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Link href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
      <article
        ref={ref}
        className={`${styles.postCard} scroll-animate ${isVisible ? 'visible' : ''}`}
      >
        {post.image_url && post.image_url.trim() !== '' && (
          <div className={styles.postImage}>
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div className={styles.overlay} />

        <div className={styles.postContent}>
          <div className={styles.topContent}>
            <span className={styles.category}>PUBLICAÇÃO</span>
            <h3 className={styles.postTitle}>{post.title}</h3>
          </div>

          <div className={styles.bottomContent}>
            <div className={styles.plusButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const post = await db.getPost(parseInt(id));

    if (!post) {
        notFound();
    }

    return (
        <div className={styles.postPage}>
            <Link href="/" className={styles.closeButton} aria-label="Fechar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </Link>

            <main className={styles.main}>
                <article className={styles.postArticle}>
                    {post.image_url && post.image_url.trim() !== '' && (
                        <div className={styles.postImageContainer}>
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                sizes="(max-width: 800px) 100vw, 800px"
                                priority
                                className={styles.postImage}
                            />
                        </div>
                    )}

                    <div className={styles.postHeader}>
                        <span className={styles.category}>PUBLICAÇÃO</span>
                        <h1 className={styles.postTitle}>{post.title}</h1>
                    </div>

                    <div className={styles.postContent}>
                        <p>{post.content}</p>
                    </div>
                </article>
            </main>
        </div>
    );
}

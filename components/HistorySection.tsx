'use client';

'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './HistorySection.module.css';

interface HistoryItem {
    id: number;
    title: string;
    content: string;
    image_url: string;
    order_index: number;
}

export default function HistorySection({ items }: { items: HistoryItem[] }) {
    const [activeId, setActiveId] = useState<number>(items[0]?.id || 0);

    const activeItem = items.find((item) => item.id === activeId) || items[0];

    if (!items || items.length === 0) return null;

    return (
        <section id="historia" className={styles.historySection}>
            <div className="container">
                <div className={styles.contentWrapper}>
                    {/* Left Side: Accordion/List */}
                    <div className={styles.accordion}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <button
                                    className={`${styles.itemHeader} ${activeId === item.id ? styles.active : ''}`}
                                    onClick={() => setActiveId(item.id)}
                                >
                                    <h3>{item.title}</h3>
                                    <span className={styles.icon}>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                                transform: activeId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    className={`${styles.itemContent} ${activeId === item.id ? styles.open : ''}`}
                                >
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Dynamic Image */}
                    <div className={styles.imageDisplay}>
                        {activeItem && activeItem.image_url && (
                            <div className={styles.imageContainer}>
                                <Image
                                    key={activeItem.id} // Key forces re-render for animation
                                    src={activeItem.image_url}
                                    alt={activeItem.title}
                                    fill
                                    className={styles.image}
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

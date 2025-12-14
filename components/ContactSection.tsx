import Image from 'next/image';
import styles from './ContactSection.module.css';

interface ContactCard {
    id: number;
    type: 'image' | 'text';
    title: string | null;
    content: string | null;
    image_url: string | null;
    order_index: number;
}

interface ContactSectionProps {
    cards: ContactCard[];
}

const extractPhoneNumber = (content: string): string | null => {
    // Look for patterns that resemble a phone number (with or without mask)
    // Matches: (XX) XXXXX-XXXX, XX XXXXX-XXXX, XXXXXXXXXXX
    const cleanNumber = content.replace(/\D/g, '');

    // Check if it's a valid mobile number (10 or 11 digits)
    if (cleanNumber.length >= 10 && cleanNumber.length <= 11) {
        return cleanNumber;
    }
    return null;
};

export default function ContactSection({ cards }: ContactSectionProps) {
    if (!cards || cards.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {cards.map((card) => {
                        const phoneNumber = card.type === 'text' && card.content ? extractPhoneNumber(card.content) : null;
                        const isLink = !!phoneNumber;
                        const Component = isLink ? 'a' : 'div';
                        const props = isLink ? {
                            href: `https://wa.me/55${phoneNumber}`,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: `${styles.card} ${styles[card.type]} ${styles.clickable}`
                        } : {
                            className: `${styles.card} ${styles[card.type]}`
                        };

                        return (
                            <Component key={card.id} {...props}>
                                {card.type === 'image' && card.image_url ? (
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={card.image_url}
                                            alt={card.title || 'Contact Image'}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className={styles.image}
                                        />
                                        {card.title && <div className={styles.imageOverlay}><h3>{card.title}</h3></div>}
                                    </div>
                                ) : (
                                    <div className={styles.content}>
                                        {card.title && <h3>{card.title}</h3>}
                                        {card.content && <p>{card.content}</p>}
                                    </div>
                                )}
                            </Component>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

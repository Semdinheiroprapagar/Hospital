import BannerCarousel from '@/components/BannerCarousel';
import PostCard from '@/components/PostCard';
import TestimonialCard from '@/components/TestimonialCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import HistorySection from '@/components/HistorySection';
import ContactSection from '@/components/ContactSection';
import db from '@/lib/db';
import './page.css';

// Revalidate every 60 seconds
export const revalidate = 60;

// Helper function to convert Date to ISO string (handles both Date objects and strings)
function toISOString(date: Date | string): string {
  if (typeof date === 'string') {
    return date; // Already a string (Supabase)
  }
  return date.toISOString(); // Convert Date to string (SQLite)
}

export default async function Home() {
  // Fetch banners
  const banners = await db.getBanners();

  // Fetch published posts (limit to 6)
  const allPosts = await db.getPosts();
  const posts = allPosts
    .filter(post => post.published)
    .slice(0, 6)
    .map(post => ({
      ...post,
      created_at: toISOString(post.created_at),
    }));

  // Fetch published testimonials (limit to 3)
  const allTestimonials = await db.getTestimonials();
  const testimonials = allTestimonials
    .filter(t => t.published)
    .slice(0, 3)
    .map(t => ({
      ...t,
      created_at: toISOString(t.created_at),
    }));

  // Fetch history items
  const historyItems = (await db.getHistoryItems()).map(item => ({
    ...item,
    image_url: item.image_url || '',
  }));

  // Fetch contact cards
  const contactCards = await db.getContactCards();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <Navbar />

      {/* Banner Carousel */}
      <section id="inicio">
        <BannerCarousel banners={banners} />
      </section>

      {/* Company History Section */}
      <HistorySection items={historyItems} />

      {/* Posts Section */}
      {posts.length > 0 && (
        <section id="publicacoes" className="posts-section">
          <div className="container">
            <h2 className="section-title">Últimas Publicações</h2>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="relatos" className="testimonials-section">
          <div className="container">
            <h2 className="section-title">Relatos de Pacientes</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <ContactSection cards={contactCards} />

      <Footer />
    </div>
  );
}

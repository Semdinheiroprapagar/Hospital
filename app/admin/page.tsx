'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const menuItems = [
    {
      title: 'Banners',
      description: 'Gerenciar imagens do carrossel',
      href: '/admin/banners',
      icon: '🖼️',
    },
    {
      title: 'Posts',
      description: 'Criar e editar publicações',
      href: '/admin/posts',
      icon: '📝',
    },
    {
      title: 'Relatos',
      description: 'Gerenciar depoimentos de pacientes',
      href: '/admin/testimonials',
      icon: '💬',
    },
    {
      title: 'Contato',
      description: 'Gerenciar cards de contato',
      href: '/admin/contact',
      icon: '📞',
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container">
          <div className="header-content">
            <h1>Painel Administrativo</h1>
            <button onClick={handleLogout} className="btn btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          <div className="dashboard-grid">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="dashboard-card card">
                <div className="card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>

          <div className="quick-links">
            <Link href="/admin/posts" className="dashboard-card card">
              <h3>Gerenciar Posts</h3>
              <p>Criar, editar e remover publicações do blog</p>
            </Link>

            <Link href="/admin/history" className="dashboard-card card">
              <h3>Gerenciar História</h3>
              <p>Editar seções da história e imagens</p>
            </Link>

            <Link href="/admin/testimonials" className="dashboard-card card">
              <h3>Gerenciar Relatos</h3>
              <p>Gerenciar depoimentos de pacientes</p>
            </Link>

            <Link href="/admin/contact" className="dashboard-card card">
              <h3>Gerenciar Contato</h3>
              <p>Editar cards de contato</p>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: var(--secondary);
        }

        .admin-header {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          padding: 20px 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          font-size: 1.75rem;
        }

        .admin-main {
          padding: 60px 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .dashboard-card {
          text-decoration: none;
          cursor: pointer;
          padding: 32px;
          text-align: center;
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .dashboard-card h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: var(--foreground);
        }

        .dashboard-card p {
          color: #6e6e73;
        }

        .quick-links {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
      `}</style>
    </div>
  );
}

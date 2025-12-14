'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: number;
  image_url: string;
  order_index: number;
  created_at: string;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    order_index: 1,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const response = await fetch('/api/banners');
    const data = await response.json();
    setBanners(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = '/api/banners';
    const method = editingBanner ? 'PUT' : 'POST';
    const body = editingBanner
      ? { ...formData, id: editingBanner.id }
      : formData;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setFormData({ image_url: '', order_index: 1 });
    setImagePreview(null);
    setEditingBanner(null);
    setShowForm(false);
    fetchBanners();
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      image_url: banner.image_url,
      order_index: banner.order_index,
    });
    setImagePreview(banner.image_url);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este banner?')) {
      await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
      fetchBanners();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
        setImagePreview(data.url);
      } else {
        alert(data.error || 'Erro ao fazer upload');
      }
    } catch (error) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container">
          <div className="header-content">
            <h1>Gerenciar Banners</h1>
            <div className="header-actions">
              <Link href="/admin" className="btn btn-secondary">
                ← Voltar
              </Link>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingBanner(null);
                  setFormData({ image_url: '', order_index: banners.length + 1 });
                }}
                className="btn btn-primary"
              >
                {showForm ? 'Cancelar' : '+ Novo Banner'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {showForm && (
            <div className="form-card card">
              <h2>{editingBanner ? 'Editar Banner' : 'Novo Banner'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Imagem do Banner</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <p style={{ marginTop: '8px', color: 'var(--accent)' }}>Fazendo upload...</p>}
                  {imagePreview && (
                    <div style={{ marginTop: '12px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <small>Recomendado: 1920x800px ou maior</small>
                </div>

                <div className="form-group">
                  <label>Ordem de Exibição</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    required
                  />
                  <small>Menor número aparece primeiro</small>
                </div>

                <button type="submit" className="btn btn-primary">
                  {editingBanner ? 'Atualizar' : 'Criar'} Banner
                </button>
              </form>
            </div>
          )}

          <div className="banners-grid">
            {banners.map((banner) => (
              <div key={banner.id} className="banner-item card">
                <div className="banner-preview">
                  <img src={banner.image_url} alt={`Banner ${banner.order_index}`} />
                  <div className="banner-overlay">
                    <span className="order-badge">#{banner.order_index}</span>
                  </div>
                </div>
                <div className="banner-actions">
                  <button onClick={() => handleEdit(banner)} className="btn-icon">
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="btn-icon delete">
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {banners.length === 0 && !showForm && (
            <div className="empty-state">
              <p>Nenhum banner cadastrado. Adicione o primeiro banner para começar!</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .admin-page {
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
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-content h1 {
          font-size: 1.75rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .admin-main {
          padding: 40px 0;
        }

        .form-card {
          margin-bottom: 40px;
          padding: 32px;
        }

        .form-card h2 {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group small {
          display: block;
          margin-top: 4px;
          color: #6e6e73;
          font-size: 0.875rem;
        }

        .banners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .banner-item {
          overflow: hidden;
          padding: 0;
        }

        .banner-preview {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .banner-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .order-badge {
          background: var(--accent);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .banner-actions {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid var(--border);
        }

        .btn-icon {
          flex: 1;
          background: var(--secondary);
          border: 1px solid var(--border);
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-icon:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .btn-icon.delete:hover {
          background: #ff3b30;
          border-color: #ff3b30;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6e6e73;
        }

        @media (max-width: 768px) {
          .banners-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

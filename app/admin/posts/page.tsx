'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  published: number;
  created_at: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    published: true,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch('/api/posts');
    const data = await response.json();
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = '/api/posts';
    const method = editingPost ? 'PUT' : 'POST';
    const body = editingPost
      ? { ...formData, id: editingPost.id }
      : formData;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setFormData({ title: '', content: '', image_url: '', published: true });
    setImagePreview(null);
    setEditingPost(null);
    setShowForm(false);
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image_url: post.image_url || '',
      published: post.published === 1,
    });
    setImagePreview(post.image_url || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este post?')) {
      try {
        const response = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
        const data = await response.json();

        if (data.success) {
          alert('Post deletado com sucesso!');
          fetchPosts();
        } else {
          alert('Erro ao deletar post: ' + (data.error || 'Erro desconhecido'));
        }
      } catch (error) {
        alert('Erro ao deletar post. Tente novamente.');
        console.error('Delete error:', error);
      }
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
            <h1>Gerenciar Posts</h1>
            <div className="header-actions">
              <Link href="/admin" className="btn btn-secondary">
                ← Voltar
              </Link>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingPost(null);
                  setFormData({ title: '', content: '', image_url: '', published: true });
                }}
                className="btn btn-primary"
              >
                {showForm ? 'Cancelar' : '+ Novo Post'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {showForm && (
            <div className="form-card card">
              <h2>{editingPost ? 'Editar Post' : 'Novo Post'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Conteúdo</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <p>Fazendo upload...</p>}
                  {imagePreview && (
                    <div style={{ marginTop: '12px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    Publicado
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">
                  {editingPost ? 'Atualizar' : 'Criar'} Post
                </button>
              </form>
            </div>
          )}

          <div className="posts-list">
            {posts.map((post) => (
              <div key={post.id} className="post-item card">
                <div className="post-info">
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 100)}...</p>
                  <div className="post-meta">
                    <span className={`status ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                    <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)} className="btn-icon">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="btn-icon delete">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
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

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }

        .post-info {
          flex: 1;
        }

        .post-info h3 {
          font-size: 1.25rem;
          margin-bottom: 8px;
        }

        .post-info p {
          color: #6e6e73;
          margin-bottom: 12px;
        }

        .post-meta {
          display: flex;
          gap: 16px;
          font-size: 0.875rem;
          color: #6e6e73;
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
        }

        .status.published {
          background: #34c759;
          color: white;
        }

        .status.draft {
          background: #ff9500;
          color: white;
        }

        .post-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .btn-icon:hover {
          background: var(--secondary);
        }

        .btn-icon.delete:hover {
          background: #ff3b30;
        }

        @media (max-width: 768px) {
          .post-item {
            flex-direction: column;
            align-items: flex-start;
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

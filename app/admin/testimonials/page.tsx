'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Testimonial {
    id: number;
    name: string;
    content: string;
    role: string | null;
    published: number;
    created_at: string;
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        role: '',
        published: true,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonials(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = '/api/testimonials';
        const method = editingTestimonial ? 'PUT' : 'POST';
        const body = editingTestimonial
            ? { ...formData, id: editingTestimonial.id }
            : formData;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        setFormData({ name: '', content: '', role: '', published: true });
        setEditingTestimonial(null);
        setShowForm(false);
        fetchTestimonials();
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            content: testimonial.content,
            role: testimonial.role || '',
            published: testimonial.published === 1,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja deletar este relato?')) {
            await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            fetchTestimonials();
        }
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="container">
                    <div className="header-content">
                        <h1>Gerenciar Relatos</h1>
                        <div className="header-actions">
                            <Link href="/admin" className="btn btn-secondary">
                                ← Voltar
                            </Link>
                            <button
                                onClick={() => {
                                    setShowForm(!showForm);
                                    setEditingTestimonial(null);
                                    setFormData({ name: '', content: '', role: '', published: true });
                                }}
                                className="btn btn-primary"
                            >
                                {showForm ? 'Cancelar' : '+ Novo Relato'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="admin-main">
                <div className="container">
                    {showForm && (
                        <div className="form-card card">
                            <h2>{editingTestimonial ? 'Editar Relato' : 'Novo Relato'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nome do Paciente</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Depoimento</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={6}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Cargo/Descrição (opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="Ex: Paciente desde 2020"
                                    />
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
                                    {editingTestimonial ? 'Atualizar' : 'Criar'} Relato
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="testimonials-list">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-item card">
                                <div className="testimonial-info">
                                    <h3>{testimonial.name}</h3>
                                    {testimonial.role && <p className="role">{testimonial.role}</p>}
                                    <p className="content">{testimonial.content}</p>
                                    <div className="testimonial-meta">
                                        <span className={`status ${testimonial.published ? 'published' : 'draft'}`}>
                                            {testimonial.published ? 'Publicado' : 'Rascunho'}
                                        </span>
                                        <span>{new Date(testimonial.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                                <div className="testimonial-actions">
                                    <button onClick={() => handleEdit(testimonial)} className="btn-icon">
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(testimonial.id)} className="btn-icon delete">
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

        .testimonials-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .testimonial-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding: 24px;
        }

        .testimonial-info {
          flex: 1;
        }

        .testimonial-info h3 {
          font-size: 1.25rem;
          margin-bottom: 4px;
        }

        .role {
          color: var(--accent);
          font-size: 0.875rem;
          margin-bottom: 12px;
        }

        .content {
          color: var(--foreground);
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .testimonial-meta {
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

        .testimonial-actions {
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
          .testimonial-item {
            flex-direction: column;
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

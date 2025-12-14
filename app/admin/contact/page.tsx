'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ContactCard {
    id: number;
    type: 'image' | 'text';
    title: string | null;
    content: string | null;
    image_url: string | null;
    order_index: number;
}

export default function ContactAdmin() {
    const router = useRouter();
    const [cards, setCards] = useState<ContactCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<ContactCard>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [newCardType, setNewCardType] = useState<'image' | 'text'>('text');

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await fetch('/api/contact');
            if (response.ok) {
                const data = await response.json();
                setCards(data);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setEditForm({ ...editForm, image_url: data.url });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erro ao fazer upload da imagem');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await fetch(`/api/contact/${isEditing}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editForm),
                });
            } else {
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...editForm, type: newCardType }),
                });
            }

            setIsEditing(null);
            setIsCreating(false);
            setEditForm({});
            fetchCards();
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Erro ao salvar card');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este card?')) return;

        try {
            await fetch(`/api/contact/${id}`, { method: 'DELETE' });
            fetchCards();
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('Erro ao excluir card');
        }
    };

    const startEdit = (card: ContactCard) => {
        setIsEditing(card.id);
        setEditForm(card);
        setIsCreating(false);
    };

    const startCreate = (type: 'image' | 'text') => {
        setIsCreating(true);
        setNewCardType(type);
        setEditForm({ type });
        setIsEditing(null);
    };

    if (isLoading) return <div className="p-8 text-center">Carregando...</div>;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="container">
                    <div className="header-content">
                        <h1>Gerenciar Contato</h1>
                        <Link href="/admin" className="btn btn-secondary">
                            Voltar
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container py-8">
                {!isEditing && !isCreating && (
                    <div className="actions mb-8">
                        <button onClick={() => startCreate('text')} className="btn btn-primary mr-4">
                            Novo Card de Texto
                        </button>
                        <button onClick={() => startCreate('image')} className="btn btn-primary">
                            Novo Card de Imagem
                        </button>
                    </div>
                )}

                {(isEditing || isCreating) && (
                    <div className="edit-form card p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Editar Card' : `Novo Card de ${newCardType === 'image' ? 'Imagem' : 'Texto'}`}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2">Título (Opcional)</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {(isEditing ? editForm.type === 'text' : newCardType === 'text') && (
                                <div>
                                    <label className="block mb-2">Conteúdo</label>
                                    <textarea
                                        value={editForm.content || ''}
                                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                        className="w-full p-2 border rounded h-32"
                                    />
                                </div>
                            )}

                            {(isEditing ? editForm.type === 'image' : newCardType === 'image') && (
                                <div>
                                    <label className="block mb-2">Imagem</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="mb-4"
                                    />
                                    {editForm.image_url && (
                                        <div className="relative w-full h-48 bg-gray-100 rounded">
                                            <Image
                                                src={editForm.image_url}
                                                alt="Preview"
                                                fill
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block mb-2">Ordem</label>
                                <input
                                    type="number"
                                    value={editForm.order_index || 0}
                                    onChange={(e) => setEditForm({ ...editForm, order_index: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="btn btn-primary">
                                    Salvar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(null);
                                        setIsCreating(false);
                                        setEditForm({});
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="cards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="card p-6 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => startEdit(card)} className="btn btn-sm btn-secondary">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(card.id)} className="btn btn-sm btn-danger">
                                    Excluir
                                </button>
                            </div>

                            {card.type === 'image' && card.image_url && (
                                <div className="relative h-48 mb-4 bg-gray-100 rounded">
                                    <Image
                                        src={card.image_url}
                                        alt={card.title || 'Contact Image'}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded"
                                    />
                                </div>
                            )}

                            {card.title && <h3 className="text-xl font-bold mb-2">{card.title}</h3>}
                            {card.content && <p className="whitespace-pre-wrap">{card.content}</p>}
                            <div className="mt-4 text-sm text-gray-500">Ordem: {card.order_index}</div>
                        </div>
                    ))}
                </div>
            </main>

            <style jsx>{`
        .admin-header {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          padding: 20px 0;
          margin-bottom: 40px;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-danger {
          background-color: #ef4444;
          color: white;
        }
        .btn-danger:hover {
          background-color: #dc2626;
        }
      `}</style>
        </div>
    );
}

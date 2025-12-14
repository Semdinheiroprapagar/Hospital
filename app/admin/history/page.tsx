'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HistoryItem {
    id: number;
    title: string;
    content: string;
    image_url: string;
    order_index: number;
}

export default function AdminHistory() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<HistoryItem>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer upload da imagem');
        }

        const data = await response.json();
        return data.url;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = currentItem.image_url || '';

            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile);
            }

            const method = isEditing ? 'PUT' : 'POST';
            const response = await fetch('/api/history', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentItem,
                    image_url: imageUrl,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(isEditing ? '✅ Item atualizado!' : '✅ Item criado!');
                resetForm();
                fetchItems();
            } else {
                alert('❌ ' + (data.error || 'Erro ao salvar'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao salvar. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja deletar este item?')) {
            return;
        }

        try {
            const response = await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok && data.success) {
                alert('✅ Item deletado!');
                fetchItems();
            } else {
                alert('❌ Erro ao deletar');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao deletar');
        }
    };

    const handleEdit = (item: HistoryItem) => {
        setCurrentItem(item);
        setIsEditing(true);
        setImagePreview(item.image_url || '');
        setImageFile(null);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentItem({});
        setImageFile(null);
        setImagePreview('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                                📚
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gerenciar História</h1>
                                <p className="text-sm text-gray-500">Seção "Nossa História"</p>
                            </div>
                        </div>
                        <Link
                            href="/admin"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition font-medium"
                        >
                            ← Voltar
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form - Left Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                {isEditing ? '✏️ Editar Item' : '➕ Novo Item'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentItem.title || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        placeholder="Ex: Início da Jornada"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Conteúdo *
                                    </label>
                                    <textarea
                                        value={currentItem.content || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        required
                                        placeholder="Descreva este momento..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ordem
                                    </label>
                                    <input
                                        type="number"
                                        value={currentItem.order_index ?? 0}
                                        onChange={(e) => setCurrentItem({ ...currentItem, order_index: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Imagem
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            {imagePreview ? (
                                                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-2">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        fill
                                                        sizes="300px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="py-8">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">Clique para selecionar</p>
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">PNG, JPG até 10MB</p>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List - Right Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-semibold text-gray-900">
                                    Itens Cadastrados ({items.length})
                                </h3>
                            </div>

                            {items.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <div className="text-5xl mb-3">📭</div>
                                    <p className="font-medium">Nenhum item cadastrado</p>
                                    <p className="text-sm mt-1">Crie o primeiro item ao lado</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                                            <div className="flex gap-4">
                                                {/* Image */}
                                                {item.image_url && (
                                                    <div className="flex-shrink-0">
                                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                            <Image
                                                                src={item.image_url}
                                                                alt={item.title}
                                                                fill
                                                                sizes="96px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                                                    {item.order_index}
                                                                </span>
                                                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                            </div>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 flex-shrink-0">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                title="Deletar"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

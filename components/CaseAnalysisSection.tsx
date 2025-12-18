'use client';

import { useState, FormEvent } from 'react';
import styles from './CaseAnalysisSection.module.css';

export default function CaseAnalysisSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Validação
            if (!file) {
                throw new Error('Por favor, selecione um arquivo');
            }

            // Validar tamanho (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
            }

            // Criar FormData
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('message', formData.message);
            data.append('file', file);

            // Enviar para API
            const response = await fetch('/api/case-analysis', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao enviar solicitação');
            }

            const result = await response.json();

            // Sucesso
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
            setFile(null);

            // Abrir WhatsApp se houver número configurado
            if (result.whatsappUrl) {
                window.open(result.whatsappUrl, '_blank');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar solicitação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="analise-caso" className={styles.section}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Solicitar Análise do Caso</h2>
                        <p className={styles.subtitle}>
                            Envie seus exames e imagens médicas para uma análise personalizada.
                            Nossa equipe entrará em contato em breve.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>
                                    Telefone/WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    className={styles.input}
                                    placeholder="(11) 99999-9999"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>
                                Mensagem / Descrição do Caso
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className={styles.textarea}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Descreva brevemente seu caso..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="file" className={styles.label}>
                                Anexar Arquivo (Exames, Imagens) *
                            </label>
                            <div className={styles.fileInputWrapper}>
                                <input
                                    type="file"
                                    id="file"
                                    required
                                    className={styles.fileInput}
                                    accept=".pdf,.jpg,.jpeg,.png,.dcm,.dicom"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="file" className={styles.fileLabel}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    {file ? file.name : 'Escolher arquivo'}
                                </label>
                            </div>
                            <p className={styles.fileHint}>
                                Formatos aceitos: PDF, JPG, PNG, DICOM. Tamanho máximo: 10MB
                            </p>
                        </div>

                        {error && (
                            <div className={styles.error}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className={styles.success}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Solicitação enviada com sucesso! Entraremos em contato em breve.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.spinner} />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Solicitação'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

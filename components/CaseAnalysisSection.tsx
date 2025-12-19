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
            <div className={styles.container}>
                <h1 className={styles.title}>Solicite análise do seu caso</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            required
                            className={styles.mainInput}
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            required
                            className={styles.mainInput}
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type="tel"
                            required
                            className={styles.mainInput}
                            placeholder="Telefone/WhatsApp"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <textarea
                            rows={4}
                            className={styles.messageInput}
                            placeholder="Mensagem (opcional)"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <div className={styles.fileSection}>
                        <input
                            type="file"
                            id="file"
                            required
                            className={styles.fileInput}
                            accept=".pdf,.jpg,.jpeg,.png,.dcm,.dicom"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <label htmlFor="file" className={styles.fileButton}>
                            {file ? `📎 ${file.name}` : 'Anexar arquivo (exames, imagens)'}
                        </label>
                        <p className={styles.fileHint}>
                            PDF, JPG, PNG ou DICOM • Máx 10MB
                        </p>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.success}>
                            Solicitação enviada com sucesso! Entraremos em contato em breve.
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.primaryButton}
                        >
                            {loading ? 'Enviando...' : 'Enviar solicitação'}
                        </button>
                    </div>
                </form>

                <div className={styles.infoSection}>
                    <p className={styles.infoText}>
                        Envie seus exames e imagens médicas para uma análise personalizada.
                        Nossa equipe entrará em contato em breve.
                    </p>
                </div>
            </div>
        </section>
    );
}

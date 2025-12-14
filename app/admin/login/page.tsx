'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                router.push('/admin');
            } else {
                setError(data.error || 'Credenciais inválidas');
            }
        } catch (err) {
            setError('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card card">
                    <h1>Admin Login</h1>
                    <p className="subtitle">Painel Administrativo</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Usuário</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--secondary);
        }

        .login-container {
          width: 100%;
          max-width: 400px;
          padding: 20px;
        }

        .login-card {
          padding: 40px;
        }

        .login-card h1 {
          font-size: 2rem;
          margin-bottom: 8px;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: #6e6e73;
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--foreground);
        }

        .error-message {
          background: #ff3b30;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.875rem;
        }

        .btn {
          width: 100%;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}

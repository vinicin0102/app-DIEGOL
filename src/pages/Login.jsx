import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn, signUp } = useGame();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password, name);
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu email se necessário ou faça login.');
                setIsSignUp(false);
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
                navigate('/app');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 24px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '24px' }}>{isSignUp ? 'Criar Conta' : 'Entrar'}</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isSignUp && (
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Seu Nome de Atleta"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                        />
                    </div>
                )}

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                    />
                </div>

                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ padding: '12px', marginTop: '8px' }}
                >
                    {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
                </button>
            </form>

            <button
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: 'none', border: 'none', color: '#aaa', marginTop: '16px', textDecoration: 'underline', cursor: 'pointer' }}
            >
                {isSignUp ? 'Já tem conta? Entre aqui.' : 'Não tem conta? Cadastre-se.'}
            </button>
        </div>
    );
};

export default Login;

import React, { useState, useEffect } from 'react';

const LGPDBanner = () => {
    const [accepted, setAccepted] = useState(true); // Hidden by default

    useEffect(() => {
        const hasAccepted = localStorage.getItem('lgpd_accepted');
        if (!hasAccepted) {
            setAccepted(false);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('lgpd_accepted', 'true');
        setAccepted(true);
    };

    if (accepted) return null;

    return (
        <div className="lgpd-banner" style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(10, 10, 12, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            backdropFilter: 'blur(20px)',
            maxWidth: '500px',
            margin: '0 auto'
        }}>
            <div>
                <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Privacidade e Dados (LGPD)</h4>
                <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.5' }}>
                    Utilizamos cookies e armazenamento local para garantir sua progressão no jogo e melhorar sua experiência.
                    Ao continuar jogando, você concorda com nossos termos de privacidade e com o processamento de seus dados de treino.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={handleAccept}
                    className="btn-primary"
                    style={{ flex: 1, padding: '12px', fontSize: '13px' }}
                >
                    ACEITAR E CONTINUAR
                </button>
            </div>
        </div>
    );
};

export default LGPDBanner;

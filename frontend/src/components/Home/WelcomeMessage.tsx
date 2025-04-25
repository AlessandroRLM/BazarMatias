import React from 'react';

interface WelcomeMessageProps {
    userName: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20%', fontSize: '2rem', color: 'blue' }}>
            Bienvenido {userName}
        </div>
    );
};

export default WelcomeMessage;
'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function HomePage() {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null);

  const handleLoginSuccess = (user: { id: number; name: string; role: string }) => {
    setUser(user);
  };

  return (
    <div>
      {user ? (
        <h1>
          Hello {user.name} (ID: {user.id}), you are logged in as {user.role}.
        </h1>
      ) : isRegistered ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <RegisterForm />
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsRegistered(true)}>Log in here</button>
          </p>
        </div>
      )}
    </div>
  );
}
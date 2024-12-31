import { useEffect, useState } from 'react';
import AddWorkForm from '@/components/AddWorkForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function AddWorkPage() {
  const [userName, setUserName] = useState('Guest');
  const router = useRouter();

  useEffect(() => {
    // Fetch the user name from cookies
    const fetchUserName = () => {
      const user = Cookies.get('user'); // Retrieve the 'user' cookie
      setUserName(user || 'Guest');
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    Cookies.remove('user'); // Remove the 'user' cookie
    router.push('/'); // Redirect to the homepage
  };

  return (
    <div>
      <h1>Hello, {userName}</h1>
      <AddWorkForm userName={userName} />
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
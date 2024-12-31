import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login'); // Redirect to the login page
  }, [router]);

  return null; // Optionally, show a loading indicator if needed
}
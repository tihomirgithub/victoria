import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <Link href="/order-management" style={styles.link}>
        Order Management
      </Link>
      <Link href="/order-payment" style={styles.link}>
        Order Payment
      </Link>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: '10px',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    gap: '10px',
    borderBottom: '1px solid #ccc',
  },
  link: {
    textDecoration: 'none',
    color: '#0070f3',
    fontWeight: 'bold',
  },
};

export default Navbar;
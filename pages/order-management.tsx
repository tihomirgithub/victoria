import OrderCards from '@/pages/order-cards';
import OrderForm from '@/pages/order-form';
import Navbar from '../components/Navbar';

export default function OrderManagementPage() {
  return (
    <>
      <Navbar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100vh', // Full height
          overflow: 'hidden', // Prevents scrollbars for the entire page
        }}
      >
        {/* Left Side: Order Form */}
        <div
          style={{
            width: '30%',
            padding: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid #ccc',
            overflowY: 'auto', // Enables vertical scrolling for the form if needed
          }}
        >
          <OrderForm />
        </div>

        {/* Right Side: Order Cards */}
        <div
          style={{
            width: '70%',
            overflowY: 'scroll', // Enables vertical scrolling for the cards
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column', // Stack cards vertically
              gap: '16px',
              alignItems: 'center', // Centers cards horizontally
              height: 'calc(100% * (13 / 8))', // Adjusts height with ratio 13:8
              paddingBottom: '16px', // Adds space at the bottom
            }}
          >
            <OrderCards />
          </div>
        </div>
      </div>
    </> 
  );
}
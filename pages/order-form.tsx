
import OrderForm from '@/components/OrderForm';
import LogoutButton from '@/components/LogoutButton';

export default function OrderFormPage() {
  return (
 <>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Create a New Order</h1>
      <OrderForm />
      <LogoutButton />
    </div>
 </>
    
  );
}
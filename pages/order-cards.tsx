import { useEffect, useState } from 'react';

interface OrderItem {
  description: string;
  time: string;
}

interface OrderGroup {
  date: string;
  group_name: string;
  items: OrderItem[];
}

export default function OrderCards() {
  const [orders, setOrders] = useState<OrderGroup[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
      }}
    >
      {orders.map((group, index) => (
     <div
     key={`${group.date}-${group.group_name}-${index}`}
     style={{
       width: '40%',
       maxWidth: '800px',
       border: '1px solid #ccc',
       borderRadius: '8px',
       padding: '16px',
       backgroundColor: '#f9f9f9',
       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
       wordWrap: 'break-word',
       overflow: 'hidden',
       aspectRatio: '2 / 2.6', // Ensures the height is 1.3 times the width
     }}
   >
     <h3
       style={{
         marginBottom: '10px',
         fontSize: '1.2rem',
         fontWeight: 'bold',
         color: '#333',
       }}
     >
       {group.date}  {group.group_name}
     </h3>
     <ul style={{ listStyleType: 'none', padding: 0 }}>
       {group.items.map((item, idx) => (
         <li key={idx} style={{ marginBottom: '8px' }}>
           <strong>{item.time}</strong>: {item.description}
           {idx < group.items.length - 1 && (
             <hr
               style={{
                 margin: '10px 0',
                 border: '0',
                 borderTop: '1px solid #ddd',
               }}
             />
           )}
         </li>
       ))}
     </ul>
   </div>
      ))}
    </div>
  );
}
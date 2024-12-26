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

export default function OrderPayment() {
  const [orders, setOrders] = useState<OrderGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<OrderGroup[]>([]);
  const [payments, setPayments] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setFilteredOrders(data);
        } else {
          console.error('Failed to fetch orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.group_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const handlePaymentChange = (key: string, value: number) => {
    setPayments((prevPayments) => ({
      ...prevPayments,
      [key]: value,
    }));
  };

  const totalPayment = Object.values(payments).reduce((sum, value) => sum + (value || 0), 0);

  const firstDate = filteredOrders.length > 0 ? filteredOrders[0].date : null;
  const lastDate = filteredOrders.length > 0 ? filteredOrders[filteredOrders.length - 1].date : null;

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
      {/* Search Box */}
      <div style={{ width: '40%', maxWidth: '800px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by group name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((group, index) => {
          const groupKey = `${group.date}-${group.group_name}`;
          return (
            <div
              key={groupKey}
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
                aspectRatio: '2 / 2.6',
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
                {group.date} - {group.group_name}
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#555',
                    marginRight: '10px',
                  }}
                >
                  Payment for the day:
                </span>
                <input
                  type="number"
                  id={`payment-${groupKey}`}
                  value={payments[groupKey] || ''}
                  onChange={(e) =>
                    handlePaymentChange(groupKey, Number(e.target.value))
                  }
                  style={{
                    width: '80px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ color: '#999', fontSize: '1rem' }}>No results found.</p>
      )}

      {/* Summary Section */}
      {filteredOrders.length > 0 && (
        <div
          style={{
            width: '40%',
            maxWidth: '800px',
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f1f1f1',
            textAlign: 'center',
          }}
        >
          <strong>
            Period: {firstDate} - {lastDate}
          </strong>
          <br />
          <strong>Total Payment: {totalPayment}</strong>
        </div>
      )}
    </div>
  );
}
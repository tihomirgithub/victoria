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
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [paymentInputs, setPaymentInputs] = useState<Record<number, number>>({});
  const [totalPayment, setTotalPayment] = useState(0);
  const [firstDate, setFirstDate] = useState('');
  const [lastDate, setLastDate] = useState('');

  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        const response = await fetch(`/api/payments?name=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setLatestDate(data.latest_date);
        }
      } catch (error) {
        console.error('Error fetching latest payment date:', error);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchLatestDate();
    } else {
      setLatestDate(null);
    }
  }, [searchQuery]);

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

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesGroupName =
        searchQuery.trim() === '' ||
        order.group_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate =
        !latestDate || new Date(order.date) > new Date(latestDate);

      return matchesGroupName && matchesDate;
    });

    setFilteredOrders(filtered);

    // Update period dates
    if (filtered.length > 0) {
      setFirstDate(filtered[0].date);
      setLastDate(filtered[filtered.length - 1].date);
    } else {
      setFirstDate('');
      setLastDate('');
    }
  }, [orders, searchQuery, latestDate]);

  useEffect(() => {
    const total = Object.values(paymentInputs).reduce(
      (sum, value) => sum + (value || 0),
      0
    );
    setTotalPayment(total);
  }, [paymentInputs]);

  const handleInputChange = (index: number, value: number) => {
    setPaymentInputs((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSavePayment = async () => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: searchQuery,
          date: lastDate,
          amount: totalPayment,
        }),
      });

      if (response.ok) {
        alert('Payment saved successfully!');
        setPaymentInputs({});
        setTotalPayment(0);
      } else {
        alert('Failed to save payment.');
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Search by group name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: '20px',
          padding: '8px',
          fontSize: '16px',
          width: '100%',
        }}
      />
      {filteredOrders.map((group, index) => (
        <div
        /*
          key={`${group.date}-${group.group_name}-${index}`}
          style={{
            marginBottom: '20px',
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
            */
         // key={groupKey}
         key={`${group.date}-${group.group_name}-${index}`}
          style={{
            width: '50%',
            maxWidth: '800px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            wordWrap: 'break-word',
            overflow: 'hidden',
           // aspectRatio: '1.8 / 1',
          }}
        >
          <h3>
            {group.date} - {group.group_name}
          </h3>
          <ul>
            {group.items.map((item, idx) => (
              <li key={idx}>
                <strong>{item.time}</strong>: {item.description}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '10px' }}>
            Payment for the day:
            <input
              type="number"
              value={paymentInputs[index] || ''}
              onChange={(e) =>
                handleInputChange(index, parseInt(e.target.value) || 0)
              }
              style={{
                marginLeft: '10px',
                padding: '4px',
                width: '80px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      ))}
      {filteredOrders.length > 0 && (
        <>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <strong>
              Period: {firstDate} - {lastDate}
            </strong>
            <br />
            <strong>Total Payment: {totalPayment}</strong>
          </div>
          <button
            onClick={handleSavePayment}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Save Payment
          </button>
        </>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LogoutButton from '@/components/LogoutButton';

interface OrderItem {
  description: string;
  time: string;
}

interface OrderGroup {
  date: string;
  group_name: string;
  items: OrderItem[];
}

interface WorkItem {
  description: string;
}

interface WorkGroup {
  date: string;
  name: string;
  items: WorkItem[];
}

type CombinedGroup = {
  date: string;
  group_name?: string;
  name?: string;
  orderItems: OrderItem[];
  workItems: WorkItem[];
};

export default function OrderPayment() {
  const [orders, setOrders] = useState<OrderGroup[]>([]);
  const [works, setWorks] = useState<WorkGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<CombinedGroup[]>([]);
  const [paymentInputs, setPaymentInputs] = useState<Record<number, number>>({});
  const [totalPayment, setTotalPayment] = useState(0);
  const [period, setPeriod] = useState({ firstDate: '', lastDate: '' });
  const [latestDate, setLatestDate] = useState<string | null>(null);

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
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/works');
        if (response.ok) {
          const data = await response.json();
          setWorks(data);
        }
      } catch (error) {
        console.error('Error fetching works:', error);
      }
    };

    fetchOrders();
    fetchWorks();
  }, []);

  useEffect(() => {
    const combinedGroups: CombinedGroup[] = [];

    const allDates = new Set([
      ...orders.map((order) => order.date),
      ...works.map((work) => work.date),
    ]);

    allDates.forEach((date) => {
      const orderGroup = orders.find((order) => order.date === date);
      const workGroup = works.find((work) => work.date === date);

      combinedGroups.push({
        date,
        group_name: orderGroup?.group_name,
        name: workGroup?.name,
        orderItems: orderGroup?.items || [],
        workItems: workGroup?.items || [],
      });
    });

    // Get today's date in the same format as the data
    const today = new Date().toISOString().split('T')[0]; // Get only the date part (YYYY-MM-DD)

    const filtered = combinedGroups.filter((group) => {
      const isValidSearch =
        searchQuery.trim() === '' ||
        group.group_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const isAfterLatestDate =
        !latestDate || new Date(group.date) > new Date(latestDate);
      const isBeforeToday = group.date <= today; // Ensure the date is not after today

      return isValidSearch && isAfterLatestDate && isBeforeToday;
    });

    setFilteredGroups(filtered);

    if (filtered.length > 0) {
      const sortedDates = filtered.map((group) => group.date).sort();
      setPeriod({
        firstDate: sortedDates[0],
        lastDate: sortedDates[sortedDates.length - 1],
      });
    } else {
      setPeriod({ firstDate: '', lastDate: '' });
    }
  }, [orders, works, searchQuery, latestDate]);

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
          amount: totalPayment,
          date: `${period.lastDate}`,
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
   <>
    <Navbar />
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
      {filteredGroups.map((group, index) => (
        <div
          key={`${group.date}-${group.group_name || group.name}-${index}`}
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
            marginBottom: '16px',
          }}
        >
          <h3>{group.date}</h3>
          {group.group_name && <strong>Group Name: {group.group_name}</strong>}
          <ul>
            {group.orderItems.map((item, idx) => (
              <li key={idx}>
                <strong>{item.time}: </strong>
                {item.description}
              </li>
            ))}
          </ul>
          {group.name && (
            <>
              <strong>Work in Service: {group.name}</strong>
              <ul>
                {group.workItems.map((item, idx) => (
                  <li key={idx}>{item.description}</li>
                ))}
              </ul>
            </>
          )}
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
      {filteredGroups.length > 0 && (
        <>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <strong>
              Period: {period.firstDate} - {period.lastDate}
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
    <LogoutButton />
 </>
   
  );
}
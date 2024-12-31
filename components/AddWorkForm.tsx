import { useState } from 'react';


interface AddWorkFormProps {
  userName: string;
}

export default function AddWorkForm({ userName }: AddWorkFormProps) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/add-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, description }),
      });

      if (response.ok) {
        setMessage('Work added successfully!');
        setDate('');
        setDescription('');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to add work.');
      }
    } catch (error) {
      console.error('Error adding work:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return ( 
   
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Work'}
      </button>
    </form>
    {message && <p>{message}</p>}
  </div>
); 
    
}
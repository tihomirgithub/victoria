import { useState } from 'react';
import React from 'react';

export default function OrderForm() {
  const [formData, setFormData] = useState({
    time: '',
    date: '',
    description: '',
    group_name: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Order added successfully!');
        setFormData({
          time: '',
          date: '',
          description: '',
          group_name: ''
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  // Generate time options (every 30 minutes from 8:00 to 17:30)
  const timeOptions = [];
  for (let hour = 8; hour <= 17; hour++) {
    timeOptions.push(`${hour}:00`, `${hour}:30`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="time">Time:</label>
        <select
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a time
          </option>
          {timeOptions.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="group_name">Group Name:</label>
        <input
          type="text"
          id="group_name"
          name="group_name"
          value={formData.group_name}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
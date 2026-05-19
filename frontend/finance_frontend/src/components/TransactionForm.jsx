import  { useState } from 'react';
import { createTransaction } from '../services/api';
import './TransactionForm.css'; // Fixed import path

const TransactionForm = ({ onTransactionAdded, categories }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const transactionData = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: parseInt(formData.category),
        date: formData.date,
        note: formData.note,
      };
      
      await createTransaction(transactionData);
      
      // Reset form
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
      
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="transaction-form-container">
      <h3 className="transaction-form-title">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="transaction-form-row">
          <div className="transaction-form-input-group">
            <label className="transaction-form-label">Amount ($):</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
              className="transaction-form-input"
            />
          </div>
          
          <div className="transaction-form-input-group">
            <label className="transaction-form-label">Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="transaction-form-select"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="transaction-form-row">
          <div className="transaction-form-input-group">
            <label className="transaction-form-label">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="transaction-form-select"
            >
              <option value="">Select category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="transaction-form-input-group">
            <label className="transaction-form-label">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="transaction-form-input"
            />
          </div>
        </div>

        <div className="transaction-form-input-group">
          <label className="transaction-form-label">Note (optional):</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="2"
            className="transaction-form-textarea"
          />
        </div>

        {error && <div className="transaction-form-error">{error}</div>}
        
        <button 
          type="submit" 
          disabled={loading} 
          className="transaction-form-button"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
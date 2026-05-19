import { useState } from 'react';
import { updateTransaction, deleteTransaction } from '../services/api';
import './TransactionList.css';

const TransactionList = ({ transactions, loading, onTransactionUpdated, categories }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    type: '',
    category: '',
    date: '',
    note: ''
  });

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      note: transaction.note || '',
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateTransaction(id, editForm);
      setEditingId(null);
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        if (onTransactionUpdated) onTransactionUpdated();
      } catch (err) {
        console.error('Delete failed', err);
        alert('Failed to delete transaction');
      }
    }
  };

  if (loading) return <div className="loading-message">Loading transactions...</div>;
  if (transactions.length === 0) return <div className="empty-message">No transactions yet. Add your first one above!</div>;

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="transactions-container">
      <h3>Recent Transactions</h3>
      <div className="transactions-list">
        {sortedTransactions.map(transaction => (
          <div key={transaction.id} className="transaction-card">
            {editingId === transaction.id ? (
              <div className="edit-form">
                <input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                  placeholder="Amount"
                />
                <select
                  value={editForm.type}
                  onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                />
                <input
                  type="text"
                  value={editForm.note}
                  onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                  placeholder="Note"
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={() => handleUpdate(transaction.id)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="card-header">
                  <span className="transaction-date">{transaction.date}</span>
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="card-body">
                  <div>
                    <strong>{transaction.category_name || 'Uncategorized'}</strong>
                    {transaction.note && <div className="transaction-note">{transaction.note}</div>}
                  </div>
                  <div className="right-section">
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </span>
                    <button className="edit-btn" onClick={() => handleEdit(transaction)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(transaction.id)}>🗑️</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
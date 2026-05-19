import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext/UseAuth.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { getTransactions, getCategories } from "../services/api";
import SpendingChart from "../components/SpendingChart";
import MonthlyComparisonChart from "../components/MonthlyComparisonChart";
import ThemeToggle from "../components/ThemeToggle";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  console.log(user);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to hardcoded if needed
      setCategories([
        { id: 1, name: "Food", type: "expense" },
        { id: 2, name: "Rent", type: "expense" },
        { id: 3, name: "Entertainment", type: "expense" },
        { id: 4, name: "Bills", type: "expense" },
        { id: 5, name: "Salary", type: "income" },
        { id: 6, name: "Investment", type: "expense" },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch both when user is ready
  useEffect(() => {
    if (user && localStorage.getItem("access_token")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  const handleTransactionAdded = () => {
    fetchTransactions();
  };

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-welcome">Welcome, dear {user?.username}!</h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <ThemeToggle />
            <button onClick={logout} className="dashboard-logout-button">
              Logout
            </button>
          </div>
      </div>

      <div className="dashboard-content">
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        ></div>
        <TransactionForm
          onTransactionAdded={handleTransactionAdded}
          categories={categories}
        />
        <TransactionList
          transactions={transactions}
          loading={loading}
          onTransactionUpdated={handleTransactionAdded}
          categories={categories}
        />
        <SpendingChart transactions={transactions} />
        <MonthlyComparisonChart transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardPage;

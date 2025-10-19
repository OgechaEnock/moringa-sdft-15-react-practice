import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Table from './components/Table';

function App() {
  const [formData, setFormData] = useState({
    expense: "",
    amount: ""
  });

  const [expenses, setExpenses] = useState([]);

  // Fetch expenses 
  useEffect(function(){
    fetch("http://localhost:3001/expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setExpenses(data);
        console.log("Fetched expenses:", data);
      })
      .catch(error => {
        console.error(" Error fetching expenses:", error);
        console.error(" Is your backend running on port 3001?");
        alert("Cannot connect to backend. Make sure your server is running on http://localhost:3001");
      });
  }, []);

  const handleSubmit = async (event) => {
  event.preventDefault();

  // Calculate the next ID 
  const nextId = String(expenses.length > 0
    ? Number(expenses[expenses.length - 1].id) + 1
    : 1
  );

  const newExpense = {
    id: nextId,
    expense: formData.expense,
    amount: parseFloat(formData.amount)
  };

  try {
    const response = await fetch("http://localhost:3001/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newExpense)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const savedExpense = await response.json();
    setExpenses((prev) => [...prev, savedExpense]);
    setFormData({ expense: "", amount: "" });

    console.log("Added expense:", savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Failed to add expense. Check console for details.");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this expense?")) return;

  try {
    const response = await fetch(`http://localhost:3001/expenses/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // remove from state
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    console.log(` Deleted expense with id: ${id}`);
  } catch (error) {
    console.error(" Error deleting expense:", error);
    alert("Failed to delete expense. Check console for details.");
  }
};

  const handleOnChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className='container bg-warning py-1'>
      <div className='row'>
        <div className='col-4 border p-4'>
          <form onSubmit={handleSubmit}>
            <input 
              name="expense" 
              value={formData.expense} 
              onChange={handleOnChange}  
              className="form-control form-control-sm my-1" 
              type="text" 
              placeholder="Expense name" 
              required
            />
            <input 
              name="amount" 
              value={formData.amount} 
              onChange={handleOnChange} 
              className="form-control form-control-sm my-1" 
              type="number" 
              step="0.01"
              placeholder="Amount" 
              required
            />
            <button type='submit' className='btn btn-sm btn-primary my-2'>
              Add Expense
            </button>
          </form>
        </div>
        
        <div className='col-8 border p-4'>
          <Table expenses={expenses} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default App;
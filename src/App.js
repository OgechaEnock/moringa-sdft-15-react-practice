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

  // Fetch expenses on component mount
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
        console.log("📥 Fetched expenses:", data);
      })
      .catch(error => {
        console.error("❌ Error fetching expenses:", error);
        console.error("⚠️ Is your backend running on port 3001?");
        alert("Cannot connect to backend. Make sure your server is running on http://localhost:3001");
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the expense object
    const newExpense = {
      expense: formData.expense,
      amount: parseFloat(formData.amount)
    };

    console.log("📤 Sending POST request with:", newExpense);

    try {
      // Make POST request to backend
      const response = await fetch("http://localhost:3001/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExpense)
      });

      console.log("📊 Response status:", response.status);
      console.log("✅ Response OK?", response.ok);

      // Parse the response
      const savedExpense = await response.json();
      console.log("💾 Saved expense from server:", savedExpense);

      // Update state with the saved expense
      setExpenses((prev) => [...prev, savedExpense]);

      // Reset form
      setFormData({ expense: "", amount: "" });

      console.log("✨ Form reset successful!");

    } catch (error) {
      console.error("❌ Error adding expense:", error);
      alert("Failed to add expense. Check console for details.");
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
          <Table expenses={expenses}/>
        </div>
      </div>
    </div>
  );
}

export default App;
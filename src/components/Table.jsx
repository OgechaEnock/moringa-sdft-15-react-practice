import React from "react";

function Table({ expenses, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Expense</th>
          <th>Amount (Ksh)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {expenses.length > 0 ? (
          expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.expense}</td>
              <td>{exp.amount}</td>
              <td>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center text-muted">
              No expenses added yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Table;

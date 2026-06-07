"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<{ name: string; amount: number }[]>([]);

  const addExpense = () => {
    if (!name || !amount) return;
    setExpenses([...expenses, { name, amount: parseFloat(amount) }]);
    setName("");
    setAmount("");
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <button
          onClick={addExpense}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
      </div>

      <ul className="flex flex-col gap-2 mb-4">
        {expenses.map((e, i) => (
          <li key={i} className="flex justify-between border-b pb-1">
            <span>{e.name}</span>
            <span>₹{e.amount}</span>
          </li>
        ))}
      </ul>

      <p className="text-xl font-semibold">Total: ₹{total}</p>
    </main>
  );
}
"use client"
import React from 'react';

const Sidebar = ({ title, coins }) => {
  return (
    <div className="p-4 text-black bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold ">{title}</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id} className="flex items-center justify-between py-2">
            <span>{coin.name}</span>
            <span>${coin.current_price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

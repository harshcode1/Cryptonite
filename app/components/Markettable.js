import React from "react";
import Link from 'next/link';

export default function Markettable({ coins }) {
  return (
    <table className="min-w-full text-black bg-white table-fixed border-collapse">
      <colgroup>
        <col style={{ width: '25%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left">Token</th>
          <th className="py-2 px-4 border-b text-left">Symbol</th>
          <th className="py-2 px-4 border-b text-left">Last Price</th>
          <th className="py-2 px-4 border-b text-left">24H Change</th>
          <th className="py-2 px-4 border-b text-left">Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <tr key={coin.id}>
            <td className="py-2 px-4 border-b text-left">
              <Link href={`/coin/${coin.id}`} legacyBehavior>
                <a className="text-blue-500 hover:underline">{coin.name}</a>
              </Link>
            </td>
            <td className="py-2 px-4 border-b text-left">{coin.symbol.toUpperCase()}</td>
            <td className="py-2 px-4 border-b text-left">${coin.current_price.toFixed(2)}</td>
            <td className={`py-2 px-4 border-b text-left ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td className="py-2 px-4 border-b text-left">${coin.market_cap.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

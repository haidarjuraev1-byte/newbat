import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Navbat — Онлайн-запись и заказ услуг</h1>
      <p className="mb-6">Быстрый поиск мастеров и запись в пару кликов</p>
      <Link to="/masters" className="px-4 py-2 bg-blue-600 text-white rounded">Найти мастера</Link>
    </div>
  );
}

function Masters() {
  const [masters] = useState([
    { id: 1, name: 'Анна — парикмахер', rating: 4.9 },
    { id: 2, name: 'Иван — ремонт кондиционеров', rating: 4.8 },
  ]);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Список мастеров</h2>
      <ul>
        {masters.map(m => (
          <li key={m.id} className="border-b py-2 flex justify-between">
            <span>{m.name}</span>
            <span className="text-yellow-500">★ {m.rating}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <nav className="bg-white shadow mb-4">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-4">
          <Link to="/" className="text-blue-600 font-semibold">Главная</Link>
          <Link to="/masters" className="text-gray-700">Мастера</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/masters" element={<Masters />} />
      </Routes>
    </div>
  );
}
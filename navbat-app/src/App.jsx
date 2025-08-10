import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import clsx from "clsx";

// Контекст пользователя
export const AuthContext = createContext(null);

// ----- UI-компоненты -----

const Nav = () => {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-10">
      <Link to="/" className="font-bold text-xl text-blue-600">
        Navbat
      </Link>
      <div className="space-x-4 text-gray-700">
        <Link to="/masters" className="hover:text-blue-600">
          Мастера
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="hover:text-blue-600">
              {user.role === "master" ? "Кабинет мастера" : "Кабинет клиента"}
            </Link>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700 font-semibold"
              aria-label="Выйти"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Войти
            </Link>
            <Link to="/register" className="hover:text-blue-600">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Главная страница
const Home = () => (
  <div className="max-w-4xl mx-auto p-4 text-center">
    <h1 className="text-3xl font-extrabold mb-4">Navbat</h1>
    <p className="mb-6 text-gray-700">
      Онлайн-запись и заказ услуг — быстро и удобно
    </p>
    <Link
      to="/masters"
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Найти мастера
    </Link>
  </div>
);

// Фейковая база мастеров
const fakeMasters = [
  {
    id: "1",
    name: "Анна",
    role: "master",
    service: "Парикмахер",
    rating: 4.9,
    description: "Опытный парикмахер, стрижки и окрашивания.",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=64&q=80",
    schedule: ["09:00", "10:00", "12:00", "15:00", "16:00"],
    reviews: [
      {
        id: "r1",
        user: "Ирина",
        rating: 5,
        comment: "Отличная работа, приду ещё!",
      },
    ],
  },
  {
    id: "2",
    name: "Иван",
    role: "master",
    service: "Ремонт кондиционеров",
    rating: 4.8,
    description: "Профессиональный мастер по ремонту и обслуживанию кондиционеров.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=80",
    schedule: ["08:00", "11:00", "13:00", "17:00"],
    reviews: [
      {
        id: "r2",
        user: "Михаил",
        rating: 4,
        comment: "Все починил быстро и качественно.",
      },
    ],
  },
];

// Список мастеров с фильтром и переходом на профиль
const Masters = () => {
  const [masters, setMasters] = useState(fakeMasters);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!filter) {
      setMasters(fakeMasters);
    } else {
      setMasters(
        fakeMasters.filter((m) =>
          m.service.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Список мастеров</h2>
      <input
        type="text"
        placeholder="Поиск по услуге..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Поиск мастеров по услуге"
      />
      {masters.length === 0 ? (
        <p>Мастера не найдены.</p>
      ) : (
        <ul className="space-y-4">
          {masters.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-4 p-4 bg-white rounded shadow hover:shadow-md transition cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => (window.location.href = `/master/${m.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.location.href = `/master/${m.id}`;
              }}
            >
              <img
                src={m.avatar}
                alt={`Аватар ${m.name}`}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{m.name}</span>
                <span className="text-sm text-gray-600">{m.service}</span>
                <span className="text-yellow-500 font-semibold">
                  ★ {m.rating.toFixed(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Профиль мастера с расписанием и бронированием
const MasterProfile = ({ id }) => {
  const { user } = React.useContext(AuthContext);
  const [master, setMaster] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const m = fakeMasters.find((m) => m.id === id);
    setMaster(m);

    // Загрузим брони из localStorage для этого мастера
    const stored = localStorage.getItem(`bookings_${id}`);
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, [id]);

  const bookTime = () => {
    if (!user) {
      setMessage("Пожалуйста, войдите в систему, чтобы забронировать.");
      return;
    }
    if (!selectedTime) {
      setMessage("Выберите время.");
      return;
    }
    if (bookings.includes(selectedTime)) {
      setMessage("Это время уже занято.");
      return;
    }
    const newBookings = [...bookings, selectedTime];
    setBookings(newBookings);
    localStorage.setItem(`bookings_${id}`, JSON.stringify(newBookings));
    setMessage(`Вы успешно забронировали время: ${selectedTime}`);
  };

  if (!master) return <div className="p-4">Мастер не найден.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-2">{master.name}</h2>
      <p className="text-gray-600 mb-4">{master.description}</p>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={master.avatar}
          alt={`Фото ${master.name}`}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{master.service}</p>
          <p className="text-yellow-500 font-semibold">★ {master.rating}</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Доступное время</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {master.schedule.map((time) => {
          const isBooked = bookings.includes(time);
          return (
            <button
              key={time}
              disabled={isBooked}
              onClick={() => setSelectedTime(time)}
              className={clsx(
                "px-4 py-2 rounded border",
                isBooked
                  ? "bg-gray-300 cursor-not-allowed"
                  : selectedTime === time
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-blue-50"
              )}
            >
              {time}
            </button>
          );
        })}
      </div>
      <button
        onClick={bookTime}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Забронировать
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}

      <h3 className="text-xl font-semibold mt-8 mb-2">Отзывы</h3>
      {master.reviews.length === 0 ? (
        <p>Нет отзывов</p>
      ) : (
        <ul className="space-y-3">
          {master.reviews.map((r) => (
            <li
              key={r.id}
              className="border rounded p-3 bg-white shadow-sm"
              aria-label={`Отзыв от ${r.user}`}
            >
              <p className="font-semibold">{r.user}</p>
              <p className="text-yellow-500">★ {r.rating}</p>
              <p>{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Регистрация и авторизация (упрощённая, с localStorage)
const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "", role: "client" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    if (mode === "register") {
      if (!form.username || !form.password) {
        setError("Заполните все поля");
        return;
      }
      if (users.find((u) => u.username === form.username)) {
        setError("Пользователь с таким именем уже существует");
        return;
      }
      const newUser = { ...form, id: Date.now().toString() };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      login(newUser);
      navigate("/");
    } else {
      // login
      const user = users.find(
        (u) => u.username === form.username && u.password === form.password
      );
      if (!user) {
        setError("Неверное имя пользователя или пароль");
        return;
      }
      login(user);
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 capitalize">
        {mode === "register" ? "Регистрация" : "Вход"}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" aria-label={`${mode} форма`}>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          value={form.username}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
          aria-required="true"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
          aria-required="true"
        />
        {mode === "register" && (
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Выберите роль"
          >
            <option value="client">Клиент</option>
            <option value="master">Мастер</option>
          </select>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {mode === "register" ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>
    </div>
  );
};

// Личный кабинет клиента
const ClientProfile = () => {
  const { user } = React.useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allBookings =
      JSON.parse(localStorage.getItem("allBookings")) || [];
    // Фильтруем брони по юзеру
    const userBookings = allBookings.filter((b) => b.userId === user.id);
    setBookings(userBookings);
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Личный кабинет клиента</h2>
      <p className="mb-4">Имя: {user.username}</p>
      <h3 className="text-xl font-semibold mb-2">Мои бронирования</h3>
      {bookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="p-3 border rounded bg-white shadow-sm"
            >
              <p>
                Мастер: <strong>{b.masterName}</strong>
              </p>
              <p>Дата и время: {b.time}</p>
              <p>Статус: {b.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Личный кабинет мастера
const MasterProfilePage = () => {
  const { user } = React.useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allBookings =
      JSON.parse(localStorage.getItem("allBookings")) || [];
    // Фильтруем брони по мастеру
    const userBookings = allBookings.filter((b) => b.masterId === user.id);
    setBookings(userBookings);
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Личный кабинет мастера</h2>
      <p className="mb-4">Имя: {user.username}</p>
      <h3 className="text-xl font-semibold mb-2">Мои заказы</h3>
      {bookings.length === 0 ? (
        <p>Нет заказов</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="p-3 border rounded bg-white shadow-sm"
            >
              <p>
                Клиент: <strong>{b.userName}</strong>
              </p>
              <p>Дата и время: {b.time}</p>
              <p>Статус: {b.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Компонент страницы профиля (выбирает кабинет по роли)
const Profile = () => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;

  return user.role === "master" ? (
    <MasterProfilePage />
  ) : (
    <ClientProfile />
  );
};

// Основное приложение
const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // Функции авторизации
  const login = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Nav />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/masters" element={<Masters />} />
            <Route
              path="/master/:id"
              element={
                <MasterRoute />
              }
            />
            <Route path="/login" element={<AuthForm mode="login" />} />
            <Route path="/register" element={<AuthForm mode="register" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-white text-center p-4 text-gray-600 text-sm">
          © 2025 Navbat. Все права защищены.
        </footer>
      </div>
    </AuthContext.Provider>
  );
};

// Вспомогательный компонент для маршрута мастера с параметром id
import { useParams } from "react-router-dom";
const MasterRoute = () => {
  const { id } = useParams();
  return <MasterProfile id={id} />;
};

// Страница 404
const NotFound = () => (
  <div className="max-w-4xl mx-auto p-4 text-center">
    <h2 className="text-3xl font-bold mb-4">404 — Страница не найдена</h2>
    <Link to="/" className="text-blue-600 hover:underline">
      Вернуться на главную
    </Link>
  </div>
);

export default App;

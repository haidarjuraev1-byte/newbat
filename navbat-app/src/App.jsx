import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Link, Navigate, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";

export const AuthContext = createContext(null);

const Nav = () => {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <nav className="bg-white shadow px-5 py-3 flex justify-between items-center sticky top-0 z-20">
      <Link to="/" className="font-extrabold text-2xl text-blue-600">
        Navbat
      </Link>
      <div className="space-x-5 text-gray-700 flex items-center">
        <Link to="/masters" className="hover:text-blue-600 font-semibold">
          Мастера
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="hover:text-blue-600 font-semibold">
              {user.role === "master" ? "Кабинет мастера" : "Кабинет клиента"}
            </Link>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700 font-semibold ml-4"
              aria-label="Выйти"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 font-semibold">
              Войти
            </Link>
            <Link to="/register" className="hover:text-blue-600 font-semibold">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const Home = () => (
  <div className="max-w-5xl mx-auto p-6 text-center">
    <h1 className="text-4xl font-bold mb-3">Добро пожаловать в Navbat</h1>
    <p className="text-gray-600 mb-6 text-lg">
      Онлайн-сервис для записи и заказа услуг от мастеров вашего города
    </p>
    <Link
      to="/masters"
      className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
    >
      Найти мастера
    </Link>
  </div>
);

// Фейковые данные мастеров
const fakeMasters = [
  {
    id: "1",
    name: "Анна",
    role: "master",
    service: "Парикмахер",
    rating: 4.9,
    description: "Опытный парикмахер, стрижки и окрашивания любой сложности.",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=64&q=80",
    schedule: ["09:00", "10:00", "12:00", "15:00", "16:00"],
    reviews: [
      { id: "r1", user: "Ирина", rating: 5, comment: "Отличная работа, приду ещё!" },
      { id: "r3", user: "Олег", rating: 4, comment: "Всё хорошо, рекомендую." },
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
      { id: "r2", user: "Михаил", rating: 4, comment: "Все починил быстро и качественно." },
    ],
  },
];

const Masters = () => {
  const [masters, setMasters] = useState(fakeMasters);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!filter) setMasters(fakeMasters);
    else
      setMasters(
        fakeMasters.filter((m) =>
          m.service.toLowerCase().includes(filter.toLowerCase())
        )
      );
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h2 className="text-3xl font-semibold mb-5">Список мастеров</h2>
      <input
        type="text"
        placeholder="Поиск по услуге..."
        className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Поиск мастеров"
      />
      {masters.length === 0 ? (
        <p>Мастера не найдены</p>
      ) : (
        <ul className="space-y-5">
          {masters.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-5 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => (window.location.href = `/master/${m.id}`)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && (window.location.href = `/master/${m.id}`)}
              role="button"
              aria-label={`Профиль мастера ${m.name}`}
            >
              <img
                src={m.avatar}
                alt={`Фото ${m.name}`}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
              <div>
                <h3 className="text-xl font-semibold">{m.name}</h3>
                <p className="text-gray-700">{m.service}</p>
                <p className="text-yellow-500 font-semibold mt-1">★ {m.rating.toFixed(1)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MasterProfile = () => {
  const { id } = useParams();
  const { user } = React.useContext(AuthContext);
  const [master, setMaster] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const m = fakeMasters.find((m) => m.id === id);
    setMaster(m);

    const stored = localStorage.getItem(`bookings_${id}`);
    if (stored) setBookings(JSON.parse(stored));
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

    // Сохраняем заказ для клиента и мастера
    const allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    allBookings.push({
      id: Date.now().toString(),
      masterId: id,
      masterName: master.name,
      userId: user.id,
      userName: user.username,
      time: selectedTime,
      status: "Ожидает подтверждения",
    });
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
  };

  if (!master) return <div className="p-5">Мастер не найден</div>;

  return (
    <div className="max-w-5xl mx-auto p-5">
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Назад к списку
      </button>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={master.avatar}
          alt={`Фото ${master.name}`}
          className="w-48 h-48 rounded-full object-cover self-center md:self-start"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{master.name}</h2>
          <p className="mb-3 text-gray-700">{master.description}</p>
          <p className="text-lg font-semibold mb-3">{master.service}</p>
          <p className="text-yellow-500 font-semibold mb-4">★ {master.rating}</p>
          <h3 className="text-xl font-semibold mb-2">Доступное время для записи</h3>
          <div className="flex flex-wrap gap-3 mb-5">
            {master.schedule.map((time) => {
              const isBooked = bookings.includes(time);
              return (
                <button
                  key={time}
                  disabled={isBooked}
                  onClick={() => setSelectedTime(time)}
                  className={clsx(
                    "px-5 py-2 rounded border transition",
                    isBooked
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : selectedTime === time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-blue-100 border-gray-300"
                  )}
                  aria-pressed={selectedTime === time}
                >
                  {time}
                </button>
              );
            })}
          </div>
          <button
            onClick={bookTime}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            aria-label="Забронировать выбранное время"
          >
            Забронировать
          </button>
          {message && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {message}
            </p>
          )}
          <h3 className="mt-8 text-xl font-semibold mb-3">Отзывы</h3>
          {master.reviews.length === 0 ? (
            <p>Отзывы отсутствуют</p>
          ) : (
            <ul className="space-y-3">
              {master.reviews.map((r) => (
                <li
                  key={r.id}
                  className="border p-3 rounded bg-gray-50 shadow-sm"
                  aria-label={`Отзыв пользователя ${r.user}`}
                >
                  <p className="font-semibold">{r.user}</p>
                  <p>★ {r.rating}</p>
                  <p>{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const AuthForm = ({ mode }) => {
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Проверка валидности
    if (!form.username || !form.password) {
      setError("Заполните все поля");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (mode === "register") {
      // Проверка уникальности логина
      if (users.find((u) => u.username === form.username)) {
        setError("Пользователь с таким именем уже существует");
        return;
      }
      // Создаем нового пользователя
      const newUser = {
        id: Date.now().toString(),
        username: form.username,
        password: form.password,
        role: form.role,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      login(newUser);
      navigate("/profile");
    } else {
      // Вход
      const user = users.find(
        (u) => u.username === form.username && u.password === form.password
      );
      if (!user) {
        setError("Неверный логин или пароль");
        return;
      }
      login(user);
      navigate("/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === "register" ? "Регистрация" : "Вход"}
      </h2>
      {error && (
        <p className="mb-4 text-red-600" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      <form onSubmit={onSubmit} noValidate>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          value={form.username}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          aria-required="true"
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          aria-required="true"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />
        {mode === "register" && (
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Выберите роль"
          >
            <option value="client">Клиент</option>
            <option value="master">Мастер</option>
          </select>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          aria-label={mode === "register" ? "Зарегистрироваться" : "Войти"}
        >
          {mode === "register" ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>
    </div>
  );
};

const ClientProfile = () => {
  const { user } = React.useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const userBookings = allBookings.filter((b) => b.userId === user.id);
    setBookings(userBookings);
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Личный кабинет клиента</h2>
      <p className="mb-4">Привет, {user.username}!</p>
      <h3 className="text-xl font-semibold mb-4">Мои бронирования</h3>
      {bookings.length === 0 ? (
        <p>У вас пока нет бронирований.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="p-4 border rounded shadow bg-white"
              aria-label={`Бронирование у мастера ${b.masterName} на ${b.time}`}
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

const MasterProfilePage = () => {
  const { user } = React.useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const myOrders = allBookings.filter((b) => b.masterId === user.id);
    setOrders(myOrders);
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Личный кабинет мастера</h2>
      <p className="mb-4">Здравствуйте, {user.username}!</p>
      <h3 className="text-xl font-semibold mb-4">Заказы от клиентов</h3>
      {orders.length === 0 ? (
        <p>Пока нет заказов.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="p-4 border rounded shadow bg-white"
              aria-label={`Заказ от клиента ${o.userName} на ${o.time}, статус ${o.status}`}
            >
              <p>
                Клиент: <strong>{o.userName}</strong>
              </p>
              <p>Дата и время: {o.time}</p>
              <p>Статус: {o.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Profile = () => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return user.role === "master" ? <MasterProfilePage /> : <ClientProfile />;
};

const NotFound = () => (
  <div className="max-w-5xl mx-auto p-6 text-center">
    <h2 className="text-4xl font-bold mb-6">404 — Страница не найдена</h2>
    <Link to="/" className="text-blue-600 hover:underline text-lg">
      Вернуться на главную
    </Link>
  </div>
);

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")) || null);

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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Nav />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/master/:id" element={<MasterProfile />} />
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

export default App;

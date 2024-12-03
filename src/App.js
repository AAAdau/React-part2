import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import SearchResults from "./components/SearchResults";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Favorite from "./components/Favorite";

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const handleUpdateCart = (newCartItems) => {
    setCartItems(newCartItems);
  };

  // 请求推送通知权限
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }, []); // 空依赖数组确保只在组件加载时执行一次

  return (
    <div className="app-container">
      <Header cartItems={cartItems} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart user={user} onUpdateTotalQuantity={handleUpdateCart} />} />
          <Route path="/shop" element={<ProductList user={user} />} />
          <Route path="/products/:id" element={<ProductDetails user={user} />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/favorite" element={<Favorite user={user} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

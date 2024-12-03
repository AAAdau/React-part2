import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart, updateCart, deleteCartItem } from "../api";
import StarRating from "./star-rating/star-rating";  // 导入 StarRating 组件
import "./Cart.css";

export default function Cart({ user, onUpdateTotalQuantity }) {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const userId = String(user.id);
            const cartItems = await getCart(userId);
            const userCart = cartItems.map((item) => ({
                ...item,
                rating: item.rating || null, // 初始化rating如果没有的话
            }));
            setCartItems(userCart);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        if (onUpdateTotalQuantity) {
            onUpdateTotalQuantity(calculateTotalQuantity());
        }
    }, [cartItems]);

    const calculateTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckboxChange = (id) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const removeFromCart = async (id) => {
        try {
            await deleteCartItem(id);
            const updatedCart = cartItems.filter((item) => item.id !== id);
            setCartItems(updatedCart);
            setSelectedItems((prevSelected) =>
                prevSelected.filter((itemId) => itemId !== id)
            );
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const increaseQuantity = async (id) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, quantity: item.quantity + 1 };
                updateCart(updatedItem);
                return updatedItem;
            }
            return item;
        });
        setCartItems(updatedCart);
    };

    const decreaseQuantity = async (id) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === id && item.quantity > 1) {
                const updatedItem = { ...item, quantity: item.quantity - 1 };
                updateCart(updatedItem);
                return updatedItem;
            }
            return item;
        });
        setCartItems(updatedCart);
    };

    const calculateTotalPrice = () => {
        const total = cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => {
                const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                if (!isNaN(price) && price > 0) {
                    return total + price * item.quantity;
                }
                return total;
            }, 0);
        return total.toFixed(2);
    };

    const handleBuy = () => {
        setIsPurchased(true); // 点击购买时设置状态为已购买
    };

    const handleRatingChange = async (id, newRating) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, rating: newRating };
                updateCart(updatedItem); // 更新到后端
                return updatedItem;
            }
            return item;
        });
        setCartItems(updatedCart); // 更新本地状态
    };

    if (!user) {
        return <p className="login-message">Please login to view your cart.</p>;
    }

    return (
        <div className="cart-page">
            <h2>My Cart</h2>
            <div className="cart">
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <div className="cart-header">
                            <span>Select</span>
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Rating</span>
                        </div>
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id}>
                                    <input
                                        className="checkbox"
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                    />
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <div className="descript-page">
                                        <span className="description">{item.name}</span>
                                        <span className="description">{item.brand}</span>
                                        <span className="description">{item.category}</span>
                                    </div>
                                    <div className="other">
                                        <span className="other1">{item.price}</span>
                                        <div className="quantity-control">
                                            <button onClick={() => decreaseQuantity(item.id)}>
                                                -
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(item.id)}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {isPurchased && selectedItems.includes(item.id) ? (
                                        <div className="rating-container purchased-rating">
                                            <StarRating
                                                numberOfStars={5}
                                                rating={item.rating || 0}  // Show previous rating if available
                                                onRatingChange={(newRating) => handleRatingChange(item.id, newRating)} // Update rating
                                            />
                                        </div>
                                    ) : (
                                        item.rating !== null && (
                                            <div className="rating-container rated">
                                                <StarRating
                                                    numberOfStars={5}
                                                    rating={item.rating}  // Show previous rating if available
                                                    onRatingChange={(newRating) => handleRatingChange(item.id, newRating)} // Update rating
                                                />
                                            </div>
                                        )
                                    )}

                                    <button onClick={() => removeFromCart(item.id)}>
                                        <img
                                            src="https://www.svgrepo.com/show/474726/bin.svg"
                                            width="30px"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-total">
                            <h3>Total Price: ${calculateTotalPrice()}</h3>
                        </div>
                        {selectedItems.length > 0 && (
                            <button onClick={handleBuy} className="buy-button">
                                Buy Selected Items
                            </button>
                        )}
                    </>
                )}
                <Link to="/" className="continue-shopping-link">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import './Favorite.css';
import { getFav } from '../api';
export default function Favorite({ user }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFav();
        }
    }, [user]);

    if (!user) {
        return <p className="login-message">Please login to view your Favorite.</p>;
    }
    const fetchFav = async () => {
        try {
            const userId = String(user.id);
            const favItems = await getFav(userId)
            const userFav = favItems.filter((item) => String(item.userId) === userId);
            console.log(userFav)
            setFavorites(userFav)
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }

    return (
        <div className="favorite-page">
            <h2>My Favorites</h2>
            {favorites.length > 0 ? (
                <div className="product-list">
                    {favorites.map((product) => (
                        <div key={product.id} className="product-item">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            <p>Brand: {product.brand}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no favorite products yet.</p>
            )}
        </div>
    );
}  
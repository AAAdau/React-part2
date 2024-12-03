import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect } from "react";
import { getProducts } from '../api'
import "./ProductDetails.css";
import { addToCart, getCart, updateCart } from "../api";

export default function ProductDetails({ user }) {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProducts().then(data => setProducts(data));
    }, []);

    const product = products.find((p) => p.id === id);
    console.log(id)
    if (!product) {
        return <h2>Product not found</h2>;
    }

    const handleAddToCart = async (product) => {
        if (!user) {
            alert("Please login to add items to the cart.");
            return;
        }
        try {
            const userId = String(user.id); // Ensure userId is a string
            const cart = await getCart(userId);
            const existingProduct = cart.find(item => item.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
                await updateCart(existingProduct); // Update the cart with the new quantity
                alert("Quantity updated in cart!");
            } else {
                // If the product doesn't exist, add it with quantity 1
                await addToCart({ ...product, quantity: 1, userId });
                alert("Item added to cart!");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };



    console.log(product)
    return (
        <div className="product-details">
            <img src={product.image} alt={product.name} className="product-image-large" />
            <h2>{product.name}</h2>
            <p>Price: {product.price}</p>
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>

            <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
                Add to Cart
            </button>
        </div>
    );
}

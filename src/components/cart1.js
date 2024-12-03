import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ProductList.css';
import { getProducts, getFav, deleteFromFav, addToFav } from '../api';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // 引入心形图标

const brands = ["Brand A", "Brand B", "Brand C"];

export default function ProductList({ user }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hoveringBrand, setHoveringBrand] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then(data => setProducts(data));
    }, []);

    useEffect(() => {
        if (user) {
            getFav(user.id).then((data) => setFavorites(data));
        }
    }, [user]);

    function handleScrollPercentage() {
        const howMuchScrolled = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollPercentage((howMuchScrolled / height) * 100);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScrollPercentage);
        return () => {
            window.removeEventListener('scroll', handleScrollPercentage);
        };
    }, []);

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
        setSelectedBrand(null);
    };

    const handleProductClick = (id) => {
        navigate(`/products/${id}`);
    };

    const toggleFavorite = async (product) => {
        if (!user) {
            alert("Please login to add items to the favorites.");
            return;
        }
        try {
            const userId = String(user.id);
            const existingFav = favorites.find((item) => item.id === product.id);

            if (existingFav) {
                await deleteFromFav(existingFav.id);
                alert(`${product.name} has been removed from your favorites.`);
            } else {
                await addToFav({ ...product, userId });
                alert(`${product.name} has been added to your favorites.`);
            }

            // Update the favorites list
            const updatedFavorites = await getFav(userId);
            setFavorites(updatedFavorites);
        } catch (error) {
            console.error("Error toggling favorite item:", error);
            alert("An error occurred while updating your favorites.");
        }
    };

    const filteredProducts = selectedCategory
        ? selectedCategory === "Brand" && selectedBrand
            ? products.filter((product) => product.brand === selectedBrand)
            : products.filter((product) => product.category === selectedCategory)
        : products;

    return (
        <div className="shop-page">
            <div className="top-container">
                <div className="scroll-progress-tracking-container">
                    <div className="current-progress-bar" style={{ width: `${scrollPercentage}%` }}></div>
                </div>
            </div>
            <div className="category-selection">
                <button onClick={() => handleCategorySelection("Women")}>Women</button>
                <button onClick={() => handleCategorySelection("Men")}>Men</button>

                <div
                    className="brand-dropdown"
                    onMouseEnter={() => setHoveringBrand(true)}
                    onMouseLeave={() => setHoveringBrand(false)}
                >
                    <button onClick={() => handleCategorySelection("Brand")}>Brand</button>

                    {hoveringBrand && (
                        <div className="brand-list">
                            {brands.map((brand) => (
                                <button key={brand} onClick={() => setSelectedBrand(brand)}>
                                    {brand}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="product-list">
                {filteredProducts.map((product) => {
                    const isFavorite = favorites.some((item) => item.id === product.id);

                    return (
                        <div key={product.id} className="product-item">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h3 onClick={() => handleProductClick(product.id)} className="product-name">
                                {product.name}
                            </h3>
                            <p style={{ color: "red" }}>{product.price}</p>
                            <p>{product.brand}</p>
                            <button
                                onClick={() => toggleFavorite(product)}
                                className="favorite-button"
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "24px",
                                }}
                            >
                                {isFavorite ? <AiFillHeart color="rgb(241, 103, 158)" /> : <AiOutlineHeart />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}

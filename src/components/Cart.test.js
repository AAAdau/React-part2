import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cart from "./Cart";
import { getCart, updateCart, deleteCartItem } from "../api";
import { BrowserRouter as Router } from "react-router-dom";

// 模拟 API 请求
jest.mock("../api", () => ({
    getCart: jest.fn(),
    updateCart: jest.fn(),
    deleteCartItem: jest.fn(),
}));

// 测试：购物车为空时，应该显示"Your cart is empty"
test("should display 'Your cart is empty' when cart is empty", async () => {
    getCart.mockResolvedValue([]);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const message = await screen.findByText("Your cart is empty.");
    expect(message).toBeInTheDocument();
});

// 测试：购物车有商品时，应该显示商品信息
test("should display cart items when cart has products", async () => {
    const mockCartItems = [
        { id: 1, name: "Product 1", price: "$10.00", quantity: 2, rating: 4, image: "image.jpg", brand: "Brand 1", category: "Category 1" },
        { id: 2, name: "Product 2", price: "$20.00", quantity: 1, rating: 3, image: "image2.jpg", brand: "Brand 2", category: "Category 2" },
    ];
    getCart.mockResolvedValue(mockCartItems);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const product1 = await screen.findByText("Product 1");
    const product2 = await screen.findByText("Product 2");

    expect(product1).toBeInTheDocument();
    expect(product2).toBeInTheDocument();
});

// 测试：增加商品数量时更新购物车
test("should increase quantity when + button is clicked", async () => {
    const mockCartItems = [{ id: 1, name: "Product 1", price: "$10.00", quantity: 1, rating: 4, image: "image.jpg", brand: "Brand 1", category: "Category 1" }];
    getCart.mockResolvedValue(mockCartItems);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const increaseButton = screen.getByText("+");
    fireEvent.click(increaseButton);

    await waitFor(() => expect(updateCart).toHaveBeenCalledWith({ ...mockCartItems[0], quantity: 2 }));
});

// 测试：减少商品数量时更新购物车
test("should decrease quantity when - button is clicked", async () => {
    const mockCartItems = [{ id: 1, name: "Product 1", price: "$10.00", quantity: 2, rating: 4, image: "image.jpg", brand: "Brand 1", category: "Category 1" }];
    getCart.mockResolvedValue(mockCartItems);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const decreaseButton = screen.getByText("-");
    fireEvent.click(decreaseButton);

    await waitFor(() => expect(updateCart).toHaveBeenCalledWith({ ...mockCartItems[0], quantity: 1 }));
});

// 测试：复选框选中时，选中的商品应该更新
test("should update selected items when checkbox is clicked", async () => {
    const mockCartItems = [
        { id: 1, name: "Product 1", price: "$10.00", quantity: 1, rating: 4, image: "image.jpg", brand: "Brand 1", category: "Category 1" },
        { id: 2, name: "Product 2", price: "$20.00", quantity: 1, rating: 3, image: "image2.jpg", brand: "Brand 2", category: "Category 2" },
    ];
    getCart.mockResolvedValue(mockCartItems);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const checkbox1 = screen.getByLabelText("Product 1");
    fireEvent.click(checkbox1);

    expect(screen.getByRole("checkbox", { name: /Product 1/i })).toBeChecked();
});

// 测试：计算总价格
test("should calculate total price correctly", async () => {
    const mockCartItems = [
        { id: 1, name: "Product 1", price: "$10.00", quantity: 2, rating: 4, image: "image.jpg", brand: "Brand 1", category: "Category 1" },
        { id: 2, name: "Product 2", price: "$20.00", quantity: 1, rating: 3, image: "image2.jpg", brand: "Brand 2", category: "Category 2" },
    ];
    getCart.mockResolvedValue(mockCartItems);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const totalPrice = await screen.findByText("Total Price: $40.00");
    expect(totalPrice).toBeInTheDocument();
});

// 测试：点击购买时显示评分组件
test("should show rating component after purchase", async () => {
    const mockCartItems = [{ id: 1, name: "Product 1", price: "$10.00", quantity: 1, rating: 4, image: "image.jpg", brand: "Brand 1", category: "Category 1" }];
    getCart.mockResolvedValue(mockCartItems);

    render(
        <Router>
            <Cart user={{ id: 1 }} />
        </Router>
    );

    const buyButton = screen.getByText("Buy Selected Items");
    fireEvent.click(buyButton);

    await screen.findByText("Rating");
    const ratingComponent = screen.getByText("Rating");
    expect(ratingComponent).toBeInTheDocument();
});

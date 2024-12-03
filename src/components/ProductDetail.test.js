import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductDetails from "./ProductDetails";
import { getProducts, addToCart, getCart, updateCart } from "../api";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// 模拟 API 请求
jest.mock("../api", () => ({
  getProducts: jest.fn(),
  addToCart: jest.fn(),
  getCart: jest.fn(),
  updateCart: jest.fn(),
}));

describe("ProductDetails Component", () => {
  const mockUser = { id: 1, name: "Test User" };

  beforeEach(() => {
    // 清除之前的 API 模拟调用
    jest.clearAllMocks();
  });

  test("should render product details correctly", async () => {
    const mockProduct = {
      id: "1",
      name: "Test Product",
      price: "20.00",
      category: "Test Category",
      brand: "Test Brand",
      image: "https://example.com/product-image.jpg",
    };

    // 模拟 getProducts 返回数据
    getProducts.mockResolvedValue([mockProduct]);

    render(
      <Router>
        <Routes>
          <Route path="/product/:id" element={<ProductDetails user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 等待产品信息加载
    await screen.findByText("Test Product");

    // 验证产品信息是否渲染
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Price: 20.00")).toBeInTheDocument();
    expect(screen.getByText("Category: Test Category")).toBeInTheDocument();
    expect(screen.getByText("Brand: Test Brand")).toBeInTheDocument();
  });

  test("should show product not found if product does not exist", async () => {
    // 模拟 getProducts 返回空数组
    getProducts.mockResolvedValue([]);

    render(
      <Router>
        <Routes>
          <Route path="/product/:id" element={<ProductDetails user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 验证未找到产品时的提示
    await screen.findByText("Product not found");
    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });

  test("should show alert if user is not logged in", async () => {
    // 模拟 getProducts 返回产品
    const mockProduct = {
      id: "1",
      name: "Test Product",
      price: "20.00",
      category: "Test Category",
      brand: "Test Brand",
      image: "https://example.com/product-image.jpg",
    };
    getProducts.mockResolvedValue([mockProduct]);

    // 模拟未登录用户
    const mockNoUser = null;

    render(
      <Router>
        <Routes>
          <Route path="/product/:id" element={<ProductDetails user={mockNoUser} />} />
        </Routes>
      </Router>
    );

    // 等待产品加载
    await screen.findByText("Test Product");

    // 点击添加到购物车按钮
    fireEvent.click(screen.getByText("Add to Cart"));

    // 验证弹出警告
    expect(window.alert).toHaveBeenCalledWith("Please login to add items to the cart.");
  });

  test("should add product to cart if user is logged in", async () => {
    // 模拟 getProducts 返回产品
    const mockProduct = {
      id: "1",
      name: "Test Product",
      price: "20.00",
      category: "Test Category",
      brand: "Test Brand",
      image: "https://example.com/product-image.jpg",
    };
    getProducts.mockResolvedValue([mockProduct]);

    // 模拟登录用户
    const mockUser = { id: 1, name: "Test User" };

    // 模拟 getCart 返回空购物车
    getCart.mockResolvedValue([]);

    render(
      <Router>
        <Routes>
          <Route path="/product/:id" element={<ProductDetails user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 等待产品加载
    await screen.findByText("Test Product");

    // 点击添加到购物车按钮
    fireEvent.click(screen.getByText("Add to Cart"));

    // 验证是否调用了 addToCart
    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith({
        ...mockProduct,
        quantity: 1,
        userId: "1", // 用户 ID 应为字符串
      });
    });

    // 验证弹出成功提示
    expect(window.alert).toHaveBeenCalledWith("Item added to cart!");
  });

  test("should update product quantity in cart if already in cart", async () => {
    // 模拟 getProducts 返回产品
    const mockProduct = {
      id: "1",
      name: "Test Product",
      price: "20.00",
      category: "Test Category",
      brand: "Test Brand",
      image: "https://example.com/product-image.jpg",
    };
    getProducts.mockResolvedValue([mockProduct]);

    // 模拟登录用户
    const mockUser = { id: 1, name: "Test User" };

    // 模拟购物车中已有该产品
    getCart.mockResolvedValue([{ id: "1", quantity: 1 }]);

    render(
      <Router>
        <Routes>
          <Route path="/product/:id" element={<ProductDetails user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 等待产品加载
    await screen.findByText("Test Product");

    // 点击添加到购物车按钮
    fireEvent.click(screen.getByText("Add to Cart"));

    // 验证是否调用了 updateCart
    await waitFor(() => {
      expect(updateCart).toHaveBeenCalledWith({ id: "1", quantity: 2 });
    });

    // 验证弹出成功提示
    expect(window.alert).toHaveBeenCalledWith("Quantity updated in cart!");
  });
});

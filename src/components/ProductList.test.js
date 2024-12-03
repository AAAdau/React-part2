import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductList from "./ProductList";
import { getProducts, getFav, addToFav, deleteFromFav, getAllCart } from "../api";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// 模拟 API 请求
jest.mock("../api", () => ({
  getProducts: jest.fn(),
  getFav: jest.fn(),
  addToFav: jest.fn(),
  deleteFromFav: jest.fn(),
  getAllCart: jest.fn(),
}));

describe("ProductList Component", () => {
  const mockUser = { id: 1, name: "Test User" };

  beforeEach(() => {
    jest.clearAllMocks(); // 清除 API 模拟调用
  });

  test("should render product list correctly", async () => {
    const mockProducts = [
      { id: "1", name: "Test Product 1", price: "20.00", brand: "Brand A", image: "https://example.com/product1.jpg", category: "Women" },
      { id: "2", name: "Test Product 2", price: "30.00", brand: "Brand B", image: "https://example.com/product2.jpg", category: "Men" },
    ];

    getProducts.mockResolvedValue(mockProducts);

    render(
      <Router>
        <Routes>
          <Route path="/" element={<ProductList user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 验证产品是否正确渲染
    await screen.findByText("Test Product 1");
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
  });

  test("should show products filtered by category", async () => {
    const mockProducts = [
      { id: "1", name: "Test Product 1", price: "20.00", brand: "Brand A", image: "https://example.com/product1.jpg", category: "Women" },
      { id: "2", name: "Test Product 2", price: "30.00", brand: "Brand B", image: "https://example.com/product2.jpg", category: "Men" },
    ];

    getProducts.mockResolvedValue(mockProducts);

    render(
      <Router>
        <Routes>
          <Route path="/" element={<ProductList user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 选择 "Women" 分类
    fireEvent.click(screen.getByText("Women"));

    // 验证产品列表中只显示 "Women" 分类的商品
    await screen.findByText("Test Product 1");
    expect(screen.queryByText("Test Product 2")).toBeNull();
  });

  test("should add and remove product from favorites", async () => {
    const mockProduct = { id: "1", name: "Test Product 1", price: "20.00", brand: "Brand A", image: "https://example.com/product1.jpg", category: "Women" };
    const mockFavorites = [];

    getFav.mockResolvedValue(mockFavorites);
    addToFav.mockResolvedValue();
    deleteFromFav.mockResolvedValue();

    render(
      <Router>
        <Routes>
          <Route path="/" element={<ProductList user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 验证没有收藏的情况下，点击收藏按钮
    fireEvent.click(screen.getByRole("button"));
    expect(addToFav).toHaveBeenCalledWith({ ...mockProduct, userId: "1" });
    expect(screen.getByRole("button")).toContainElement(screen.getByText("♥"));

    // 模拟点击取消收藏
    fireEvent.click(screen.getByRole("button"));
    expect(deleteFromFav).toHaveBeenCalledWith("1");
  });

  test("should handle pagination correctly", async () => {
    const mockProducts = [
      { id: "1", name: "Test Product 1", price: "20.00", brand: "Brand A", image: "https://example.com/product1.jpg", category: "Women" },
      { id: "2", name: "Test Product 2", price: "30.00", brand: "Brand B", image: "https://example.com/product2.jpg", category: "Men" },
      { id: "3", name: "Test Product 3", price: "40.00", brand: "Brand C", image: "https://example.com/product3.jpg", category: "Women" },
    ];

    getProducts.mockResolvedValue(mockProducts);

    render(
      <Router>
        <Routes>
          <Route path="/" element={<ProductList user={mockUser} />} />
        </Routes>
      </Router>
    );

    // 验证第一个页面的产品是否正确渲染
    await screen.findByText("Test Product 1");
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();

    // 点击下一页
    fireEvent.click(screen.getByText(">"));

    // 验证第二页的产品是否正确渲染
    await screen.findByText("Test Product 2");
    expect(screen.queryByText("Test Product 1")).toBeNull();
  });

  test("should navigate to product details page when product is clicked", async () => {
    const mockProducts = [
      { id: "1", name: "Test Product 1", price: "20.00", brand: "Brand A", image: "https://example.com/product1.jpg", category: "Women" },
    ];

    getProducts.mockResolvedValue(mockProducts);

    render(
      <Router>
        <Routes>
          <Route path="/" element={<ProductList user={mockUser} />} />
          <Route path="/products/:id" element={<div>Product Details</div>} />
        </Routes>
      </Router>
    );

    // 点击产品名称
    fireEvent.click(screen.getByText("Test Product 1"));

    // 验证是否导航到产品详细页面
    expect(screen.getByText("Product Details")).toBeInTheDocument();
  });
});

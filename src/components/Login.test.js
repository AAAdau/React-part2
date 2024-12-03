import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { loginUser } from "../api";
import { BrowserRouter as Router } from "react-router-dom";

// 模拟 loginUser 函数
jest.mock("../api", () => ({
  loginUser: jest.fn(),
}));

describe("Login Component", () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    mockSetUser.mockClear(); // 清除之前的调用
  });

  test("should render email and password input fields", () => {
    render(
      <Router>
        <Login setUser={mockSetUser} />
      </Router>
    );

    // 检查是否渲染了 email 和 password 输入框
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("should update email and password fields on change", () => {
    render(
      <Router>
        <Login setUser={mockSetUser} />
      </Router>
    );

    // 模拟输入 email 和 password
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // 检查输入值是否正确更新
    expect(screen.getByPlaceholderText("Email").value).toBe("test@example.com");
    expect(screen.getByPlaceholderText("Password").value).toBe("password123");
  });

  test("should call setUser and redirect on successful login", async () => {
    // 模拟登录成功
    loginUser.mockResolvedValue([{ id: 1, email: "test@example.com", name: "Test User" }]);

    render(
      <Router>
        <Login setUser={mockSetUser} />
      </Router>
    );

    // 填写并提交表单
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("Sign In"));

    // 等待异步操作完成
    await waitFor(() => {
      // 验证 setUser 是否被调用
      expect(mockSetUser).toHaveBeenCalledWith({ id: 1, email: "test@example.com", name: "Test User" });
    });

    // 检查是否跳转到主页
    expect(window.location.pathname).toBe("/");
  });

  test("should show alert on failed login", async () => {
    // 模拟登录失败
    loginUser.mockResolvedValue([]);

    render(
      <Router>
        <Login setUser={mockSetUser} />
      </Router>
    );

    // 填写并提交表单
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByText("Sign In"));

    // 等待异步操作完成
    await waitFor(() => {
      // 验证是否弹出错误提示
      expect(window.alert).toHaveBeenCalledWith("Invalid email or password.");
    });
  });

  test("should handle errors during login", async () => {
    // 模拟 API 错误
    loginUser.mockRejectedValue(new Error("Network Error"));

    render(
      <Router>
        <Login setUser={mockSetUser} />
      </Router>
    );

    // 填写并提交表单
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("Sign In"));

    // 等待异步操作完成
    await waitFor(() => {
      // 验证是否弹出错误提示
      expect(window.alert).toHaveBeenCalledWith("An error occurred during login. Please try again.");
    });
  });
});

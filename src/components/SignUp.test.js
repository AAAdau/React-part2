import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./Signup";
import { signUpUser } from "../api";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// 模拟 signUpUser API 请求
jest.mock("../api", () => ({
  signUpUser: jest.fn(),
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 清除 API 模拟调用
  });

  test("should render the signup form correctly", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
        </Routes>
      </Router>
    );

    // 验证表单元素是否正确渲染
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("I agree with the Terms & Conditions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("should update form data when input fields change", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
        </Routes>
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // 模拟用户输入
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // 验证输入框中的值是否更新
    expect(nameInput.value).toBe("Test User");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("should show alert and prevent submission if terms are not accepted", async () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
        </Routes>
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    // 模拟用户输入
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // 不选中“接受条款”
    fireEvent.click(submitButton);

    // 验证弹出提示框
    expect(await screen.findByText("You must accept the terms and conditions.")).toBeInTheDocument();
  });

  test("should call signUpUser and redirect on successful sign-up", async () => {
    const mockSignUpResponse = { id: 1, name: "Test User", email: "test@example.com" };
    signUpUser.mockResolvedValue(mockSignUpResponse);

    render(
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });
    const termsCheckbox = screen.getByLabelText("I agree with the Terms & Conditions");

    // 模拟用户输入
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // 勾选“接受条款”
    fireEvent.click(termsCheckbox);

    // 模拟表单提交
    fireEvent.click(submitButton);

    // 验证 signUpUser 是否被调用
    await waitFor(() => expect(signUpUser).toHaveBeenCalledWith("Test User", "test@example.com", "password123"));

    // 验证是否重定向到登录页面
    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });

  test("should navigate to login page when 'Already have an account?' is clicked", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </Router>
    );

    // 模拟点击跳转到登录页面
    fireEvent.click(screen.getByText(/already have an account\? sign in/i));

    // 验证是否导航到登录页面
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});

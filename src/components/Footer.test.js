import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

// 测试：页脚是否显示版权信息
test("should display copyright text", () => {
    render(<Footer />);

    const copyrightText = screen.getByText(/© 2024 Perfume company. All Rights Reserved./i);
    expect(copyrightText).toBeInTheDocument();
});

// 测试：页脚是否有关于我们、联系我们、隐私政策的链接
test("should display footer navigation links", () => {
    render(<Footer />);

    const aboutLink = screen.getByRole("link", { name: /About Us/i });
    const contactLink = screen.getByRole("link", { name: /Contact/i });
    const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });

    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
});

// 测试：链接是否指向正确的页面
test("should have correct href for navigation links", () => {
    render(<Footer />);

    const aboutLink = screen.getByRole("link", { name: /About Us/i });
    const contactLink = screen.getByRole("link", { name: /Contact/i });
    const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });

    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(privacyLink).toHaveAttribute("href", "/privacy");
});

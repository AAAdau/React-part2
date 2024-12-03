import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { getImages } from "../api";

// 模拟 getImages 方法
jest.mock("../api", () => ({
  getImages: jest.fn(),
}));

describe("Home Component", () => {
  const mockImages = [
    { id: 1, url: "https://example.com/image1.jpg" },
    { id: 2, url: "https://example.com/image2.jpg" },
    { id: 3, url: "https://example.com/image3.jpg" },
  ];

  beforeEach(() => {
    getImages.mockResolvedValue(mockImages);
  });

  test("should render images", async () => {
    render(<Home />);
    
    // 确保 API 调用返回的图片渲染到了页面上
    const images = await screen.findAllByRole("img");
    expect(images).toHaveLength(mockImages.length);
  });

  test("should navigate to the next image when clicking the right arrow", async () => {
    render(<Home />);
    
    // 获取并点击右箭头
    const nextButton = screen.getByRole("button", { name: /right arrow/i });
    fireEvent.click(nextButton);

    // 检查当前图片是否切换
    const currentImage = screen.getByAltText(/Perfume/i);
    expect(currentImage).toHaveAttribute("src", mockImages[1].url);
  });

  test("should navigate to the previous image when clicking the left arrow", async () => {
    render(<Home />);
    
    // 获取并点击左箭头
    const prevButton = screen.getByRole("button", { name: /left arrow/i });
    fireEvent.click(prevButton);

    // 检查当前图片是否切换
    const currentImage = screen.getByAltText(/Perfume/i);
    expect(currentImage).toHaveAttribute("src", mockImages[2].url);
  });

  test("should update current image when clicking on the circle indicator", async () => {
    render(<Home />);
    
    // 获取并点击圆形指示器
    const indicator = screen.getAllByRole("button")[1]; // 获取第二个指示器
    fireEvent.click(indicator);

    // 检查当前图片是否切换
    const currentImage = screen.getByAltText(/Perfume/i);
    expect(currentImage).toHaveAttribute("src", mockImages[1].url);
  });
});

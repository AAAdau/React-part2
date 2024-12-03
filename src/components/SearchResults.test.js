import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchResults from "./SearchResults"; // 根据实际路径调整
import products from "../data/products"; // 根据实际路径调整

// Mock products data if needed
jest.mock("../data/products", () => [
    { id: 1, name: "Perfume A", brand: "Brand X", price: "$30", image: "imageA.jpg" },
    { id: 2, name: "Perfume B", brand: "Brand Y", price: "$40", image: "imageB.jpg" },
    { id: 3, name: "Perfume C", brand: "Brand X", price: "$50", image: "imageC.jpg" },
]);

describe("SearchResults", () => {
    test("renders all products when query is empty", async () => {
        // Use MemoryRouter to simulate location (search query)
        render(
            <MemoryRouter initialEntries={['/search?query=']}>
                <SearchResults />
            </MemoryRouter>
        );

        // Verify all products are displayed
        await waitFor(() => {
            expect(screen.getByText("Perfume A")).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(screen.getByText("Perfume B")).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(screen.getByText("Perfume C")).toBeInTheDocument();
        });
    });

    test("displays 'No products found' when no products match the query", async () => {
        render(
            <MemoryRouter initialEntries={['/search?query=nonexistent']}>
                <SearchResults />
            </MemoryRouter>
        );

        // 修改为期望的文本，仅为 "No products found."，去掉额外的提示信息
        await waitFor(() => {
            expect(screen.getByText("No products found.")).toBeInTheDocument();
        });
    });

    test("filters products based on query", async () => {
        render(
            <MemoryRouter initialEntries={['/search?query=Brand X']}>
                <SearchResults />
            </MemoryRouter>
        );

        // Ensure only matching products (Brand X) are displayed
        await waitFor(() => {
            expect(screen.getByText("Perfume A")).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(screen.getByText("Perfume C")).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(screen.queryByText("Perfume B")).toBeNull(); // Perfume B should not be shown
        });
    });
});

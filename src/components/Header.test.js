import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Mocking useNavigate hook
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("Header Component", () => {
    it("should navigate to search results page when submitting the search form", () => {
        const mockCartItems = 5;

        // Mock navigate function
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);  // Return the mock function when useNavigate is called

        render(
            <MemoryRouter initialEntries={['/']}>
                <Header cartItems={mockCartItems} />
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText("Search 10,000+ trusted brands");
        const searchButton = screen.getByRole("button");

        fireEvent.change(searchInput, { target: { value: "Perfume" } });
        fireEvent.click(searchButton);

        // Check that navigate was called with the correct URL
        expect(mockNavigate).toHaveBeenCalledWith("/search?query=Perfume");
    });
});

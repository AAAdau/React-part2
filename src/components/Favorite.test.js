// src/components/Favorite.test.js
import { render, screen, waitFor } from "@testing-library/react";
import Favorite from "./Favorite";
import { getFav } from "../api";

jest.mock("../api");

describe("Favorite Component", () => {
    it("should display user's favorite products", async () => {
        const mockUser = { id: 1 };
        const mockFavItems = [
            { id: 1, name: "Perfume A", price: "$50", brand: "Brand A", userId: "1", image: "image-url" },
            { id: 2, name: "Perfume B", price: "$60", brand: "Brand B", userId: "1", image: "image-url" },
        ];

        getFav.mockResolvedValue(mockFavItems);

        render(<Favorite user={mockUser} />);

        await waitFor(() => {
            expect(screen.getByText("My Favorites")).toBeInTheDocument();
            expect(screen.getByText("Perfume A")).toBeInTheDocument();
            expect(screen.getByText("Perfume B")).toBeInTheDocument();
        });
    });

    it("should display login message when no user is logged in", () => {
        render(<Favorite user={null} />);
        expect(screen.getByText("Please login to view your Favorite.")).toBeInTheDocument();
    });
});

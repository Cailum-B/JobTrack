import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ApplicationsScreen from "../screens/ApplicationsScreen";

jest.mock("../db/database", () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => Promise.resolve([
          {
            id: 1,
            companyName: "Clearstream",
            roleName: "Junior Data Analyst",
            date: "2026-03-01",
            categoryId: 1,
            notes: "Applied via LinkedIn",
            userId: 1,
          },
        ])),
      })),
    })),
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: { userId: 1 },
};

describe("ApplicationsScreen", () => {
  it("displays seeded applications after database initialisation", async () => {
    const { getByText } = render(
      <ApplicationsScreen navigation={mockNavigation} route={mockRoute} />
    );
    await waitFor(() => {
      expect(getByText("Clearstream")).toBeTruthy();
      expect(getByText("Junior Data Analyst")).toBeTruthy();
    });
  });
});
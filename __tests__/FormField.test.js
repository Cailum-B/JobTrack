import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FormField from "../components/FormField";

describe("FormField", () => {
  it("renders the label and placeholder correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <FormField
        label="Company"
        placeholder="Enter company name"
        value=""
        onChangeText={() => {}}
      />
    );
    expect(getByText("Company")).toBeTruthy();
    expect(getByPlaceholderText("Enter company name")).toBeTruthy();
  });

  it("fires onChangeText when input changes", () => {
    const mockFn = jest.fn();
    const { getByPlaceholderText } = render(
      <FormField
        label="Company"
        placeholder="Enter company name"
        value=""
        onChangeText={mockFn}
      />
    );
    fireEvent.changeText(getByPlaceholderText("Enter company name"), "Google");
    expect(mockFn).toHaveBeenCalledWith("Google");
  });
});
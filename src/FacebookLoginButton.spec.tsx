import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import { FacebookLoginButton } from "./FacebookLoginButton";

test('displays a "Hello World" message', () => {
  render(<FacebookLoginButton />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});

test("should return true", () => {
  expect(true).toBe(true);
});

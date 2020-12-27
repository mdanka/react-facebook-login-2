import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import { FacebookLoginButton } from "./FacebookLoginButton";

test('displays a "Hello World" message', () => {
  render(
    <FacebookLoginButton
      appId="168590974451254"
      version="v8.0"
      cookie={true}
      status={true}
      xfbml={true}
      autoLogoutLink={true}
      scope="public_profile"
      size="medium"
      buttonType="login_with"
      useContinueAs={true}
    />,
  );
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});

test("should return true", () => {
  expect(true).toBe(true);
});

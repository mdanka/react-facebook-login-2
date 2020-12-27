import React from "react";
import { FacebookLoginButton } from "./FacebookLoginButton";

export default {
  title: "Facebook Login Button",
  component: FacebookLoginButton,
};

export const Default = (): React.ReactNode => (
  <FacebookLoginButton
    sdkProps={{
      appId: "168590974451254",
      version: "v8.0",
      cookie: true,
      status: true,
      xfbml: true,
    }}
    autoLogoutLink={false}
    scope="public_profile"
    size="medium"
    buttonType="login_with"
    useContinueAs={true}
  />
);

import React, { useEffect, useState } from "react";
import { IFacebookSdkProps, startFacebookSdk } from "./FacebookSdk";
import { getFacebookWindow } from "./utils";

export type FacebookLoginResponse = Record<string, unknown>;

export interface IFacebookLoginButtonProps {
  // General options

  /**
   * Options to initialize the Facebook SDK.
   */
  sdkProps: IFacebookSdkProps;

  /**
   * A custom class to add to the button.
   * @default fb-login-button
   */
  className?: string;

  // Login button options

  /**
   * If enabled, the button will change to a logout button when the user is logged in.
   * @default false
   */
  autoLogoutLink?: boolean;

  /**
   * The list of permissions to request during login.
   * @default public_profile
   */
  scope?: string;

  /**
   * Picks one of the size options for the button.
   * @default small
   */
  size?: "small" | "medium" | "large";

  /**
   * Determines what audience will be selected by default, when requesting write permissions.
   * @default friends
   */
  defaultAudience?: "everyone" | "friends" | "only_me";

  /**
   * Determines the display type of the button.
   * @default default
   */
  layout?: "default" | "rounded";

  /**
   * Determines the type of button text.
   * @default continue_with
   */
  buttonType?: "continue_with" | "login_with";

  /**
   * Determines whether to show the user's profile picture when available.
   * @default false
   */
  useContinueAs?: boolean;
}

const DEFAULT_PROPS = {
  autoLogoutLink: false,
  scope: "public_profile",
  size: "small" as const,
  defaultAudience: "friends" as const,
  layout: "default" as const,
  buttonType: "continue_with" as const,
  useContinueAs: false,

  className: "fb-login-button",
  onFacebookLoginResponse: (response: FacebookLoginResponse) => {
    console.debug("[FacebookLoginResponse] Default response", response);
  },
};

export const FacebookLoginButton: React.FC<IFacebookLoginButtonProps> = (
  props,
) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  const propsWithDefaults: Required<IFacebookLoginButtonProps> = {
    ...DEFAULT_PROPS,
    ...props,
  };

  const {
    autoLogoutLink,
    scope,
    size,
    defaultAudience,
    layout,
    buttonType,
    useContinueAs,
    className,
    sdkProps,
  } = propsWithDefaults;

  useEffect(() => {
    startFacebookSdk(sdkProps).then(() => {
      setIsSdkLoaded(true);
    });
    if (isSdkLoaded) {
      // We have to ask the Facebook SDK to rerender the button if
      // some properties changed
      getFacebookWindow().FB.XFBML.parse();
    }
  }, []);

  useEffect(() => {
    if (isSdkLoaded) {
      // We have to ask the Facebook SDK to rerender the button if
      // some properties changed
      getFacebookWindow().FB.XFBML.parse();
    }
  });

  return (
    <>
      <div
        className={className}
        data-auto-logout-link={autoLogoutLink}
        data-scope={scope}
        data-size={size}
        data-default-audience={defaultAudience}
        data-button-type={buttonType}
        data-layout={layout}
        data-use-continue-as={useContinueAs}
        data-width=""
      />
    </>
  );
};

import React from "react";

export interface IFacebookLoginButtonProps {
  // General options

  /**
   * A custom class to add to the button.
   * @default fb-login-button
   */
  className?: string;

  /**
   * The properties returned by the Facebook login callback.
   */
  onFacebookLoginResponse: (response: Record<string, unknown>) => void;

  // Facebook options

  /**
   * Your Facebook application ID. If you don't have one find it in the App dashboard
   * or go there to create a new app.
   */
  appId: string;

  /**
   * The language code, such as "en_US".
   * @default en_US
   */
  language?: string;

  /**
   * Determines which versions of the Graph API and any API dialogs or
   * plugins are invoked when using the .api() and .ui() functions. Valid
   * values are determined by currently available versions, such as 'v2.0'.
   * @default v8.0
   */
  version?: string;

  /**
   * Determines whether a cookie is created for the session or not. If enabled,
   * it can be accessed by server-side code.
   * @default false
   */
  cookie?: boolean;

  /**
   * Determines whether the current login status of the user is freshly retrieved
   * on every page load. If this is disabled, that status will have to be manually
   * retrieved using .getLoginStatus().
   * @default false
   */
  status?: boolean;

  /**
   * Determines whether XFBML tags used by social plugins are parsed, and
   * therefore whether the plugins are rendered or not.
   * @default false
   */
  xfbml?: boolean;

  /**
   * Frictionless Requests are available to games on Facebook.com or on mobile
   * web using the JavaScript SDK. This parameter determines whether they are
   * enabled.
   * @default false
   */
  frictionlessRequests?: boolean;

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
  language: "en_US",
  version: "v8.0",
  cookie: false,
  status: false,
  xfbml: false,
  frictionlessRequests: false,

  autoLogoutLink: false,
  scope: "public_profile",
  size: "small",
  defaultAudience: "friends",
  layout: "default",
  buttonType: "continue_with",
  useContinueAs: false,

  className: "fb-login-button",
};

export const FacebookLoginButton: React.FC = () => {
  return <div>Hello World</div>;
};

import React, { useCallback, useEffect, useState } from "react";

export type FacebookLoginResponse = Record<string, unknown>;

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
  onFacebookLoginResponse?: (response: FacebookLoginResponse) => void;

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
  const [isSdkLoaded, setIsSdkLoadedState] = useState(false);

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
    language,
    onFacebookLoginResponse,
    appId,
    version,
    cookie,
    status,
    xfbml,
    frictionlessRequests,
  } = propsWithDefaults;

  let authStatusChangeSubscription:
    | ((response: FacebookLoginResponse) => void)
    | undefined;
  let authResponseChangeSubscription:
    | ((response: FacebookLoginResponse) => void)
    | undefined;

  const getFacebookWindow = () => {
    return (window as unknown) as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      FB: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fbAsyncInit: any;
    };
  };

  useEffect(() => {
    console.debug("[FacebookLoginButton] componentDidMount");
    if (document.getElementById("facebook-jssdk")) {
      console.debug("[FacebookLoginButton] facebook-jssdk already exists");
      setIsSdkLoaded();
      refreshLoginStatus();
      return;
    }
    console.debug("[FacebookLoginButton] facebook-jssdk doesn't yet exist");
    setFbAsyncInit();
    loadSdkAsynchronously();
    let fbRoot = document.getElementById("fb-root");
    if (!fbRoot) {
      fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }

    return () => {
      console.debug("[FacebookLoginButton] componentWillUnmount");
      if (authStatusChangeSubscription != null) {
        getFacebookWindow().FB.Event.unsubscribe(
          "auth.statusChange",
          authStatusChangeSubscription,
        );
        authStatusChangeSubscription = null;
      }
      if (authResponseChangeSubscription != null) {
        getFacebookWindow().FB.Event.unsubscribe(
          "auth.authResponseChange",
          authResponseChangeSubscription,
        );
        authResponseChangeSubscription = null;
      }
      console.debug("[FacebookLoginButton] Unsubscribed change listeners");
    };
  }, []);

  useEffect(() => {
    if (isSdkLoaded) {
      console.debug("[FacebookLoginButton] The SDK has just loaded");
      if (!status) {
        // The status is not automatically loaded, so we have to load it
        refreshLoginStatus();
      }
      // We have to ask the Facebook SDK to rerender the button if
      // some properties changed
      getFacebookWindow().FB.XFBML.parse();
    }
  }, [isSdkLoaded]);

  const setIsSdkLoaded = useCallback(() => {
    console.debug("[FacebookLoginButton] setIsSdkLoaded");
    setIsSdkLoadedState(true);
    authStatusChangeSubscription = function (response) {
      onFacebookLoginResponse(response);
    };
    authResponseChangeSubscription = function (response) {
      onFacebookLoginResponse(response);
    };
    getFacebookWindow().FB.Event.subscribe(
      "auth.statusChange",
      authStatusChangeSubscription,
    );
    getFacebookWindow().FB.Event.subscribe(
      "auth.authResponseChange",
      authResponseChangeSubscription,
    );
    console.debug("[FacebookLoginButton] Subscribed change listeners");
  }, [setIsSdkLoadedState, onFacebookLoginResponse]);

  const setFbAsyncInit = useCallback(() => {
    getFacebookWindow().fbAsyncInit = () => {
      getFacebookWindow().FB.init({
        appId,
        version,
        cookie,
        status,
        xfbml,
        frictionlessRequests,
      });
      setIsSdkLoaded();
    };
  }, [appId, version, cookie, status, xfbml, frictionlessRequests]);

  const loadSdkAsynchronously = useCallback(() => {
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      (js as HTMLScriptElement).src = `https://connect.facebook.net/${language}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, [language]);

  const refreshLoginStatus = useCallback(() => {
    console.debug("[FacebookLoginButton] refreshLoginStatus");
    getFacebookWindow().FB.getLoginStatus(function (response) {
      onFacebookLoginResponse(response);
    });
  }, [onFacebookLoginResponse]);

  return (
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
  );
};

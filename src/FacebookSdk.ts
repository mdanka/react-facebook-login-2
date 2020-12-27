import { FacebookLoginResponse, getFacebookWindow } from "./utils";

export interface IFacebookSdkProps {
  // General options

  /**
   * The properties returned by the Facebook login callback.
   */
  onFacebookLoginResponse?: (response: FacebookLoginResponse) => void;

  /**
   * Triggered when the SDK loads.
   */
  onSdkLoaded?: () => void;

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
}

const DEFAULT_PROPS = {
  language: "en_US",
  version: "v8.0",
  cookie: false,
  status: false,
  xfbml: false,
  frictionlessRequests: false,

  onFacebookLoginResponse: (response: FacebookLoginResponse) => {
    console.debug("[FacebookSdk] Default response", response);
  },
};

const FB_SCRIPT_ID = "facebook-jssdk";

/**
 * Resolves when the SDK is loaded.
 */
export const startFacebookSdk = (props: IFacebookSdkProps): Promise<void> => {
  return new Promise((resolve) => {
    const onSdkLoaded = () => {
      resolve();
      props.onSdkLoaded?.();
    };

    const propsWithDefaults: Required<IFacebookSdkProps> = {
      ...DEFAULT_PROPS,
      ...props,
      onSdkLoaded,
    };

    console.debug("[FacebookSdk] initialize");
    if (document.getElementById(FB_SCRIPT_ID)) {
      console.debug(`[FacebookSdk] ${FB_SCRIPT_ID} already exists`);
      setIsSdkLoaded(propsWithDefaults);
      refreshLoginStatus(propsWithDefaults);
      return;
    }
    console.debug(`[FacebookSdk] ${FB_SCRIPT_ID} doesn't yet exist`);
    setFbAsyncInit(propsWithDefaults);
    let fbRoot = document.getElementById("fb-root");
    if (!fbRoot) {
      fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }
    loadSdkAsynchronously(propsWithDefaults);
  });
};

const setIsSdkLoaded = (props: Required<IFacebookSdkProps>) => {
  console.debug("[FacebookSdk] setIsSdkLoaded");
  const { onSdkLoaded, onFacebookLoginResponse } = props;
  onSdkLoaded();
  const authStatusChangeSubscription = function (response) {
    onFacebookLoginResponse(response);
  };
  const authResponseChangeSubscription = function (response) {
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
  if (!status) {
    // The status is not automatically loaded, so we have to load it
    refreshLoginStatus(props);
  }
  // We have to ask the Facebook SDK to rerender components if
  // the status has changed
  getFacebookWindow().FB.XFBML.parse();
  console.debug("[FacebookSdk] Subscribed change listeners");
};

const setFbAsyncInit = (props: Required<IFacebookSdkProps>) => {
  console.debug("[FacebookSdk] setFbAsyncInit");
  getFacebookWindow().fbAsyncInit = () => {
    console.debug("[FacebookSdk] fbAsyncInit triggered");
    const {
      appId,
      version,
      cookie,
      status,
      xfbml,
      frictionlessRequests,
    } = props;
    getFacebookWindow().FB.init({
      appId,
      version,
      cookie,
      status,
      xfbml,
      frictionlessRequests,
    });
    console.debug("[FacebookSdk] FB.init finished");
    setIsSdkLoaded(props);
  };
};

const loadSdkAsynchronously = (props: Required<IFacebookSdkProps>) => {
  const { language } = props;
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
  })(document, "script", FB_SCRIPT_ID);
};

const refreshLoginStatus = (props: Required<IFacebookSdkProps>) => {
  const { onFacebookLoginResponse } = props;
  console.debug("[FacebookSdk] refreshLoginStatus");
  getFacebookWindow().FB.getLoginStatus(function (response) {
    onFacebookLoginResponse(response);
  });
};

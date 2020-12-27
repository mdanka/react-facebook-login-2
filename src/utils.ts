export type FacebookLoginResponse = unknown;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getFacebookWindow() {
  return (window as unknown) as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbAsyncInit: any;
  };
}

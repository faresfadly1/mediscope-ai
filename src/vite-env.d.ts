/// <reference types="vite/client" />

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (options: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            theme?: string;
            size?: string;
            shape?: string;
            text?: string;
            width?: string | number;
          }
        ) => void;
      };
    };
  };
}

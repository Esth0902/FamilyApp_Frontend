/// <reference types="expo/types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_MODE?: 'local' | 'online';
      
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_API_URL_LOCAL?: string;
      EXPO_PUBLIC_API_URL_ONLINE?: string;
      
      EXPO_PUBLIC_REVERB_HOST?: string;
      EXPO_PUBLIC_REVERB_HOST_LOCAL?: string;
      EXPO_PUBLIC_REVERB_HOST_ONLINE?: string;
      
      EXPO_PUBLIC_REVERB_PORT?: string;
      EXPO_PUBLIC_REVERB_PORT_LOCAL?: string;
      EXPO_PUBLIC_REVERB_PORT_ONLINE?: string;
      
      EXPO_PUBLIC_REVERB_SCHEME?: string;
      EXPO_PUBLIC_REVERB_SCHEME_LOCAL?: string;
      EXPO_PUBLIC_REVERB_SCHEME_ONLINE?: string;
      
      EXPO_PUBLIC_REVERB_KEY?: string;
      EXPO_PUBLIC_REVERB_KEY_LOCAL?: string;
      EXPO_PUBLIC_REVERB_KEY_ONLINE?: string;
      
      EXPO_PUBLIC_PUSHER_APP_CLUSTER?: string;
      EXPO_PUBLIC_PUSHER_APP_CLUSTER_LOCAL?: string;
      EXPO_PUBLIC_PUSHER_APP_CLUSTER_ONLINE?: string;
    }
  }
}

export { };

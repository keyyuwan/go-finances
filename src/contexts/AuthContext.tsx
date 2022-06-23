import React, { createContext, ReactNode, useState } from "react";
import * as AuthSession from "expo-auth-session";

interface User {
  id: string;
  name: string;
  email: string;
  img?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as User);

  async function signInWithGoogle() {
    try {
      const CLIENT_ID =
        "45337424103-r56unosqv37rmio3lont03i40odv2og8.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@keyyuwan/gofinances";
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email"); // substitui o espaço por alguma coisa que seja válida na URL

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params, type } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();

        setUser({
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          img: userInfo.picture,
        });
      }
    } catch (err: any) {
      throw new Error(err); // passando o erro pra quem chamou a função
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

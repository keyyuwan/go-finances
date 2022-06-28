import React, { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { USER_COLLECTION_NAME } from "../utils/asyncStorage";

interface User {
  id: string;
  name: string;
  email: string;
  img?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  isAuthenticated: boolean;
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
  const [isUserStoragedLoading, setIsUserStoragedLoading] = useState(true);

  useEffect(() => {
    async function getUserStorageData() {
      const userStoraged = await AsyncStorage.getItem(USER_COLLECTION_NAME);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged);
        setUser(userLogged);
      }

      setIsUserStoragedLoading(false);
    }

    getUserStorageData();
  }, []);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email"); // substitui o espaço por alguma coisa que seja válida na URL

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params, type } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          img: userInfo.picture,
        };

        setUser(userLogged);

        await AsyncStorage.setItem(
          USER_COLLECTION_NAME,
          JSON.stringify(userLogged)
        );
      }
    } catch (err: any) {
      throw new Error(err); // passando o erro pra quem chamou a função
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const userLogged = {
          id: String(credential.user),
          name: credential.fullName!.givenName!,
          email: credential.email!,
          img: undefined,
        };
        setUser(userLogged);

        await AsyncStorage.setItem(
          USER_COLLECTION_NAME,
          JSON.stringify(userLogged)
        );
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

export function Routes() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthRoutes /> : <AppRoutes />}
    </NavigationContainer>
  );
}

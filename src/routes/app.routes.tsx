import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignIn } from "../screens/SignIn";

const { Navigator, Screen } = createStackNavigator();

// Public routes
export function AppRoutes() {
  return (
    <Navigator>
      <Screen name="SignIn" component={SignIn} />
    </Navigator>
  );
}

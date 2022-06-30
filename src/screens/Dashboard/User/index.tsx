import React from "react";

import { useAuth } from "../../../hooks/useAuth";

import {
  Container,
  UserInfo,
  Avatar,
  UserGreetings,
  Greetings,
  UserName,
  LogoutButton,
  Icon,
} from "./styles";

export function User() {
  const { user, signOut } = useAuth();

  return (
    <Container>
      <UserInfo>
        <Avatar source={{ uri: user.img }} />

        <UserGreetings>
          <Greetings>Olá,</Greetings>
          <UserName>{user.name}</UserName>
        </UserGreetings>
      </UserInfo>

      <LogoutButton onPress={signOut}>
        <Icon name="power" />
      </LogoutButton>
    </Container>
  );
}

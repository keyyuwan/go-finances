import React from "react";

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
  return (
    <Container>
      <UserInfo>
        <Avatar source={{ uri: "https://github.com/keyyuwan.png" }} />

        <UserGreetings>
          <Greetings>Olá,</Greetings>
          <UserName>Key</UserName>
        </UserGreetings>
      </UserInfo>

      <LogoutButton onPress={() => {}}>
        <Icon name="power" />
      </LogoutButton>
    </Container>
  );
}

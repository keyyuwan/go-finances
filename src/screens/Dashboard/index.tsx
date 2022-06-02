import React from "react";

import { HighlightCard } from "../../components/HighlightCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Avatar,
  User,
  Greetings,
  UserName,
  Icon,
  HighlightCards,
} from "./styles";

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Avatar source={{ uri: "https://github.com/keyyuwan.png" }} />

            <User>
              <Greetings>Olá,</Greetings>
              <UserName>Key</UserName>
            </User>
          </UserInfo>

          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$5000,00"
          lastTransactionDate="Última entrada dia 13 de maio"
          type="income"
        />
        <HighlightCard
          title="Saídas"
          amount="R$2000,00"
          lastTransactionDate="Última saída dia 13 de maio"
          type="outcome"
        />
        <HighlightCard
          title="Total"
          amount="R$3000,00"
          lastTransactionDate="01  à 16 de maio"
          type="total"
        />
      </HighlightCards>
    </Container>
  );
}

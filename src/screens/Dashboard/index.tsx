import React from "react";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

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
  Transactions,
  Title,
  TransactionsList,
} from "./styles";

export interface ListData extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: ListData[] = [
    {
      id: "1",
      type: "income",
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      category: { icon: "dollar-sign", name: "Vendas" },
      date: "13/05/2022",
    },
    {
      id: "2",
      type: "outcome",
      title: "Mc Donalds",
      amount: "R$ 58,00",
      category: { icon: "coffee", name: "Alimentação" },
      date: "13/05/2022",
    },
    {
      id: "3",
      type: "outcome",
      title: "Peita da Gucci",
      amount: "R$ 3000,00",
      category: { icon: "shopping-bag", name: "Compras" },
      date: "13/05/2022",
    },
  ];

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

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}

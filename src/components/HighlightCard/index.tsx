import React from "react";

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransactionDate,
} from "./styles";

type HighlightCardProps = {
  title: string;
  amount: string;
  lastTransactionDate: string;
  type: "income" | "outcome" | "total";
};

const icon = {
  income: "arrow-up-circle",
  outcome: "arrow-down-circle",
  total: "dollar-sign",
};

export function HighlightCard({
  title,
  amount,
  lastTransactionDate,
  type,
}: HighlightCardProps) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>

      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransactionDate type={type}>
          {lastTransactionDate}
        </LastTransactionDate>
      </Footer>
    </Container>
  );
}

import React from "react";

import { TransactionCard } from "../../../components/TransactionCard";
import { ListData } from "..";

import { Container, Title, List } from "./styles";

interface TransactionsListProps {
  transactions: ListData[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <Container>
      <Title>Listagem</Title>

      <List
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard data={item} />}
      />
    </Container>
  );
}

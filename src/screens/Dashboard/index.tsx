import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import { TRANSACTIONS_COLLECTION_NAME } from "../../utils/asyncStorage";
import { formatCurrencyBRL } from "../../utils/formatCurrencyBRL";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Avatar,
  User,
  Greetings,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from "./styles";

export interface ListData extends TransactionCardProps {
  id: string;
}

interface HighlightCardDataProps {
  amount: string;
}

interface HighlightCardData {
  incomes: HighlightCardDataProps;
  outcomes: HighlightCardDataProps;
  total: HighlightCardDataProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<ListData[]>([]);
  const [highlightCardData, setHighlightCardData] = useState<HighlightCardData>(
    {} as HighlightCardData
  );

  async function loadTransactions() {
    const transactions = await AsyncStorage.getItem(
      TRANSACTIONS_COLLECTION_NAME
    );
    const transactionsList = transactions ? JSON.parse(transactions) : [];

    let incomesSum = 0;
    let outcomesSum = 0;

    const transactionsFormatted: ListData[] = transactionsList.map(
      (item: ListData) => {
        if (item.transactionType === "income") {
          incomesSum += Number(item.amount);
        } else {
          outcomesSum += Number(item.amount);
        }

        return {
          ...item,
          amount: formatCurrencyBRL(item.amount),
          date: Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }).format(new Date(item.date)),
        };
      }
    );

    setHighlightCardData({
      incomes: {
        amount: formatCurrencyBRL(incomesSum),
      },

      outcomes: {
        amount: formatCurrencyBRL(outcomesSum),
      },

      total: {
        amount: formatCurrencyBRL(incomesSum - outcomesSum),
      },
    });

    setTransactions(transactionsFormatted);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

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

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount={highlightCardData.incomes.amount}
          lastTransactionDate="Última entrada dia 13 de maio"
          type="income"
        />
        <HighlightCard
          title="Saídas"
          amount={highlightCardData.outcomes.amount}
          lastTransactionDate="Última saída dia 13 de maio"
          type="outcome"
        />
        <HighlightCard
          title="Total"
          amount={highlightCardData.total.amount}
          lastTransactionDate="01  à 16 de maio"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}

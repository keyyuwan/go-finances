import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import { Loading } from "../../components/Loading";
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
  lastTransactionDate: string;
}

interface HighlightCardData {
  incomes: HighlightCardDataProps;
  outcomes: HighlightCardDataProps;
  total: HighlightCardDataProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<ListData[]>([]);
  const [highlightCardData, setHighlightCardData] = useState<HighlightCardData>(
    {} as HighlightCardData
  );

  function getLastTransactionDate(
    collection: ListData[],
    transactionType: "income" | "outcome"
  ) {
    // returns the highest number that represents the most recent transaction date
    const lastIncomeTransactionTimestamp = Math.max.apply(
      Math,
      collection
        .filter(
          (transaction) => transaction.transactionType === transactionType
        )
        .map((transaction) => new Date(transaction.date).getTime())
    );

    const lastIncomeTransactionDate = Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
    }).format(new Date(lastIncomeTransactionTimestamp));

    return lastIncomeTransactionDate;
  }

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

    setTransactions(transactionsFormatted);

    const lastIncomeTransactionDate = getLastTransactionDate(
      transactionsList,
      "income"
    );
    const lastOutcomeTransactionDate = getLastTransactionDate(
      transactionsList,
      "outcome"
    );

    setHighlightCardData({
      incomes: {
        amount: formatCurrencyBRL(incomesSum),
        lastTransactionDate: lastIncomeTransactionDate,
      },

      outcomes: {
        amount: formatCurrencyBRL(outcomesSum),
        lastTransactionDate: lastOutcomeTransactionDate,
      },

      total: {
        amount: formatCurrencyBRL(incomesSum - outcomesSum),
        lastTransactionDate: "01 a 03 de maio",
      },
    });

    setIsLoading(false);
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
              lastTransactionDate={`Última entrada dia ${highlightCardData.incomes.lastTransactionDate}`}
              type="income"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightCardData.outcomes.amount}
              lastTransactionDate={`Última saída dia ${highlightCardData.outcomes.lastTransactionDate}`}
              type="outcome"
            />
            <HighlightCard
              title="Total"
              amount={highlightCardData.total.amount}
              lastTransactionDate={`01 à ${highlightCardData.outcomes.lastTransactionDate}`}
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
        </>
      )}
    </Container>
  );
}

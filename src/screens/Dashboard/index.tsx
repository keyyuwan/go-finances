import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { TransactionCardProps } from "../../components/TransactionCard";
import { Loading } from "../../components/Loading";
import { HighlightCards } from "./HighlightCards";
import { TransactionsList } from "./TransactionsList";
import { User } from "./User";
import { formatCurrencyBRL } from "../../utils/formatCurrencyBRL";

import { Container, Header } from "./styles";
import { useAuth } from "../../hooks/useAuth";

export interface ListData extends TransactionCardProps {
  id: string;
}

interface HighlightCardDataProps {
  amount: string;
  lastTransaction: string;
}

export interface HighlightCardData {
  incomes: HighlightCardDataProps;
  outcomes: HighlightCardDataProps;
  total: HighlightCardDataProps;
}

export function Dashboard() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<ListData[]>([]);
  const [highlightCardData, setHighlightCardData] = useState<HighlightCardData>(
    {} as HighlightCardData
  );

  function getLastTransactionDate(
    collection: ListData[],
    transactionType: "income" | "outcome"
  ) {
    const collectionFiltered = collection.filter(
      (transaction) => transaction.transactionType === transactionType
    );

    if (collectionFiltered.length === 0) {
      return 0;
    }

    // returns the highest number that represents the most recent transaction date
    const lastIncomeTransactionTimestamp = Math.max.apply(
      Math,
      collectionFiltered.map((transaction) =>
        new Date(transaction.date).getTime()
      )
    );

    const lastIncomeTransactionDate = Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
    }).format(new Date(lastIncomeTransactionTimestamp));

    return lastIncomeTransactionDate;
  }

  async function loadTransactions() {
    const dataKey = `@goFinances:transactions_user:${user.id}`;
    const transactions = await AsyncStorage.getItem(dataKey);
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
    const totalInterval =
      lastOutcomeTransactionDate === 0
        ? "Não há transações"
        : `01 a ${lastOutcomeTransactionDate}`;

    setHighlightCardData({
      incomes: {
        amount: formatCurrencyBRL(incomesSum),
        lastTransaction:
          lastIncomeTransactionDate === 0
            ? "Não há transações"
            : `Última entrada dia ${lastIncomeTransactionDate}`,
      },
      outcomes: {
        amount: formatCurrencyBRL(outcomesSum),
        lastTransaction:
          lastOutcomeTransactionDate === 0
            ? "Não há transações"
            : `Última saída dia ${lastOutcomeTransactionDate}`,
      },
      total: {
        amount: formatCurrencyBRL(incomesSum - outcomesSum),
        lastTransaction: totalInterval,
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
            <User />
          </Header>

          <HighlightCards highlightCardData={highlightCardData} />

          <TransactionsList transactions={transactions} />
        </>
      )}
    </Container>
  );
}

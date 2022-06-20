import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TRANSACTIONS_COLLECTION_NAME } from "../../utils/asyncStorage";
import { categories } from "../../utils/categories";
import { HistoryCard } from "../../components/HistoryCard";

import { Container, Header, Title, Content } from "./styles";

interface TransactionData {
  transactionType: "income" | "outcome";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryTotal {
  key: string;
  name: string;
  total: string;
  color: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryTotal[]>(
    []
  );

  async function loadTransactions() {
    const transactions = await AsyncStorage.getItem(
      TRANSACTIONS_COLLECTION_NAME
    );
    const transactionsList = transactions ? JSON.parse(transactions) : [];

    const outcomes = transactionsList.filter(
      (transaction: TransactionData) =>
        transaction.transactionType === "outcome"
    );

    const totalByCategory: CategoryTotal[] = [];

    categories.forEach((category) => {
      let categoryAmountSum = 0;

      outcomes.forEach((transaction: TransactionData) => {
        if (category.key === transaction.category) {
          categoryAmountSum += Number(transaction.amount);
        }
      });

      if (categoryAmountSum > 0) {
        const total = categoryAmountSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total,
          color: category.color,
        });
      }
    });

    setTotalByCategories(totalByCategory);
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
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        {totalByCategories.map((category) => (
          <HistoryCard
            key={category.key}
            color={category.color}
            title={category.name}
            amount={category.total}
          />
        ))}
      </Content>
    </Container>
  );
}

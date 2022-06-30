import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths } from "date-fns";

import { useAuth } from "../../hooks/useAuth";
import { categories } from "../../utils/categories";
import { Loading } from "../../components/Loading";
import { Header } from "../../components/Header";
import { MonthSelect } from "./MonthSelect";
import { PieChart } from "./PieChart";
import { HistoryCards } from "./HistoryCards";

import { Container, Content, ChartContainer } from "./styles";

interface TransactionData {
  transactionType: "income" | "outcome";
  name: string;
  amount: string;
  category: string;
  date: string;
}

export interface CategoryTotal {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percentage: string;
}

export function Resume() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [totalByCategories, setTotalByCategories] = useState<CategoryTotal[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleDateChange(action: "prev" | "next") {
    if (action === "prev") {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadTransactions() {
    setIsLoading(true);

    const dataKey = `@goFinances:transactions_user:${user.id}`;
    const transactions = await AsyncStorage.getItem(dataKey);
    const transactionsList = transactions ? JSON.parse(transactions) : [];

    const outcomes = transactionsList.filter(
      (transaction: TransactionData) =>
        transaction.transactionType === "outcome" &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
    );

    const outcomesTotal = outcomes.reduce(
      (acc: number, outcome: TransactionData) => {
        return acc + Number(outcome.amount);
      },
      0
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

        const percentage = `${(
          (categoryAmountSum / outcomesTotal) *
          100
        ).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          totalFormatted: total,
          total: categoryAmountSum,
          color: category.color,
          percentage,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header title="Resumo por categoria" />

      {isLoading ? (
        <Loading />
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: useBottomTabBarHeight(),
            paddingHorizontal: 24,
          }}
        >
          <MonthSelect
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />

          <ChartContainer>
            <PieChart totalByCategories={totalByCategories} />
          </ChartContainer>

          <HistoryCards totalByCategories={totalByCategories} />
        </Content>
      )}
    </Container>
  );
}

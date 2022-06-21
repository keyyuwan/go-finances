import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TRANSACTIONS_COLLECTION_NAME } from "../../utils/asyncStorage";
import { categories } from "../../utils/categories";
import { HistoryCard } from "../../components/HistoryCard";
import { Loading } from "../../components/Loading";
import { Header } from "../../components/Header";

import {
  Container,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from "./styles";

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
  total: number;
  totalFormatted: string;
  color: string;
  percentage: string;
}

export function Resume() {
  const theme = useTheme();

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

    const transactions = await AsyncStorage.getItem(
      TRANSACTIONS_COLLECTION_NAME
    );
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
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange("prev")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percentage"
              y="total"
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
            />
          </ChartContainer>

          {totalByCategories.map((category) => (
            <HistoryCard
              key={category.key}
              color={category.color}
              title={category.name}
              amount={category.totalFormatted}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}

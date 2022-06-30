import React from "react";

import { HighlightCardData } from "..";
import { HighlightCard } from "../../../components/HighlightCard";

import { Container } from "./styles";

interface HighlightCardsProps {
  highlightCardData: HighlightCardData;
}

export function HighlightCards({ highlightCardData }: HighlightCardsProps) {
  return (
    <Container>
      <HighlightCard
        title="Entradas"
        amount={highlightCardData.incomes.amount}
        lastTransactionDate={highlightCardData.incomes.lastTransaction}
        type="income"
      />
      <HighlightCard
        title="Saídas"
        amount={highlightCardData.outcomes.amount}
        lastTransactionDate={highlightCardData.outcomes.lastTransaction}
        type="outcome"
      />
      <HighlightCard
        title="Total"
        amount={highlightCardData.total.amount}
        lastTransactionDate={highlightCardData.total.lastTransaction}
        type="total"
      />
    </Container>
  );
}

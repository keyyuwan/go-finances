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
    </Container>
  );
}

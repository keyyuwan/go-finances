import React from "react";

import { CategoryTotal } from "..";
import { HistoryCard } from "../../../components/HistoryCard";

interface HistoryCardsProps {
  totalByCategories: CategoryTotal[];
}

export function HistoryCards({ totalByCategories }: HistoryCardsProps) {
  return (
    <>
      {totalByCategories.map((category) => (
        <HistoryCard
          key={category.key}
          color={category.color}
          title={category.name}
          amount={category.totalFormatted}
        />
      ))}
    </>
  );
}

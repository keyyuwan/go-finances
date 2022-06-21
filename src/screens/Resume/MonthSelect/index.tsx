import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Container, MonthSelectButton, MonthSelectIcon, Month } from "./styles";

interface MonthSelectProps {
  selectedDate: Date;
  handleDateChange: (action: "prev" | "next") => void;
}

export function MonthSelect({
  selectedDate,
  handleDateChange,
}: MonthSelectProps) {
  return (
    <Container>
      <MonthSelectButton onPress={() => handleDateChange("prev")}>
        <MonthSelectIcon name="chevron-left" />
      </MonthSelectButton>

      <Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</Month>

      <MonthSelectButton onPress={() => handleDateChange("next")}>
        <MonthSelectIcon name="chevron-right" />
      </MonthSelectButton>
    </Container>
  );
}

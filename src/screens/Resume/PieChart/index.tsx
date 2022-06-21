import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";

import { CategoryTotal } from "../index";

interface PieChartProps {
  totalByCategories: CategoryTotal[];
}

export function PieChart({ totalByCategories }: PieChartProps) {
  const theme = useTheme();

  return (
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
  );
}

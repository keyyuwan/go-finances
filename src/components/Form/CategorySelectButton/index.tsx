import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Category, Icon } from "./styles";

interface CategorySelectButtonProps extends RectButtonProps {
  title: string;
}

export function CategorySelectButton({
  title,
  ...rest
}: CategorySelectButtonProps) {
  return (
    <Container {...rest}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}

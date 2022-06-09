import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextInputProps } from "react-native";

import { Input } from "../Input";

import { Container, Error } from "./styles";

interface ControlledInputProps extends TextInputProps {
  control: Control;
  name: string;
  error: string;
}

export function ControlledInput({
  control,
  name,
  error,
  ...rest
}: ControlledInputProps) {
  return (
    <Container>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input value={value} onChangeText={onChange} {...rest} />
        )}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}

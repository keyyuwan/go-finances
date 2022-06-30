import React, { useState } from "react";
import { Modal, Keyboard, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../hooks/useAuth";
import { Header } from "../../components/Header";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { ControlledInput } from "../../components/Form/ControlledInput";
import { CategorySelect } from "../CategorySelect";
import { TRANSACTIONS_COLLECTION_NAME } from "../../utils/asyncStorage";

import { Container, Form, Fields, TransactionTypes } from "./styles";

interface NavigationProps {
  navigate: (name: string) => void;
}

interface FormData {
  name: string;
  amount: number;
}

type TransactionType = "income" | "outcome" | "";

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Preço deve ser um número")
    .positive("Preço deve ser um valor positivo")
    .required("Preço é obrigatório"),
});

export function Register() {
  const { user } = useAuth();

  const [transactionType, setTransactionType] = useState<TransactionType>("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: "income" | "outcome") {
    setTransactionType(type);
  }

  function handleCloseCategorySelect() {
    setCategoryModalOpen(false);
  }

  function handleOpenCategorySelect() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: Partial<FormData>) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }

    if (category.key === "category") {
      return Alert.alert("Selecione uma categoria");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const dataKey = `@goFinances:transactions_user:${user.id}`;
      const transactions = await AsyncStorage.getItem(dataKey);
      const currentTransactions = transactions ? JSON.parse(transactions) : [];

      const transactionsWithTheNewOne = [
        ...currentTransactions,
        newTransaction,
      ];

      await AsyncStorage.setItem(
        dataKey,
        JSON.stringify(transactionsWithTheNewOne)
      );

      resetFields();

      navigation.navigate("Listagem");
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível salvar");
    }
  }

  function resetFields() {
    reset();
    setTransactionType("");
    setCategory({
      key: "category",
      name: "Categoria",
    });
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={{ height: "100%" }}
    >
      <Container>
        <Header title="Cadastro" />

        <Form>
          <Fields>
            <ControlledInput
              placeholder="Nome"
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <ControlledInput
              placeholder="Preço"
              name="amount"
              control={control}
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                title="Income"
                type="income"
                isActive={transactionType === "income"}
                onPress={() => handleTransactionTypeSelect("income")}
              />
              <TransactionTypeButton
                title="Outcome"
                type="outcome"
                isActive={transactionType === "outcome"}
                onPress={() => handleTransactionTypeSelect("outcome")}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenCategorySelect}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            onCloseCategorySelect={handleCloseCategorySelect}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

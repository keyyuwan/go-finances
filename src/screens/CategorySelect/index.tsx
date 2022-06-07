import React from "react";
import { FlatList } from "react-native";

import { Button } from "../../components/Form/Button";
import { categories } from "../../utils/categories";

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Divider,
  Footer,
} from "./styles";

interface Category {
  key: string;
  name: string;
}

interface CategorySelectProps {
  category: Category;
  setCategory: (category: Category) => void;
  onCloseCategorySelect: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  onCloseCategorySelect,
}: CategorySelectProps) {
  function handleCategorySelect(category: Category) {
    setCategory(category);
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        style={{ flex: 1, width: "100%" }}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      <Footer>
        <Button title="Selecionar" onPress={onCloseCategorySelect} />
      </Footer>
    </Container>
  );
}

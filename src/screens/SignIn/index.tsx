import React from "react";
import { Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import GoogleSvg from "../../assets/google.svg";
import AppleSvg from "../../assets/apple.svg";
import LogoSvg from "../../assets/logo.svg";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/useAuth";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

export function SignIn() {
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    await signInWithGoogle();
    try {
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível conectar a sua conta Google :(");
    }
  }

  async function handleSignInWithApple() {
    await signInWithApple();
    try {
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível conectar a sua conta Apple :(");
    }
  }

  const isIos = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas {"\n"}
            finanças de forma {"\n"}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          {isAndroid
            ? "Faça seu login com Google"
            : `Faça seu login com ${"\n"}
          uma das contas abaixo`}
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {isIos && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>
      </Footer>
    </Container>
  );
}

import React, { useState } from "react";
import { Alert, Platform, ActivityIndicator } from "react-native";
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
import theme from "../../global/styles/theme";

export function SignIn() {
  const { signInWithGoogle, signInWithApple } = useAuth();

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleSignInWithGoogle() {
    setIsAuthenticating(true);

    try {
      return await signInWithGoogle();
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível conectar a sua conta Google :(");
      setIsAuthenticating(false);
    }
  }

  async function handleSignInWithApple() {
    setIsAuthenticating(true);

    try {
      return await signInWithApple();
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível conectar a sua conta Apple :(");
      setIsAuthenticating(false);
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

        {isAuthenticating ? (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        ) : null}
      </Footer>
    </Container>
  );
}

import React, { useCallback } from "react";
import { View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { useAuth0 } from "react-native-auth0";
import * as SecureStore from "expo-secure-store";

const SignInScreen = () => {
  const { authorize, user, getCredentials, isLoading } = useAuth0();

  const onLogin = useCallback(async () => {
    try {
      await authorize();
      const { idToken } = await getCredentials();
      await SecureStore.setItemAsync("idToken", idToken);
    } catch (e) {
      console.log(e);
    }
  }, [user, isLoading]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        maxHeight: 140,
      }}
    >
      <Text category="h1">Rider</Text>
      <Button onPress={onLogin}>Log In</Button>
    </View>
  );
};

export default SignInScreen;

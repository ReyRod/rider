import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { Layout, Text } from "@ui-kitten/components";
import ApiClient from "../api/client";
import getUser from "../api/queries/getUser";
import SignInScreen from "./auth/login";
import MapScreen from "./dashboard/map";
import useUserStore from "../store/user";

const AppLayout = () => {
  const { user, isLoading } = useAuth0();
  const { setUser } = useUserStore();

  const getUserInfo = async (user) => {
    try {
      const response = await ApiClient.query({
        query: getUser,
        variables: { id: user.sub },
      });
      setUser(response.data.users_by_pk);
    } catch (e) {
      console.log("Error getting user info", e);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      getUserInfo(user);
    }
  }, [isLoading, user]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Layout style={styles.layout}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : !user ? (
          <SignInScreen />
        ) : (
          <MapScreen />
        )}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppLayout;

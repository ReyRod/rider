import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Dimensions, View, Alert } from "react-native";
import { Layout, Button, Text } from "@ui-kitten/components";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth0 } from "react-native-auth0";
import ApiClient from "../../api/client";
import createSession from "../../api/mutations/createSession";
import useUserStore from "../../store/user";
import updateSession from "../../api/mutations/updateSession";
import orders from "../../api/subscriptions/orders";
import createUserGeolocation from "../../api/mutations/createUserGeolocation";
import Counter from "./counter";

const LOCATION_TASK_NAME = "background-location-task";

const UserLocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { user, clearUser } = useUserStore();
  const { clearSession } = useAuth0();

  const onSessionToggle = async () => {
    setIsLoading(true);
    try {
      if (!isSessionActive) {
        const start = new Date();
        const result = await ApiClient.mutate({
          mutation: createSession,
          variables: {
            start: new Date(),
            user_id: user.id,
          },
        });
        setSessionId(result.data.insert_sessions_one.id);
        setIsSessionActive(true);
        setSessionStart(start);
      } else {
        await ApiClient.mutate({
          mutation: updateSession,
          variables: {
            id: sessionId,
            end: new Date(),
          },
        });
        setIsSessionActive(false);
        setSessionStart(null);
      }
    } catch (e) {
      console.log("error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const onLogout = async () => {
    setIsLoading(true);
    try {
      await clearSession();
      clearUser();
    } catch (e) {
      console.log("Log out cancelled");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe;

    async function subscribe() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      unsubscribe = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    }

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe.remove();
      }
    };
  }, []);

  useEffect(() => {
    let subscribeToOrders;

    const subscribe = async () => {
      if (isSessionActive) {
        subscribeToOrders = ApiClient.subscribe({
          query: orders,
        }).subscribe({
          next(response) {
            console.log("response", response);
            if (response.data.orders && response.data.orders.length > 0) {
              Alert.alert("New Order", "You have a new order!");
            }
          },
          error(err) {
            console.error("Error subscribing to orders:", err);
          },
        });
      }
    };

    subscribe();

    return () => {
      if (subscribeToOrders) {
        subscribeToOrders.unsubscribe();
      }
    };
  }, [isSessionActive]);

  const updateLocation = async () => {
    try {
      await ApiClient.mutate({
        mutation: createUserGeolocation,
        variables: {
          geolocation: `(${location.latitude}, ${location.longitude})`,
          user_id: user.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location && user) {
      updateLocation();
    }
  }, [user, location]);

  return (
    <Layout style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location ? location.latitude : 37.78825,
            longitude: location ? location.longitude : -122.4324,
            latitudeDelta: 0.01, // Increase the value for more zoom
            longitudeDelta: 0.01, // Increase the value for more zoom
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          )}
        </MapView>
      )}
      {!!user && <Button style={styles.badge}>Rey</Button>}
      <View style={styles.footer}>
        <Button onPress={onSessionToggle} disabled={isLoading}>
          {isSessionActive ? "End Session" : "Start Session"}
        </Button>
        {sessionStart && <Counter sessionStart={sessionStart} />}
        <Button onPress={onLogout} disabled={isLoading || isSessionActive}>
          Log Out
        </Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 20,
    borderRadius: 100,
    width: 50,
    height: 50,
    padding: 0,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 10,
  },
});

export default UserLocationScreen;

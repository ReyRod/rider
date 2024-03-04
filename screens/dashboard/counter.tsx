import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@ui-kitten/components";

const TimerComponent = ({ sessionStart }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMilliseconds = now - sessionStart;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      setElapsedTime(elapsedSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStart]);

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <View
      style={{
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        minWidth: 65,

        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
        }}
      >
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>
    </View>
  );
};

export default TimerComponent;

// components/FloatingButton.tsx

import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FloatingButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/add-product")}
    >
      <MaterialIcons
        name="add"
        size={30}
        color="#fff"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
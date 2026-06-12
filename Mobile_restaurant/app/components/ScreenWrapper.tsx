import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: React.ReactNode;
};

export default function ScreenWrapper({ children }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    container: {
        flex: 1,
        paddingHorizontal: 12,
    },
});
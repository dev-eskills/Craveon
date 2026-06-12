import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

import { getProductsByRestaurant } from "../services/product";
import { useAuthStore } from "../store/authStore";
import ScreenWrapper from "../components/ScreenWrapper";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function Products() {
    const authUser = useAuthStore((state) => state.user);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (authUser?.id) {
                loadProducts(authUser.id);
            }
        }, [authUser?.id])
    );

    const loadProducts = async (restaurantId: string) => {
        try {
            setLoading(true);

            const res = await getProductsByRestaurant(restaurantId);

            setProducts(res.data); // API: { success, count, data }
        } catch (error) {
            console.log("LOAD PRODUCTS ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading menu...</Text>
            </View>
        );
    }

    return (
        <ScreenWrapper>
            {/* 🔥 HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>🍽️ Menu</Text>

                <Text style={styles.subtitle}>
                    Fresh food made just for you
                </Text>

                <View style={styles.metaRow}>
                    <Text style={styles.meta}>
                        🧾 Items: {products.length}
                    </Text>

                    <Text style={styles.meta}>
                        ⚡ Fast Delivery
                    </Text>
                </View>
            </View>

            {/* PRODUCTS */}
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>

                        {/* IMAGE */}
                        <View style={styles.imageWrap}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />

                            {/* VEG INDICATOR */}
                            <View
                                style={[
                                    styles.vegDot,
                                    {
                                        backgroundColor: item.isVeg
                                            ? "green"
                                            : "red",
                                    },
                                ]}
                            />

                            {/* CATEGORY */}
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {item.category?.name}
                                </Text>
                            </View>
                        </View>

                        {/* CONTENT */}
                        <View style={styles.content}>
                            <Text style={styles.name} numberOfLines={1}>
                                {item.name}
                            </Text>

                            <Text style={styles.desc} numberOfLines={2}>
                                {item.description}
                            </Text>

                            <View style={styles.bottomRow}>
                                <View>
                                    <Text style={styles.price}>
                                        ₹{item.discountedPrice}
                                    </Text>

                                    {item.price !==
                                        item.discountedPrice && (
                                            <Text style={styles.oldPrice}>
                                                ₹{item.price}
                                            </Text>
                                        )}
                                </View>

                                <View style={styles.metaRight}>
                                    <Text style={styles.time}>
                                        ⏱ {item.preparationTime} min
                                    </Text>

                                    <Text style={styles.rating}>
                                        ⭐ {item.ratings?.average || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        color: "#666",
    },

    header: {
        marginBottom: 12,
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#111",
    },

    subtitle: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },

    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    meta: {
        fontSize: 12,
        color: "#444",
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },

    imageWrap: {
        position: "relative",
    },

    image: {
        width: "100%",
        height: 180,
    },

    vegDot: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#fff",
    },

    categoryBadge: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    categoryText: {
        color: "#fff",
        fontSize: 11,
    },

    content: {
        padding: 12,
    },

    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },

    desc: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        alignItems: "flex-end",
    },

    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },

    oldPrice: {
        fontSize: 12,
        color: "#999",
        textDecorationLine: "line-through",
    },

    metaRight: {
        alignItems: "flex-end",
    },

    time: {
        fontSize: 11,
        color: "#777",
    },

    rating: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#ff9800",
        marginTop: 2,
    },
});
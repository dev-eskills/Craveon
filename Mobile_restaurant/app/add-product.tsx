import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Switch,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

import ScreenWrapper from "./components/ScreenWrapper";

import { createProduct } from "@/app/services/product";
import { useAuthStore } from "../app/store/authStore";

import { useCategories } from "@/app/hooks/useCategories";
import { useCategoryStore } from "@/app/store/category";

type ProductForm = {
    name: string;
    description: string;
    category: string;
    price: string;
    discountedPrice: string;
    image: any;
    isVeg: boolean;
    isAvailable: boolean;
    featured: boolean;
    preparationTime: string;
    attributes: Attribute[];
    addons: Addon[];
    tags: string[];
};

type Option = {
    name: string;
    price: number;
};

type Attribute = {
    name: string;
    options: Option[];
};

type Addon = {
    name: string;
    price: number;
    isVeg: boolean;
};

const Card = ({
    title,
    children,
}: any) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>
            {title}
        </Text>
        {children}
    </View>
);

export default function AddProduct() {

    const authUser =
        useAuthStore(
            (s) => s.user
        );

    const {
        data,
        isLoading,
    } = useCategories();

    const {
        selectedCategory,
        setSelectedCategory,
    } = useCategoryStore();

    const responseData = data as any;
    const categories = Array.isArray(data)
        ? data
        : Array.isArray(responseData?.data)
            ? responseData.data
            : Array.isArray(responseData?.data?.categories)
                ? responseData.data.categories
                : [];

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] =
        useState<ProductForm>({
            name: "",
            description: "",
            category: "",
            price: "",
            discountedPrice: "",
            image: null,
            isVeg: true,
            isAvailable: true,
            featured: false,
            preparationTime: "",
            attributes: [],
            addons: [],
            tags: [],
        });

    const update = (
        key: keyof ProductForm,
        value: any
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const addVariant = () => {

        setForm(prev => ({

            ...prev,

            attributes: [
                ...prev.attributes,
                {
                    name: "",
                    options: []
                }
            ]

        }));

    };

    const removeVariant = (index: number) => {

        setForm(prev => ({

            ...prev,

            attributes:
                prev.attributes.filter(
                    (_, i) => i !== index
                )

        }));

    };

    const addOption = (index: number) => {

        const copy =
            [...form.attributes];


        copy[index].options.push({
            name: "",
            price: 0
        });


        setForm(prev => ({
            ...prev,
            attributes: copy
        }));

    };



    const addAddon = () => {

        setForm(prev => ({

            ...prev,

            addons: [
                ...prev.addons,
                {
                    name: "",
                    price: 0,
                    isVeg: true
                }
            ]

        }));

    };

    const removeAddon = (index: number) => {

        setForm(prev => ({

            ...prev,

            addons:
                prev.addons.filter(
                    (_, i) => i !== index
                )

        }));

    };

    const pickImage =
        async () => {
            const result =
                await ImagePicker.launchImageLibraryAsync(
                    {
                        mediaTypes:
                            ImagePicker.MediaTypeOptions.Images,

                        allowsEditing:
                            true,

                        quality:
                            0.8,
                    }
                );

            if (
                result.canceled
            )
                return;

            update(
                "image",
                result.assets[0]
            );
        };

    const validate =
        () => {
            if (
                !form.name
            )
                return "Enter product name";

            if (
                !form.description
            )
                return "Enter description";

            if (
                !selectedCategory
            )
                return "Select category";

            if (
                !form.price
            )
                return "Enter price";

            return null;
        };


    const handleSubmit = async () => {
        try {
            if (!form.name.trim()) {
                return Alert.alert(
                    "Validation",
                    "Enter product name"
                );
            }

            if (!form.description.trim()) {
                return Alert.alert(
                    "Validation",
                    "Enter description"
                );
            }

            if (!selectedCategory?._id) {
                return Alert.alert(
                    "Validation",
                    "Select category"
                );
            }

            if (!authUser?.id) {
                return Alert.alert(
                    "Validation",
                    "Restaurant not found"
                );
            }
            if (!form.image) {

                return Alert.alert(
                    "Validation",
                    "Select product image"
                )

            }
            setLoading(true);

            const fd = new FormData();

            fd.append("name", form.name);

            fd.append(
                "description",
                form.description
            );

            fd.append(
                "category",
                selectedCategory._id
            );

            fd.append(
                "restaurant",
                authUser.id
            );

            fd.append(
                "price",
                String(
                    Number(form.price)
                )
            );

            fd.append(
                "discountedPrice",
                String(
                    Number(
                        form.discountedPrice ||
                        form.price
                    )
                )
            );

            fd.append(
                "isVeg",
                String(form.isVeg)
            );

            fd.append(
                "isAvailable",
                String(
                    form.isAvailable
                )
            );

            fd.append(
                "featured",
                String(
                    form.featured
                )
            );

            fd.append(
                "preparationTime",
                form.preparationTime
            );

            fd.append(
                "tags",
                JSON.stringify(
                    form.tags
                )
            );

            fd.append(
                "attributes",
                JSON.stringify(
                    form.attributes
                )
            );


            fd.append(
                "addons",
                JSON.stringify(
                    form.addons
                )
            );

            // if (form.image) {
            //     fd.append(
            //         "image",
            //         {
            //             uri:
            //                 form.image.uri,

            //             type:
            //                 form.image.mimeType ||
            //                 "image/jpeg",

            //             name:
            //                 form.image.fileName ||
            //                 "product.jpg",
            //         } as any
            //     );
            // }

            if (form.image) {

                fd.append(
                    "image",
                    {
                        uri: form.image.uri,

                        type:
                            form.image.mimeType ??
                            "image/jpeg",

                        name:
                            form.image.fileName ??
                            "product.jpg"

                    } as any
                )

            }

            const res =
                await createProduct(
                    fd
                );

            console.log(
                "PRODUCT CREATED",
                res
            );

            Alert.alert(
                "Success",
                "Product created"
            );

            setForm({
                name: "",
                description: "",
                category: "",
                price: "",
                discountedPrice: "",
                image: null,
                isVeg: true,
                isAvailable: true,
                featured: false,
                preparationTime: "15",
                attributes: [],
                addons: [],
                tags: [],
            });

            setSelectedCategory(
                null
            );

        } catch (
        err: any
        ) {
            console.log(
                "CREATE ERROR",
                err?.response
                    ?.data
            );

            Alert.alert(
                "Error",
                err?.response
                    ?.data
                    ?.message ||
                "Failed to create product"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView
                style={
                    styles.container
                }
            >
                <View style={styles.header}>

                    <View>
                        <Text style={styles.title}>
                            Add Product
                        </Text>

                        <Text style={styles.subtitle}>
                            Create your restaurant menu item
                        </Text>
                    </View>


                </View>

                <Card title="Basic">

                    <TextInput
                        placeholder="Name"
                        style={
                            styles.input
                        }
                        value={
                            form.name
                        }
                        onChangeText={(
                            t
                        ) =>
                            update(
                                "name",
                                t
                            )
                        }
                    />

                    <TextInput
                        multiline
                        placeholder="Description"
                        style={[
                            styles.input,
                            {
                                height: 100,
                            },
                        ]}
                        value={
                            form.description
                        }
                        onChangeText={(
                            t
                        ) =>
                            update(
                                "description",
                                t
                            )
                        }
                    />

                </Card>

                <Card title="Category">

                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View
                            style={
                                styles.picker
                            }
                        >
                            <Picker
                                selectedValue={form.category}
                                onValueChange={(value) => {
                                    update("category", value);

                                    const selected =
                                        categories.find(
                                            (cat: any) =>
                                                cat._id === value
                                        );

                                    setSelectedCategory(
                                        selected || null
                                    );
                                }}
                            >
                                <Picker.Item
                                    label="Select Category"
                                    value=""
                                />
                                {categories.map(
                                    (item: any) => (
                                        <Picker.Item
                                            key={item._id}
                                            label={item.name}
                                            value={item._id}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>
                    )}
                </Card>

                <Card title="Pricing">

                    <TextInput
                        style={
                            styles.input
                        }
                        placeholder="Price"
                        keyboardType="numeric"
                        value={
                            form.price
                        }
                        onChangeText={(
                            t
                        ) =>
                            update(
                                "price",
                                t
                            )
                        }
                    />

                    <TextInput
                        style={
                            styles.input
                        }
                        placeholder="Discount"
                        keyboardType="numeric"
                        value={
                            form.discountedPrice
                        }
                        onChangeText={(
                            t
                        ) =>
                            update(
                                "discountedPrice",
                                t
                            )
                        }
                    />

                </Card>

                <Card title="Preparation Time">
                    <TextInput
                        style={styles.input}
                        placeholder="Preparation time (minutes)"
                        keyboardType="numeric"
                        value={form.preparationTime}
                        onChangeText={(t) =>
                            update(
                                "preparationTime",
                                t
                            )
                        }
                    />
                    <Text style={{
                        color: "#666",
                        marginTop: 5
                    }}>
                        Example: 15 min
                    </Text>
                </Card>
                <Card title="Variants or Sizes">
                    <TouchableOpacity
                        onPress={addVariant}
                    >
                        <Text style={styles.add}>
                            + New variant or size
                        </Text>
                    </TouchableOpacity>
                    {
                        form.attributes.map((item, index) => (
                            <View key={index}>
                                <TextInput
                                    placeholder="Variant name"
                                    style={styles.input}
                                    value={item.name}
                                    onChangeText={(t) => {
                                        let copy =
                                            [...form.attributes];

                                        copy[index].name = t;
                                        setForm({
                                            ...form,
                                            attributes: copy
                                        });
                                    }}

                                />
                                <TouchableOpacity
                                    onPress={() => removeVariant(index)}
                                >
                                    <Text style={{
                                        color: "red",
                                        fontWeight: "700"
                                    }}>
                                        Remove Variant
                                    </Text>
                                </TouchableOpacity>
                                {
                                    item.options.map((op, i) => (
                                        <View key={i}>
                                            <TextInput
                                                placeholder="Size name"
                                                style={styles.input}
                                                value={op.name}
                                                onChangeText={(t) => {
                                                    let copy =
                                                        [...form.attributes];
                                                    copy[index]
                                                        .options[i]
                                                        .name = t;
                                                    setForm({
                                                        ...form,
                                                        attributes: copy
                                                    });
                                                }}
                                            />
                                            <TextInput
                                                placeholder="Price"
                                                keyboardType="numeric"
                                                style={styles.input}
                                                onChangeText={(t) => {

                                                    let copy =
                                                        [...form.attributes];


                                                    copy[index]
                                                        .options[i]
                                                        .price =
                                                        Number(t);


                                                    setForm({
                                                        ...form,
                                                        attributes: copy
                                                    });

                                                }}
                                            />
                                        </View>
                                    ))
                                }
                                <TouchableOpacity
                                    onPress={() => addOption(index)}
                                >
                                    <Text style={styles.add}>
                                        + Add size
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </Card>

                <Card title="Image">
                    <TouchableOpacity
                        style={
                            styles.image
                        }
                        onPress={
                            pickImage
                        }
                    >
                        <Text>
                            {form.image
                                ? "✓ Selected"
                                : "Select Image"}
                        </Text>
                    </TouchableOpacity>
                </Card>

                <Card title="Add-ons">
                    <TouchableOpacity
                        onPress={addAddon}
                    >
                        <Text style={styles.add}>
                            + Add Item
                        </Text>
                    </TouchableOpacity>

                    {
                        form.addons.map((item, index) => (
                            <View key={index}>
                                <TextInput
                                    placeholder="Add-on name"
                                    style={styles.input}
                                    value={item.name}
                                    onChangeText={(t) => {
                                        let copy =
                                            [...form.addons];

                                        copy[index].name = t;
                                        setForm({
                                            ...form,
                                            addons: copy
                                        });
                                    }}
                                />

                                <TouchableOpacity
                                    onPress={() => removeAddon(index)}
                                >
                                    <Text style={{
                                        color: "red",
                                        fontWeight: "700"
                                    }}>
                                        Remove Add-on
                                    </Text>
                                </TouchableOpacity>

                                <TextInput
                                    placeholder="₹ Price"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    onChangeText={(t) => {
                                        let copy =
                                            [...form.addons];
                                        copy[index].price =
                                            Number(t);
                                        setForm({
                                            ...form,
                                            addons: copy
                                        });
                                    }}
                                />

                                <View style={styles.row}>
                                    <Text>
                                        Vegetarian
                                    </Text>
                                    <Switch
                                        value={item.isVeg}
                                        onValueChange={(v) => {
                                            let copy =
                                                [...form.addons];

                                            copy[index].isVeg = v;
                                            setForm({
                                                ...form,
                                                addons: copy
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        ))
                    }
                </Card>

                <Card title="Settings">

                    <View style={styles.row}>

                        <Text>
                            Featured
                        </Text>

                        <Switch
                            value={form.featured}

                            onValueChange={(v) =>
                                update("featured", v)
                            }

                        />

                    </View>

                    <View
                        style={
                            styles.row
                        }
                    >
                        <Text>
                            Veg
                        </Text>

                        <Switch
                            value={
                                form.isVeg
                            }
                            onValueChange={(
                                v
                            ) =>
                                update(
                                    "isVeg",
                                    v
                                )
                            }
                        />
                    </View>

                    <View
                        style={
                            styles.row
                        }
                    >
                        <Text>
                            Available
                        </Text>

                        <Switch
                            value={
                                form.isAvailable
                            }
                            onValueChange={(
                                v
                            ) =>
                                update(
                                    "isAvailable",
                                    v
                                )
                            }
                        />
                    </View>

                </Card>
                <Card title="Tags">

                    <TextInput
                        placeholder="pizza, spicy, cheese"
                        style={styles.input}

                        onChangeText={(t) => {

                            setForm(prev => ({

                                ...prev,

                                tags:
                                    t.split(",")
                                        .map(x => x.trim())

                            }));

                        }}

                    />

                </Card>

                <TouchableOpacity
                    style={
                        styles.button
                    }
                    onPress={
                        handleSubmit
                    }
                    disabled={
                        loading
                    }
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            Save Product
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F6F7FB",
            padding: 16,
        },
        header: {
            marginBottom: 20,
        },

        subtitle: {
            color: "#777",
            marginTop: 4,
        },
        title: {
            fontSize: 28,
            fontWeight:
                "800",
            marginBottom: 20,
        },

        card: {
            backgroundColor:
                "#fff",

            padding: 16,

            borderRadius: 16,

            marginBottom: 16,
        },

        cardTitle: {
            fontWeight:
                "700",

            marginBottom: 10,
        },

        input: {

            backgroundColor: "#fff",

            borderWidth: 1,

            borderColor: "#e5e7eb",

            paddingHorizontal: 15,

            height: 52,

            borderRadius: 14,

            marginBottom: 12,

            fontSize: 15

        },

        picker: {
            borderRadius: 12,

            overflow:
                "hidden",
        },

        image: {
            height: 150,

            borderRadius: 12,

            backgroundColor:
                "#E5E7EB",

            justifyContent:
                "center",

            alignItems:
                "center",
        },
        add: {
            color: "#FF6900",
            fontWeight: "700",
            marginBottom: 10
        },

        row: {
            flexDirection:
                "row",

            justifyContent:
                "space-between",

            marginVertical: 10,
        },

        button: {
            backgroundColor:
                "#FF6900",

            padding: 16,

            borderRadius: 14,

            alignItems:
                "center",

            marginBottom: 40,
        },

        buttonText: {
            color: "#fff",

            fontWeight:
                "700",
        },
    });
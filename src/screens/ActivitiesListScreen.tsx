import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Activity } from "../models/Activity";
import { fetchActivities } from "../services/activityService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "ActivitiesList">;

export default function ActivitiesListScreen({ navigation }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchActivities();
      setActivities(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ActivitiesMap")}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  title: { fontSize: 18, fontWeight: "bold" },
});
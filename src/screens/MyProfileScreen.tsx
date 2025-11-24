import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { fetchUserActivities } from "../services/activityService";
import { Activity } from "../models/Activity";
import { auth } from "../firebase/config";

export default function MyProfileScreen() {
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      fetchUserActivities(userId).then(data => setMyActivities(data));
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Omat luodut aktiviteetit</Text>
      <FlatList
        data={myActivities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" }
});
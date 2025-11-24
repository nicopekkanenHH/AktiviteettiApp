import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Activity } from "../models/Activity";
import { fetchActivities } from "../services/activityService";
import * as Location from "expo-location";

export default function ActivitiesMapScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchActivities();
        setActivities(data);
      } catch (error: any) {
        Alert.alert("Virhe", error.message || "Aktiviteettien haku epäonnistui.");
      }
    };
    load();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Virhe", "Sijaintilupaa ei myönnetty!");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  const isNearby = (activityLocation: { latitude: number; longitude: number }) => {
    if (!userLocation) return false;
    const dx = activityLocation.latitude - userLocation.latitude;
    const dy = activityLocation.longitude - userLocation.longitude;
    const distanceKm = Math.sqrt(dx * dx + dy * dy) * 111; // approx conversion
    return distanceKm <= 5; // 5 km radius
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 60.1699,
          longitude: userLocation ? userLocation.longitude : 24.9384,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
      >
        {activities.map((act) => (
          <Marker
            key={act.id}
            coordinate={{
              latitude: act.location.latitude,
              longitude: act.location.longitude
            }}
            title={act.name}
            description={act.category}
            pinColor={isNearby(act.location) ? "blue" : "red"}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});
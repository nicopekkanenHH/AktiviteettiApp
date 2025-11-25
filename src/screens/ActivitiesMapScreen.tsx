import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Text } from "react-native";
import MapView, { Marker, Callout, Region } from "react-native-maps";
import * as Location from "expo-location";

import { fetchActivities } from "services/activityService";
import { Activity } from "models/Activity";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "ActivitiesMap">;

const ActivitiesMapScreen: React.FC<Props> = ({ navigation }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchActivities();
        setActivities(data);
      } catch (error: any) {
        Alert.alert("Virhe", error?.message || "Tietojen haku epäonnistui.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const region: Region = {
    latitude: userLocation ? userLocation.latitude : 60.1699,
    longitude: userLocation ? userLocation.longitude : 24.9384,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Ladataan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MapView style={styles.map} initialRegion={region}>
        {activities.map((act) => (
          <Marker
            key={act.id}
            coordinate={{
              latitude: act.location.latitude,
              longitude: act.location.longitude,
            }}
            title={act.name}
          >
            <Callout
              onPress={() =>
                navigation.navigate("ActivityDetails", {
                  activityId: act.id,
                })
              }
            >
              <View style={{ width: 150 }}>
                <Text style={{ fontWeight: "bold" }}>{act.name}</Text>
                <Text>{act.category}</Text>
                <Text style={{ color: "blue", marginTop: 6 }}>
                  Näytä tiedot →
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ActivitiesMapScreen;

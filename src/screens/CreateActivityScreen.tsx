// src/screens/CreateActivityScreen.tsx

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

import {
  createActivity,
  getActivityById,
  updateActivity,
} from "services/activityService";

import { Picker } from "@react-native-picker/picker";
import { Activity } from "models/Activity";

import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "components/theme";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "CreateActivity">;

const CreateActivityScreen: React.FC<Props> = ({ navigation, route }) => {
  const activityId = route.params && "activityId" in route.params
    ? route.params.activityId
    : null;

  const presetLat =
    route.params && "latitude" in route.params ? route.params.latitude : null;

  const presetLon =
    route.params && "longitude" in route.params ? route.params.longitude : null;

  const isEditing = !!activityId;

  // FORM STATE
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("liikunta");
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: presetLat ?? null,
    longitude: presetLon ?? null,
  });

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [loading, setLoading] = useState(false);

  const [original, setOriginal] = useState<Activity | null>(null);

  // LOAD EXISTING ACTIVITY IF EDITING
  useEffect(() => {
    if (!activityId) return;

    const load = async () => {
      setLoading(true);
      try {
        const act = await getActivityById(activityId);
        if (!act) {
          Alert.alert("Virhe", "Aktiviteettia ei löytynyt.");
          navigation.goBack();
          return;
        }

        setOriginal(act);
        setName(act.name);
        setDescription(act.description);
        setCategory(act.category);
        setDate(new Date(act.time));
        setLocation({
          latitude: act.location.latitude,
          longitude: act.location.longitude,
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Virhe", "Virhe ladattaessa aktiviteettia.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activityId, navigation]);

  // DATE SELECT
  const handleChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(Platform.OS === "ios");
  };

  const showMode = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setShowPicker(true);
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Virhe", "Täytä kaikki kentät!");
      return;
    }

    if (!location.latitude || !location.longitude) {
      Alert.alert("Virhe", "Valitse sijainti kartalta!");
      return;
    }

    const base: Omit<Activity, "participants"> = {
      id: original?.id ?? "",
      name: name.trim(),
      description: description.trim(),
      category,
      time: date.toISOString(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      creatorId: original?.creatorId,
    };

    try {
      if (isEditing && original) {
        await updateActivity(base);
        Alert.alert("Onnistui", "Aktiviteetti päivitetty!");
      } else {
        await createActivity({
          name: base.name,
          description: base.description,
          category: base.category,
          time: base.time,
          location: base.location,
        });
        Alert.alert("Onnistui", "Aktiviteetti luotu!");
      }

      navigation.navigate("ActivitiesList");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Virhe", "Tallennus epäonnistui.");
    }
  };

  // MAP TAP HANDLER
  const onMapPress = (e: MapPressEvent) => {
    setLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: SPACING.lg }}>
      <Text style={styles.heading}>
        {isEditing ? "Muokkaa aktiviteettia" : "Luo uusi aktiviteetti"}
      </Text>

      {/* MAP SELECTOR */}
      <Text style={styles.label}>Valitse sijainti kartalta</Text>

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude ?? 60.1699,
            longitude: location.longitude ?? 24.9384,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={onMapPress}
        >
          {location.latitude && location.longitude && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          )}
        </MapView>
      </View>

      {/* NAME */}
      <Text style={styles.label}>Nimi</Text>
      <TextInput
        placeholder="Nimi"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* DESCRIPTION */}
      <Text style={styles.label}>Kuvaus</Text>
      <TextInput
        placeholder="Kuvaus"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      {/* CATEGORY */}
      <Text style={styles.label}>Kategoria</Text>
      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
        style={styles.picker}
      >
        <Picker.Item label="Liikunta" value="liikunta" />
        <Picker.Item label="Kulttuuri" value="kulttuuri" />
        <Picker.Item label="Yhteisö" value="yhteisö" />
      </Picker>

      {/* DATE & TIME */}
      <Text style={styles.label}>Päivämäärä & aikavalinta</Text>

      <View style={styles.row}>
        <Button title="Valitse päivä" onPress={() => showMode("date")} />
        <Button title="Valitse aika" onPress={() => showMode("time")} />
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour
          display="default"
          onChange={handleChange}
        />
      )}

      <Text style={styles.selected}>{date.toLocaleString()}</Text>

      {/* SUBMIT BUTTON */}
      <Button
        title={isEditing ? "Tallenna muutokset" : "Luo aktiviteetti"}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  mapWrapper: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: SPACING.lg,
  },
  map: { flex: 1 },

  heading: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.lg,
  },

  label: {
    fontSize: FONT_SIZES.md,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  picker: {
    backgroundColor: "white",
    marginBottom: SPACING.md,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  selected: {
    textAlign: "center",
    marginBottom: SPACING.lg,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default CreateActivityScreen;

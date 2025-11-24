import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createActivity } from "../services/activityService";
import { Activity } from "../models/Activity";
import { auth } from "../firebase/config";
import { Picker } from "@react-native-picker/picker";

export default function CreateActivityScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("liikunta");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleChange = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode: "date" | "time") => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || latitude === null || longitude === null) {
      Alert.alert("Virhe", "Täytä kaikki kentät!");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Virhe", "Kirjaudu sisään luodaksesi aktiviteetin.");
      return;
    }

    const newActivity: Omit<Activity, "id" | "participants"> = {
      name: name.trim(),
      description: description.trim(),
      category,
      time: date.toISOString(),
      location: { latitude: latitude as number, longitude: longitude as number },
      creatorId: currentUser.uid
    };

    try {
      await createActivity(newActivity);
      Alert.alert("Onnistui", "Aktiviteetti luotu!");
      navigation.navigate("ActivitiesList");
    } catch (error: any) {
      Alert.alert("Virhe", error.message || "Aktiviteetin luominen epäonnistui.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nimi</Text>
      <TextInput
        placeholder="Nimi"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text style={styles.label}>Kuvaus</Text>
      <TextInput
        placeholder="Kuvaus"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
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
      <Text style={styles.label}>Latitude</Text>
      <TextInput
        placeholder="Latitude"
        keyboardType="numeric"
        value={latitude !== null ? latitude.toString() : ""}
        onChangeText={text => setLatitude(parseFloat(text))}
        style={styles.input}
      />
      <Text style={styles.label}>Longitude</Text>
      <TextInput
        placeholder="Longitude"
        keyboardType="numeric"
        value={longitude !== null ? longitude.toString() : ""}
        onChangeText={text => setLongitude(parseFloat(text))}
        style={styles.input}
      />
      <Text style={styles.label}>Päivämäärä & Kellonaika</Text>
      <View style={styles.buttonRow}>
        <Button onPress={showDatepicker} title="Valitse päivä" />
        <Button onPress={showTimepicker} title="Valitse aika" />
      </View>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
        />
      )}
      <Text style={styles.selectedDate}>{date.toLocaleString()}</Text>
      <Button title="Luo aktiviteetti" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4
  },
  picker: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  selectedDate: {
    marginBottom: 12,
    fontSize: 16,
    textAlign: "center"
  }
});
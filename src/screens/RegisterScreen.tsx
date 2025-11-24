
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Sähköposti" value={email} onChangeText={setEmail}
                 autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Salasana (väh. 6 merkkiä)" value={password} onChangeText={setPassword}
                 secureTextEntry />
      <Button title="Rekisteröidy" onPress={handleRegister} />
      {error ? <Text style={{color:"red"}}>{error}</Text> : null}
    </View>
  );
}

import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Sähköposti" value={email} onChangeText={setEmail}
                 autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Salasana" value={password} onChangeText={setPassword}
                 secureTextEntry />
      <Button title="Kirjaudu sisään" onPress={handleLogin} />
      <Button title="Rekisteröidy" onPress={() => navigation.navigate("Register")} />
      {error ? <Text style={{color:"red"}}>{error}</Text> : null}
    </View>
  );
}


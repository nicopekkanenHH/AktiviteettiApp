import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Tokeniä ei voitu hakea tiedotuksia varten.");
      return;
    }
    if (Constants.expoConfig?.extra?.eas?.projectId) {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId
      })).data;
    } else {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    console.log("PushToken:", token);
  } else {
    alert("Tarvitset fyysisen laitteen push-ilmoitusten testaamiseen.");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C"
    });
  }

  return token;
}

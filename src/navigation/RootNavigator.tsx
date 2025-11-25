// src/navigation/RootNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "screens/HomeScreen";
import ActivitiesListScreen from "screens/ActivitiesListScreen";
import ActivityDetailsScreen from "screens/ActivityDetailsScreen";
import CreateActivityScreen from "screens/CreateActivityScreen";
import ActivitiesMapScreen from "screens/ActivitiesMapScreen";
import MyProfileScreen from "screens/MyProfileScreen";

// ----------------------------
// TÄYDELLINEN PARAMI-TYYPPI
// ----------------------------
// EI UNIONIA → kaikki valinnaisia → ei virheitä
export type RootStackParamList = {
  Home: undefined;
  ActivitiesList: undefined;

  ActivityDetails: {
    activityId: string;
  };

  // Kaikki valinnaisia → toimii kartalta, editistä ja normaalista
  CreateActivity?: {
    activityId?: string;
    latitude?: number;
    longitude?: number;
  };

  ActivitiesMap: undefined;
  MyProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen
          name="ActivitiesList"
          component={ActivitiesListScreen}
          options={{ title: "Aktiviteetit" }}
        />

        <Stack.Screen
          name="ActivityDetails"
          component={ActivityDetailsScreen}
          options={{ title: "Aktiviteetin tiedot" }}
        />

        <Stack.Screen
          name="CreateActivity"
          component={CreateActivityScreen}
          options={{ title: "Luo aktiviteetti" }}
        />

        <Stack.Screen
          name="ActivitiesMap"
          component={ActivitiesMapScreen}
          options={{ title: "Kartta" }}
        />

        <Stack.Screen
          name="MyProfile"
          component={MyProfileScreen}
          options={{ title: "Profiili" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

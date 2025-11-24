// RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from 'screens/HomeScreen';
import ActivitiesListScreen from 'screens/ActivitiesListScreen';
import ActivitiesMapScreen from 'screens/ActivitiesMapScreen';
import MyProfileScreen from 'screens/MyProfileScreen';
import CreateActivityScreen from 'screens/CreateActivityScreen';

export type RootStackParamList = {
  Home: undefined;
  ActivitiesList: undefined;
  ActivitiesMap: undefined;
  MyProfile: undefined;
  CreateActivity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Etusivu' }} />
        <Stack.Screen name="ActivitiesList" component={ActivitiesListScreen} options={{ title: 'Kaikki aktiviteetit' }} />
        <Stack.Screen name="ActivitiesMap" component={ActivitiesMapScreen} options={{ title: 'Kartta' }} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'Minun profiili' }} />
        <Stack.Screen name="CreateActivity" component={CreateActivityScreen} options={{ title: 'Luo aktiviteetti' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

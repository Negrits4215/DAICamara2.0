import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; // Importa HomeScreen desde el archivo HomeScreen.js
import CameraScreen from './CameraScreen'; // Importa CameraScreen desde el archivo CameraScreen.js

const Tab = createNativeStackNavigator();

export default function App() {
  const [photos, setPhotos] = useState([]);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} photos={photos} />}
        </Tab.Screen>
        <Tab.Screen
          name="CameraScreen"
          component={() => <CameraScreen setPhotos={setPhotos} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
import React, {useEffect} from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import MigrationScreen from './src/screens/MigrationScreen';
import MigrationProcess from './src/screens/MigrationProcess';
import RestoreScreen from './src/screens/RestoreScreen';

const AppStack = createStackNavigator();

const AppStackScreen = () => {

  useEffect(() => {
    SplashScreen.hide() // Pour le SplashScreen
  
  }, []);
  
  return (
    <AppStack.Navigator
      initialRouteName={"MigrationScreen"}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        headerTitleStyle: {fontSize: 21},
        headerStyle: { backgroundColor: '#4a235a'  },
      }}
    >    
      <AppStack.Screen
        name="MigrationScreen"
        component={MigrationScreen}
        options={{
          headerShown: false
        }}
      />
      <AppStack.Screen
        name="MigrationProcess"
        component={MigrationProcess}
        options={{
          headerShown: false
        }}
      />
      <AppStack.Screen
        name="RestoreScreen"
        component={RestoreScreen}
        options={{
          headerShown: false
        }}
      />
    </AppStack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <AppStackScreen />
    </NavigationContainer>
  );
}
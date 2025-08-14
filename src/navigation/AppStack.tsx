// // src/navigation/AppStack.tsx
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../features/HomeScreen';
// import ScoringScreen from '../features/ScoringScreen';
// import LoginScreen from '../features/LoginScreen'; // 1. Import the new screen

// // 2. Define all the screens and their potential parameters
// export type AppStackParamList = {
//   Login: undefined; // The Login screen takes no parameters
//   Home: undefined;
//   Scoring: undefined;
// };

// const Stack = createNativeStackNavigator<AppStackParamList>();

// export default function AppStack() {
//   return (
//     // 3. Set the initial route to "Login"
//     <Stack.Navigator initialRouteName="Login">
//       {/* 4. Add the LoginScreen to the navigator stack */}
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ headerShown: false }} // Hide the header on the login screen
//       />
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Scoring" component={ScoringScreen} />
//     </Stack.Navigator>
//   );
// }

// src/navigation/AppStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/HomeScreen';
import ScoringScreen from '../features/ScoringScreen';

export type AppStackParamList = {
  Home: undefined;
  Scoring: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scoring" component={ScoringScreen} />
    </Stack.Navigator>
  );
}

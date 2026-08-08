import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the available routes across our app
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
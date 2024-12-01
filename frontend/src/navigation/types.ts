import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type MainTabNavigationProp = StackNavigationProp<MainTabParamList>;
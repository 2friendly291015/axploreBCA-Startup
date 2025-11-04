import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './AuthContext';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { Easing, ActivityIndicator, View, StatusBar } from 'react-native';
import IntroductionScreen from './IntroductionScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import StudyMaterialScreen from './StudyMaterialScreen';
import TermsAndConditionsScreen from './TermsAndConditionsScreen';
import ProfileScreen from './ProfileScreen';
import AdminUpload from './AdminUpload';
import StatusUpdateScreen from './StatusUpdateScreen';
import SettingsScreen from './SettingsScreen';
import OfflineScreen from './components/OfflineScreen';

const Stack = createStackNavigator();

const modernTransition = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.7, 1],
      }),
      transform: [
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
      }),
    },
  }),
};

const Navigation = () => {
  const { user, loading } = useAuth();
  const { isConnected } = useNetwork();

  // Hide the status bar
  React.useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  // Show offline screen when there's no internet connection
  if (!isConnected) {
    return <OfflineScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={!user ? "Introduction" : "Home"}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        ...modernTransition,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Introduction" component={IntroductionScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StatusUpdate" component={StatusUpdateScreen} />
          <Stack.Screen name="StudyMaterial" component={StudyMaterialScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="AdminUpload" component={AdminUpload} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NetworkProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </NetworkProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

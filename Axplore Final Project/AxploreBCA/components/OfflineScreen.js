import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { useNetwork } from '../context/NetworkContext';

const { width, height } = Dimensions.get('window');

const OfflineScreen = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const { isConnected } = useNetwork();

  const handleRetry = async () => {
    setIsChecking(true);
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setIsChecking(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  if (isConnected) {
    return null; // or navigate to the main screen
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../assets/error.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <MaterialCommunityIcons
          name="wifi-off"
          size={80}
          color={COLORS.primary}
          style={styles.icon}
        />
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.description}>
          Please check your internet connection and try again
        </Text>
        
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
          disabled={isChecking}
        >
          <View
            style={[styles.gradientButton, { backgroundColor: COLORS.primary }]}
          >
            {isChecking ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="refresh"
                  size={24}
                  color={COLORS.white}
                  style={styles.retryIcon}
                />
                <Text style={styles.buttonText}>Try Again</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.tipContainer}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={20}
            color={COLORS.text.secondary}
            style={styles.tipIcon}
          />
          <Text style={styles.tipText}>
            Tip: Make sure your Wi-Fi or mobile data is turned on
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  image: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: SPACING.xl,
  },
  icon: {
    marginBottom: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  retryIcon: {
    marginRight: SPACING.s,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.m,
    borderRadius: 12,
    maxWidth: '90%',
  },
  tipIcon: {
    marginRight: SPACING.s,
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    flex: 1,
  },
});

export default OfflineScreen;
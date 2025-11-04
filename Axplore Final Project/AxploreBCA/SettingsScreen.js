import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING } from './theme';
import { BottomNav } from './components/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebaseConfig';

const STORAGE_KEYS = {
  NOTIFICATIONS: 'notifications',
  EMAIL_NOTIFICATIONS: 'emailNotifications',
  DOWNLOAD_WIFI: 'downloadOverWifi',
  AUTO_PLAY: 'autoPlay',
};

const APP_VERSION = '1.0.0';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const emailNotifications = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS);
      const downloadWifi = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_WIFI);
      const autoPlay = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_PLAY);

      setNotifications(notifications !== 'false');
      setEmailNotifications(emailNotifications !== 'false');
      setDownloadOverWifi(downloadWifi !== 'false');
      setAutoPlay(autoPlay === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error saving setting:', error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  const handleNotifications = async (value) => {
    setNotifications(value);
    await updateSetting(STORAGE_KEYS.NOTIFICATIONS, value);
    if (value) {
      Alert.alert('Notifications Enabled', 'You will now receive push notifications');
    }
  };

  const handleEmailNotifications = async (value) => {
    setEmailNotifications(value);
    await updateSetting(STORAGE_KEYS.EMAIL_NOTIFICATIONS, value);
  };

  const handleDownloadOverWifi = async (value) => {
    setDownloadOverWifi(value);
    await updateSetting(STORAGE_KEYS.DOWNLOAD_WIFI, value);
  };

  const handleAutoPlay = async (value) => {
    setAutoPlay(value);
    await updateSetting(STORAGE_KEYS.AUTO_PLAY, value);
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'Cache cleared successfully');
              loadSettings(); // Reload settings after clearing
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ],
    );
  };

  const openHelpCenter = () => {
    Linking.openURL('https://example.com/help').catch(() => {
      Alert.alert('Error', 'Could not open help center');
    });
  };

  const showAboutInfo = () => {
    Alert.alert(
      'About AxploreBCA',
      `Version: ${APP_VERSION}\n\nAxploreBCA is your comprehensive companion for BCA studies.`,
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy').catch(() => {
      Alert.alert('Error', 'Could not open privacy policy');
    });
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            auth.signOut();
          },
        },
      ],
    );
  };

  const renderSettingItem = (icon, title, description, value, onPress, type = 'toggle') => (
    <View style={styles.settingItem}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons name={icon} size={24} color={COLORS.white} />
      </LinearGradient>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#D1D5DB', true: COLORS.primaryLight }}
          thumbColor={value ? COLORS.primary : '#9CA3AF'}
        />
      ) : (
        <TouchableOpacity onPress={onPress}>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      padding: SPACING.xl,
      borderBottomLeftRadius: BORDER_RADIUS.xl,
      borderBottomRightRadius: BORDER_RADIUS.xl,
      ...SHADOWS.large,
    },
    headerTitle: {
      ...TYPOGRAPHY.h1,
      color: COLORS.text.light,
      marginBottom: SPACING.xs,
    },
    scrollView: {
      flex: 1,
    },
    sectionHeader: {
      ...TYPOGRAPHY.h3,
      color: COLORS.text.primary,
      marginHorizontal: SPACING.l,
      marginTop: SPACING.l,
      marginBottom: SPACING.m,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      marginHorizontal: SPACING.l,
      marginBottom: SPACING.m,
      padding: SPACING.m,
      borderRadius: BORDER_RADIUS.l,
      ...SHADOWS.small,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS.m,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.m,
    },
    settingContent: {
      flex: 1,
      marginRight: SPACING.m,
    },
    settingTitle: {
      ...TYPOGRAPHY.body1,
      color: COLORS.text.primary,
      marginBottom: SPACING.xxs,
    },
    settingDescription: {
      ...TYPOGRAPHY.caption,
      color: COLORS.text.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        {renderSectionHeader('Notifications')}
        {renderSettingItem(
          'bell-outline',
          'Push Notifications',
          'Receive updates and alerts',
          notifications,
          handleNotifications
        )}
        {renderSettingItem(
          'email-outline',
          'Email Notifications',
          'Get updates via email',
          emailNotifications,
          handleEmailNotifications
        )}

        {/* Content & Storage */}
        {renderSectionHeader('Content & Storage')}
        {renderSettingItem(
          'wifi',
          'Download over Wi-Fi only',
          'Save mobile data usage',
          downloadOverWifi,
          handleDownloadOverWifi
        )}
        {renderSettingItem(
          'play-circle-outline',
          'Auto-play Media',
          'Automatically play videos',
          autoPlay,
          handleAutoPlay
        )}
        {renderSettingItem(
          'trash-can-outline',
          'Clear Cache',
          'Free up storage space',
          null,
          clearCache,
          'button'
        )}

        {/* Help & Support */}
        {renderSectionHeader('Help & Support')}
        {renderSettingItem(
          'help-circle-outline',
          'Help Center',
          'Get help with using the app',
          null,
          openHelpCenter,
          'button'
        )}
        {renderSettingItem(
          'information',
          'About',
          'App information and version',
          null,
          showAboutInfo,
          'button'
        )}
        {renderSettingItem(
          'shield-check',
          'Privacy Policy',
          'Read our privacy policy',
          null,
          openPrivacyPolicy,
          'button'
        )}
        {renderSettingItem(
          'logout',
          'Sign Out',
          'Sign out of your account',
          null,
          handleSignOut,
          'button'
        )}
      </ScrollView>

      <BottomNav navigation={navigation} currentRoute="Settings" />
    </SafeAreaView>
  );
};

export default SettingsScreen;

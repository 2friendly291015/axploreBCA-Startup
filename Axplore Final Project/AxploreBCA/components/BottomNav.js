import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING } from '../theme';

export const BottomNav = ({ navigation, currentRoute }) => {
  const navItems = [
    {
      route: 'Home',
      icon: 'home',
      label: 'Home'
    },
    {
      route: 'StatusUpdate',
      icon: 'image',
      label: 'Feeds'
    },
    {
      route: 'StudyMaterial',
      icon: 'book',
      label: 'Notes'
    },
    {
      route: 'Profile',
      icon: 'account',
      label: 'Profile'
    },
    {
      route: 'Settings',
      icon: 'cog',
      label: 'Settings'
    }
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.navItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            color={currentRoute === item.route ? '#3B82F6' : '#6B7280'}
          />
          <Text
            style={[
              styles.navLabel,
              { color: currentRoute === item.route ? '#3B82F6' : '#6B7280' }
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navLabel: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
}); 
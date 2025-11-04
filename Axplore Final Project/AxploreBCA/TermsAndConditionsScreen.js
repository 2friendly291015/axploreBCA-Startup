import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements';

const CustomCheckBox = ({ title = 'Default Title', checked = false, onPress }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <CheckBox
        checked={checked}
        onPress={onPress}
        checkedColor="#8A2BE2" // Purple color for checkbox
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0 }}
      />
      <Text style={styles.checkboxText}>{title}</Text>
    </TouchableOpacity>
  );
};

const TermsAndConditionsScreen = ({ navigation }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      navigation.replace('Home'); // Navigate to the Home screen if terms are accepted
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section with Logo */}
      <View style={styles.header}>
        <Image
          source={require('./assets/logo.png')} // Replace with the correct path to your logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Terms and Conditions</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.info}>
          Welcome to Axplore BCA! By using this application, you agree to the following terms and conditions:
        </Text>
        <Text style={styles.listItem}>
          1. The application is intended for educational purposes only.
        </Text>
        <Text style={styles.listItem}>
          2. Users must not upload or share unauthorized or inappropriate content.
        </Text>
        <Text style={styles.listItem}>
          3. Any misuse of the application, including violation of these terms, may result in account suspension.
        </Text>
        <Text style={styles.listItem}>
          4. Users are responsible for ensuring that the content they upload complies with copyright laws.
        </Text>
        <Text style={styles.listItem}>
          5. The app reserves the right to modify or update these terms at any time without prior notice.
        </Text>

        <View style={styles.footer}>
          <CustomCheckBox
            title="I accept the Terms and Conditions"
            checked={accepted}
            onPress={() => setAccepted(!accepted)}
          />

          <TouchableOpacity
            style={[styles.continueButton, !accepted && styles.disabledButton]}
            onPress={handleAccept}
            disabled={!accepted}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F6F8FC',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2', // Purple color
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  info: {
    fontSize: 16,
    color: '#4C3E83', 
    lineHeight: 24,
    marginBottom: 16,
  },
  listItem: {
    fontSize: 14,
    color: '#4C3E83', 
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  checkboxText: {
    fontSize: 14,
    color: '#4C3E83',   },
  continueButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#BDB4D4', 
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TermsAndConditionsScreen;

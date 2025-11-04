import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, SafeAreaView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebaseConfig'; // Adjust the path if necessary
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './theme';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Load saved email and password if they exist
    const loadCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');

      if (savedRememberMe === 'true') {
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    };

    loadCredentials();
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('rememberMe');
      }
    } catch (error) {
      handleSignInError(error);
    }
  };

  const handleSignInError = (error) => {
    if (error.code === 'auth/invalid-credential') {
      setError('Incorrect email or password. Please try again.');
    } else {
      setError('An error occurred. Please try again.');
    }
    console.error('Error signing in:', error);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
      console.error('Error sending password reset email:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 38,
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: 40,
      textAlign: 'left',
      paddingLeft: 4,
      letterSpacing: 0.5,
    },
    formContainer: {
      width: '100%',
      marginBottom: 40,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.3)',
      paddingBottom: 8,
    },
    inputIcon: {
      marginRight: 12,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#FFFFFF',
      paddingVertical: 8,
      backgroundColor: 'transparent',
    },
    visibilityIcon: {
      padding: 4,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    errorText: {
      color: COLORS.status.error,
      fontSize: 14,
      marginBottom: 16,
      marginLeft: 4,
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    rememberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      marginLeft: -8,
      marginRight: 4,
      padding: 0,
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    rememberText: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    forgotText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    signInButton: {
      backgroundColor: COLORS.surface,
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    signInButtonText: {
      color: COLORS.primary,
      fontSize: 18,
      fontWeight: '600',
    },
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    footerText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    signUpText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      textDecorationLine: 'none',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6200EE', '#9C64D1']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Sign In</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon 
                name="envelope" 
                size={20} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Icon 
                name="lock" 
                size={20} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.visibilityIcon} 
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Icon 
                  name={passwordVisible ? 'eye-slash' : 'eye'} 
                  size={20} 
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.optionsContainer}>
              <View style={styles.rememberContainer}>
                <CheckBox
                  checked={rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                  checkedColor="#FFFFFF"
                  uncheckedColor="rgba(255, 255, 255, 0.7)"
                  containerStyle={styles.checkbox}
                  textStyle={{ color: '#FFFFFF' }}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </View>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignInScreen;

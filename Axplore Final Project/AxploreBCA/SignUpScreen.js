import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './theme';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [semester, setSemester] = useState('1');
  const [role, setRole] = useState('student');
  const [teacherCode, setTeacherCode] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = async () => {
    setError(null);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (role === 'teacher' && teacherCode !== 'NIELITTEACHER') {
      setError('Invalid teacher code.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        semester: role === 'student' ? semester : null,
        createdAt: new Date(),
      });

      alert(`Account successfully created as ${role}.`);
      navigation.navigate('TermsAndConditions'); // Navigate to Terms and Conditions
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      flexGrow: 1,
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
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.3)',
      paddingBottom: 8,
      height: 50,
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
    picker: {
      flex: 1,
      marginLeft: -12,
      height: 50,
      backgroundColor: 'transparent',
      color: '#FFFFFF',
    },
    pickerItem: {
      color: '#FFFFFF',
      fontSize: 16,
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
    signUpButton: {
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
    signUpButtonText: {
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
    signInText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      textDecorationLine: 'none',
    },
  });

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon 
              name="user" 
              size={20} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={name}
              onChangeText={setName}
            />
          </View>

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
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.pickerContainer}>
            <Icon 
              name="users" 
              size={20} 
              style={styles.inputIcon} 
            />
            <Picker
              selectedValue={role}
              onValueChange={(value) => {
                setRole(value);
                setTeacherCode('');
              }}
              style={[styles.picker, { color: '#FFFFFF' }]}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item 
                label="Student" 
                value="student" 
                color={Platform.OS === 'ios' ? '#FFFFFF' : '#000000'} 
              />
              <Picker.Item 
                label="Teacher" 
                value="teacher" 
                color={Platform.OS === 'ios' ? '#FFFFFF' : '#000000'} 
              />
            </Picker>
          </View>

          {role === 'student' && (
            <View style={styles.pickerContainer}>
              <Icon 
                name="graduation-cap" 
                size={20} 
                style={styles.inputIcon} 
              />
              <Picker
                selectedValue={semester}
                onValueChange={setSemester}
                style={[styles.picker, { color: '#FFFFFF' }]}
                dropdownIconColor="#FFFFFF"
              >
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <Picker.Item 
                    key={sem} 
                    label={`Semester ${sem}`} 
                    value={sem.toString()}
                    color={Platform.OS === 'ios' ? '#FFFFFF' : '#000000'} 
                  />
                ))}
              </Picker>
            </View>
          )}

          {role === 'teacher' && (
            <View style={styles.inputContainer}>
              <Icon 
                name="key" 
                size={20} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Teacher Code"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={teacherCode}
                onChangeText={setTeacherCode}
                secureTextEntry
              />
            </View>
          )}

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
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.visibilityIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon 
                name={showPassword ? 'eye-slash' : 'eye'} 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon 
              name="lock" 
              size={20} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.visibilityIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon 
                name={showConfirmPassword ? 'eye-slash' : 'eye'} 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
              />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpScreen;

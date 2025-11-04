import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { auth, db, storage } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING, COLORS } from './theme';
import { BottomNav } from './components/BottomNav';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedSemester, setEditedSemester] = useState('1');
  const [notifications, setNotifications] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editedBio, setEditedBio] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditedName(userData.name || '');
      setEditedSemester(userData.semester || '1');
      setEditedBio(userData.bio || '');
      setEditedPhone(userData.phone || '');
    }
  }, [userData]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    headerGradient: {
      paddingBottom: SPACING.xl,
    },
    header: {
      alignItems: 'center',
      paddingHorizontal: SPACING.l,
      paddingTop: SPACING.xl,
    },
    profileImageContainer: {
      alignItems: 'center',
      marginBottom: SPACING.l,
    },
    profileImageWrapper: {
      position: 'relative',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: COLORS.surface,
      ...SHADOWS.larges,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
    },
    placeholderImage: {
      backgroundColor: COLORS.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: COLORS.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      ...SHADOWS.small,
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    contentContainer: {
      padding: SPACING.l,
      paddingBottom: SPACING.xl,
    },
    name: {
      ...TYPOGRAPHY.h2,
      color: COLORS.text,
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    email: {
      ...TYPOGRAPHY.body2,
      color: COLORS.text,
      opacity: 0.7,
      marginBottom: SPACING.m,
      textAlign: 'center',
    },
    optionsContainer: {
      padding: SPACING.l,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      borderRadius: BORDER_RADIUS.l,
      marginBottom: SPACING.m,
      ...SHADOWS.small,
    },
    optionIcon: {
      marginRight: SPACING.m,
      width: 24,
      color: COLORS.primary,
    },
    optionText: {
      ...TYPOGRAPHY.body1,
      color: COLORS.text,
      flex: 1,
    },
    editInput: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: BORDER_RADIUS.m,
      padding: SPACING.m,
      color: COLORS.text,
      fontSize: 16,
      marginBottom: SPACING.m,
    },
    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: SPACING.s,
    },
    editButton: {
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS.m,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    saveButton: {
      backgroundColor: COLORS.primary,
    },
    editFieldContainer: {
      marginTop: SPACING.s,
    },
    editFieldInput: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: BORDER_RADIUS.m,
      padding: SPACING.m,
      color: COLORS.text,
      fontSize: 16,
      marginBottom: SPACING.s,
    },
    editFieldActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: SPACING.s,
    },
    editFieldButton: {
      width: 36,
      height: 36,
      borderRadius: BORDER_RADIUS.m,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    saveFieldButton: {
      backgroundColor: COLORS.primary,
    },
    editFieldButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    roleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.xs,
    },
    role: {
      ...TYPOGRAPHY.caption,
      color: COLORS.text,
      opacity: 0.7,
      marginLeft: SPACING.xs,
    },
    pickerContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: BORDER_RADIUS.m,
      marginBottom: SPACING.m,
    },
    picker: {
      color: COLORS.text,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      borderRadius: BORDER_RADIUS.l,
      marginBottom: SPACING.m,
      ...SHADOWS.small,
    },
    editProfileIcon: {
      marginRight: SPACING.m,
      width: 24,
      color: COLORS.primary,
    },
    editProfileText: {
      ...TYPOGRAPHY.body1,
      color: COLORS.text,
      flex: 1,
    },
  });

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfilePicture = async (uri) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, 'users', user.uid), {
        profilePicture: downloadURL
      });
      
      setUserData(prev => ({ ...prev, profilePicture: downloadURL }));
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.replace('SignIn');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      const updates = {
        name: editedName.trim(),
        ...(userData?.role === 'student' && { semester: editedSemester }),
      };

      await updateDoc(userRef, updates);
      
      setUserData(prev => ({
        ...prev,
        ...updates
      }));
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveField = async (field) => {
    try {
      setLoading(true);
      const updates = {};
      
      if (field === 'bio') {
        updates.bio = editedBio.trim();
      } else if (field === 'phone') {
        updates.phone = editedPhone.trim();
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updates);
      
      setUserData(prev => ({ ...prev, ...updates }));
      setEditingField(null);
      Alert.alert('Success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileOption = (icon, title, value, onPress, iconColor) => {
    const isEditing = editingField === title.toLowerCase();

    return (
      <TouchableOpacity 
        style={[styles.optionButton, isEditing && { borderColor: COLORS.primary, borderWidth: 1 }]}
        onPress={() => {
          if (title === 'Bio' || title === 'Phone') {
            setEditingField(title.toLowerCase());
            if (title === 'Bio') setEditedBio(userData?.bio || '');
            if (title === 'Phone') setEditedPhone(userData?.phone || '');
          } else if (onPress) {
            onPress();
          }
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          style={[styles.optionIcon, { color: iconColor || COLORS.primary }]}
        />
        <View style={{ flex: 1 }}>
          {isEditing ? (
            <View style={styles.editFieldContainer}>
              <TextInput
                style={styles.editFieldInput}
                value={title === 'Bio' ? editedBio : editedPhone}
                onChangeText={title === 'Bio' ? setEditedBio : setEditedPhone}
                placeholder={`Enter your ${title.toLowerCase()}`}
                placeholderTextColor={`${COLORS.text}80`}
                multiline={title === 'Bio'}
                keyboardType={title === 'Phone' ? 'phone-pad' : 'default'}
              />
              <View style={styles.editFieldActions}>
                <TouchableOpacity 
                  style={styles.editFieldButton}
                  onPress={() => setEditingField(null)}
                >
                  <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editFieldButton, styles.saveFieldButton]}
                  onPress={() => handleSaveField(title.toLowerCase())}
                >
                  <MaterialCommunityIcons name="check" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.optionText}>{title}</Text>
              <Text style={[styles.optionText, { opacity: 0.7, fontSize: 14 }]}>{value}</Text>
            </>
          )}
        </View>
        {!isEditing && !onPress && (
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color="rgba(255, 255, 255, 0.5)"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.background]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
            {userData?.profilePicture ? (
              <Image
                source={{ uri: userData.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <MaterialCommunityIcons name="account" size={60} color={COLORS.text} />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor={`${COLORS.text}80`}
              />
              {userData?.role === 'student' && (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editedSemester}
                    onValueChange={setEditedSemester}
                    style={styles.picker}
                  >
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <Picker.Item
                        key={sem}
                        label={`Semester ${sem}`}
                        value={sem.toString()}
                        color={COLORS.text}
                      />
                    ))}
                  </Picker>
                </View>
              )}
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(false)}
                >
                  <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <MaterialCommunityIcons name="loading" size={24} color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons name="check" size={24} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.name}>{userData?.name || 'Loading...'}</Text>
              <Text style={styles.email}>{userData?.email}</Text>
              <View style={styles.roleContainer}>
                <MaterialCommunityIcons 
                  name="school"
                  size={16} 
                  color={COLORS.text} 
                  style={{ opacity: 0.7 }}
                />
                <Text style={styles.role}>
                  {userData?.role === 'teacher' ? 'Teacher' : `Student • Semester ${userData?.semester || '-'}`}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => setIsEditing(true)}
              >
                <MaterialCommunityIcons name="account-edit" size={24} style={styles.optionIcon} />
                <Text style={styles.optionText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {renderProfileOption(
            'text-box',
            'Bio',
            userData?.bio || 'Add a bio'
          )}

          {renderProfileOption(
            'phone',
            'Phone',
            userData?.phone || 'Add phone number'
          )}

          {renderProfileOption(
            'bell',
            'Notifications',
            notifications ? 'Enabled' : 'Disabled',
            () => setNotifications(!notifications),
            notifications ? COLORS.primary : 'rgba(255, 255, 255, 0.5)'
          )}

          {renderProfileOption(
            'cog',
            'Settings',
            null,
            () => navigation.navigate('Settings')
          )}

          {renderProfileOption(
            'logout',
            'Sign Out',
            null,
            handleSignOut,
            '#FF4B4B'
          )}
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} currentRoute="Profile" />
    </SafeAreaView>
  );
};

export default ProfileScreen;

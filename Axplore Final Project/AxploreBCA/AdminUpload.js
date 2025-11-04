import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  ScrollView, 
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING } from './theme';
import { BottomNav } from './components/BottomNav';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig'; // Adjust the path if necessary
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

const AdminUpload = ({ navigation }) => {
  const [formData, setFormData] = useState({
    newsTitle: '',
    newsDate: '',
    newsContent: '',
    eventTitle: '',
    eventStartDate: '',
    eventEndDate: '',
    recentTitle: '',
    recentImage: null,
  });

  const [updates, setUpdates] = useState({
    newsUpdates: [],
    upcomingEvents: [],
    recentUpdates: [],
  });

  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  
  // Date Picker States
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [dateType, setDateType] = useState(''); // 'news' or 'event'

  // Initialize Firebase services
  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();

  // Fetch Updates function moved outside of useEffect
  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const [newsSnapshot, eventsSnapshot, recentSnapshot] = await Promise.all([
        getDocs(collection(db, 'newsUpdates')),
        getDocs(collection(db, 'upcomingEvents')),
        getDocs(collection(db, 'recentUpdates')),
      ]);

      const newsUpdates = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const upcomingEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const recentUpdates = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUpdates({ newsUpdates, upcomingEvents, recentUpdates });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch updates.');
    } finally {
      setLoading(false);
    }
  };

  // Check if the current user is a teacher and fetch updates
  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsTeacher(userData.role === 'teacher');
          }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      }
    };

    checkUserRole();
    fetchUpdates(); // Fetch updates when component mounts
  }, []); // Empty array means it will run once when the component is mounted

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const clearInput = (field) => {
    setFormData(prevState => ({ ...prevState, [field]: '' }));
  };

  // Date Picker Handlers
  const showDatePicker = (type) => {
    setDateType(type);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = format(date, 'MMM dd, yyyy');
    if (dateType === 'news') {
      handleInputChange('newsDate', formattedDate);
    } else if (dateType === 'eventStart') {
      handleInputChange('eventStartDate', formattedDate);
    } else if (dateType === 'eventEnd') {
      handleInputChange('eventEndDate', formattedDate);
    }
    hideDatePicker();
  };

  // New function to handle end date confirmation
  const handleEndDateConfirm = (date) => {
    const formattedDate = format(date, 'MMM dd, yyyy');
    handleInputChange('eventEndDate', formattedDate);
    hideEndDatePicker();
  };

  // Function to hide the end date picker
  const hideEndDatePicker = () => {
    setEndDatePickerVisible(false);
  };

  // Image Picker function
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Allow full image upload
        quality: 1,
      });

      if (!result.canceled) {
        handleInputChange('recentImage', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Upload News Update function
  const uploadNewsUpdate = async () => {
    if (!isTeacher) {
      Alert.alert('Permission Denied', 'Only teachers can upload news updates.');
      return;
    }

    const { newsTitle, newsDate, newsContent } = formData;
    if (!newsTitle || !newsDate || !newsContent) {
      Alert.alert('Error', 'Please fill in all news update fields.');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'newsUpdates'), {
        title: newsTitle,
        date: newsDate,
        content: newsContent,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'News update uploaded successfully!');
      setFormData(prev => ({ ...prev, newsTitle: '', newsDate: '', newsContent: '' }));
      fetchUpdates();
    } catch (error) {
      console.error('Error uploading news:', error);
      Alert.alert('Error', 'Failed to upload news update.');
    } finally {
      setLoading(false);
    }
  };

  // Upload Upcoming Event function
  const uploadUpcomingEvent = async () => {
    if (!isTeacher) {
      Alert.alert('Permission Denied', 'Only teachers can upload events.');
      return;
    }

    const { eventTitle, eventStartDate, eventEndDate } = formData;
    if (!eventTitle || !eventStartDate) {
      Alert.alert('Error', 'Please fill in all event fields.');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'upcomingEvents'), {
        title: eventTitle,
        date: eventStartDate === eventEndDate 
          ? eventStartDate // Single day event
          : `${eventStartDate} to ${eventEndDate}`, // Multi-day event
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Event uploaded successfully!');
      setFormData(prev => ({ ...prev, eventTitle: '', eventStartDate: '', eventEndDate: '' }));
      fetchUpdates();
    } catch (error) {
      console.error('Error uploading event:', error);
      Alert.alert('Error', 'Failed to upload event.');
    } finally {
      setLoading(false);
    }
  };

  // Upload Recent Update (Feed) function
  const uploadRecentUpdate = async () => {
    if (!isTeacher) {
      Alert.alert('Permission Denied', 'Only teachers can upload feeds.');
      return;
    }

    const { recentTitle, recentImage } = formData;
    if (!recentTitle || !recentImage) {
      Alert.alert('Error', 'Please fill in the title and select an image.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(recentImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `recentUpdates/${Date.now()}`);

      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'recentUpdates'), {
        title: recentTitle,
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Feed uploaded successfully!');
      setFormData(prev => ({ ...prev, recentTitle: '', recentImage: null }));
      fetchUpdates();
    } catch (error) {
      console.error('Error uploading feed:', error);
      Alert.alert('Error', 'Failed to upload feed.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Item
  const deleteItem = async (id, collectionName) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteDoc(doc(db, collectionName, id));
              await fetchUpdates(); // Refresh the list
              Alert.alert('Success', 'Item deleted successfully!');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Loading State
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const DATA = [
    { title: 'News Updates', data: updates.newsUpdates, collectionName: 'newsUpdates' },
    { title: 'Upcoming Events', data: updates.upcomingEvents, collectionName: 'upcomingEvents' },
    { title: 'Feeds', data: updates.recentUpdates, collectionName: 'recentUpdates' },
  ];

  const renderItem = (item, collectionName) => (
    <View style={styles.itemCard} key={item.id}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.content && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.content}
          </Text>
        )}
        {item.date && (
          <Text style={styles.itemDate}>
            {item.date}
          </Text>
        )}
        {item.imageUrl && (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.itemImage}
            resizeMode="cover"
          />
        )}
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id, collectionName)}
      >
        <MaterialCommunityIcons name="delete" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* News Updates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News Updates</Text>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="News Title"
                value={formData.newsTitle}
                onChangeText={(value) => handleInputChange('newsTitle', value)}
                placeholderTextColor={COLORS.text.tertiary}
              />
              {formData.newsTitle.length > 0 && (
                <TouchableOpacity onPress={() => clearInput('newsTitle')} style={styles.clearButton}>
                  <MaterialCommunityIcons name="close" size={20} color={COLORS.text.tertiary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => showDatePicker('news')} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="News Date"
                value={formData.newsDate}
                editable={false} // Make it non-editable
                placeholderTextColor={COLORS.text.tertiary}
              />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="News Content"
                value={formData.newsContent}
                onChangeText={(value) => handleInputChange('newsContent', value)}
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.text.tertiary}
              />
              {formData.newsContent.length > 0 && (
                <TouchableOpacity onPress={() => clearInput('newsContent')} style={styles.clearButton}>
                  <MaterialCommunityIcons name="close" size={20} color={COLORS.text.tertiary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={uploadNewsUpdate} style={styles.uploadButton}>
              <MaterialCommunityIcons name="newspaper-plus" size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Upload News Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={formData.eventTitle}
                onChangeText={(value) => handleInputChange('eventTitle', value)}
                placeholderTextColor={COLORS.text.tertiary}
              />
              {formData.eventTitle.length > 0 && (
                <TouchableOpacity onPress={() => clearInput('eventTitle')} style={styles.clearButton}>
                  <MaterialCommunityIcons name="close" size={20} color={COLORS.text.tertiary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => showDatePicker('eventStart')} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Start Date"
                value={formData.eventStartDate}
                editable={false} // Make it non-editable
                placeholderTextColor={COLORS.text.tertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showDatePicker('eventEnd')} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="End Date"
                value={formData.eventEndDate}
                editable={false} // Make it non-editable
                placeholderTextColor={COLORS.text.tertiary}
              />

            </TouchableOpacity>
            <TouchableOpacity onPress={uploadUpcomingEvent} style={styles.uploadButton}>
              <MaterialCommunityIcons name="calendar-plus" size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Upload Event</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Updates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feeds</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Feed Title"
              value={formData.recentTitle}
              onChangeText={(value) => handleInputChange('recentTitle', value)}
              placeholderTextColor={COLORS.text.tertiary}
            />
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              <MaterialCommunityIcons name="image-plus" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>
            {formData.recentImage && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: formData.recentImage }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => handleInputChange('recentImage', null)}
                >
                  <MaterialCommunityIcons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={uploadRecentUpdate} style={styles.uploadButton}>
              <MaterialCommunityIcons name="cloud-upload" size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Upload Feed</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Uploaded Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uploaded Content</Text>
          {DATA.map((section) => (
            <View key={section.title} style={styles.uploadedSection}>
              <Text style={styles.uploadedSectionTitle}>{section.title}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {section.data.length > 0 ? (
                  section.data.map((item) => renderItem(item, section.collectionName))
                ) : (
                  <Text style={styles.noContentText}>No {section.title.toLowerCase()} available</Text>
                )}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Date Picker for News Date */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      {/* Date Picker for Event End Date */}
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      )}

      <BottomNav navigation={navigation} currentRoute="AdminUpload" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.black,
  },
  content: {
    flex: 1,
    padding: SPACING.m,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.black,
    marginBottom: SPACING.m,
  },
  inputGroup: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    ...SHADOWS.small,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.m,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    ...TYPOGRAPHY.body,
    color: COLORS.text.black,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: SPACING.m,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    ...SHADOWS.small,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    marginLeft: SPACING.s,
    fontWeight: '600',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    marginBottom: SPACING.m,
  },
  imagePickerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    marginLeft: SPACING.s,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: SPACING.m,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.m,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.small,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    marginTop: SPACING.m,
  },
  uploadedSection: {
    marginBottom: SPACING.l,
  },
  uploadedSectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.secondary,
    marginBottom: SPACING.s,
    marginLeft: SPACING.s,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    marginRight: SPACING.m,
    marginBottom: SPACING.s,
    width: 280,
    ...SHADOWS.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginRight: SPACING.s,
  },
  itemTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.black,
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
  },
  itemDate: {
    ...TYPOGRAPHY.small,
    color: COLORS.text.secondary,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: BORDER_RADIUS.m,
    marginTop: SPACING.s,
  },
  deleteButton: {
    padding: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.background,
  },
  noContentText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
    padding: SPACING.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: SPACING.s,
    top: '50%',
    transform: [{ translateY: -50 }],
    padding: SPACING.xs,
  },
});

export default AdminUpload;


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistanceToNow } from 'date-fns';
import { BottomNav } from './components/BottomNav';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING } from './theme';

const StudyMaterialScreen = ({ navigation }) => {
  const [materials, setMaterials] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [currentSemester, setCurrentSemester] = useState(6);
  const semesters = [1, 2, 3, 4, 5, 6];

  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    const initializeScreen = async () => {
      await fetchMaterials();
      await fetchQuestionPapers();

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsTeacher(userData.role === 'teacher');
        }
      }
    };
    initializeScreen();
  }, [currentSemester]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
        const materialsSnapshot = await getDocs(collection(db, 'studyMaterials'));
        const materialsData = materialsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(material => material.semester === currentSemester); // Filter by current semester
        setMaterials(materialsData);
    } catch (error) {
        console.error('Error fetching study materials:', error);
    } finally {
        setLoading(false);
    }
};

  const fetchQuestionPapers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'questionPapers'));
      const papersData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((paper) => paper.semester === currentSemester);
      setQuestionPapers(papersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch question papers.');
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async (collectionName) => {
    if (!isTeacher) {
      Alert.alert('Permission Denied', 'Only teachers can upload documents.');
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      copyToCacheDirectory: true
    });

    if (!result.canceled) {
      const file = result.assets[0];
      if (file) {
        Alert.alert(
          'Confirm Upload',
          `Are you sure you want to upload "${file.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upload', onPress: () => uploadDocument(file, collectionName) },
          ]
        );
      } else {
        Alert.alert('Error', 'Selected file is invalid.');
      }
    }
  };

  const uploadDocument = async (document, collectionName) => {
    setUploading(true);
    try {
      const response = await fetch(document.uri);
      if (!response.ok) throw new Error('Failed to fetch document.');

      const blob = await response.blob();
      const storageRef = ref(storage, `${collectionName}/${document.name}`);

      await uploadBytes(storageRef, blob);

      const fileUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, collectionName), {
        title: document.name,
        fileUrl,
        createdAt: new Date(),
        semester: currentSemester,
      });

      Alert.alert('Success', 'Document uploaded successfully!');
      if (collectionName === 'studyMaterials') {
        fetchMaterials();
      } else {
        fetchQuestionPapers();
      }
    } catch (error) {
      Alert.alert('Error', `Failed to upload document: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id, collectionName) => {
    if (!isTeacher) {
      Alert.alert('Permission Denied', 'Only teachers can delete documents.');
      return;
    }

    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, collectionName, id));
              Alert.alert('Success', 'Document deleted successfully!');
              if (collectionName === 'studyMaterials') {
                fetchMaterials();
              } else {
                fetchQuestionPapers();
              }
            } catch (error) {
              Alert.alert('Error', `Failed to delete document: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'file-pdf-box';
      case 'doc':
      case 'docx':
        return 'file-word-box';
      case 'ppt':
      case 'pptx':
        return 'file-powerpoint-box';
      case 'xls':
      case 'xlsx':
        return 'file-excel-box';
      default:
        return 'file-document-outline';
    }
  };

  const getFileTypeName = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint Presentation';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      default:
        return 'Document';
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            auth
              .signOut()
              .then(() => navigation.navigate('SignIn'))
              .catch(error => console.error('Sign out error: ', error));
          },
        },
      ],
    );
  };

  const handleDownload = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url); // This opens the file in browser
    } else {
      Alert.alert('Error', 'Unable to open the document.');
    }
  } catch (error) {
    console.error('Download Error:', error);
    Alert.alert('Error', 'Something went wrong while trying to download.');
  }
};

  const renderMaterialCard = (material) => (
    <TouchableOpacity
      key={material.id}
      style={styles.card}
      onPress={() => handleDownload(material.fileUrl)}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon
          name={getFileTypeIcon(material.title)}
          size={24}
          color={COLORS.text.light}
        />
      </LinearGradient>
      
      <View style={styles.cardContent}>
        <Text style={styles.materialTitle}>{material.title}</Text>
        <Text style={styles.materialInfo}>
          {getFileTypeName(material.title)} • Semester {material.semester}
        </Text>
        <Text style={styles.materialDescription} numberOfLines={2}>
          {material.description}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => handleDownload(material.fileUrl)}
        >
          <Icon
            name="download"
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {isTeacher && (
          <TouchableOpacity 
            style={[styles.downloadButton, styles.deleteButton]}
            onPress={() => deleteDocument(material.id, 'studyMaterials')}
          >
            <Icon
              name="delete"
              size={20}
              color={COLORS.status.error}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderQuestionPaperCard = (paper) => {
    // Add date validation
    const formatDate = (dateString) => {
      try {
        const date = paper.uploadDate ? new Date(paper.uploadDate) : null;
        if (date && !isNaN(date.getTime())) {
          return formatDistanceToNow(date, { addSuffix: true });
        }
        return 'Date not available';
      } catch (error) {
        console.log('Date formatting error:', error);
        return 'Date not available';
      }
    };

    return (
      <TouchableOpacity
        key={paper.id}
        style={styles.card}
        onPress={() => handleDownload(paper.fileUrl)}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon
            name={getFileTypeIcon(paper.title)}
            size={24}
            color={COLORS.text.light}
          />
        </LinearGradient>
        
        <View style={styles.cardContent}>
          <Text style={styles.materialTitle}>{paper.title}</Text>
          <Text style={styles.materialInfo}>
            Semester {paper.semester} • {formatDate(paper.uploadDate)}
          </Text>
          {paper.description && (
            <Text style={styles.materialDescription} numberOfLines={2}>
              {paper.description}
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={() => handleDownload(paper.fileUrl)}
          >
            <Icon
              name="download"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          {isTeacher && (
            <TouchableOpacity 
              style={[styles.downloadButton, styles.deleteButton]}
              onPress={() => deleteDocument(paper.id, 'questionPapers')}
            >
              <Icon
                name="delete"
                size={20}
                color={COLORS.status.error}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading || uploading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        {uploading && <Text style={styles.loadingText}>Uploading document, please wait...</Text>}
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2023/01/09/16/43/neon-frame-2410534_1280.jpg' }}
      style={styles.background}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Semester Picker */}
          <Picker
            selectedValue={currentSemester}
            onValueChange={setCurrentSemester}
            style={styles.semesterPicker}
          >
            {semesters.map((semester) => (
              <Picker.Item key={semester} label={`Semester ${semester}`} value={semester} />
            ))}
          </Picker>

          {/* Study Materials Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Study Materials</Text>
            {isTeacher && (
              <TouchableOpacity
                onPress={() => pickDocument('studyMaterials')}
                style={styles.uploadButton}
              >
                <Text style={styles.uploadButtonText}>Upload Study Material</Text>
              </TouchableOpacity>
            )}
            <ScrollView style={styles.materialList} contentContainerStyle={{ paddingBottom: 30 }}>
              {materials.map(renderMaterialCard)}
            </ScrollView>
          </View>

          {/* Question Papers Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Question Papers</Text>
            {isTeacher && (
              <TouchableOpacity
                onPress={() => pickDocument('questionPapers')}
                style={styles.uploadButton}
              >
                <Text style={styles.uploadButtonText}>Upload Question Paper</Text>
              </TouchableOpacity>
            )}
            <ScrollView style={styles.materialList} contentContainerStyle={{ paddingBottom: 30 }}>
              {questionPapers.map(renderQuestionPaperCard)}
            </ScrollView>
          </View>
        </ScrollView>

        <BottomNav navigation={navigation} currentRoute="StudyMaterial" />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  uploadButton: {
    backgroundColor: '#6200EE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#6200EE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  semesterPicker: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.s,
    marginBottom: SPACING.s,
    ...SHADOWS.medium,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  cardContent: {
    flex: 1,
    marginRight: SPACING.s,
  },
  materialTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  materialInfo: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  materialDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  materialList: {
    padding: SPACING.l,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: SPACING.xs,
  },
  deleteButton: {
    backgroundColor: `${COLORS.status.error}10`,
  },
  uploadIcon: {
    marginRight: SPACING.s,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    alignItems: 'center',
    marginBottom: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  uploadButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.light,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.m,
  },
});

export default StudyMaterialScreen;

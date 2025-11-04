import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { BottomNav } from './components/BottomNav';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from './theme';
import { formatDistanceToNow, format } from 'date-fns';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const formatUploadTime = (timestamp) => {
  if (!timestamp) return 'Date unknown';
  
  try {
    const date = timestamp.toDate();
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    const exactTime = format(date, 'MMM d, yyyy h:mm a');
    return `${timeAgo} (${exactTime})`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date unknown';
  }
};

const StatusUpdateScreen = ({ navigation }) => {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLikes, setCurrentLikes] = useState({});
  const [currentDislikes, setCurrentDislikes] = useState({});

  const fetchRecentUpdates = async () => {
    setLoading(true);
    try {
      const recentSnapshot = await getDocs(collection(db, 'recentUpdates'));
      const recentData = recentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecentUpdates(recentData);
    } catch (error) {
      console.error('Error fetching recent updates: ', error);
      Alert.alert('Error', 'Failed to fetch recent updates.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentUpdates();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRecentUpdates();
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleLike = (item) => {
    // Implement like functionality
  };

  const handleDislike = (item) => {
    // Implement dislike functionality
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.dateContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
          <Text style={styles.date}>{formatUploadTime(item.createdAt)}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handleImagePress(item.imageUrl)}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item)}
        >
          <MaterialCommunityIcons name="thumb-up-outline" size={24} color="#6200EE" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDislike(item)}
        >
          <MaterialCommunityIcons name="thumb-down-outline" size={24} color="#6200EE" />
          <Text style={styles.actionText}>Dislike</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={recentUpdates}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            colors={['#6200EE']}
            tintColor="#6200EE"
          />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No updates available</Text>
            </View>
          )
        }
        ListFooterComponent={<View style={styles.bottomPadding} />}
      />

      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={() => setShowModal(false)}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <BottomNav navigation={navigation} currentRoute="StatusUpdate" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  cardFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 80,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
});

export default StatusUpdateScreen;

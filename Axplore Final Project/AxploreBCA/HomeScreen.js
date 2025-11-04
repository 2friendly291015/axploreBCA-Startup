import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING, COLORS } from './theme';
import { BottomNav } from './components/BottomNav';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsUpdates, setNewsUpdates] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [zoomedNewsItem, setZoomedNewsItem] = useState(null);
  const [zoomedEventItem, setZoomedEventItem] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState({});

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setIsTeacher(userDoc.data().role === 'teacher');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchNewsUpdates = async () => {
    setLoading(true);
    try {
      const newsSnapshot = await getDocs(collection(db, 'newsUpdates'));
      const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsUpdates(newsData);
    } catch (error) {
      console.error('Error fetching news updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    setLoading(true);
    try {
      const eventsSnapshot = await getDocs(collection(db, 'upcomingEvents'));
      const eventsData = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Parse the date string to get individual dates
        let startDate = data.date;
        let endDate = data.date;

        if (data.date && data.date.includes('to')) {
          [startDate, endDate] = data.date.split(' to ');
        }

        return {
          id: doc.id,
          ...data,
          startDate: startDate,
          endDate: endDate,
          venue: data.venue || 'No venue specified'
        };
      });
      console.log('Fetched Events:', eventsData); // For debugging
      setUpcomingEvents(eventsData);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchNewsUpdates();
    fetchUpcomingEvents();

    // Add navigation listener to refresh data when returning from AdminUpload
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNewsUpdates();
      fetchUpcomingEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchNewsUpdates();
    fetchUpcomingEvents();
    setIsRefreshing(false);
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
              .catch(error => console.error('Sign out error: ', error));
          },
        },
      ],
    );
  };

  const handleJoinEvent = (eventId) => {
    setJoinedEvents(prev => {
      if (prev[eventId]) {
        Alert.alert(
          'Cancel Event',
          'Are you sure you want to cancel your participation?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                const newJoinedEvents = { ...prev };
                delete newJoinedEvents[eventId];
                setJoinedEvents(newJoinedEvents);
                Alert.alert('Cancelled', 'You will no longer receive notifications for this event.');
              }
            }
          ]
        );
        return prev;
      } else {
        Alert.alert(
          'Join Event',
          'You will receive notifications about this event. Would you like to proceed?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                setJoinedEvents(current => ({
                  ...current,
                  [eventId]: true
                }));
                Alert.alert('Success', 'You will be notified about updates for this event!');
              }
            }
          ]
        );
        return prev;
      }
    });
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <MaterialCommunityIcons name="magnify" size={20} color="#9BA3AF" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search news & events..."
        placeholderTextColor="#9BA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch}>
          <MaterialCommunityIcons name="close-circle" size={18} color="#9BA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return '';
      
      // Handle Firestore Timestamp
      if (dateValue.toDate) {
        return format(dateValue.toDate(), 'MMM dd, yyyy');
      }
      
      // Handle string date
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return dateValue; // Return original if invalid
        return format(date, 'MMM dd, yyyy');
      }
      
      // Handle Date object
      if (dateValue instanceof Date) {
        return format(dateValue, 'MMM dd, yyyy');
      }
      
      return '';
    } catch (error) {
      console.log('Date formatting error:', error);
      return '';
    }
  };

  const parseDate = (dateStr) => {
    try {
      return new Date(dateStr);
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return null;
    }
  };

  const formatDateDisplay = (dateStr) => {
    try {
      const date = parseDate(dateStr);
      if (!date) return '';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return dateStr; // Return original string if formatting fails
    }
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => setZoomedNewsItem(item.id === zoomedNewsItem ? null : item.id)}
    >
      <LinearGradient
        colors={['#6200EE', '#3700B3']}
        style={styles.newsIconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons name="newspaper-variant" size={24} color="#FFFFFF" />
      </LinearGradient>
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={zoomedNewsItem === item.id ? undefined : 2}>
          {item.title}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={zoomedNewsItem === item.id ? undefined : 2}>
          {item.content}
        </Text>
        <View style={styles.newsFooter}>
          <View style={styles.newsDateContainer}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
            <Text style={styles.newsDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => setZoomedNewsItem(item.id === zoomedNewsItem ? null : item.id)}
          >
            <Text style={[styles.readMoreText, { color: '#6200EE' }]}>
              {zoomedNewsItem === item.id ? 'Show Less' : 'Read More'}
            </Text>
            <MaterialCommunityIcons 
              name={zoomedNewsItem === item.id ? "chevron-up" : "chevron-right"} 
              size={16} 
              color="#6200EE" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }) => {
    // Extract day and month from the startDate string
    const getDateParts = (dateStr) => {
      try {
        const [month, day, year] = dateStr.split(' ');
        return { day: day.replace(',', ''), month };
      } catch (error) {
        return { day: '', month: '' };
      }
    };

    const { day, month } = getDateParts(item.startDate);

    return (
      <TouchableOpacity 
        style={styles.eventCard}
        onPress={() => setZoomedEventItem(item.id === zoomedEventItem ? null : item.id)}
      >
        <LinearGradient
          colors={['#6200EE', '#3700B3']}
          style={styles.eventDateBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.eventDateDay}>{day}</Text>
          <Text style={styles.eventDateMonth}>{month}</Text>
        </LinearGradient>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={zoomedEventItem === item.id ? undefined : 1}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.eventDescription} numberOfLines={zoomedEventItem === item.id ? undefined : 2}>
              {item.description}
            </Text>
          )}
          <View style={styles.eventFooter}>
            <View style={styles.eventTimeLocation}>
              <View style={styles.eventDetail}>
                <MaterialCommunityIcons name="calendar-range" size={14} color="#6B7280" />
                <Text style={styles.eventDetailText}>
                  {item.startDate === item.endDate ? 
                    item.startDate : 
                    `${item.startDate} - ${item.endDate}`
                  }
                </Text>
              </View>
              <View style={styles.eventDetail}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#6B7280" />
                <Text style={styles.eventDetailText}>{item.venue}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[
                styles.eventButton, 
                joinedEvents[item.id] ? styles.joinedEventButton : null
              ]}
              onPress={() => handleJoinEvent(item.id)}
            >
              <Text style={styles.eventButtonText}>
                {joinedEvents[item.id] ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#1F2937" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  const filteredNewsUpdates = newsUpdates.filter((update) =>
    update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpcomingEvents = upcomingEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    header: {
      paddingTop: Platform.OS === 'android' ? 4 : 4,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: -15,
      paddingBottom: 10,
      borderBottomWidth: 0,
      borderBottomColor: '#F3F4F6',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      paddingVertical: 4,
    },
    logoContainer: {
      width: Platform.OS === 'ios' ? 150 : 150,
      height: '100%',
      justifyContent: 'center',
      marginLeft: -30,
    },
    logo: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      alignSelf: 'flex-start',
    },
    contentContainer: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    listContent: {
      padding: 16,
      paddingBottom: Platform.OS === 'ios' ? 120 : 140,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginLeft: -30,
      marginRight: 8,
      height: 42,
      minWidth: Platform.OS === 'ios' ? 200 : 180,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#1F2937',
      marginLeft: 8,
      paddingVertical: 0,
      minWidth: Platform.OS === 'ios' ? 160 : 140,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 24,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      marginLeft: 8,
    },
    newsCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      marginBottom: 16,
      flexDirection: 'row',
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    newsIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    newsContent: {
      flex: 1,
    },
    newsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 8,
    },
    newsDescription: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 12,
      lineHeight: 20,
    },
    newsFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    newsDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    newsDate: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
    },
    readMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(98, 0, 238, 0.05)',
    },
    readMoreText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6200EE',
      marginRight: 4,
    },
    eventCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      marginBottom: 16,
      flexDirection: 'row',
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    eventDateBadge: {
      width: 64,
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventDateDay: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    eventDateMonth: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    eventContent: {
      flex: 1,
      padding: 16,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    eventDescription: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 12,
      lineHeight: 20,
    },
    eventFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    eventTimeLocation: {
      flex: 1,
    },
    eventDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    eventDetailText: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
      flex: 1,
    },
    eventButton: {
      backgroundColor: '#6200EE',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    joinedEventButton: {
      backgroundColor: '#3B82F6',
    },
    eventButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 96,
    },
    fabGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    bottomNavContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('./assets/logo.png')} 
              style={styles.logo}
            />
          </View>
          {renderSearchBar()}
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#6200EE']}
            tintColor="#6200EE"
            progressViewOffset={Platform.OS === 'android' ? 50 : 0}
          />
        }
        scrollEventThrottle={16}
        overScrollMode="never"
        bounces={true}
      >
        {/* News Section */}
        {renderSectionHeader('Latest News', 'newspaper-variant-outline')}
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" style={{ marginVertical: 20 }} />
        ) : (
          newsUpdates.map(item => renderNewsItem({ item }))
        )}

        {/* Events Section */}
        {renderSectionHeader('Upcoming Events', 'calendar-clock')}
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" style={{ marginVertical: 20 }} />
        ) : (
          upcomingEvents.map(item => renderEventItem({ item }))
        )}
      </ScrollView>

      {/* FAB for admin uploads */}
      {isTeacher && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => {
            navigation.navigate('AdminUpload', {
              onUpdateSuccess: () => {
                fetchNewsUpdates();
                fetchUpcomingEvents();
              }
            });
          }}
        >
          <LinearGradient
            colors={['#6200EE', '#3700B3']}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNav navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

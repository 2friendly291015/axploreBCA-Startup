import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING, COLORS } from './theme';

const { width, height } = Dimensions.get('window');

const IntroductionScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Welcome to AxploreBCA',
      description: 'Your one-stop solution for all BCA study materials and updates',
      image: require('./assets/intro1.png'),
      icon: 'school',
    },
    {
      id: 2,
      title: 'Stay Updated',
      description: 'Get instant notifications about college news and upcoming events',
      image: require('./assets/intro2.png'),
      icon: 'bell-ring',
    },
    {
      id: 3,
      title: 'Access Study Materials',
      description: 'Download and study from a vast collection of learning resources',
      image: require('./assets/intro3.png'),
      icon: 'book-open-variant',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.primary,
    },
    slide: {
      flex: 1,
    },
    imageSection: {
      height: height * 0.6,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    icon: {
      marginBottom: SPACING.xl,
    },
    image: {
      width: width * 0.85,
      height: height * 0.4,
      resizeMode: 'contain',
      opacity: 1,
    },
    contentSection: {
      flex: 1,
      backgroundColor: COLORS.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xl * 1.5,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
    },
    title: {
      ...TYPOGRAPHY.h1,
      color: COLORS.text.primary,
      fontSize: 28,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: SPACING.m,
    },
    description: {
      ...TYPOGRAPHY.body1,
      color: COLORS.text.secondary,
      fontSize: 16,
      textAlign: 'center',
      maxWidth: '90%',
      lineHeight: 24,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.background,
      paddingHorizontal: SPACING.xl,
      paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl,
      paddingTop: SPACING.l,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: SPACING.xl,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: `${COLORS.primary}40`,
      marginHorizontal: 4,
    },
    activeDot: {
      width: 24,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.primary,
      marginHorizontal: 4,
    },
    button: {
      height: 56,
      borderRadius: BORDER_RADIUS.xl,
      overflow: 'hidden',
      ...SHADOWS.medium,
    },
    buttonGradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.light,
      fontSize: 18,
      fontWeight: '600',
      marginRight: SPACING.s,
    },
  });

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        onIndexChanged={setCurrentIndex}
        showsPagination={false}
        autoplay={false}
        scrollEnabled={true}
        horizontal={true}
        bounces={false}
        removeClippedSubviews={true}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={32}
        decelerationRate={0.992}
        pagingEnabled={true}
        containerStyle={{ flex: 1 }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.imageSection}>
              <MaterialCommunityIcons
                name={slide.icon}
                size={80}
                color={COLORS.text.light}
                style={[styles.icon, { opacity: 0.9 }]}
              />
              <Image 
                source={slide.image} 
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.contentSection}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </Swiper>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={`dot-${index}`} // ✅ FIXED: Added unique key
              style={index === currentIndex ? styles.activeDot : styles.dot}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (currentIndex === slides.length - 1) {
              navigation.navigate('SignIn');
            } else {
              setCurrentIndex(prev => prev + 1);
            }
          }}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <MaterialCommunityIcons
              name={currentIndex === slides.length - 1 ? 'arrow-right-circle' : 'arrow-right'}
              size={24}
              color={COLORS.text.light}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroductionScreen;

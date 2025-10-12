import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants';

const HomeMainScreen = ({ navigation }: any) => {
  // TODO: Backend developer - Replace with actual user data from authentication
  const userName = 'John Smith';

  const navigationCards = [
    {
      id: 'windows',
      title: 'Windows',
      icon: '🪟',
      description: 'Measure & quote windows',
      color: Colors.primary,
      onPress: () => navigation.navigate('NewJob', { category: 'WINDOWS' }),
    },
    {
      id: 'glass',
      title: 'Glass',
      icon: '◇',
      description: 'Measure & quote glass',
      color: '#10B981',
      onPress: () => navigation.navigate('NewJob', { category: 'GLASS' }),
    },
    {
      id: 'doors',
      title: 'Doors',
      icon: '🚪',
      description: 'Measure & quote doors',
      color: '#F59E0B',
      onPress: () => navigation.navigate('NewJob', { category: 'DOORS' }),
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: '📁',
      description: 'View all estimates & jobs',
      color: '#8B5CF6',
      onPress: () => navigation.navigate('Projects'),
    },
    {
      id: 'calendar',
      title: 'Calendar',
      icon: '📅',
      description: 'Scheduled jobs',
      color: '#EC4899',
      onPress: () => navigation.navigate('Calendar'),
    },
    {
      id: 'leads',
      title: 'Leads',
      icon: '👥',
      description: 'Potential customers',
      color: '#06B6D4',
      onPress: () => navigation.navigate('Leads'),
    },
    {
      id: 'converter',
      title: 'Converter',
      icon: '🔢',
      description: 'Fraction ↔ Decimal',
      color: '#EF4444',
      onPress: () => navigation.navigate('Converter'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* User Icon/Avatar */}
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {userName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          {/* User Name */}
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userNameText}>{userName}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Notifications Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              // TODO: Backend developer - Implement notifications feature
              console.log('Notifications pressed');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.iconButtonText}>🔔</Text>
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.iconButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardGrid}>
          {navigationCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { borderLeftColor: card.color }]}
              onPress={card.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: card.color + '15' }]}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
              </View>
              <View style={styles.cardArrow}>
                <Text style={styles.cardArrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButtonText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  cardGrid: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    minHeight: 80,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  cardArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArrowText: {
    fontSize: 28,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeMainScreen;

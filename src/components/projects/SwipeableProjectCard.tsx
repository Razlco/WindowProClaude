import React, { memo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Linking, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants';
import { Job } from '../../types';
import ProjectCard from './ProjectCard';

interface SwipeableProjectCardProps {
  job: Job;
  viewMode: 'compact' | 'detailed';
  onPress: (jobId: string) => void;
  onStatusPress?: (job: Job) => void;
  onWorkflowPress?: (job: Job) => void;
  onEmailPress?: (job: Job) => void;
  onCallPress?: (job: Job) => void;
}

const SwipeableProjectCard = memo(
  ({
    job,
    viewMode,
    onPress,
    onStatusPress,
    onWorkflowPress,
    onEmailPress,
    onCallPress,
  }: SwipeableProjectCardProps) => {
    const swipeableRef = useRef<Swipeable>(null);

    const handleCall = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      swipeableRef.current?.close();
      if (onCallPress) {
        onCallPress(job);
      } else {
        // Default behavior: Open phone dialer
        const phoneNumber = job.customer.phone.replace(/[^0-9]/g, '');
        Linking.openURL(`tel:${phoneNumber}`).catch(() => {
          Alert.alert('Error', 'Unable to open phone dialer');
        });
      }
    };

    const handleEmail = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      swipeableRef.current?.close();
      if (onEmailPress) {
        onEmailPress(job);
      } else {
        // Default behavior: Open email client
        if (job.customer.email) {
          const subject = encodeURIComponent(`Project ${job.jobNumber}`);
          Linking.openURL(`mailto:${job.customer.email}?subject=${subject}`).catch(() => {
            Alert.alert('Error', 'Unable to open email client');
          });
        } else {
          Alert.alert('No Email', 'Customer email not available');
        }
      }
    };

    const handleSMS = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      swipeableRef.current?.close();
      // TODO: Backend developer - Implement SMS functionality
      const phoneNumber = job.customer.phone.replace(/[^0-9]/g, '');
      Linking.openURL(`sms:${phoneNumber}`).catch(() => {
        Alert.alert('Error', 'Unable to open messaging app');
      });
    };

    const renderLeftActions = (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [0, 0, 0, 1],
      });

      return (
        <View style={styles.leftActions}>
          <Animated.View style={[styles.actionButton, styles.callAction, { transform: [{ translateX: trans }] }]}>
            <TouchableOpacity onPress={handleCall} style={styles.actionTouchable} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.actionButton, styles.smsAction, { transform: [{ translateX: trans }] }]}>
            <TouchableOpacity onPress={handleSMS} style={styles.actionTouchable} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Text</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    const renderRightActions = (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const trans = dragX.interpolate({
        inputRange: [-101, -100, -50, 0],
        outputRange: [-1, 0, 0, 0],
      });

      return (
        <View style={styles.rightActions}>
          <Animated.View style={[styles.actionButton, styles.emailAction, { transform: [{ translateX: trans }] }]}>
            <TouchableOpacity onPress={handleEmail} style={styles.actionTouchable} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>📧</Text>
              <Text style={styles.actionText}>Email</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    return (
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        leftThreshold={30}
        rightThreshold={40}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
      >
        <ProjectCard
          job={job}
          viewMode={viewMode}
          onPress={onPress}
          onStatusPress={onStatusPress}
          onWorkflowPress={onWorkflowPress}
        />
      </Swipeable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.job.id === nextProps.job.id &&
      prevProps.job.updatedAt === nextProps.job.updatedAt &&
      prevProps.viewMode === nextProps.viewMode
    );
  }
);

const styles = StyleSheet.create({
  leftActions: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rightActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  actionTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callAction: {
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  smsAction: {
    backgroundColor: Colors.info,
    marginRight: 4,
  },
  emailAction: {
    backgroundColor: Colors.primary,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SwipeableProjectCard;

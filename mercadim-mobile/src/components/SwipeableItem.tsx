import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

const TrashIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type SwipeableItemProps = {
  children: React.ReactNode;
  onDelete: () => void;
  onEdit: () => void;
  deleteLabel?: string;
  editLabel?: string;
};

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ 
  children, 
  onDelete, 
  onEdit,
  deleteLabel = 'Excluir',
  editLabel = 'Editar'
}) => {

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>, 
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <RectButton 
        onPress={onDelete}
        style={styles.rightAction}
      >
        <TrashIcon />
        <Text style={styles.actionText}>{deleteLabel}</Text>
      </RectButton>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>, 
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <RectButton 
        onPress={onEdit}
        style={styles.leftAction}
      >
        <EditIcon />
        <Text style={styles.actionText}>{editLabel}</Text>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      overshootLeft={false}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    backgroundColor: '#FCA537',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  rightAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});

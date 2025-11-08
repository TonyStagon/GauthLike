import React from 'react';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface CropMaskProps {
  boxLeft: SharedValue<number>;
  boxTop: SharedValue<number>;
  boxWidth: SharedValue<number>;
  boxHeight: SharedValue<number>;
  screenWidth: number;
  screenHeight: number;
}

export function CropMask({
  boxLeft,
  boxTop,
  boxWidth,
  boxHeight,
  screenWidth,
  screenHeight,
}: CropMaskProps) {
  const topMaskStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: boxTop.value,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }));

  const bottomMaskStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: boxTop.value + boxHeight.value,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }));

  const leftMaskStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: boxTop.value,
    left: 0,
    width: boxLeft.value,
    height: boxHeight.value,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }));

  const rightMaskStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: boxTop.value,
    right: 0,
    left: boxLeft.value + boxWidth.value,
    height: boxHeight.value,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }));

  return (
    <>
      <Animated.View style={topMaskStyle} />
      <Animated.View style={bottomMaskStyle} />
      <Animated.View style={leftMaskStyle} />
      <Animated.View style={rightMaskStyle} />
    </>
  );
}

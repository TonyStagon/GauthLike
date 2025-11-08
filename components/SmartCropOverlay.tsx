import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;
const CORNER_LENGTH = 32;

interface SmartCropOverlayProps {
  boxLeft: SharedValue<number>;
  boxTop: SharedValue<number>;
  boxWidth: SharedValue<number>;
  boxHeight: SharedValue<number>;
  minBoxSize: number;
  screenWidth: number;
  screenHeight: number;
}

export function SmartCropOverlay({
  boxLeft,
  boxTop,
  boxWidth,
  boxHeight,
  minBoxSize,
  screenWidth,
  screenHeight,
}: SmartCropOverlayProps) {
  const createDragGesture = (
    type: 'box' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  ) => {
    const startLeft = useSharedValue(0);
    const startTop = useSharedValue(0);
    const startWidth = useSharedValue(0);
    const startHeight = useSharedValue(0);

    return Gesture.Pan()
      .onStart(() => {
        startLeft.value = boxLeft.value;
        startTop.value = boxTop.value;
        startWidth.value = boxWidth.value;
        startHeight.value = boxHeight.value;
      })
      .onUpdate((event) => {
        if (type === 'box') {
          const newLeft = startLeft.value + event.translationX;
          const newTop = startTop.value + event.translationY;

          boxLeft.value = Math.max(
            0,
            Math.min(newLeft, screenWidth - boxWidth.value)
          );
          boxTop.value = Math.max(
            0,
            Math.min(newTop, screenHeight - boxHeight.value)
          );
        } else if (type === 'topLeft') {
          const newWidth = startWidth.value - event.translationX;
          const newHeight = startHeight.value - event.translationY;

          if (newWidth >= minBoxSize) {
            boxWidth.value = newWidth;
            boxLeft.value = startLeft.value + event.translationX;
          }
          if (newHeight >= minBoxSize) {
            boxHeight.value = newHeight;
            boxTop.value = startTop.value + event.translationY;
          }
        } else if (type === 'topRight') {
          const newWidth = startWidth.value + event.translationX;
          const newHeight = startHeight.value - event.translationY;

          if (
            newWidth >= minBoxSize &&
            startLeft.value + newWidth <= screenWidth
          ) {
            boxWidth.value = newWidth;
          }
          if (newHeight >= minBoxSize) {
            boxHeight.value = newHeight;
            boxTop.value = startTop.value + event.translationY;
          }
        } else if (type === 'bottomLeft') {
          const newWidth = startWidth.value - event.translationX;
          const newHeight = startHeight.value + event.translationY;

          if (newWidth >= minBoxSize) {
            boxWidth.value = newWidth;
            boxLeft.value = startLeft.value + event.translationX;
          }
          if (
            newHeight >= minBoxSize &&
            startTop.value + newHeight <= screenHeight
          ) {
            boxHeight.value = newHeight;
          }
        } else if (type === 'bottomRight') {
          const newWidth = startWidth.value + event.translationX;
          const newHeight = startHeight.value + event.translationY;

          if (
            newWidth >= minBoxSize &&
            startLeft.value + newWidth <= screenWidth
          ) {
            boxWidth.value = newWidth;
          }
          if (
            newHeight >= minBoxSize &&
            startTop.value + newHeight <= screenHeight
          ) {
            boxHeight.value = newHeight;
          }
        }
      });
  };

  const boxStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: boxLeft.value,
    top: boxTop.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  return (
    <Animated.View style={boxStyle}>
      <GestureDetector gesture={createDragGesture('box')}>
        <View style={styles.cropBox}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </GestureDetector>

      <GestureDetector gesture={createDragGesture('topLeft')}>
        <Animated.View style={[styles.handle, styles.handleTopLeft]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={createDragGesture('topRight')}>
        <Animated.View style={[styles.handle, styles.handleTopRight]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={createDragGesture('bottomLeft')}>
        <Animated.View style={[styles.handle, styles.handleBottomLeft]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={createDragGesture('bottomRight')}>
        <Animated.View style={[styles.handle, styles.handleBottomRight]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cropBox: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: '#FFF',
    borderTopLeftRadius: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: '#FFF',
    borderTopRightRadius: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: '#FFF',
    borderBottomLeftRadius: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: '#FFF',
    borderBottomRightRadius: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  handle: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleTopLeft: {
    top: -CORNER_SIZE / 2,
    left: -CORNER_SIZE / 2,
  },
  handleTopRight: {
    top: -CORNER_SIZE / 2,
    right: -CORNER_SIZE / 2,
  },
  handleBottomLeft: {
    bottom: -CORNER_SIZE / 2,
    left: -CORNER_SIZE / 2,
  },
  handleBottomRight: {
    bottom: -CORNER_SIZE / 2,
    right: -CORNER_SIZE / 2,
  },
  handleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

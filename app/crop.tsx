import { router, useLocalSearchParams } from 'expo-router';
import { Check, RotateCw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HANDLE_SIZE = 32;
const MIN_BOX_SIZE = 80;

export default function CropScreen() {
  const params = useLocalSearchParams();
  const { imageUri, autoBox } = params;
  const autoBoxEnabled = autoBox === 'true';

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const boxLeft = useSharedValue(SCREEN_WIDTH * 0.1);
  const boxTop = useSharedValue(SCREEN_HEIGHT * 0.3);
  const boxWidth = useSharedValue(SCREEN_WIDTH * 0.8);
  const boxHeight = useSharedValue(200);

  useEffect(() => {
    if (imageUri && typeof imageUri === 'string') {
      Image.getSize(imageUri, (width, height) => {
        setImageSize({ width, height });

        if (autoBoxEnabled) {
          const imageAspectRatio = width / height;
          const screenAspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

          let displayWidth, displayHeight, offsetX, offsetY;

          if (imageAspectRatio > screenAspectRatio) {
            displayWidth = SCREEN_WIDTH;
            displayHeight = SCREEN_WIDTH / imageAspectRatio;
            offsetX = 0;
            offsetY = (SCREEN_HEIGHT - displayHeight) / 2;
          } else {
            displayHeight = SCREEN_HEIGHT;
            displayWidth = SCREEN_HEIGHT * imageAspectRatio;
            offsetX = (SCREEN_WIDTH - displayWidth) / 2;
            offsetY = 0;
          }

          const boxW = displayWidth * 0.8;
          const boxH = displayHeight * 0.3;
          boxLeft.value = offsetX + (displayWidth - boxW) / 2;
          boxTop.value = offsetY + displayHeight * 0.35;
          boxWidth.value = boxW;
          boxHeight.value = boxH;
        }
      });
    }
  }, [imageUri, autoBoxEnabled]);

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
            Math.min(newLeft, SCREEN_WIDTH - boxWidth.value)
          );
          boxTop.value = Math.max(
            0,
            Math.min(newTop, SCREEN_HEIGHT - boxHeight.value)
          );
        } else if (type === 'topLeft') {
          const newWidth = startWidth.value - event.translationX;
          const newHeight = startHeight.value - event.translationY;

          if (newWidth >= MIN_BOX_SIZE) {
            boxWidth.value = newWidth;
            boxLeft.value = startLeft.value + event.translationX;
          }
          if (newHeight >= MIN_BOX_SIZE) {
            boxHeight.value = newHeight;
            boxTop.value = startTop.value + event.translationY;
          }
        } else if (type === 'topRight') {
          const newWidth = startWidth.value + event.translationX;
          const newHeight = startHeight.value - event.translationY;

          if (
            newWidth >= MIN_BOX_SIZE &&
            startLeft.value + newWidth <= SCREEN_WIDTH
          ) {
            boxWidth.value = newWidth;
          }
          if (newHeight >= MIN_BOX_SIZE) {
            boxHeight.value = newHeight;
            boxTop.value = startTop.value + event.translationY;
          }
        } else if (type === 'bottomLeft') {
          const newWidth = startWidth.value - event.translationX;
          const newHeight = startHeight.value + event.translationY;

          if (newWidth >= MIN_BOX_SIZE) {
            boxWidth.value = newWidth;
            boxLeft.value = startLeft.value + event.translationX;
          }
          if (
            newHeight >= MIN_BOX_SIZE &&
            startTop.value + newHeight <= SCREEN_HEIGHT
          ) {
            boxHeight.value = newHeight;
          }
        } else if (type === 'bottomRight') {
          const newWidth = startWidth.value + event.translationX;
          const newHeight = startHeight.value + event.translationY;

          if (
            newWidth >= MIN_BOX_SIZE &&
            startLeft.value + newWidth <= SCREEN_WIDTH
          ) {
            boxWidth.value = newWidth;
          }
          if (
            newHeight >= MIN_BOX_SIZE &&
            startTop.value + newHeight <= SCREEN_HEIGHT
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

  const handleCrop = () => {
    router.push({
      pathname: '/subject',
      params: {
        imageUri: imageUri,
        cropX: boxLeft.value,
        cropY: boxTop.value,
        cropWidth: boxWidth.value,
        cropHeight: boxHeight.value,
      },
    });
  };

  if (!imageUri || typeof imageUri !== 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No image provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.overlay} />

      <Animated.View style={boxStyle}>
        <GestureDetector gesture={createDragGesture('box')}>
          <View style={styles.selectionBox}>
            <View style={styles.boxBorder} />
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

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={() => router.back()}>
          <RotateCw size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.branding}>
          <View style={styles.brandIcon} />
          <Text style={styles.brandText}>Get pro</Text>
        </View>

        <TouchableOpacity style={styles.topButton} onPress={handleCrop}>
          <Check size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleCrop}>
          <View style={styles.confirmButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  topButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  brandIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    marginRight: 6,
  },
  brandText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectionBox: {
    flex: 1,
  },
  boxBorder: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#FFF',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleTopLeft: {
    top: -HANDLE_SIZE / 2,
    left: -HANDLE_SIZE / 2,
  },
  handleTopRight: {
    top: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
  handleBottomLeft: {
    bottom: -HANDLE_SIZE / 2,
    left: -HANDLE_SIZE / 2,
  },
  handleBottomRight: {
    bottom: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
  handleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  confirmButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  confirmButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF',
  },
});

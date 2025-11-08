import { CropMask } from '@/components/CropMask';
import { SmartCropOverlay } from '@/components/SmartCropOverlay';
import { detectTextRegion } from '@/utils/textDetection';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, RotateCw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HANDLE_SIZE = 32;
const MIN_BOX_SIZE = 80;

export default function CropScreen() {
  const params = useLocalSearchParams();
  const { imageUri, autoBox } = params;
  const autoBoxEnabled = autoBox === 'true';

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionComplete, setDetectionComplete] = useState(false);

  const boxLeft = useSharedValue(SCREEN_WIDTH * 0.1);
  const boxTop = useSharedValue(SCREEN_HEIGHT * 0.3);
  const boxWidth = useSharedValue(SCREEN_WIDTH * 0.8);
  const boxHeight = useSharedValue(200);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (imageUri && typeof imageUri === 'string') {
      Image.getSize(imageUri, async (width, height) => {
        setImageSize({ width, height });

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

        if (autoBoxEnabled) {
          setIsDetecting(true);
          const textRegion = await detectTextRegion(imageUri);
          setIsDetecting(false);

          if (textRegion) {
            const scaleX = displayWidth / width;
            const scaleY = displayHeight / height;

            const detectedLeft = offsetX + textRegion.left * scaleX;
            const detectedTop = offsetY + textRegion.top * scaleY;
            const detectedWidth = textRegion.width * scaleX;
            const detectedHeight = textRegion.height * scaleY;

            boxLeft.value = withSpring(detectedLeft, { damping: 20 });
            boxTop.value = withSpring(detectedTop, { damping: 20 });
            boxWidth.value = withSpring(detectedWidth, { damping: 20 });
            boxHeight.value = withSpring(detectedHeight, { damping: 20 });

            overlayOpacity.value = withTiming(1, { duration: 300 });
            setDetectionComplete(true);
          } else {
            const boxW = displayWidth * 0.8;
            const boxH = displayHeight * 0.3;
            boxLeft.value = withSpring(offsetX + (displayWidth - boxW) / 2);
            boxTop.value = withSpring(offsetY + displayHeight * 0.35);
            boxWidth.value = withSpring(boxW);
            boxHeight.value = withSpring(boxH);
            overlayOpacity.value = withTiming(1, { duration: 300 });
            setDetectionComplete(true);
          }
        } else {
          const boxW = displayWidth * 0.8;
          const boxH = displayHeight * 0.3;
          boxLeft.value = offsetX + (displayWidth - boxW) / 2;
          boxTop.value = offsetY + displayHeight * 0.35;
          boxWidth.value = boxW;
          boxHeight.value = boxH;
          overlayOpacity.value = 1;
          setDetectionComplete(true);
        }
      });
    }
  }, [imageUri, autoBoxEnabled]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
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

{isDetecting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Detecting text...</Text>
        </View>
      )}

      {detectionComplete && (
        <Animated.View style={overlayStyle}>
          <CropMask
            boxLeft={boxLeft}
            boxTop={boxTop}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            screenWidth={SCREEN_WIDTH}
            screenHeight={SCREEN_HEIGHT}
          />
          <SmartCropOverlay
            boxLeft={boxLeft}
            boxTop={boxTop}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            minBoxSize={MIN_BOX_SIZE}
            screenWidth={SCREEN_WIDTH}
            screenHeight={SCREEN_HEIGHT}
          />
        </Animated.View>
      )}

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
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -40 }],
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
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

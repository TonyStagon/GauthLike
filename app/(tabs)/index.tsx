import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, Image, Mic, RotateCw, Zap, ZapOff } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [autoBoxEnabled, setAutoBoxEnabled] = useState(true);
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera access is required to take photos
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        router.push({
          pathname: '/crop',
          params: {
            imageUri: photo.uri,
            autoBox: autoBoxEnabled.toString(),
          },
        });
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        enableTorch={flash}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={toggleFlash}>
              {flash ? (
                <Zap size={24} color="#FFF" fill="#FFF" />
              ) : (
                <ZapOff size={24} color="#FFF" />
              )}
            </TouchableOpacity>

            <View style={styles.branding}>
              <View style={styles.brandIcon} />
              <Text style={styles.brandText}>Get pro</Text>
            </View>

            <TouchableOpacity
              style={styles.topButton}
              onPress={toggleCameraFacing}>
              <RotateCw size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.centerContent}>
            <Text style={styles.title}>Take a pic and get{'\n'}an answer</Text>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.autoBoxContainer}>
              <TouchableOpacity
                style={styles.autoBoxButton}
                onPress={() => setAutoBoxEnabled(!autoBoxEnabled)}>
                <View
                  style={[
                    styles.autoBoxIcon,
                    autoBoxEnabled && styles.autoBoxIconActive,
                  ]}>
                  {autoBoxEnabled && <View style={styles.autoBoxDot} />}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton}>
                <Image size={24} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                <Mic size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomTabs}>
              <TouchableOpacity style={styles.tab}>
                <View style={styles.tabIcon} />
                <Text style={styles.tabText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                <Camera size={20} color="#FFF" />
                <Text style={[styles.tabText, styles.tabTextActive]}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <View style={styles.tabIcon} />
                <Text style={styles.tabText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  topBar: {
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  bottomBar: {
    paddingBottom: 40,
  },
  autoBoxContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  autoBoxButton: {
    padding: 8,
  },
  autoBoxIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoBoxIconActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  autoBoxDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    padding: 8,
  },
  tabActive: {},
  tabIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});

# Smart Crop Features

## Overview

The camera crop feature has been upgraded with automatic text detection and a modern UI that matches Brainly/Gauth style.

## Features Implemented

### 1. Automatic Text Detection

- When `autoBox` is enabled (default behavior), the app automatically detects text regions in captured images
- Uses ML Kit Text Recognition on native platforms (iOS/Android)
- Automatically positions and sizes the crop box around detected text
- Shows a loading indicator during detection with "Detecting text..." message

### 2. Modern Smart Crop UI

- **Corner Brackets**: Replaced full rectangle border with corner brackets (⎾ ⏋ ⏌ ⎿) for a cleaner look
- **Smart Mask**: Dark overlay outside crop area to focus attention on selected region
- **Smooth Animations**:
  - Fade-in animation when crop box appears
  - Spring animations when box auto-fits to detected text
  - Smooth transitions when adjusting crop area

### 3. Interactive Controls

- **Drag to Move**: Tap and drag inside the crop box to reposition
- **Corner Handles**: White dots at each corner for precise resizing
- **Visual Feedback**: Corner brackets with subtle glow effect using shadows
- **Responsive**: Maintains minimum box size and screen boundaries

## Technical Implementation

### New Files

1. **utils/textDetection.ts** - Text recognition using ML Kit
2. **utils/textDetection.web.ts** - Web fallback (returns null)
3. **components/SmartCropOverlay.tsx** - Modern crop UI with corner brackets
4. **components/CropMask.tsx** - Animated dark overlay for focus effect

### Updated Files

- **app/crop.tsx** - Enhanced with text detection and new UI components

### Dependencies Added

- `@react-native-ml-kit/text-recognition` - For text detection
- `expo-image-manipulator` - For image processing capabilities

## Usage

The feature works automatically when users take a photo:

1. User captures photo from camera
2. App navigates to crop screen
3. If autoBox enabled, text detection runs automatically
4. Crop box animates to fit detected text region
5. User can adjust crop area manually if needed
6. User confirms and proceeds to subject selection

## Platform Support

- **iOS/Android**: Full text detection with ML Kit
- **Web**: Manual crop only (auto-detection returns null)

## Styling Highlights

- Corner bracket length: 32px
- Corner thickness: 3px
- Corner color: White with blue glow (#4A90E2)
- Overlay darkness: rgba(0, 0, 0, 0.7)
- Handle size: 24x24px with 12px dot
- Animations: Spring damping of 20 for natural feel

## Future Enhancements

Potential improvements:

- Multi-region detection for multiple text blocks
- Confidence scoring to show detection accuracy
- Manual re-detection trigger
- Advanced image preprocessing for better detection

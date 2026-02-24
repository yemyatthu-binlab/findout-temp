---
sidebar_position: 4
---

# Development Guide

## Useful Scripts

- `yarn format` — Auto-format using Prettier
- `yarn clean:android` — Custom script for Android cleanup
- `yarn clean:ios` — Custom script for iOS cleanup

## Cleaning & Cache Reset (Important)

If you encounter build issues, especially after updating dependencies or native modules, a full cleanup is often the best solution.

### Reset Metro cache

```bash
yarn start --reset-cache
```

### Android clean build

```bash
cd android
./gradlew clean
cd ..
```

### iOS clean

```bash
cd ios
xcodebuild clean
cd ..
```

### Full cleanup

```bash
rm -rf node_modules
rm -rf android/.gradle android/app/build
rm -rf ios/Pods ios/Podfile.lock
yarn
cd ios && pod install && cd ..
```

> **Tip:** You can also run cleaning commands directly from package.json scripts:
>
> - `yarn clean:ios`
> - `yarn clean:android`
> - `yarn clean:gradle`
> - `yarn clean:yarn`

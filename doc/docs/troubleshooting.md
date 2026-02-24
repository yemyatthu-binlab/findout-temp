---
sidebar_position: 8
---

# Troubleshooting

## Common Issues

### Metro stuck or not reloading

Run `yarn start --reset-cache`

### Android build fails

Run `cd android && ./gradlew clean`

### iOS pods failing

1. `sudo gem install cocoapods`
2. `cd ios && pod repo update && pod install`

### App crashes on launch

1. Ensure `.env` is correct.
2. Re-install app: `yarn ios` / `yarn android`.

## Further Reading

- [React Native CLI Docs](https://reactnative.dev/docs/environment-setup)
- [Android Build System](https://developer.android.com/studio/build)
- [Xcode App Distribution](https://developer.apple.com/documentation/xcode/distributing-your-app-for-testing-and-release)
- [React Navigation](https://reactnavigation.org/)

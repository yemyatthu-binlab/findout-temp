---
sidebar_position: 2
---

# Getting Started

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/patchwork-hub/findout-app
cd findout-app
```

### 2. Install Dependencies

```bash
yarn
```

### 3. Install iOS Pods (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Environment Variables

Create a `.env` file at the project root with the following variables:

```bash
# URL of your Mastodon instance
API_URL: https://findout-media.social

# URL of Patchwork Dashboard (optional)
DASHBOARD_API_URL: https://dashboard.channel.org

# Environment
ENV_TYPE: production

# Client key and secret of Mastodon application
# Log in with the instance owner account and go to the /settings/applications page of your Mastodon instance.
# Create a new application with the scopes: read, profile, write, follow, and push.
CLIENT_ID: YOUR_CLIENT_ID
CLIENT_SECRET_TOKEN: YOUR_CLIENT_SECRET

# Application monitoring tool
SENTRY_DSN: https://07f1a2a85e@o43dd22288.ingest.us.sentry.io/13727228

# GIF keyboard
TENOR_API_KEY: AIdusk8k28339md89229kdskdh
```

After modifying `.env`, always reset the cache:

```bash
yarn start --reset-cache
```

## Running in Development

### Start Metro

Start the Metro bundler if it doesn't auto-start:

```bash
yarn start
```

### Run iOS

```bash
yarn ios
# or
npx react-native run-ios
```

### Run Android

```bash
yarn android
# or
npx react-native run-android
```

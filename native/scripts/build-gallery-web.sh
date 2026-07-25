#!/usr/bin/env bash
# Build the Expo web bundle for the Specimen gallery and write it to app/public/native-app/.
# Re-run this whenever the native screens change, then commit app/public/native-app/.
set -euo pipefail
cd "$(dirname "$0")/.."          # native/
npx expo install react-native-svg >/dev/null 2>&1 || true
EXPO_PUBLIC_BASE_URL=/native-app npx expo export --platform web \
  --output-dir ../app/public/native-app --clear
echo "built -> app/public/native-app"

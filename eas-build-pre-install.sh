#!/bin/bash
# Suppression manuelle du boost.podspec de React Native AVANT le pod install
echo "🧹 Suppression de react-native/third-party-podspecs/boost.podspec"
rm -f node_modules/react-native/third-party-podspecs/boost.podspec

#!/bin/bash

echo "=== Checking React Native App Logs ==="
echo ""
echo "1. Metro Bundler Status:"
curl -s http://localhost:8081/status || echo "Metro bundler not running"
echo ""
echo ""
echo "2. Recent iOS Simulator Logs (Meallan app):"
xcrun simctl spawn "6026DE1D-ED2A-4010-B5BD-885DEC312B46" log show --predicate 'processImagePath contains "Meallan" OR subsystem contains "com.facebook.react"' --last 1m --style compact 2>&1 | grep -i "error\|warning\|api\|restaurant\|location\|fetch\|network" | tail -30
echo ""
echo ""
echo "3. Checking if app is installed:"
xcrun simctl listapps "6026DE1D-ED2A-4010-B5BD-885DEC312B46" | grep -i "meallan\|club" || echo "App not found in simulator"
echo ""
echo ""
echo "4. Build Status:"
ps aux | grep -i "xcodebuild\|react-native.*run-ios" | grep -v grep | head -3 || echo "No build process running"


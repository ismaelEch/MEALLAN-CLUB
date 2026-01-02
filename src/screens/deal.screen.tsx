import React from 'react';
import { StyleSheet, useColorScheme, View, Text } from 'react-native';

import { XColors } from '../config/constants';

function DealScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? XColors.darker : XColors.lighter
  };

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {},
});

export default DealScreen;

import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function MealScreen(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={{...backgroundStyle, ...styles.screen}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {},
});

export default MealScreen;

import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Slider } from '@miblanchard/react-native-slider';
import { Picker } from '@react-native-picker/picker';


import { XColors } from '../config/constants';
import { useFocusEffect } from '@react-navigation/native';
import { fetchRestaurants } from '../redux/actions/retaurantAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

function SettingsScreen() {
  const { t, i18n } = useTranslation();

  const [distance, setDistance] = React.useState(100);
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    i18n.language || 'en',
  );

  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
  ];

  // Save language selection
  const setLanguage = async (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const getInitialDistance = async () => {
    const localDistance = await AsyncStorage.getItem('distance');
    setDistance(parseInt(localDistance || '100'));
  };

  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, [distance]),
  );

  useFocusEffect(
    useCallback(() => {
      getInitialDistance();
    }, []),
  );

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <View style={{ height: 20 }} />
      <Text style={{ color: XColors.dark }}>
        {t('Distance')} ( {distance} ) KM
      </Text>
      <Slider
        value={distance}
        minimumTrackTintColor={XColors.orange}
        thumbTintColor={XColors.orange}
        minimumValue={5}
        step={5}
        maximumValue={100}
        onValueChange={async value => {
          await AsyncStorage.setItem('distance', String(value[0]));
          setDistance(value[0]);
        }}
      />

      <View style={{ height: 20 }} />
      <Text style={{ color: XColors.dark }}>{t('Select Language')}</Text>
      <Picker
        style={{ color: XColors.dark }}
        itemStyle={{ color: XColors.dark }}
        selectedValue={selectedLanguage}
        onValueChange={setLanguage}>
        {languages.map(lang => (
          <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
});

export default SettingsScreen;

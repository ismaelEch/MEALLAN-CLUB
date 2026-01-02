import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { XColors } from '../config/constants';
import { RestaurantCard } from './restaurant-card.component';
import { MealBar } from './meal-bar.component';
import { Screens } from '../config/constants';
import { useNavigation } from '@react-navigation/native';
import { convertCurrency } from '../utils/currency';

export type MealSearchProps = {
  results: Array<any>;
  heartIcon: string;
};

function MealSearch(props: MealSearchProps) {
  const navigation: any = useNavigation();

  return (
    <ScrollView>
      <View style={[styles.backgroundStyle, styles.screen]}>
        {props.results.map((item, i) => (
          <View key={item.title + i}>
            <RestaurantCard
              {...item}
              key={item.title + i}
              heartIcon={props.heartIcon}
              onClick={() =>
                navigation.navigate(Screens.RESTAURANT_SCREEN, {
                  distance: item?.distance,
                  id: item?.id,
                })
              }
            />
            <View style={styles.mealBarContainer}>
              {item.meals &&
                item.meals.map((meal: any, k: number) => (
                  <MealBar
                    currencySymbol={convertCurrency(
                      item?.currency?.code || '$',
                    )}
                    {...meal}
                    key={meal?.label + k}
                  />
                ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingBottom: 300 },
  backgroundStyle: {
    backgroundColor: XColors.lighter
  },
  mealBarContainer: {
    paddingHorizontal: 30,
  },
});

export default MealSearch;

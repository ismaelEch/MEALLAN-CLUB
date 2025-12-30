import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { XColors } from '../config/constants';

import { Accented, Heading } from './../components/formatting.component';
import { CDNURL } from '../config/Url';

export type MealBarProps = {
  label: string;
  currencySymbol?: string;
  picture?: string;
  rating?: Double;
  price?: Double;
  pointsToBuy?: number;

  onAddToCart?: (e: GestureResponderEvent) => void;
  onPress?: (e: GestureResponderEvent) => void;
};

export const MealBar = (props: MealBarProps) => {
  const {
    label = 'Un named',
    rating = 0.0,
    price = 0.0,
    onAddToCart,
    picture,
    onPress,
    currencySymbol = '$',
  } = props;

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder}>
                <Image
                  style={styles.image}

                  source={{
                    uri: CDNURL + 'no-image.jpg',
                  }}
                />
              </View>
              {picture && (
                <Image
                  style={styles.image}

                  source={{
                    uri:  CDNURL + picture,
                  }}
                />
              )}
            </View>
            <View style={styles.rowSpaceBetween}>
              <View style={styles.textContainer}>
                <Heading level={3}>
                  <Text>{label}</Text>
                </Heading>
                {rating > 0 && (
                  <View style={styles.ratingContainer}>
                    <Accented>
                      <AntDesign name="star" size={14} />
                    </Accented>
                    <Accented>
                      <Text>{rating}Rating</Text>
                    </Accented>
                  </View>
                )}
                {onAddToCart ? (
                  <TouchableNativeFeedback onPress={onAddToCart}>
                    <View style={styles.addToCartButton}>
                      <Text style={styles.addToCartText}>Add to Cart</Text>
                    </View>
                  </TouchableNativeFeedback>
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.alignEnd}>
            <Heading level={3}>
              <Text>
                {currencySymbol} {price}
              </Text>
            </Heading>
            {props?.pointsToBuy && (
              <View style={styles.pointsContainer}>
                <Text>{props?.pointsToBuy}</Text>
                <Text style={styles.pointsText}>points</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 20,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginHorizontal: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addToCartButton: {
    backgroundColor: XColors.orange,
    alignItems: 'center',
    padding: 2,
    borderRadius: 500,
    width: 100,
  },
  addToCartText: {
    color: 'white',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  pointsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pointsText: {
    fontSize: 12,
  },
});

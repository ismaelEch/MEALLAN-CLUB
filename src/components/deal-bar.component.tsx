import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Heading } from './formatting.component';
import { CDNURL } from '../config/Url';

export type DealBarProps = {
  label: string;
  picture?: string;
  description: String;
  newPrice: String;
  oldPrice?: String;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  descriptionText: {
    maxWidth: 160,
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
});

export const DealBar = (props: DealBarProps) => {
  const { label, picture } = props;
  return (
    <View style={styles.container}>
      <TouchableNativeFeedback>
        <View style={styles.row}>
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
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Heading level={3}>
                  <Text>{label}</Text>
                </Heading>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>
                    {props.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Heading level={3}>
              <Text>{props.newPrice}</Text>
            </Heading>
            <Heading level={3} style={styles.oldPriceText}>
              <Text>{props.oldPrice}</Text>
            </Heading>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

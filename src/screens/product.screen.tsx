import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  Text,
  TouchableNativeFeedback,
} from 'react-native';


import AntDesign from 'react-native-vector-icons/AntDesign';

import { Accented, Heading } from '../components/formatting.component';
import { Screens, XColors } from '../config/constants';
import { useTranslation } from 'react-i18next';

function ProductScreen(props: any) {
  const { t } = useTranslation();

  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const [count, setCount] = React.useState(1);

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <View style={styles.banner}>
        <View style={styles.bannerImage}>
          <View style={StyleSheet.absoluteFill}>
            <Image
              style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
              source={require('./../../assets/burger.jpeg')}
            />
          </View>
          <View style={styles.headerButtonsRight}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{ ...styles.iconButton, marginLeft: 20 }}>
                <Accented>
                  <AntDesign name="arrowleft" size={24} />
                </Accented>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Heading level={1}>
                <Text>{t('Cheese Burger')}</Text>
              </Heading>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                disabled={count === 0}
                onPress={() => {
                  if (count > 0) setCount(count - 1);
                }}>
                <View
                  style={{
                    ...styles.iconButton,
                    backgroundColor: count > 0 ? XColors.accent : 'lightgrey',
                  }}>
                  <AntDesign name="minus" size={20} />
                </View>
              </TouchableOpacity>
              <Heading level={2} style={{paddingHorizontal: 10}}>
                <Text>{count}</Text>
              </Heading>
              <TouchableOpacity onPress={() => setCount(count + 1)}>
                <View
                  style={{
                    ...styles.iconButton,
                    backgroundColor: XColors.accent,
                  }}>
                  <AntDesign name="plus" size={20} />
                </View>
              </TouchableOpacity>
            </View> */}
            <View>
              <Heading level={2}>
                <Text>{t('$ 2.99')}</Text>
              </Heading>
              <Text>{t('23 Points')}</Text>
            </View>
          </View>
        </View>
        {/* <TouchableNativeFeedback disabled={count === 0} onPress={() => {}}>
          <View style={styles.addToCartButton}>
            <Heading level={3} style={{color: 'white'}}>
              <Text>{t('Order Now')}</Text>
            </Heading>
          </View>
        </TouchableNativeFeedback> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: {
    marginTop: 10,
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 45,
    height: 45,
    backgroundColor: XColors.lightgrey,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  banner: {
    backgroundColor: 'white',
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  bannerImage: {
    position: 'relative',
    height: 250,
  },
  headerButtonsRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    backgroundColor: XColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default ProductScreen;

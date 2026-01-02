import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import { XColors } from '../config/constants';
import { Accented } from './formatting.component';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';

type HeaderProps = {
  onPressMenu: (e: GestureResponderEvent) => void;
  onPressUser: (e: GestureResponderEvent) => void;
  onPressHeart: (e: GestureResponderEvent) => void;
  inputProps: TextInputProps;
  switchIcon: string;
};

export const Header = (props: HeaderProps) => {
  const isLogin = useSelector((state: any) => state.authentication.login_user);

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconsBar}>
          <TouchableOpacity
            hitSlop={{ right: 20, bottom: 20 }}
            onPress={props.onPressMenu}>
            <AntDesign name="menu-fold" size={20} style={styles.menuIcon} />
          </TouchableOpacity>
          <View style={styles.iconsRow}>
            <View
              style={[
                styles.iconButton,
                isLogin ? styles.iconButtonLoggedIn : styles.iconButtonDefault,
              ]}>
              {isLogin && (
                <TouchableOpacity
                  hitSlop={{ right: 20, bottom: 20 }}
                  onPress={props.onPressHeart}>
                  <Accented>
                    <AntDesign name={props.switchIcon} size={16} />
                  </Accented>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.iconButton}>
              <TouchableOpacity
                hitSlop={{ right: 20, bottom: 20 }}
                onPress={props.onPressUser}>
                <Accented>
                  <AntDesign name="user" size={16} />
                </Accented>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.headerRow}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholderTextColor={XColors.dark}
              style={styles.search}
              placeholder={t('Restaurants, meals')}
              {...props.inputProps}
            />
            <AntDesign style={styles.searchIcon} name="search1" size={16} />
          </View>
          <View style={styles.filterIcon}>
            <Accented>
              <AntDesign name="filter" size={16} />
            </Accented>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 3,
  },
  screen: {},
  header: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    paddingTop: 0,
  },
  body: {},
  iconsBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconsRow: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    width: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    color: XColors.dark,
    backgroundColor: XColors.lightgrey,
    borderRadius: 5,
    width: '100%',
    paddingLeft: 40,
    minHeight: 48,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: XColors.lightgrey,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonLoggedIn: {
    backgroundColor: XColors.lightgrey,
  },
  iconButtonDefault: {
    backgroundColor: 'white',
  },
  searchContainer: {
    flex: 9,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 16,
    color: XColors.dark,
  },

  filterIcon: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  menuIcon: {
    color: XColors.dark,
  },
});

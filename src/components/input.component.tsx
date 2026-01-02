import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { XColors } from '../config/constants';


type InputProps = TextInputProps & {
  icon: string;
};

export const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const inputBorderStyles = {
    borderColor: isFocused ? XColors.accent : XColors.lightgrey,
    borderWidth: 0.5,
    color: XColors.dark,
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholderTextColor={XColors.dark}
        style={{
          ...inputBorderStyles,
          ...styles.search,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <AntDesign
        style={styles.serachIcon}
        name={props.icon}
        color={isFocused ? XColors.accent : 'grey'}
        size={16}
      />
    </View>
  );
};

export const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputBorderStyles = {
    borderColor: isFocused ? XColors.accent : XColors.lightgrey,
    borderWidth: 0.5,
    color: XColors.dark,
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholderTextColor={XColors.dark}
        style={{
          ...inputBorderStyles,
          ...styles.search,
        }}
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={!showPassword}
      />
      <AntDesign
        style={styles.serachIcon}
        name={props.icon}
        color={isFocused ? XColors.accent : 'grey'}
        size={16}
      />
      <TouchableOpacity
        hitSlop={{ top: 50, bottom: 50, right: 50 }}
        onPress={() => setShowPassword(!showPassword)}
        style={styles.rightIconButton}>
        <AntDesign
          name={showPassword ? 'eye' : 'eyeo'}
          color={isFocused ? XColors.accent : 'grey'}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    backgroundColor: XColors.lightgrey,
    borderRadius: 5,
    width: '100%',
    paddingLeft: 40,
    // iOS: harmoniser la hauteur et l'espacement vertical
    minHeight: 48,
    paddingVertical: 12,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  serachIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    color: XColors.dark,
  },
  rightIconButton: { top: 15, right: 15, position: 'absolute' },
});

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Accented } from '../components/formatting.component';

import { Screens, XColors } from '../config/constants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

function ProfileScreen() {
  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);

  const [userData, setUserData] = useState({});

  const state = useSelector(x => x.authentication);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !state.user_data?.id) {
      navigation.navigate(Screens.LOGIN_SCREEN);
    }
  }, [isFocused, navigation, state]);

  const handleSave = async () => {
    try {
      const data = {};

      if (firstName) {
        data.firstname = firstName;
      }

      if (lastName) {
        data.lastname = lastName;
      }

      if (email) {
        data.email = email;
      }

      if (phone) {
        data.phone = phone;
      }


      const res = await axiosInstance.put(
        `/users/${state?.user_data?.id}`,
        data,
      );

      fetchProfile();
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAccount = () => {
  Alert.alert(
    t('Delete account'),
    t('Are you sure you want to delete your account permanently?'),
    [
      {
        text: t('Cancel'),
        style: 'cancel',
      },
      {
        text: t('Delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosInstance.delete(
              `/users/${state?.user_data?.id}`,
            );

            // 👉 ici tu peux aussi dispatch un logout si tu en as un
            // dispatch(logout());

            navigation.reset({
              index: 0,
              routes: [{ name: Screens.LOGIN_SCREEN }],
            });
          } catch (err) {
            console.log(err);
            Alert.alert(
              t('Error'),
              t('An error occurred while deleting the account'),
            );
          }
        },
      },
    ],
    { cancelable: true },
  );
};


  const fetchProfile = async () => {
    try {
      const res = await axiosInstance(`/users/${state?.user_data?.id}`);

      setFirstName(res?.data?.firstname);
      setLastName(res?.data?.lastname);
      setEmail(res?.data?.email);
      setPhone(res?.data?.phone);

      setUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCancel = () => {
    // Discard changes
    setFirstName(userData?.firstname);
    setLastName(userData?.lastname);
    setEmail(userData?.email);
    setPhone(userData?.phone);
    setEditing(false);
  };

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <View style={styles.field}>
        <Text style={styles.label}>{t('First Name')} :</Text>
        <TextInput
          placeholderTextColor={XColors.dark}
          style={styles.input}
          value={firstName === 'null' ? '' : firstName}
          onChangeText={setFirstName}
          editable={editing}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{t('Last Name')} :</Text>
        <TextInput
          placeholderTextColor={XColors.dark}
          style={styles.input}
          value={lastName === 'null' ? '' : lastName}
          onChangeText={setLastName}
          editable={editing}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{t('Email')} :</Text>
        <TextInput
          placeholderTextColor={XColors.dark}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={editing}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{t('Phone')} :</Text>
        <TextInput
          placeholderTextColor={XColors.dark}
          style={styles.input}
          value={phone === 'null' ? '' : phone}
          onChangeText={setPhone}
          editable={editing}
        />
      </View>
      {editing ? (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{t('Save')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>{t('Cancel')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(true)}>
          <Accented>
            <AntDesign name="edit" size={24} />
          </Accented>
        </TouchableOpacity>
        
      )}
      <TouchableOpacity
  style={styles.deleteButton}
  onPress={handleDeleteAccount}
>
  <Text style={styles.deleteButtonText}>
    {t('Delete my account')}
  </Text>
</TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  container: {},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    marginRight: 16,
    fontWeight: 'bold',
    color: XColors.dark,
  },
  input: {
    flex: 3,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: XColors.dark,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#4dc6e2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: XColors.lightgrey,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  deleteButton: {
  marginTop: 32,
  backgroundColor: '#e74c3c',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
deleteButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});

export default ProfileScreen;
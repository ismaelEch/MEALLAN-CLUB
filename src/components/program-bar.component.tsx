import React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Heading} from './../components/formatting.component';

export const ProgramBar = props => {
  return (
    <View
      style={{
        overflow: 'hidden',
        borderRadius: 5,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        backgroundColor: 'white',
      }}>
      <TouchableNativeFeedback>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Heading level={3}>
                <Text>15</Text>
              </Heading>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{marginHorizontal: 10}}>
                <Heading level={3}>
                  <Text>Cheese Burger</Text>
                </Heading>
                <View
                  style={{
                    marginBottom: 5,
                  }}>
                  <Text>HEAVY RESTAURANT</Text>
                  <Text>Crunch Burger</Text>
                </View>
              </View>
            </View>
          </View>
          <Heading level={3}>
            <AntDesign name="down" />
          </Heading>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

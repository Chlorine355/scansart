import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"
import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


export default function SuggestLabel({ navigation, route }) {
  const { uri, name, id, width, height } = route.params;
  const [coords, setCoords] = useState([-10, -10]);
  const [text, onChangeText] = React.useState('');

  const submitSuggestion = (x, y, text) => {
    if (text === '') {
      Toast.show('Empty text!');
      return;
    }
    if (coords[0] < 0 || coords[1] < 0) {
      Toast.show('Tap on the picture to place the label!');
      return;
    }
    AsyncStorage.getItem('uuid')
      .then((device_id) => {
        if (device_id) {
          return device_id;
        } else {
          let new_device_id = uuid.v4();
          AsyncStorage.setItem('uuid', new_device_id);
          return new_device_id;
        }
      })
      .then((device_id) => {
        fetch(ip + 'suggest_label', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_id: id,
            x: Math.round(
              (x * width) / (width < deviceWidth ? width : deviceWidth - 30)
            ),
            y: Math.round(
              (y * height) /
                (width < deviceWidth
                  ? height
                  : height * ((deviceWidth - 30) / width))
            ),
            text: text,
            device_id: device_id,
          }),
        }).then(() => {
          Toast.show('Label suggested!');
        });
      });
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <ScrollView style={{ flex: 1, padding: 15, marginBottom: 0 }}>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            paddingBottom: 15,
            fontWeight: 600,
            textAlign: 'center',
          }}>
          Tap on the picture to place the label
        </Text>
        <TouchableWithoutFeedback
          onPress={(evt) => {
            setCoords([evt.nativeEvent.locationX, evt.nativeEvent.locationY]);
          }}>
          <View
            style={{
              flex: 0,
              height:
                width < deviceWidth
                  ? height
                  : height * ((deviceWidth - 30) / width),
              width: width < deviceWidth ? width : null,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              overflow: 'hidden',
            }}>
            <Image
              source={{ uri: uri }}
              style={{
                width: width < deviceWidth ? width : deviceWidth - 30,
                height:
                  width < deviceWidth
                    ? height
                    : height * ((deviceWidth - 30) / width),
              }}
            />
            <Ionicons
              name="ellipse"
              size={10}
              style={{
                position: 'absolute',
                top: coords[1],
                left: coords[0],
                color: primary_red,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        <TextInput
          onChangeText={onChangeText}
          value={text}
          placeholder="Type your suggestion to the chosen position..."
          multiline={true}
          style={{ backgroundColor: 'white', width: deviceWidth - 30 }}
        />
        <Button
          title="Submit"
          color={dark_red}
          onPress={() => submitSuggestion(coords[0], coords[1], text)}
        />
        <View style={{ marginVertical: 40 }} />
      </ScrollView>
    </View>
  );
}
import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';


import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"


export default function Map({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.picTitle}>Map yet to come</Text>
    </View>
  );
}
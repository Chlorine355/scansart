import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"

import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';



export default function Search({ navigation }) {
  const [text, setText] = React.useState('');
  const [resultList, setResultList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  function searchImages(query) {
    setLoading(true);
    fetch(ip + 'search_images/' + query, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed.' + response.status);
        }
      })
      .then(function (data) {
        setResultList(data);
        // console.log(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error.message);
        return null;
      });
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#fff',
      }}>
      <View>
        <TextInput
          style={styles.search_input}
          onChangeText={(value) => {
            setText(value);
            if (value.trim().length > 0) {
              searchImages(value);
            } else {
              setResultList([]);
            }
          }}
          value={text}
          placeholder={'e.g. La Gioconda'}
          cursorColor="black"
          autoFocus={false}
        />
        {text.length > 0 ? (
          <TouchableOpacity
            style={{ position: 'absolute', top: 25, right: 0 }}
            onPress={() => {
              setText('');
              setResultList([]);
            }}>
            <Ionicons name="close-outline" size={40} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={dark_red} />
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>
            {resultList.map((imageInfo) => (
              <View
                key={imageInfo.id}
                style={{ marginBottom: 20, width: deviceWidth - 40 }}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('Picture', {
                      uri: imageInfo.id,
                      is_uri: false,
                    });
                  }}>
                  <Image
                    source={{ uri: imageInfo.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: 'cover',
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                    }}>
                    <Text
                      style={{
                        width: deviceWidth - 40 - 100 - 10,
                        fontSize: 20,
                        color: 'black',
                        fontFamily: 'SuezOne-Regular',
                      }}>
                      {imageInfo.name}
                    </Text>
                    <Text style={{ fontWeight: 600 }}>{imageInfo.author}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
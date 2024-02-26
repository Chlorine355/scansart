import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"

import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


export default function Bookmarks({ navigation }) {
  const [bookmarkList, setBookmarkList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setBookmarkList([]);
      setLoading(true);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  if (bookmarkList.length === 0 && isLoading) {
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
        fetch(ip + 'get_bookmarks/' + device_id, {
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
            setBookmarkList(data);
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error.message);
            return null;
          });
      });
  }

  return (
    <View style={styles.wrapper}>
      {isLoading ? (
        <ActivityIndicator size="large" color={dark_red} />
      ) : (
        <View>
          {bookmarkList.length > 0 ? (
            <View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20 }}>
                {bookmarkList.map((imageInfo) => (
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
                        <Text style={{ fontWeight: 600 }}>
                          {imageInfo.author}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View>
              <Text style={[styles.picTitle, { textAlign: 'center' }]}>
                Saved artworks will appear here
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setBookmarkList([]);
                  setLoading(true);
                }}>
                <Text style={[styles.picTitle, { textAlign: 'center' }]}>
                  Tap to refresh{'\n'}{' '}
                  <Ionicons name="refresh-outline" size={50} />{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

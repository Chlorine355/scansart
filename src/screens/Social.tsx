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
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import ProgressBar from 'react-native-progress/Bar';


function artists_by_labels(label_count) {
  if (label_count < 19) {
    return label_count + 2;
  }
  return 20;
}

export default function Social({ navigation, route }) {
  const { setParentState } = route.params;
  const [avatarId, setAvatarId] = useState(0);
  if (avatarId == 0) {
    AsyncStorage.getItem('avatarId').then((avatarId) => {
      if (avatarId) {
        setAvatarId(parseInt(avatarId));
      } else {
        AsyncStorage.setItem('avatarId', '1');
        setAvatarId(1);
      }
    });
  }
  const [achievementList, setAchievementList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [labelScore, setLabelScore] = useState(-1);
  const [unlockedArtists, setUnlockedArtists] = useState(-1);
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const toggleNicknameModalVisibility = () => {
    setNicknameModalVisible(!isNicknameModalVisible);
  };

  const toggleAvatarModalVisibility = () => {
    setAvatarModalVisible(!isAvatarModalVisible);
  };

  const saveAndClose = () => {
    if (inputValue.length > 0 && inputValue != username) {
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
          fetch(ip + 'change_name', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: inputValue,
              device_id: device_id,
            }),
          });
        });
      AsyncStorage.setItem('username', inputValue);
      setUsername(inputValue);
      setAchievementList([]);
      setLoading(true);
    }
    setNicknameModalVisible(false);
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAchievementList([]);
      setLoading(true);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  if (username === '') {
    AsyncStorage.getItem('username')
      .then((username) => {
        if (username) {
          return username;
        } else {
          AsyncStorage.setItem('username', 'artlover');
          return 'artlover';
        }
      })
      .then((username) => {
        setUsername(username);
        setInputValue(username);
      });
  }

  if (labelScore == -1) {
    AsyncStorage.getItem('label_score')
      .then((score) => {
        if (score) {
          return parseInt(score);
        } else {
          AsyncStorage.setItem('label_score', '0');
          return 0;
        }
      })
      .then((score) => {
        setLabelScore(score);
        setUnlockedArtists(artists_by_labels(score));
      });
  }

  if (achievementList.length === 0 && isLoading) {
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
        fetch(ip + 'get_profile/' + device_id, {
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
            // console.log(data);
            setAchievementList(data['achievements']);
            setLabelScore(data['label_score']);
            setUnlockedArtists(artists_by_labels(data['label_score']));
            setLeaderboard(data['leaderboard']);
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
      <Modal
        animationType="fade"
        transparent
        visible={isNicknameModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleNicknameModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter nickname..."
              value={inputValue}
              style={styles.textInput}
              onChangeText={(value) => setInputValue(value)}
            />

            {/** This button is responsible to close the modal */}
            <Button color={dark_red} title="Save" onPress={saveAndClose} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isAvatarModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleAvatarModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.avatarModalView}>
            <Text style={styles.picTitle}>Select avatar</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: 300,
                flexWrap: 'wrap',
                justifyContent: 'center',
                paddingBottom: 20,
              }}>
              {avatars_array.map((avatar) => (
                <View key={avatar.id}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (avatar.id <= unlockedArtists) {
                        setAvatarId(avatar.id);
                        setParentState(avatar.id);
                        AsyncStorage.setItem('avatarId', avatar.id.toString());
                      } else {
                        Toast.show(
                          'Suggest more labels to unlock this artist!'
                        );
                      }
                    }}>
                    <Image
                      source={{ uri: avatar.uri }}
                      blurRadius={avatar.id > unlockedArtists ? 30 : 0}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                        margin: 5,
                        borderWidth: 1,
                        borderColor:
                          avatarId == avatar.id ? dark_red : 'transparent',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <Button
              color={dark_red}
              title="Close"
              onPress={() => {
                toggleAvatarModalVisibility();
              }}
            />
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ display: 'flex', alignItems: 'center', paddingTop: 30 }}>
          <TouchableOpacity onPress={toggleAvatarModalVisibility}>
            <Image
              source={{
                uri: avatars[avatarId],
              }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 200,
                marginBottom: 20,
              }}
            />
          </TouchableOpacity>
          <Text style={styles.picTitle}>
            {username}{' '}
            <TouchableOpacity onPress={toggleNicknameModalVisibility}>
              <Ionicons name="pencil-outline" size={20} color="gray" />
            </TouchableOpacity>
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'black',
              fontFamily: 'SuezOne-Regular',
            }}>
            Label score: {labelScore}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'black',
              fontFamily: 'SuezOne-Regular',
            }}>
            Artists available: {unlockedArtists}
          </Text>
        </View>

        <View style={{ display: 'flex', alignItems: 'center', paddingTop: 30 }}>
          <Text style={styles.picTitle}>Leaderboard</Text>
          <View style={{ width: 300 }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: 'black',
                  fontFamily: 'SuezOne-Regular',
                }}>
                Username
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: 'black',
                  fontFamily: 'SuezOne-Regular',
                }}>
                Score
              </Text>
            </View>
            {leaderboard.map((user) => (
              <View
                key={user.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: 'black',
                    fontFamily: 'SuezOne-Regular',
                  }}>
                  {user.name}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: 'black',
                    fontFamily: 'SuezOne-Regular',
                  }}>
                  {user.score}
                </Text>
              </View>
            ))}
          </View>
          <Text style={[styles.picTitle, { paddingTop: 30 }]}>
            Achievements
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={primary_red} />
        ) : (
          <View>
            {achievementList.length > 0 ? (
              <View>
                <ScrollView showsVertiFcalScrollIndicator={false}>
                  {achievementList.map((achievementInfo) => (
                    <View
                      key={achievementInfo.id}
                      style={{ marginBottom: 20, width: deviceWidth - 40 }}>
                      <TouchableOpacity
                        activeOpacity={0.4}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <Image
                          source={{ uri: achievementInfo.pic_path }}
                          style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'contain',
                            borderRadius: 5,
                          }}
                        />
                        <View
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            gap: 5,
                          }}>
                          <Text
                            style={{
                              width: deviceWidth - 40 - 100 - 10,
                              fontSize: 20,
                              color: 'black',
                              fontFamily: 'SuezOne-Regular',
                            }}>
                            {achievementInfo.title}
                          </Text>
                          <Text style={{ fontWeight: 600 }}>
                            {achievementInfo.description}
                          </Text>
                          <ProgressBar
                            progress={
                              achievementInfo.progress /
                              achievementInfo.required
                            }
                            width={200}
                          />
                          <Text>
                            {achievementInfo.progress > achievementInfo.required
                              ? achievementInfo.required
                              : achievementInfo.progress}
                            /{achievementInfo.required}
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
                  Please try again to load the achievements.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAchievementList([]);
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
      </ScrollView>
    </View>
  );
}
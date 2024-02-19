import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  ImageBackground,
  Modal,
  LogBox,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';
import { readFile } from 'react-native-fs';
const RNFS = require('react-native-fs');
import { Popable, Popover } from 'react-native-popable';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-crop-picker';
import { accelerometer } from 'react-native-sensors';
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import ProgressBar from 'react-native-progress/Bar';
import Share from 'react-native-share';

LogBox.ignoreAllLogs();

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ip = 'http://192.168.0.103:5000/';

const avatars_array = [
  { id: '1', uri: ip + 'static/avatars/leonardo.webp' },
  { id: '2', uri: ip + 'static/avatars/vangogh.jpg' },
  { id: '3', uri: ip + 'static/avatars/monet.jpeg' },
  { id: '4', uri: ip + 'static/avatars/kahlo.png' },
  { id: '5', uri: ip + 'static/avatars/rubens.jpg' },
  { id: '6', uri: ip + 'static/avatars/vermeer.jpg' },
  { id: '7', uri: ip + 'static/avatars/bosch.jpg' },
  { id: '8', uri: ip + 'static/avatars/dali.jpg' },
  { id: '9', uri: ip + 'static/avatars/cassatt.jpg' },
  { id: '10', uri: ip + 'static/avatars/degas.png' },
  { id: '11', uri: ip + 'static/avatars/Eduard-Mane.jpg' },
  { id: '12', uri: ip + 'static/avatars/jturner.jpg' },
  { id: '13', uri: ip + 'static/avatars/matisse.jpg' },
  { id: '14', uri: ip + 'static/avatars/michelangelo.jpg' },
  { id: '15', uri: ip + 'static/avatars/rembrandt.jpg' },
  { id: '16', uri: ip + 'static/avatars/sezann.jpg' },
  { id: '17', uri: ip + 'static/avatars/picasso.png' },
];

const avatars = {
  1: ip + 'static/avatars/leonardo.webp',
  2: ip + 'static/avatars/vangogh.jpg',
  3: ip + 'static/avatars/monet.jpeg',
  4: ip + 'static/avatars/kahlo.png',
  5: ip + 'static/avatars/rubens.jpg',
  6: ip + 'static/avatars/vermeer.jpg',
  7: ip + 'static/avatars/bosch.jpg',
  8: ip + 'static/avatars/dali.jpg',
  9: ip + 'static/avatars/cassatt.jpg',
  10: ip + 'static/avatars/degas.png',
  11: ip + 'static/avatars/Eduard-Mane.jpg',
  12: ip + 'static/avatars/jturner.jpg',
  13: ip + 'static/avatars/matisse.jpg',
  14: ip + 'static/avatars/michelangelo.jpg',
  15: ip + 'static/avatars/rembrandt.jpg',
  16: ip + 'static/avatars/sezann.jpg',
  17: ip + 'static/avatars/picasso.png',
};

const loadImageBase64 = async (capturedImageURI) => {
  try {
    const base64Data = await readFile(capturedImageURI, 'base64');
    return base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
  }
};

function isEmpty(obj) {
  for (var i in obj) {
    return false;
  }
  return true;
}

function clearTemp() {
  ImagePicker.clean(); // clear pick cache
  RNFS.readdir(RNFS.TemporaryDirectoryPath + '/Camera')
    .then((files) => {
      for (path of files) {
        RNFS.unlink(RNFS.TemporaryDirectoryPath + '/Camera/' + path).catch(
          (e) => {
            return null;
          }
        );
      }
    })
    .catch((e) => {
      return null;
    }); // clear camera cache
}

function Scan({ navigation }) {
  const [degrees, setDegrees] = useState('0deg');
  const [cameraType, setCameraType] = useState(0);
  setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
  const subscription = accelerometer.subscribe(({ x, y, z }) => {
    // console.log(x, y, z);
    if (Math.abs(x) > Math.abs(y)) {
      setDegrees(x > 0 ? '90deg' : '-90deg');
    } else if (Math.abs(x) < Math.abs(y)) {
      setDegrees(y > 0 ? '0deg' : '180deg');
    }
  });

  const handleChoosePhoto = () => {
    clearTemp();
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        // console.log(image.path);
        navigation.navigate('Picture', { uri: image.path, is_uri: true });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  takePicture = async function (camera) {
    clearTemp();
    const options = { quality: 1, base64: true };
    const data = await camera.takePictureAsync(options);
    navigation.navigate('Picture', { uri: data.uri, is_uri: true });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          display: 'flex',
          gap: 5,
          alignItems: 'center',
          marginTop: 15,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'black', fontWeight: 600 }}>
            Fit the image into the rectangle and press
          </Text>
          <Ionicons name={'scan-circle-outline'} color={dark_red} size={35} />
        </View>
        <Text style={{ color: 'black', fontWeight: 600 }}>
          Turn your device to scan horizontal images
        </Text>
      </View>
      <View style={styles.cameraView(deviceWidth, deviceHeight)}>
        <RNCamera
          style={styles.camera(deviceWidth, deviceHeight)}
          type={
            cameraType
              ? RNCamera.Constants.Type.front
              : RNCamera.Constants.Type.back
          }
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          useNativeZoom
          playSoundOnCapture={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({ camera, status }) => {
            if (status !== 'READY') return <Text>wait</Text>;
            return (
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableHighlight
                  onPress={() => this.takePicture(camera)}
                  style={styles.snapbtn(deviceHeight)}
                  underlayColor="#5B0F10">
                  <Ionicons
                    name={'scan-circle-outline'}
                    color="white"
                    size={45}
                  />
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.gallerybtn(deviceHeight)}
                  onPress={handleChoosePhoto}
                  underlayColor="#5B0F10">
                  <Ionicons
                    name={'images-outline'}
                    color="white"
                    size={30}
                    style={{ transform: [{ rotateZ: degrees }] }}
                  />
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.switchcambtn(deviceHeight)}
                  onPress={() => {
                    setCameraType(!cameraType);
                  }}
                  underlayColor="#5B0F10">
                  <Ionicons
                    name={'sync-outline'}
                    color="white"
                    size={30}
                    style={{ transform: [{ rotateZ: degrees }] }}
                  />
                </TouchableHighlight>
              </View>
            );
          }}
        </RNCamera>
      </View>
    </View>
  );
}

function Map({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.picTitle}>Map yet to come</Text>
    </View>
  );
}

function Search({ navigation }) {
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

function artists_by_labels(label_count) {
  if (label_count < 19) {
    return label_count + 2;
  }
  return 20;
}

function Social({ navigation, route }) {
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
            console.log(data);
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
              placeholder="Enter something..."
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
                <ScrollView showsVerticalScrollIndicator={false}>
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

function Bookmarks({ navigation }) {
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

function PaintMe({ navigation }) {
  const [photo, setPhoto] = useState('');
  const [styleN, setStyleN] = useState(0);
  const availableStyles = [
    {
      id: 0,
      name: 'Starry Night',
      uri: ip + 'static/images/Starry Night_770.jpg',
    },
    { id: 1, name: 'Sunflowers', uri: ip + 'static/images/Sunflowers_030.jpg' },
    { id: 2, name: 'The Park', uri: ip + 'static/images/The Park_958.jpg' },
    {
      id: 3,
      name: 'Vitruvian Man',
      uri: ip + 'static/images/Vitruvian Man_619.jpg',
    },
    { id: 4, name: 'Irises', uri: ip + 'static/images/Irises_532.jpg' },
  ];
  const handleChoosePhoto = () => {
    clearTemp();
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        // console.log(image.path);
        setPhoto(image.path);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1, gap: 20, alignItems: 'center', paddingTop: 20 }}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{
              width: 250,
              height: 250,
              resizeMode: 'cover',
              borderRadius: 5,
            }}
          />
        ) : null}
        <Button
          onPress={handleChoosePhoto}
          title="Choose photo"
          color={dark_red}
        />
        <View style={{ height: 140 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {availableStyles.map((imageInfo) => (
              <View key={imageInfo.id} style={{ width: 110, marginRight: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setStyleN(imageInfo.id);
                  }}>
                  <Image
                    source={{ uri: imageInfo.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: 'cover',
                      borderRadius: 5,
                      borderWidth: styleN === imageInfo.id ? 2 : 0,
                      borderColor: primary_red,
                    }}
                  />
                  <Text>{imageInfo.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <Button
          onPress={() => {
            if (photo.length > 0) {
              navigation.navigate('Painting result', {
                uri: photo,
                style_id: styleN,
              });
            } else {
              Toast.show('Choose a photo first!');
            }
          }}
          title="Paint it!"
          color={dark_red}
        />
      </View>
    </View>
  );
}

function PaintingResult({ navigation, route }) {
  const { uri } = route.params;
  const { style_id } = route.params;

  const [picture, setPicture] = useState({});
  const [isLoading, setLoading] = useState(true);
  const sharePic = (file_url) => {
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', file_url)
      // the image is now dowloaded to device's storage
      .then((resp) => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async (base64Data) => {
        var base64Data = `data:image/png;base64,` + base64Data;
        // here's base64 encoded image
        await Share.open({
          title: 'Share ' + 'new image',
          url: base64Data,
          filename: 'Painted image',
          message:
            'Create your styled images in ScansArt!' +
            '\n' +
            'Download for free: https://www.scansart.com/',
        });
        // remove the file from storage
        return fs.unlink(imagePath);
      });
  };

  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          // .log("Storage Permission Granted.");
          downloadImage();
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = picture.uri;
    // Getting the extension of the file
    let ext = getExtension(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/' +
          'generated_image' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'generated_image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then((res) => {
        Toast.show('Image downloaded');
      });
  };

  const getExtension = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  if (isEmpty(picture)) {
    loadImageBase64(uri).then((data) => {
      fetch(ip + 'paint', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: data,
          style_id: style_id,
        }),
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Request failed.' + response.status);
          }
        })
        .then(function (data) {
          setPicture(data);
          setLoading(false);
          // console.log(data);
        })
        .catch(function (error) {
          console.log(error.message);
          return null;
        });
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      {isLoading ? (
        <ActivityIndicator size="large" color={primary_red} />
      ) : (
        <ScrollView style={{ flex: 1, padding: 15, marginBottom: 0 }}>
          <Text style={styles.picTitle}>Style: {picture.style_name}</Text>
          <View style={{ overflow: 'hidden' }}>
            <View
              style={{
                flex: 0,
                height:
                  picture.width < deviceWidth
                    ? picture.height
                    : picture.height * ((deviceWidth - 30) / picture.width),
                width: picture.width < deviceWidth ? picture.width : null,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                overflow: 'hidden',
              }}>
              <ImageViewer
                backgroundColor={'transparent'}
                imageUrls={[{ url: picture.uri }]}
                maxOverflow={0}
                renderIndicator={() => {}}
                style={{ width: deviceWidth - 30 }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              justifyContent: 'space-between',
              paddingBottom: 50,
              paddingTop: 15,
            }}>
            <TouchableOpacity onPress={checkPermission}>
              <Ionicons name="download-outline" size={30} color={primary_red} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => sharePic(picture.uri)}>
              <Ionicons
                name="arrow-redo-outline"
                size={30}
                color={primary_red}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Picture({ navigation, route }) {
  const { uri } = route.params;
  const { is_uri } = route.params;
  const [bookmark, setBookmark] = useState(false);
  const [labels, setLabels] = useState(false);
  const [picture, setPicture] = useState({});
  const [isLoading, setLoading] = useState(true);

  const sharePic = (file_url, picname) => {
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', file_url)
      // the image is now dowloaded to device's storage
      .then((resp) => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async (base64Data) => {
        var base64Data = `data:image/png;base64,` + base64Data;
        // here's base64 encoded image
        await Share.open({
          title: 'Share ' + picname,
          url: base64Data,
          filename: picname,
          message:
            'Sent from ScansArt: ' +
            picname +
            '\n' +
            'Download for free: https://www.scansart.com/',
        });
        // remove the file from storage
        return fs.unlink(imagePath);
      });
  };

  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          // .log("Storage Permission Granted.");
          downloadImage();
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = picture.uri;
    // Getting the extension of the file
    let ext = getExtension(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/' +
          picture.name +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: picture.name,
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then((res) => {
        Toast.show('Image downloaded');
      });
  };

  const getExtension = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  if (isEmpty(picture)) {
    if (is_uri) {
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
          loadImageBase64(uri).then((data) => {
            fetch(ip + 'recognize_image/' + device_id, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: data,
              }),
            })
              .then(function (response) {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Request failed.' + response.status);
                }
              })
              .then(function (data) {
                setPicture(data);
                setLoading(false);
                setBookmark(data.bookmark);
                // console.log(data);
              })
              .catch(function (error) {
                console.log(error.message);
                return null;
              });
          });
        });
    } else {
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
          fetch(ip + 'get_image_by_id/' + uri + '/' + device_id, {
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
                throw new Error('Request failed.');
              }
            })
            .then(function (data) {
              setPicture(data);
              setLoading(false);
              setBookmark(data.bookmark);
              // console.log(data);
            })
            .catch(function (error) {
              console.log(error.message);
              return null;
            });
        });
    }
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      {isLoading ? (
        <ActivityIndicator size="large" color={primary_red} />
      ) : (
        <ScrollView style={{ flex: 1, padding: 15, marginBottom: 0 }}>
          <Text style={styles.picTitle}>
            {picture.name}
            {picture.year ? ', ' + picture.year : ''}
          </Text>
          <View style={{ overflow: 'hidden' }}>
            <View
              style={{
                flex: 0,
                height:
                  picture.width < deviceWidth
                    ? picture.height
                    : picture.height * ((deviceWidth - 30) / picture.width),
                width: picture.width < deviceWidth ? picture.width : null,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                overflow: 'hidden',
              }}>
              <ImageViewer
                onMove={() => {
                  if (labels) {
                    setLabels(false);
                  }
                }}
                backgroundColor={'transparent'}
                imageUrls={[{ url: picture.uri }]}
                maxOverflow={0}
                renderIndicator={() => {}}
                style={{ width: deviceWidth - 30 }}
              />
            </View>

            {labels
              ? picture.labels.map((labelInfo) => (
                  <View
                    key={labelInfo.id}
                    style={{
                      position: 'absolute',
                      left:
                        (labelInfo.x * (deviceWidth - 30)) / picture.width - 15,
                      top:
                        (labelInfo.y * (deviceWidth - 30)) / picture.width - 15,
                    }}>
                    <Popable
                      content={labelInfo.text}
                      position={
                        labelInfo.x > picture.width / 2 ? 'left' : 'right'
                      }
                      style={{ width: deviceWidth / 2.5 }}>
                      <Ionicons
                        name={'ellipse'}
                        size={15}
                        color={primary_red}
                      />
                    </Popable>
                  </View>
                ))
              : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              justifyContent: 'space-between',
              paddingBottom: 10,
              paddingTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SuggestLabel', {
                  name: picture.name,
                  id: picture.id,
                  uri: picture.uri,
                  width: picture.width,
                  height: picture.height,
                });
              }}>
              <Ionicons
                name="duplicate-outline"
                size={30}
                color={primary_red}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 20 }}>
              <TouchableOpacity onPress={checkPermission}>
                <Ionicons
                  name="download-outline"
                  size={30}
                  color={primary_red}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sharePic(picture.uri, picture.name)}>
                <Ionicons
                  name="arrow-redo-outline"
                  size={30}
                  color={primary_red}
                />
              </TouchableOpacity>

              <TouchableWithoutFeedback
                onPress={() => {
                  setLabels(!labels);
                }}>
                <Ionicons
                  name={labels ? 'copy' : 'copy-outline'}
                  size={30}
                  color={primary_red}
                  style={{ transform: [{ scaleX: -1 }] }}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  setBookmark(!bookmark);
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
                      fetch(
                        ip + 'toggle_bookmark/' + device_id + '/' + picture.id
                      );
                    });
                }}>
                <Ionicons
                  name={bookmark ? 'bookmark' : 'bookmark-outline'}
                  size={30}
                  color={primary_red}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <Text style={styles.picAuthor}>{picture.author}</Text>
          <Text style={styles.picDescription} selectable>
            {picture.description}
          </Text>
          {picture.carousel.length > 0 ? (
            <View style={{ marginBottom: 70 }}>
              <Text style={styles.picAuthor}>More from {picture.author}:</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {picture.carousel.map((imageInfo) => (
                  <View
                    key={imageInfo.id}
                    style={{ width: 110, marginRight: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.replace('Picture', {
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
                      <Text>{imageInfo.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

function SuggestLabel({ navigation, route }) {
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  const [avatarId, setTabsAvatarId] = useState(0);
  if (avatarId == 0) {
    AsyncStorage.getItem('avatarId').then((avatarId) => {
      if (avatarId) {
        setTabsAvatarId(parseInt(avatarId));
      } else {
        AsyncStorage.setItem('avatarId', '1');
        setTabsAvatarId(1);
      }
    });
  }

  function setParentState(n) {
    setTabsAvatarId(n);
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Scan') {
            iconName = focused ? 'scan-outline' : 'scan-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Achievements') {
            iconName = focused ? 'trophy-outline' : 'trophy-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmarks-outline' : 'bookmarks-outline';
          } else if (route.name === 'Social') {
            return (
              <Image
                source={{
                  uri: avatars[avatarId],
                }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 200,
                  borderColor: focused ? primary_red : 'gray',
                  borderWidth: 1,
                }}
              />
            );
            iconName = focused ? 'person-outline' : 'person-outline';
          } else if (route.name === 'Paint') {
            iconName = focused
              ? 'color-palette-outline'
              : 'color-palette-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search-outline' : 'search-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: primary_red,
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        tabBarShowLabel: false,
        headerTitleStyle: { fontFamily: 'SuezOne-Regular' },
      })}>
      <Tab.Screen name="Scan" component={Scan} />
      {/* !!!!!!!!!!!!!!!!!! <Tab.Screen name="Map" component={Map} /> карту потом завезём */}
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen
        name="Social"
        component={Social}
        initialParams={{ setParentState: setParentState }}
      />

      <Tab.Screen
        name="Paint"
        component={PaintMe}
        options={{
          tabBarBadge: 'β',
          tabBarBadgeStyle: {
            fontSize: 14,
            backgroundColor: 'transparent',
            color: 'gray',
          },
        }}
      />
      {/*<Tab.Screen name="Achievements" component={Achievements} /> */}
      <Tab.Screen name="Bookmarks" component={Bookmarks} />
    </Tab.Navigator>
  );
}

const primary_red = '#C1171C';
const dark_red = '#8B0000';
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 0,
    backgroundColor: 'white',
  },
  snapbtn: (deviceHeight) => ({
    position: 'absolute',
    top: deviceHeight > 700 ? 489 : deviceHeight - 310,
    backgroundColor: dark_red,
    padding: 5,
    borderRadius: 50,
  }),
  gallerybtn: (deviceHeight) => ({
    backgroundColor: dark_red,
    padding: 13,
    borderRadius: 50,
    position: 'absolute',
    left: 20,
    top: deviceHeight > 700 ? 489 : deviceHeight - 310,
  }),
  switchcambtn: (deviceHeight) => ({
    backgroundColor: dark_red,
    padding: 13,
    borderRadius: 50,
    position: 'absolute',
    right: 20,
    top: deviceHeight > 700 ? 489 : deviceHeight - 310,
  }),
  picTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    paddingBottom: 20,
    fontFamily: 'SuezOne-Regular',
  },
  picAuthor: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: '600',
    color: 'black',
    fontFamily: 'SuezOne-Regular',
  },
  picDescription: { fontSize: 18, color: 'black', paddingBottom: 30 },
  search_input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    width: deviceWidth - 50,
    marginTop: 25,
  },
  cameraView: (deviceWidth, deviceHeight) => ({
    width: deviceWidth > 350 ? 350 : deviceWidth - 20,
    height: deviceHeight > 700 ? 566 : deviceHeight - 235,
    borderRadius: 10,
    overflow: 'hidden',
  }),
  camera: (deviceWidth, deviceHeight) => ({
    width: deviceWidth > 350 ? 350 : deviceWidth - 20,
    height: deviceHeight > 700 ? 566 : deviceHeight - 235,
  }),
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    elevation: 5,
    transform: [{ translateX: -(deviceWidth * 0.4) }, { translateY: -90 }],
    height: 180,
    width: deviceWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  textInput: {
    width: '80%',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 8,
  },
  avatarModalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    elevation: 5,
    transform: [
      { translateX: -(deviceWidth * 0.4) },
      { translateY: -(deviceHeight * 0.4) },
    ],
    paddingVertical: 20,
    width: deviceWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          headerTitleStyle: { fontFamily: 'SuezOne-Regular' },
        })}>
        <Stack.Screen name="ScanArt" component={Tabs} />
        <Stack.Screen
          name="Painting result"
          component={PaintingResult}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Picture"
          component={Picture}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="SuggestLabel"
          component={SuggestLabel}
          options={({ route }) => ({
            title: 'Suggest label for ' + route.params.name,
            headerShown: true,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

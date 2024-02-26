import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  PermissionsAndroid,
  LogBox,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Popable, Popover } from 'react-native-popable';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Share from 'react-native-share';
import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"


export default function Picture({ navigation, route }) {
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
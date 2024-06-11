import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  LogBox,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import ImageViewer from 'react-native-image-zoom-viewer';
import Share from 'react-native-share';
import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"


export default function PaintingResult({ navigation, route }) {
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
          downloadImage();
          // alert('Storage Permission Not Granted');
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
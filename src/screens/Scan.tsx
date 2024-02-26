import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { accelerometer } from 'react-native-sensors';
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"


export default function Scan({ navigation }) {
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

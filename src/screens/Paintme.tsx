import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./styles"
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./constants"
import * as React from 'react';
import { useState } from 'react';
import {
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';


export default function PaintMe({ navigation }) {
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

import { readFile } from 'react-native-fs';
const RNFS = require('react-native-fs');
import ImagePicker from 'react-native-image-crop-picker';


export const ip = 'http://94.241.140.56:5000/';

export const avatars_array = [
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
  { id: '18', uri: ip + 'static/avatars/caravaggio.jpg' },
  { id: '19', uri: ip + 'static/avatars/raphael.jpg' },
  { id: '20', uri: ip + 'static/avatars/renoir.webp' },
];

export const avatars = {
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
  18: ip + 'static/avatars/caravaggio.jpg',
  19: ip + 'static/avatars/raphael.jpg',
  20: ip + 'static/avatars/renoir.webp',
};

export const loadImageBase64 = async (capturedImageURI) => {
  try {
    const base64Data = await readFile(capturedImageURI, 'base64');
    return base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
  }
};

export function isEmpty(obj) {
  for (var i in obj) {
    return false;
  }
  return true;
}

export function clearTemp() {
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

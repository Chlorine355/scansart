import {
  StyleSheet, Dimensions
} from 'react-native';


export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
export const primary_red = '#C1171C';
export const dark_red = '#8B0000';
export const styles = StyleSheet.create({
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
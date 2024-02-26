// libs
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
// screens
import Share from 'react-native-share';
import Scan from "./src/screens/Scan"
import Map from "./src/screens/Map"
import Social from "./src/screens/Social"
import Search from "./src/screens/Search"
import Bookmarks from "./src/screens/Bookmarks"
import PaintMe from "./src/screens/Paintme"
import PaintingResult from "./src/screens/PaintingResult"
import Picture from "./src/screens/Picture"
import SuggestLabel from "./src/screens/SuggestLabel"
// constants and styles
import { ip, avatars, avatars_array, loadImageBase64, isEmpty, clearTemp } from "./src/screens/constants"
import { styles, primary_red, dark_red, deviceWidth, deviceHeight } from "./src/screens/styles"
// to hell the logs
LogBox.ignoreAllLogs();


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
      { /* <Tab.Screen name="Map" component={Map} /> */ }
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

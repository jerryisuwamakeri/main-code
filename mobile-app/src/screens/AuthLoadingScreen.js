import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../common/theme';

export default function AuthLoadingScreen(props) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/intro.jpg')}
        resizeMode="stretch"
        style={styles.imagebg}
      >
        <ActivityIndicator style={{ paddingBottom: 100 }} color={colors.INDICATOR_BLUE} size='large' />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imagebg: {
    flex:1,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});
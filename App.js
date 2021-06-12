import React from "react";
import { StyleSheet, View, LogBox, Image, I18nManager, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import { AppProvider } from "@services/provider";
import AppNavigator from "@components/AppNavigator";
import language from "@res/Language";
import * as SplashScreen from "expo-splash-screen";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      language: {},
      isReady: false,
    };
  }
  componentDidMount() {
    SplashScreen.preventAutoHideAsync();
  }

  _cacheSplashResourcesAsync = async () => {
    const image = require("./res/splash_screen.jpg");
    return Asset.fromModule(image).downloadAsync();
  };

  _cacheResourcesAsync = async () => {
    SplashScreen.hideAsync();
    let gifLoadedOnce = false;
    let dataLoaded = false;
    setTimeout(() => {
      gifLoadedOnce = true;
      if (dataLoaded) {
        this.setState({ isReady: true });
      }
    }, 3000);
    const images = [];
    const icons = [];
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    const cacheIcons = icons.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    await Promise.all(cacheImages, cacheIcons, this.loadLangauge());
    dataLoaded = true;

    if (gifLoadedOnce) {
      this.setState({ isReady: true });
    }
  };

  loadLangauge = async () => {
    const value = await language();
    this.setState({ language: value });
  };

  changeLang = async (language) => {
    await AsyncStorage.setItem("lang", language);
    await this.loadLangauge();
  };

  render() {
    if (this.state.isReady) {
      return (
        <AppProvider
          value={{
            state: this.state
          }}
        >
          <AppNavigator />
        </AppProvider>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Image source={require("./res/splash_screen.jpg")} onLoad={this._cacheResourcesAsync} style={{ width: responsiveWidth(100), height: responsiveHeight(100) }} />
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

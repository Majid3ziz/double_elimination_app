import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import React from "react";
import Homepage from "@screens/Homepage";
import CreateTournament from "@screens/CreateTournament";
import CustomStatusBar from "@components/CustomStatusBar";

const RootStack = createStackNavigator(
  {
    Homepage: { screen: Homepage },
    CreateTournament: { screen: CreateTournament }
  },
  {
    mode: "card",
    headerMode: "screen",
    initialRouteName: "Homepage",
    defaultNavigationOptions: {
      header: () => <CustomStatusBar />,
    },
  }
);
const AppNavigator = createAppContainer(RootStack);
export default AppNavigator;

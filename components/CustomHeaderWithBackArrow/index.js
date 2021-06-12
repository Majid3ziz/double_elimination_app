import React from "react";
import { TouchableWithoutFeedback, View } from 'react-native';
import { Header } from "react-native-elements";
import { Ionicons } from "react-native-vector-icons";
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import AppContext from '@services/provider';
import Colors from '@res/Colors';

export default class CustomHeaderWithBackArrow extends React.Component {
    render() {
        return (
            <Header
                centerComponent={{
                    text: this.props.title,
                    style: { color: Colors.PrimaryText, fontSize: responsiveFontSize(2.5) }
                }}
                leftComponent={
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                        <View style={{ marginHorizontal: 7 }}>
                            <Ionicons
                                color={this.props.iconsColor}
                                name="ios-arrow-back"
                                size={responsiveFontSize(3)}
                            /></View>
                    </TouchableWithoutFeedback>
                }
                statusBarProps={{
                    barStyle: 'light-content',
                    backgroundColor: Colors.PrimaryColorDark
                }}
                containerStyle={{
                    backgroundColor: Colors.PrimaryColor,
                    justifyContent: 'space-around',
                }}
            />
        );
    }
}
CustomHeaderWithBackArrow.contextType = AppContext;

import React from "react";
import { TouchableWithoutFeedback, View, Image } from 'react-native';
import { Header } from "react-native-elements";
import { Ionicons } from "react-native-vector-icons";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import AppContext from '@services/provider';
import Colors from '@res/Colors';

export default class CustomHeaderWithBackArrow extends React.Component {
    render() {
        return (
            <Header
                centerComponent={this.props.title === undefined ? <Image
                    source={this.props.icon}
                    style={{ width: responsiveWidth(50), height: responsiveWidth(17), alignSelf: 'center' }}
                /> : {
                        text: this.props.title,
                        style: { color: this.props.textColor, fontSize: responsiveFontSize(2.5) }
                    }}
                leftComponent={
                    this.props.lang === 'en' ?
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                            <View style={{ marginHorizontal: 7 }}>
                                <Ionicons
                                    color={this.props.iconsColor}
                                    name="ios-arrow-back"
                                    size={32}
                                /></View>
                        </TouchableWithoutFeedback> : null
                }
                rightComponent={
                    this.props.lang === 'ar' ?
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} >
                            <View style={{ marginHorizontal: 7 }}>
                                <Ionicons
                                    color={this.props.iconsColor}
                                    name="ios-arrow-forward"
                                    size={32}
                                /></View>
                        </TouchableWithoutFeedback> : null
                }
                statusBarProps={{
                    barStyle: 'light-content',
                    backgroundColor: Colors.PrimaryColorDark
                }}
                containerStyle={{
                    backgroundColor: this.props.containerColor,
                    justifyContent: 'space-around',
                }}
            />
        );
    }
}
CustomHeaderWithBackArrow.contextType = AppContext;

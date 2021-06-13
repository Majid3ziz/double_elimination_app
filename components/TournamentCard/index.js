import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { responsiveWidth, responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import Colors from "@res/Colors";
import { Ionicons } from "react-native-vector-icons";
import AppContext from "@services/provider";
import { Image as CachedImage } from "react-native-expo-image-cache";

export default class TournamentCard extends React.Component {
  render() {
    let name = String(this.props.name);
    if (name.length > 15) {
      if (name.charAt(14) === " ") {
        name = name.substr(0, 14) + "...";
      } else {
        name = name.substr(0, 15) + "...";
      }
    }
    return (
      <TouchableOpacity onPress={() => this.props.viewTournament(this.props.index)} style={styles.container}>
        <View style={styles.nameRow}>
          <CachedImage uri={this.props.image} preview={{ uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" }} style={styles.image} />
          <Text style={[styles.label]}>{name}</Text>
        </View>
        <View style={styles.countRow}>
          <Ionicons name={"ios-person"} color={Colors.PrimaryColor} size={responsiveFontSize(4)} />
          <Text style={[styles.label, { marginLeft: 3 }]}>{this.props.playersCount}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

TournamentCard.contextType = AppContext;
const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(85),
    height: responsiveHeight(12),
    alignSelf: "center",
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameRow: {
    marginHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: Colors.PrimaryText,
    fontSize: responsiveFontSize(2.5),
    fontWeight: "500",
    elevation: 5,
    textAlign: "center",
    marginHorizontal: 5,
  },
  image: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: 150,
    overflow: "hidden",
  },
});

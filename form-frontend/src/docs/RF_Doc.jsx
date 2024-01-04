import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  pageView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    fontFamily: "Courier",
  },
  imageContainer: {
    padding: 0,
    marginBottom: 20,
  },
  image: {
    padding: 0,
    width: 150,
    height: 150,
  },
  heading: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
    fontFamily: "Courier",
  },
  districtDate: {
    fontSize: 10,
  },
  boldText: {
    fontWeight: 700,
  },
});
const RF_Doc = async (formData) => {
  return (
    <Document>
      <Page size="A4" style={styles.pageView}>
        <View style={styles.imageContainer}>
          <Image source={"/govtLogo.png"} style={styles.image} />
        </View>
        <View>
          <Text style={styles.heading}>ANNEXURE-B</Text>
          <Text style={styles.heading}>RESIDENCE CERTIFICATE</Text>
          <Text style={styles.heading}>{"[Under Article 371(J)]"}</Text>
          <Text style={styles.paragraph}>
            This is to certify that Sri/Smt
            <Text style={styles.boldText}> {formData.name}</Text> S/o/ W/o
            {formData.sowo + " "} has been residing at the following address in
            {formData.villageTown + " "} Village/Town of
            {formData.district + " "} District: Taluka of{" "}
            {formData.taluka + " "}
            District during the period noted below
            {": "}
          </Text>
        </View>
        <View>
          <Text style={styles.districtDate}>District: {formData.district}</Text>
          <Text style={styles.districtDate}>Date: {formData.date}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default RF_Doc;

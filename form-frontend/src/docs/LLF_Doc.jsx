import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
    pdf,
  } from "@react-pdf/renderer";
  import React from "react";
  
  const styles = StyleSheet.create({
    pageView: {
      display: "flex",
    },
    sectionCol: {
      flexDirection: "col",
      alignContent: "space-between",
    },
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    formNameAndValue: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    imageView: {
      alignContent: "center",
      alignItems: "center",
    },
    logoImage: {
      width: 150,
    },
  });
  const LLF_Doc = async (formData) => {
    // Create styles
    return (
      <Document>
        <Page size="A4" style={styles.sectionCol}>
          <View style={styles.imageView}>
            <Image source={"/govtLogo.png"} style={styles.logoImage} />
          </View>
          <View style={styles.sectionRow}>
            //TODO: Text align ceter
            <View style={styles.formNameAndValue}>
              <Text>ANNEXURE-B</Text>
              <Text>RESIDENCE CERTIFICATE</Text>
              <Text>{"[Under Article 371(J)]"}</Text>
            </View>
          </View>
          <View style={styles.sectionRow}>
            <View style={styles.formNameAndValue}>
              <Text>Name:</Text>
              <Text>{formData.name}</Text>
            </View>
            <View style={styles.formNameAndValue}>
              <Text>S/o W/o:</Text>
              <Text>{formData.sowo}</Text>
            </View>
          </View>
          <View style={styles.sectionRow}>
            <View style={styles.formNameAndValue}>
              <Text>Village/Town:</Text>
              <Text>{formData.villageTown}</Text>
            </View>
            <View style={styles.formNameAndValue}>
              <Text>Taluka:</Text>
              <Text>{formData.taluka}</Text>
            </View>
          </View>
          <View style={styles.sectionRow}>
            <View style={styles.formNameAndValue}>
              <Text>District:</Text>
              <Text>{formData.district}</Text>
            </View>
            <View style={styles.formNameAndValue}>
              <Text>Place:</Text>
              <Text>{formData.place}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };
  
  export default LLF_Doc;
  
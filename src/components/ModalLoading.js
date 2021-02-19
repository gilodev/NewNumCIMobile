import React from "react";
import {
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
  View
} from "react-native";

const ModalLoading = ({modalParagraph}) => {

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#4a235a" />
            {modalParagraph && <Text style={styles.modalParagraph}>{modalParagraph}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 15,
    fontWeight: '700'
  },
  modalParagraph: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular'
  }
});

export default ModalLoading;
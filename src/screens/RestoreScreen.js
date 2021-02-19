
import React, {useState, useEffect} from 'react';
import { Platform, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, PermissionsAndroid, BackHandler } from 'react-native';


import AsyncStorage from '@react-native-community/async-storage';

import Contacts from "react-native-contacts";

import ModalLoading from '../components/ModalLoading';

export default function RestoreScreen({route}) {

    let { dataCToRestore } = route.params;

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorApp, setErrorApp] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS === "android") {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
                        {
                            title: "Contacts",
                            message: "Cette application souhaite effectuer des actions sur vos contacts",
                        }
                    ).
                    then(() => {
                        restoreContact();
                    })
                
            } else {
                restoreContact();
            }
        })()
    }, []);

    const restoreNumber = (item) => {

        let okToRestore, newItem;

        newItem = item.replace(/[- .()]/g, '');  
        if(newItem.startsWith('+225', 0)) {
            newItem = newItem.replace('+225', '');
        } else if(newItem.startsWith('00225', 0)) {
        newItem = newItem.replace('00225', '');
        } else if(newItem.startsWith('225', 0)) {
            newItem = newItem.replace('225', '');
        }
    
        const regexRestore = /^(01|05|07|21|25|27)([0-9]{8})$/;
        
        // Match Mobile Converted
        okToRestore = newItem.match(regexRestore);
    
        if(okToRestore) {
            let number = newItem.substring(2);
            return `+225${number}`;
        } else {
            return item;
        }
    }

    const restoreContact = async () => {
        console.debug('restore...');
        let isRestore = await AsyncStorage.getItem('isRestore');
        
        if(isRestore == null) {

            setLoading(true);

            try {

                dataCToRestore.forEach(async contactElement => {

                    // Récupère tous les numéros du contact
                    let { phoneNumbers } = contactElement;
                    phoneNumbers.forEach((phoneItem, index) => {
                        let num = restoreNumber(phoneItem.number);
                        contactElement.phoneNumbers[index] = {label: phoneItem.label, number: num};
                    })
                 
                    Contacts.deleteContact(contactElement).then(() => {
                        //Contact supprimé
                    });
                    Contacts.addContact(contactElement);

                })

                setIsSuccess(true);
                setLoading(false);


            } catch(e){
                console.log(e);
                setLoading(false);
                setErrorApp('Erreur lors de la restauration des contacts, veuillez réssayer!');
            }
        } else {
            Alert.alert(
                "Avertissement",
                "Vous n'avez pas de contacts à restaurer.",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
            );
            setLoading(false);
            return false;
        }

        await AsyncStorage.setItem('isFix', 'success');

        Contacts.checkPermission();
    
    }

 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitleLogo}>Restaurer</Text>
                </View>
                {loading ? 
                    <ModalLoading
                        modalParagraph="Vos contacts préfixés sont entrain d'être restaurés à 8 chiffres"
                    />
                : (!errorApp ?
                    (isSuccess ?
                    <>
                    <View style={styles.headerSelect}>
                        <Text style={{fontSize: 18}}>Félicitations, vous êtes passés à 8 chiffres à présent</Text>
                    </View>
                    <TouchableOpacity style={styles.beginButton}
                        onPress={() => BackHandler.exitApp()}
                    >
                        <Text style={styles.beginButtonText}>Vérifier votre répertoire</Text>
                    </TouchableOpacity>
                    </>
                    :
                    <Text>Vous n'avez pas de contacts à restaurer!</Text>)
                    : 
                    <>
                        <Text style={styles.error}>{errorApp}</Text>
                    </>
                    )
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    error: {
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        color:'#4a235a'
    },
    header: {
        flexDirection: 'row',
    },
    headerTitleLogo: {
        fontSize:25,
        color:'#4a235a'
    },
    logo: {
        height: 70,
        width: 70,
        marginTop: -18,
        marginLeft: -160
    },
    beginButton: {
        backgroundColor: '#4a235a',
        borderRadius: 53,
        width: 250,
        height: 43,
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    beginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    headerSelect: {
        width: '100%',
        marginBottom: 30,
        marginTop: 10
    },
});

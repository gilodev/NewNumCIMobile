
import React, {useState, useEffect} from 'react';
import { Platform, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, PermissionsAndroid, BackHandler } from 'react-native';


import AsyncStorage from '@react-native-community/async-storage';

import Contacts from "react-native-contacts";

import ModalLoading from '../components/ModalLoading';

let countFix = 0;

export default function MigrationScreen({route, navigation}) {

    let { dataC } = route.params;

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
                        updatingContact();
                    })
                
            } else {
                updatingContact();
            }
        })()
    }, []);

    const fixNumber = (item) => {

        let okMtn, okMoov, okOrange, okFixeMoov, okFixeMtn, okFixeOrange;
    
        const regexMoov = /^((01)|(02)|(03)|(40)|(41)|(42)|(43)|(50)|(51)|(52)|(53)|(70)|(71)|(72)|(73))/;
        const regexOrange = /^((07)|(08)|(09)|(47)|(48)|(49)|(57)|(58)|(59)|(67)|(68)|(69)|(77)|(78)|(79)|(87)|(88)|(89)|(97)|(98))/;
        const regexMtn = /^((04)|(05)|(06)|(44)|(45)|(46)|(54)|(55)|(56)|(64)|(65)|(66)|(74)|(75)|(76)|(84)|(85)|(86)|(94)|(95)|(96))/;
        //Fixes
        const fixeOrange = /^((202)|(203)|(212)|(213)|(215)|(217)|(224)|(225)|(234)|(235)|(243)|(244)|(245)|(306)|(316)|(319)|(327)|(337)|(347)|(359)|(368))/;
        const fixeMtn = /^((200)|(210)|(220)|(230)|(240)|(300)|(310)|(320)|(330)|(340)|(350)|(360))/;
        const fixeMoov = /^((208)|(218)|(228)|(238))/;
        
        // Match Mobile
        okMtn = item.match(regexMtn);
        okMoov = item.match(regexMoov);
        okOrange = item.match(regexOrange);
        okFixeMtn = item.match(fixeMtn);
        okFixeMoov = item.match(fixeMoov);
        okFixeOrange = item.match(fixeOrange);
    
        if(item.length === 8) {
            if(okMtn) {
                return `+225 05${item}`;
            } else if(okMoov) {
                return `+225 01${item}`;
            } else if(okOrange) {
                return `+225 07${item}`;
            } else if(okFixeMoov) {
                return `+225 21${item}`;
            } else if(okFixeOrange) {
                return `+225 27${item}`;
            } else if(okFixeMtn) {
                return `+225 25${item}`;
            } else {
                return item;
            }
        } else {
            return item;
        }
        
    }

    const updatingContact = async () => {
        console.debug('updating...');
        let isFix = await AsyncStorage.getItem('isFix');
        
        if(isFix == null) {

            setLoading(true);

            try {

                dataC.forEach(async contactElement => {

                    // Récupère tous les numéros du contact
                    let { phoneNumbers } = contactElement;
                    phoneNumbers.forEach((phoneItem, index) => {
                        let num = fixNumber(phoneItem.number);
                        contactElement.phoneNumbers[index] = {label: phoneItem.label, number: num};
                    })
                 
                    try {
                        Contacts.deleteContact(contactElement).then(() => {
                            //Contact supprimé
                            
                        });
                        Contacts.addContact(contactElement);

                        countFix += 1;
                    } catch(e) {

                    }
                    

                })

                console.log(countFix);
                setIsSuccess(true);
                setLoading(false);


            } catch(e){
                console.log(e);
                setLoading(false);
                setErrorApp('Erreur lors de la migration des contacts, veuillez réssayer!');
            }
        } else {
            Alert.alert(
                "Avertissement",
                "Vous n'avez pas de contacts à migrer.",
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
                    <Text style={styles.headerTitleLogo}>Migration</Text>
                </View>
                {loading ? 
                    <ModalLoading
                        modalParagraph='Vos contacts ivoiriens sont en cours de migration conformement à la nouvelle numérotation'
                    />
                : (!errorApp ?
                    (isSuccess ?
                    <>
                    <View style={styles.headerSelect}>
                        <Text style={styles.headerTitle}>Migration Réussie</Text>
                        <Text>Vous avez prefixé {countFix} contact{countFix > 1 ? 's' : ''} vers la nouvelle numérotation ivoirienne</Text>
                        {(dataC.length - countFix > 0) && (
                            <Text>Il reste {dataC.length - countFix} contacts restants à convertir</Text>)
                        }
                    </View>
                    {(dataC.length - countFix > 0) ? (
                        <TouchableOpacity style={styles.beginButton}
                            onPress={() => navigation.replace('MigrationScreen')}
                        >
                            <Text style={styles.beginButtonText}>Voir contacts restants</Text>
                        </TouchableOpacity>)
                        :
                        (
                            <TouchableOpacity style={styles.beginButton}
                                onPress={() => BackHandler.exitApp()}
                            >
                                <Text style={styles.beginButtonText}>Vérifier votre répertoire</Text>
                            </TouchableOpacity>
                        )
                    }
                    </>
                    :
                    <Text>Vous n'avez pas de contacts à préfixer!</Text>)
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

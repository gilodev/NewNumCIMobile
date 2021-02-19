import React, {useState, useEffect} from 'react';
import { Platform, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, FlatList, PermissionsAndroid } from 'react-native';

import Contacts from "react-native-contacts";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';

import ModalLoading from '../components/ModalLoading';


export default function MigrationScreen({navigation}) {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countContacts, setCountContacts] = useState(null);
    const [errorApp, setErrorApp] = useState(null);

    useEffect(() => {
        (async () => {

            if (Platform.OS === "android") {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: "Contacts",
                        message: "Cette application souhaite afficher vos contacts",
                    }
                ).then(
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
                        {
                            title: "Contacts",
                            message: "Cette application souhaite effectuer des actions sur vos contacts",
                        }
                    )
                ).then(() => {
                        loadContacts();
                })
            } else {
                loadContacts();
            }
        })()
    }, []);

    const triContactsByOrderAZ = (a, b) => {
        let aName = a.displayName;
        let bName = b.displayName;
        aName = (typeof aName === "string") ? aName.toLowerCase() : aName;
        bName = (typeof bName === "string") ? bName.toLowerCase() : bName;
        return (aName > bName) ? 1 : -1;
    }

    const fixNumber = (item) => {
        if(item)  {

            let okMtn, okMoov, okOrange, okFixeMoov, okFixeMtn, okFixeOrange;
        
            const regexMoov = /^((01)|(02)|(03)|(40)|(41)|(42)|(43)|(50)|(51)|(52)|(53)|(70)|(71)|(72)|(73))[0-9]{6}$/;
            const regexOrange = /^((07)|(08)|(09)|(47)|(48)|(49)|(57)|(58)|(59)|(67)|(68)|(69)|(77)|(78)|(79)|(87)|(88)|(89)|(97)|(98))[0-9]{6}$/;
            const regexMtn = /^((04)|(05)|(06)|(44)|(45)|(46)|(54)|(55)|(56)|(64)|(65)|(66)|(74)|(75)|(76)|(84)|(85)|(86)|(94)|(95)|(96))[0-9]{6}$/;
            //Fixes
            const fixeOrange = /^((202)|(203)|(212)|(213)|(215)|(217)|(224)|(225)|(234)|(235)|(243)|(244)|(245)|(306)|(316)|(319)|(327)|(337)|(347)|(359)|(368))[0-9]{5}$/;
            const fixeMtn = /^((200)|(210)|(220)|(230)|(240)|(300)|(310)|(320)|(330)|(340)|(350)|(360))[0-9]{5}$/;
            const fixeMoov = /^((208)|(218)|(228)|(238))[0-9]{5}$/;
            
            // Match Mobile
            okMtn = item.match(regexMtn);
            okMoov = item.match(regexMoov);
            okOrange = item.match(regexOrange);
            okFixeMtn = item.match(fixeMtn);
            okFixeMoov = item.match(fixeMoov);
            okFixeOrange = item.match(fixeOrange);
        
            if(okMtn) {
                return item;
            } else if(okMoov) {
                return item;
            } else if(okOrange) {
                return item;
            } else if(okFixeMoov) {
                return item;
            } else if(okFixeOrange) {
                return item;
            } else if(okFixeMtn) {
                return item;
            } else {
                return item;
            }
        } else {
            return null;
        }
    
    }

    // Vérifier si numéro ivoirien
    const verifIsNumCI = (numero) => {
        if(numero)  {

            let okMtn, okMoov, okOrange, okFixeMoov, okFixeMtn, okFixeOrange;
        
            const regexMoov = /^((01)|(02)|(03)|(40)|(41)|(42)|(43)|(50)|(51)|(52)|(53)|(70)|(71)|(72)|(73))[0-9]{6}$/;
            const regexOrange = /^((07)|(08)|(09)|(47)|(48)|(49)|(57)|(58)|(59)|(67)|(68)|(69)|(77)|(78)|(79)|(87)|(88)|(89)|(97)|(98))[0-9]{6}$/;
            const regexMtn = /^((04)|(05)|(06)|(44)|(45)|(46)|(54)|(55)|(56)|(64)|(65)|(66)|(74)|(75)|(76)|(84)|(85)|(86)|(94)|(95)|(96))[0-9]{6}$/;
            //Fixes
            const fixeOrange = /^((202)|(203)|(212)|(213)|(215)|(217)|(224)|(225)|(234)|(235)|(243)|(244)|(245)|(306)|(316)|(319)|(327)|(337)|(347)|(359)|(368))[0-9]{5}$/;
            const fixeMtn = /^((200)|(210)|(220)|(230)|(240)|(300)|(310)|(320)|(330)|(340)|(350)|(360))[0-9]{5}$/;
            const fixeMoov = /^((208)|(218)|(228)|(238))[0-9]{5}$/;
            
            // Match Mobile
            okMtn = numero.match(regexMtn);
            okMoov = numero.match(regexMoov);
            okOrange = numero.match(regexOrange);
            okFixeMtn = numero.match(fixeMtn);
            okFixeMoov = numero.match(fixeMoov);
            okFixeOrange = numero.match(fixeOrange);
            
            if(numero.length === 8) {
                if(okMtn) {
                    return true;
                } else if(okMoov) {
                    return true;
                } else if(okOrange) {
                    return true;
                } else if(okFixeMoov) {
                    return true;
                } else if(okFixeOrange) {
                    return true;
                } else if(okFixeMtn) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false
            }
                
        } else {
            return null;
        }
    }

    const verifIsFixNumber = (item) => {

        let okToRestore;

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
            return true;
        } else {
            return false;
        }
    }

    // Vérifier si au moins un numéro est ivoirien dans les numéros du contact
    const verifIvorianNum = (phoneNumbers) => {
        const found = phoneNumbers.find(item => verifIsNumCI(item.number));

        return (found ? true : false)
    }

    const verifPrefixNum = (phoneNumbers) => {
        const found = phoneNumbers.find(item => verifIsFixNumber(item.number));

        return (found ? true : false)
    }

    const loadContacts = async () => {

        let dataNotDoubleContacts = [];
        setLoading(true);

        let isFix = await AsyncStorage.getItem('isFix');
        if(isFix) {
            await AsyncStorage.removeItem('isFix');
        }

        try {

            const dataC = await Contacts.getAll();

            dataNotDoubleContacts = dataC.map((item) => {
                // Récupère le ou les contacts
                let {phoneNumbers} = item;

                let newNumbers = phoneNumbers.map(phoneItem => {
                    let newNum = removeIndicatif225(phoneItem.number);
                    newNum = fixNumber(newNum);
                    phoneItem.number = newNum;
    
                    return phoneItem;
                })

                // Filter le data phoneNumbers
                // Renvoyez les données où numéro n'est pas null
                newNumbers = newNumbers.filter(item => item.number);

                // Supprimer les numéros doublons du contact
                newNumbers = newNumbers.reduce((acc, current) => {
                    const x = acc.find(item => item.number.replace(/\s/g, '') === current.number.replace(/\s/g, ''));
                    if (!x) {
                      return acc.concat([current]);
                    } else {
                      return acc;
                    }
                }, []);

                
                //contact.phoneNumbers = nouveau data phoneNumbers
                item.phoneNumbers = newNumbers;

                return item;
            }).filter(item => verifIvorianNum(item.phoneNumbers));

            // Trier les contacts par ordre alphabétique
            dataNotDoubleContacts.sort(triContactsByOrderAZ);
            setContacts(dataNotDoubleContacts);
            
            setCountContacts(dataNotDoubleContacts.length);

            setLoading(false);

        } catch(e){
            console.log(e);
            setLoading(false);
            setErrorApp('Erreur lors du chargement des contacts');
        }
    
        Contacts.checkPermission();
    }

    const removeIndicatif225 = (item) => {
        // Enlever les espaces
        let newItem;
        newItem = item.replace(/[- .()]/g, '');  
        if(newItem.startsWith('+225', 0)) {
            newItem = newItem.replace('+225', '');
        } else if(newItem.startsWith('00225', 0)) {
        newItem = newItem.replace('00225', '');
        } else if(newItem.startsWith('225', 0)) {
            newItem = newItem.replace('225', '');
        }
    
        if(newItem.length === 8) {
          return newItem;
        } else {
          return item;
        }
        
    }

    const goToMigrationProcess = () => {
        if(contacts && contacts.length > 0) {
            Alert.alert("Confirmer la migration",
                        `Attention!!! Les numéros ivoiriens précédés de +225, 00225 ou 225 et les numéros à 8 chiffres de votre répertoire seront convertis au format à 10 chiffres si vous validez cette opération. Vous êtes invité à ajouter les indicatifs internationaux des numéros à 8 chiffres non-nationaux de votre répertoire avant de poursuivre l'opération.
Voulez-vous continuer ?`, [
                {
                  text: "Annuler",
                  onPress: () => null,
                  style: "cancel"
                },
                { text: "Oui, Continuer", onPress: () => navigation.replace("MigrationProcess", {
                    dataC: contacts
                }) }
            ]);
        } else {
            Alert.alert(
                "Avertissement",
                "Vous n'avez pas de contacts à migrer.",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
            );
            return false;
        }
        
    }

    const goToRestoreScreen = async () => {

        let dataRestoreContacts = [];
        setLoading(true);

        let isRestore = await AsyncStorage.getItem('isRestore');
        if(isRestore) {
            await AsyncStorage.removeItem('isRestore');
        }

        try {

            const dataCToRestore = await Contacts.getAll();

            dataRestoreContacts = dataCToRestore.filter(item => verifPrefixNum(item.phoneNumbers));

            // Trier les contacts par ordre alphabétique
            dataRestoreContacts.sort(triContactsByOrderAZ);

            setLoading(false);

        } catch(e){
            console.log(e);
            setLoading(false);
            setErrorApp('Erreur lors du chargement des contacts');
        }
    
        Contacts.checkPermission();

        if(dataRestoreContacts && dataRestoreContacts.length > 0) {
            Alert.alert("Confirmer la restauration",
                        `Vous pouvez revenir à 8 chiffres, c'est gratuit, rapide, sécurisé et sans consommation de vos données internet.
Voulez-vous continuer ?`, [
                {
                  text: "Annuler",
                  onPress: () => null,
                  style: "cancel"
                },
                { text: "Oui, Continuer", onPress: () => navigation.replace("RestoreScreen", {
                    dataCToRestore: dataRestoreContacts
                }) }
            ]);
        } else {
            Alert.alert(
                "Avertissement",
                "Vous n'avez pas de contacts à restaurer.",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
            );
            return false;
        }
        
    }

    const getAvatarInitials = textString => {
        if (!textString) return "";
      
        const text = textString.trim();
      
        const textSplit = text.split(" ");
      
        if (textSplit.length <= 1) return text.charAt(0);
      
        const initials =
          textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
      
        return initials;
    };

    const renderListeContacts = (contactItem) => (
        
        <View style={styles.contactContainer}
            key={contactItem.recordID}
        >
            <View style={styles.avatarContact}>
                <Text style={styles.textAvatar}>{getAvatarInitials(contactItem.displayName)}</Text>
            </View>
            <View style={styles.contactInfo}>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.contactName}>{!isNaN(Number(contactItem.displayName.replace(/\s/g, ''))) ? 'Sans nom' : contactItem.displayName}</Text>
                    {contactItem.phoneNumbers.map((contact, index) => (
                            verifIsNumCI(contact.number) && (
                            <Text key={index} style={styles.contactNumber}>{contact.number}</Text>
                            )
                            
                        )
                    )}
                </View>
            </View>
        </View>
    )
 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.headerTitleLogo}>Migration</Text>
                    </View>
                    <TouchableOpacity style={{marginRight: 10}}
                        onPress={loadContacts}
                    > 
                        <Icon name='refresh' color='#4a235a' size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerSelect}>
                    <Text style={styles.headerTitle}>Repertoire</Text>
                    {countContacts ? <Text>Vous avez {countContacts} contact{countContacts > 1 ? 's' : ''} à migrer vers 10 chiffres</Text> : 
                        <Text>Vous n'avez aucun contact à convertir vers 10 chiffres</Text>
                    }
                </View>
                {loading ? 
                    <ModalLoading modalParagraph='Chargement des contacts...' />
                : (!errorApp ?
                    <>
                        <FlatList
                            style={{width: '100%'}}
                            data={contacts}
                            renderItem={({item}) => renderListeContacts(item)}
                            keyExtractor={contact => contact.recordID}
                            onEndReachedThreshold={0.01}
                        />
                        <TouchableOpacity style={styles.beginButton}
                            onPress={goToMigrationProcess}
                        >
                            <Text style={styles.beginButtonText}>Migrer vers 10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.beginButton}
                            onPress={goToRestoreScreen}
                        >
                            <Text style={styles.beginButtonText}>Revenir à 8</Text>
                        </TouchableOpacity>
                    </>
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    error: {
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        color:'#F77F00'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    headerTitleLogo: {
        fontSize:25,
        color:'#4a235a',
        fontWeight: 'bold'
    },
    logo: {
        height: 70,
        width: 70,
    },
    beginButton: {
        backgroundColor: '#4a235a',
        borderRadius: 53,
        width: '80%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    beginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#F77F00",
        height: 30,
        padding: 20,
        borderRadius:17,
        margin:20,
        position: 'absolute',
        bottom: 10,
    },
    headerSelect: {
        width: '100%',
        marginBottom: 30,
        marginTop: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700'
    },
    contactContainer: {
        width: '100%',
        //backgroundColor: 'red',
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E9EBF1'
    },
    allContacts: {
        width: '100%',
    },
    contact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    avatarContact: {
        height: 50,
        width: 50,
        borderRadius: 10,
        backgroundColor: '#E9EBF1',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAvatar: {
        fontSize: 20,
    },
    contactInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    contactName: {
        fontSize: 16,
        fontFamily: 'OpenSans-SemiBold',
        marginBottom: 5
    },
    contactNumber: {
        fontFamily: 'OpenSans-Regular'
    },
    footer: {
        padding: 15,
    },
    footerText: {
        fontWeight: '600',
    }
});
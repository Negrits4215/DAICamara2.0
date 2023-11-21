import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Alert, FlatList, Text, Modal, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import * as Sharing from 'expo-sharing'; // Agregado para compartir imágenes

export default function PhotoItem({ photoUri }) {
    const [contacts, setContacts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
                });

                if (data.length > 0) {
                    setContacts(data);
                } else {
                    Alert.alert('Error', 'No se encontraron contactos.');
                }
            } else {
                Alert.alert('Error', 'Se requieren permisos para acceder a los contactos.');
            }
        };

        fetchContacts();
    }, []);

    const sendPhotoViaSMS = async () => {
        if (selectedContact && selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0) {
            const phoneNumber = selectedContact.phoneNumbers[0].number;

            if (photoUri) {
                const message = `Mira esta foto: ${photoUri}`;
                const isAvailable = await SMS.isAvailableAsync();

                if (isAvailable) {
                    await SMS.sendSMSAsync([phoneNumber], message);
                    setModalVisible(false);
                } else {
                    Alert.alert('Error', 'El envío de mensajes de texto no está disponible en este dispositivo.');
                }
            } else {
                Alert.alert('Error', 'La foto no es válida.');
            }
        } else {
            Alert.alert('Error', 'Selecciona un contacto válido.');
        }
    };

    const sharePhoto = async () => {
        if (photoUri) {
            await Sharing.shareAsync(photoUri);
        } else {
            Alert.alert('Error', 'La foto no es válida.');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedContact(item)}>
            <View style={[styles.contactItem, selectedContact === item && styles.selectedContact]}>
                <Text style={selectedContact === item && styles.selectedContactText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View>
                    <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />
                </View>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <FlatList
                        data={contacts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={{ flex: 1 }}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendPhotoViaSMS}>
                        <Text style={styles.sendButtonText}>Enviar Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton} onPress={sharePhoto}>
                        <Text style={styles.shareButtonText}>Compartir Foto</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedContact: {
        backgroundColor: 'yellow', // Puedes cambiar el color de fondo para resaltar
    },
    selectedContactText: {
        fontWeight: 'bold', // Puedes aplicar otros estilos al texto del contacto seleccionado
    },
    sendButton: {
        backgroundColor: 'blue',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    shareButton: {
        backgroundColor: 'green',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    shareButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

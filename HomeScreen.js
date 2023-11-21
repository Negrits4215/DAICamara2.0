import React from 'react';
import { View, Button, FlatList } from 'react-native';
import PhotoItem from './components/PhotoItem';

export default function HomeScreen({ photos, navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <PhotoItem photoUri={item} />}
        numColumns={2} // Puedes ajustar esto según tus necesidades de diseño
      />
      <Button title="Take New Photo" onPress={() => navigation.navigate('CameraScreen')} />
    </View>
  );
}

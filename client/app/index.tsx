import { useState } from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';

const BASE_URL = 'https://guess-bgjd.onrender.com';

export default function Index() {
  const [result, setResult] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    try {
      setLoading(true);

      const picked = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: 3,
        mediaTypes: ['images'],
      });

      if (picked.canceled) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      picked.assets.forEach((img, index) => {
        formData.append('files', {
          uri: img.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      const res = await fetch(`${BASE_URL}/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      setLoading(false);

      if (!res.ok) {
        console.log(res);
        alert('Upload failed');
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert('Something went wrong');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F7F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
      }}
    >
      {/* Modal Result */}
      {result && (
        <Modal visible animationType="fade" transparent>
          <BlurView
            intensity={40}
            tint="dark"
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 25,
            }}
          >
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                elevation: 5,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
              }}
            >
              {result.map((r, index) => (
                <Text
                  style={{
                    fontSize: 16,
                    color: '#333',
                    marginBottom: 20,
                    fontWeight: '500',
                  }}
                >
                  {`${index}: ${r}`}
                </Text>
              ))}
              <Pressable
                onPress={() => setResult(undefined)}
                style={{
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: '#1A73E8',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Close</Text>
              </Pressable>
            </View>
          </BlurView>
        </Modal>
      )}

      {/* Upload Button */}
      <TouchableOpacity
        onPress={handleImagePicker}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#1A73E8',
          paddingVertical: 16,
          paddingHorizontal: 28,
          borderRadius: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#1A73E8',
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          {loading ? 'Processing...' : 'Upload Images'}
        </Text>
      </TouchableOpacity>

      {/* Subtext */}
      <Text
        style={{
          marginTop: 18,
          color: '#666',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Supports multiple images • Up to 3 files
      </Text>
    </View>
  );
}

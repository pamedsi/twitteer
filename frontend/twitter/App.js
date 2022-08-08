import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { api } from './src/services/api';

export default function App() {

  try {
    useEffect(() => {
      async function seeUsers() {
        const users = await api.get('users')
        console.log(users)
      }
      seeUsers()
    }, [])

  } catch (error) {
    console.log(error)
  }



  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { api } from './src/services/api';
// import { user } from './../../backend/api/models/user';

export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      users: []
    }
  }

  async componentDidMount(){
    const {data: users} = await api.get('users')
    this.setState({
      users: users[0]
    })
    console.log(this.state)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{String(this.state.users.full_name)}</Text>
        <Text> abaixo </Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebaseConfig = {
  apiKey: "AIzaSyCz0tSItpib2o8ikutynA33nHmVA-o0Y-A",
  authDomain: "chatapp-37dc1.firebaseapp.com",
  projectId: "chatapp-37dc1",
  storageBucket: "chatapp-37dc1.appspot.com",
  messagingSenderId: "146206587088",
  appId: "1:146206587088:web:b6dfb8f69a8cea20acc6d5"
};

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id:'',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
      location: null
    }

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.refMsgsUser = null;

  }

  onCollectionUpdate = (querySnapshot) => { 
    const messages = [];
    querySnapshot.forEach((doc) => {
      // get the doc data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages
    });
  };

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
			if (connection.isConnected) {
				
        this.setState({ isConnected: true });
				console.log('online');

				this.unsubscribe = this.referenceChatMessages
					.orderBy('createdAt', 'desc')
					.onSnapshot(this.onCollectionUpdate);

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });

      this.refMsgsUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
        
    });

    this.saveMessages();
    } else {
      // if the user is offline
      this.setState({ isConnected: false });
      console.log('offline');
      this.getMessages();
      }
    });
  }

  addMessages() { 
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || '',
      location: message.location || null
    });
  }

  renderCustomView(props) {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3}}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessages();
    })
  }

  renderBubble(props) {
    return (
      <Bubble 
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000'
        }
      }} />
    )
  }

  
  renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return (
        <InputToolbar
          {...props}
        />
      );
		}
	}

  componentWillUnmount() {
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.unsubscribe();
        this.authUnsubscribe();
      }
    });
  }

  render() {

    const { bgColor } = this.props.route.params;

    return (

      <View style={styles.container}>

        <View style={{...styles.container,
          backgroundColor: bgColor
        }}>
          
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.user._id,
              name: this.state.name,
              avatar: this.state.user.avatar,
            }}
          />

          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null }

        </View>
      
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

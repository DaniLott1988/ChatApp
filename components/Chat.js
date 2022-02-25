import React, { Component } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import "firebase/firestore";

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
    };

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.refMsgsUser = null;

  }

  componentDidMount() {

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
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

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate)
    });

  }

  onCollectionUpdate = (querySnapshot) => { 
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages
    });
  };

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();

  }

  addMessages() { 
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || null,
      createdAt: message.createdAt,
      user: {
        _id: message.user._id,
        name: message.user.name,
        avatar: message.user.avatar
      } 
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
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

  render() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (

      <View style={styles.container}>

        <View style={{...styles.container,
          backgroundColor: bgColor
        }}>

        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar
          }} />

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

import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, Image, TouchableOpacity, Pressable } from 'react-native';
import BGImage from '../assets/BGImage.png';
import icon from '../assets/icon.svg'

export default class Start extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      bgColor: this.colors.blue
    };
  }

  //function to update the state with new bg color for the chat
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  //color options from the assignment brief
  colors = {
    dark: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE',
  };

  render() {

    return (

      <View style={styles.container}>

        <ImageBackground source={BGImage} resizeMode='cover' style={styles.backgroundImage} >

          <View style = {styles.titleBox}>

            <Text style={styles.title}>ChatApp</Text>

          </View>

          <View style={styles.box1}>

            <View style={styles.inputBox}>

              <Image source={icon} style={styles.image} />

              <TextInput 
                accessible={true}
                accessibilityLabel= 'Your Name'
                accessibilityHint= 'Please type the name you want to use to chat'
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text})}
                value={this.state.name}
                placeholder='Your Name' />

            </View>

            <View style={styles.colorBox}>

              <Text style={styles.chooseColor}> Choose Your Background Color: </Text>

            </View>

            <View style={styles.colorArray}>

              <TouchableOpacity
              accessible={true}
              accessibilityLabel= 'Black Background'
              accessibilityHint= 'Please select this option to turn the background color of the chat black'
              style={styles.color1}
              onPress={() => this.changeBgColor(this.colors.dark)}>
              </TouchableOpacity>

              <TouchableOpacity
              accessible={true}
              accessibilityLabel= 'Purple Background'
              accessibilityHint= 'Please select this option to turn the background color of the chat purple'
              style={styles.color2}
              onPress={() => this.changeBgColor(this.colors.purple)}>
              </TouchableOpacity>

              <TouchableOpacity
              accessible={true}
              accessibilityLabel= 'Blue Background'
              accessibilityHint= 'Please select this option to turn the background color of the chat blue'
              style={styles.color3}
              onPress={() => this.changeBgColor(this.colors.blue)}>
              </TouchableOpacity>

              <TouchableOpacity
              accessible={true}
              accessibilityLabel= 'Green Background'
              accessibilityHint= 'Please select this option to turn the background color of the chat green'
              style={styles.color4}
              onPress={() => this.changeBgColor(this.colors.green)}>
              </TouchableOpacity>

            </View>

            <Pressable style={styles.button}
            onPress={() => this.props.navigation.navigate('Chat', {
              name: this.state.name,
              bgColor: this.state.bgColor
            })}>
              <Text style={styles.buttonText}>Start the Chat</Text>
            </Pressable>

          </View>

        </ImageBackground>
        
      </View>
      
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBox: {
    height: '50%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 100
  },

  title: {
    fontSize: 45, 
    fontWeight: "600", 
    color: '#FFFFFF',
  },

  box1: {
    backgroundColor: 'white', 
    height: '44%',
    width: '88%',
    justifyContent: 'space-around', 
    alignItems: 'center',

  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: 'grey',
    width: '88%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  image: {
    width: 20,
    height: 20,
    marginRight: 10
  },

  input: {
    fontSize: 16, 
    fontWeight: "300", 
    color: '#757083', 
    opacity: 0.5,
  },

  colorBox: {
    marginRight: 'auto',
    paddingLeft: 15,
    width: '88%'
  },

  chooseColor: {
    fontSize: 16, 
    fontWeight: "300", 
    color: '#757083', 
    opacity: 1,
  },

  colorArray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    paddingRight: 60
  },

  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  button: {
    width: '88%',
    height: 70,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600"
  }
});

import * as React from 'react';
import {Switch, StyleSheet, View, Text,Image, Button,TextInput, CheckBox,KeyboardAvoidingView, Alert} from 'react-native';
import {AsyncStorage} from 'react-native';
import MQTT from 'sp-react-native-mqtt';

export default class Login extends React.Component {

    constructor(props){
    super(props)
      this.state = {
        username: '',
        password: '',
        uri: '',
        remember: false,
        flag: null,
        errorMessage: ''
      }
    }

    connectionVerification(navigation, state, that){
      MQTT.createClient({
          uri: this.state.uri,
          user: this.state.username,
          pass: this.state.password,
          auth: true
      }).then((client) => {
          client.on('connect', function() {
            console.log('connected');
            console.log('username', state.username)
            if (state.remember === true){
                //console.log('im in remember')
                that.storeData('user',state.username);
                that.storeData('pass',state.password);
                that.storeData('uri',state.uri);
                that.storeData('switch', `${state.remember}`);
            } else if (state.remember === false && state.flag !== state.remember){
                //console.log("im in dont remember")
                var value=''
                that.storeData('user',value);
                that.storeData('pass',value);
                that.storeData('uri',value);
                that.storeData('switch', `${state.remember}`);
            }
            navigation.navigate('Connect',{
              username: state.username,
              password: state.password,
              uri: state.uri
            })
          });
          client.on('error', function(msg) {
          console.log('mqtt.event.error', msg);
          that.setState({errorMessage: "Connection Error"})
          });
          client.connect();
      })
      .catch(function(err){
        console.log(err);
      });

    }

    credentialHandler(){
      this.setState({remember: !this.state.remember})
    }

    componentDidMount(){
      this.retrieveData()
    }

    async storeData(key, value){
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.log(error)
        }
      };

    async retrieveData(){
      try {
        await AsyncStorage.getItem('user').then((res) => {this.setState({username: res})})
        await AsyncStorage.getItem('pass').then((res) => {this.setState({password: res})})
        await AsyncStorage.getItem('uri').then((res) => {this.setState({uri: res})})
        await AsyncStorage.getItem("switch").then((res) => {
          if (res === 'false' || res === null) {
            this.setState({remember: false, flag: false})
          } else {
            this.setState({remember: true, flag: true})
          }
           })
        console.log('retrieved')
      } catch (error) {
        console.log(error)
      }
    };

  render(){
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image style={{width: 100, height: 100, marginBottom:10}} source={require('../images/uniwa.png')} />
        </View>
        <View style={{flex: 2}}>
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
          <View style={{ flexDirection: 'row' }}>
              <Text style={{height:40, marginTop:10, fontSize: 16}}>Enter Username:</Text>
              <TextInput
                style={{
                  height: 40,
                  backgroundColor:'rgba(0,0,0,0.2)',
                  marginBottom:10,
                  color:'#FFF',
                  paddingHorizontal:10,
                  marginLeft: 10,
                  borderRadius: 5
                }}
                placeholder="Username"
                onChangeText={(user) => this.setState({username: user})}
              >
                  {this.state.username}
              </TextInput>
          </View>

          <View style={{ flexDirection: 'row' }}>
              <Text style={{height:40, marginTop:10, fontSize: 16}}>Enter Password:</Text>
              <TextInput
                  style={{
                  height: 40,
                  backgroundColor:'rgba(0,0,0,0.2)',
                  marginBottom:10,
                  color:'#FFF',
                  paddingHorizontal:10,
                  marginLeft: 10,
                  borderRadius: 5
                }}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(pass) => this.setState({password: pass})}
              >
                  {this.state.password}
              </TextInput>
          </View>

          <View>
           <Text style={{height:40, marginTop:10, fontSize: 16}}>Enter MQTT and port:</Text>
            <TextInput
              style={{
              height: 40,
              backgroundColor:'rgba(0,0,0,0.2)',
              marginBottom:10,
              color:'#FFF',
              paddingHorizontal:10,
              borderRadius: 5
              }}
              placeholder="IP:port"
              onChangeText={(uri) => this.setState({uri: uri})}
            >
              {this.state.uri}
            </TextInput>
          </View>

          <Button
              title="Log in"
              onPress={() => this.connectionVerification(this.props.navigation, this.state, this)}
          />
          <View style={{backgroundColor: 'transparent', flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16}}>Remember Me</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                onValueChange = {() => this.credentialHandler()}
                value = {this.state.remember}
                style={{}}
              />
            </View>
          </View>
          <Text>Tsirimiangos Theofilos </Text>
          <Text>Michalopoulos Ioannis</Text>

        </View>
      </View>
    );
  }
}

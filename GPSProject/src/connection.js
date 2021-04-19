import * as React from 'react';
import {StyleSheet, View, Text,Image, Button,TextInput, CheckBox,KeyboardAvoidingView, Alert} from 'react-native';
import GetLocation from 'react-native-get-location';
import MQTT from 'sp-react-native-mqtt';

export default class Connect extends React.Component {

    constructor(props){
        super(props)
        this.state = {
          lat: '',
          long: '',
          alt: '',
          username: '',
          password: '',
          uri: ''
        }
      }

    componentDidMount(){
      this.setState({
        username: this.props.route.params.username,
        password: this.props.route.params.password,
        uri: this.props.route.params.uri
      })
    }

    connectToNodeRed(data){

        data = JSON.stringify(data)
        /* create mqtt client */
        MQTT.createClient({
            uri: this.state.uri,
            user: this.state.username,
            pass: this.state.password,
            auth: true
        }).then(function(client) {

            client.on('closed', function() {
            console.log('mqtt.event.closed');
            });

            client.on('error', function(msg) {
            console.log('mqtt.event.error', msg);
            });

            client.on('message', function(msg) {
            console.log('mqtt.event.message', msg);
            });

            client.on('connect', function() {
            console.log('connected');
            client.subscribe('/data', 0);
            client.publish('/data', data, 0, false);
            });

            client.connect();
        }).catch(function(err){
            console.log(err);
        });
    }

    getMyLocation(){
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(location => {
            console.log(location);
            //console.log(flag);

            this.setState({
            lat: location.latitude,
            long: location.longitude,
            alt: location.altitude
            }, () => {
            this.connectToNodeRed(this.state)
            })
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    }


    render(){

      //var test = this.props.route.params.username

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ flexDirection: 'row' }}>
                    {/* <CheckBox
                        value={this.state.checked}
                        onValueChange={() => this.flag({ checked: !this.state.checked })}

                    /> */}
                    <Text style={{marginTop: 5}}> Remember me</Text>
                    </View>




                <Text style={{fontSize: 20}}>This is my latitude: {this.state.lat}</Text>
                <Text style={{fontSize: 20}}>This is my longitude: {this.state.long}</Text>
                <Text style={{fontSize: 20, marginBottom: 15}}>This is my altitude: {this.state.alt}</Text>
                <Button
                title="Get Location"
                onPress={() => this.getMyLocation()}
                />

            </View>
        );
    }
}

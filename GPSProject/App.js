import React from 'react';
import {View} from 'react-native';
import Nav from './src/navigator';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Warning: AsyncStorage']);

export default class App extends React.Component {

  render(){
    return(
        <Nav />
    )
  }
}

import * as React from 'react';
import {StyleSheet, View, Text,Image, Button,TextInput, CheckBox,KeyboardAvoidingView, Alert} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import Connect from './connection';

const Stack = createStackNavigator();

function Nav() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Connect" component={Connect} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Nav;

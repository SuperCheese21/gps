import React from 'react';
import { View } from 'react-native';
import { KeepAwake } from 'expo';

import AccelerometerData from './src/components/Accelerometer';
import GPSData from './src/components/GPSData';

export default class App extends React.Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <KeepAwake />
                <GPSData />
                <AccelerometerData />
            </View>
        );
    }
}

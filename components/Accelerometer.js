import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { Accelerometer } from 'expo';
import Speedometer from 'react-native-speedometer-chart';

const NUM_POINTS = 10;
const UPDATE_INTERVAL = 10;

export default class AccelerometerData extends React.Component {
    state = {
        gForceValues: [],
        gForce: null,
        low: 1,
        high: 1
    };

    componentDidMount() {
        // Add listener for accelerometer
        Accelerometer.addListener(({ x, y, z }) => {
            this.updateGForce(Math.sqrt(x*x + y*y + z*z));
        });
        Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
    }

    updateGForce(newValue) {
        let { gForceValues, low, high } = this.state, gForce;

        // Add new value to values array
        gForceValues.push(newValue);
        if (gForceValues.length > NUM_POINTS) {
            gForceValues.shift();

            // Calculate average value in values array
            let sum = 0;
            gForceValues.forEach(value => {
                sum += value;
            });
            gForce = sum / NUM_POINTS;

            // Update extreme values
            if (!low || gForce < low) {
                low = gForce;
            }
            if (!high || gForce > high) {
                high = gForce;
            }
        }

        // Update state
        this.setState({ gForceValues, gForce, low, high });
    }

    render() {
        const { gForce, low, high } = this.state;
        if (!gForce) {
            return null;
        }

        return (
            <View style={styles.container}>
                <Speedometer
                    value={1 - 1 / (gForce + 1)}
                    totalValue={1}
                />
                <Text style={{ fontSize: 30 }}>{gForce.toFixed(2)}</Text>
                <Text>Low: {low.toFixed(2)}    High: {high.toFixed(2)}</Text>
                <Button
                    onPress={() => this.setState({ low: 1, high: 1 })}
                    title='Reset'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

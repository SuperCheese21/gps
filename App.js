import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { AppLoading, Constants, Location, Permissions } from 'expo';

import moment from 'moment';

export default class App extends React.Component {
    state = {
        location: null
    };

    async componentDidMount() {
        if (Platform.OS !== 'android' || Constants.isDevice) {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
            } else {
                this._getLocationAsync();
                setInterval(() => {
                    this._getLocationAsync()
                }, 1000);
            }
        }
    }

    _getLocationAsync = async () => {
        await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        }, location => {
            console.log('Location updated');
            this.setState({
                location: location
            });
        });
    };

    render() {
        if (!this.state.location) {
            return (
                <AppLoading />
            );
        }
        return (
            <View style={styles.container}>
                <Text>Updated {moment(this.state.location.timestamp).format('h:mm:ss')}</Text>
                <Text>{this.state.location.coords.latitude}, {this.state.location.coords.longitude} (+/- {this.state.location.coords.accuracy} m)</Text>
                <Text>{this.state.location.coords.altitude} m</Text>
                <Text>{this.state.location.coords.heading}°</Text>
                <Text>{this.state.location.coords.speed} m/s</Text>
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

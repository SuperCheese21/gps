import React from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Location, Permissions } from 'expo';

const M_TO_FT = 3.28084;
const MS_TO_KTS = 1.94384;
const UPDATE_INTERVAL = 1000;

export default class GPSData extends React.Component {
    state = {
        location: {}
    }

    componentDidMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert('Error', 'Permission to access location was denied');
        }
        await Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: UPDATE_INTERVAL,
            distanceInterval: 0
        }, ({ coords }) => {
            this.setState({ location: this.formatData(coords) });
        });
    };

    formatData(location) {
        let locationString = 'N/A', locationURL = '';
        if (location.latitude && location.longitude) {
            locationString = location.latitude.toFixed(5) + ', ' + location.longitude.toFixed(5);
            locationURL = 'https://www.google.com/maps/search/?api=1&query=' + location.latitude + ',' + location.longitude;
        }
        return {
            locationString: locationString,
            locationURL: locationURL,
            accuracy: Math.round(location.accuracy * M_TO_FT),
            altitude: Math.round(location.altitude * M_TO_FT),
            speed: Math.round(location.speed * MS_TO_KTS),
            heading: Math.round(location.heading)
        };
    }

    render() {
        const { location } = this.state;
        return (
            <View style={styles.container}>
                <Text>
                    Location: <Text
                        style={styles.linkText}
                        onPress={() => Linking.openURL(location.locationURL)}
                    >
                        {location.locationString}
                    </Text> (+/- {location.accuracy} ft)
                </Text>
                <Text>Altitude: {location.altitude} ft</Text>
                <Text>Speed: {location.speed} kts</Text>
                <Text>Heading: {location.heading}°</Text>
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
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline'
    }
});

import React, { Component } from 'react';
import { View, Text, ImageBackground, ScrollView } from 'react-native';
import axios from 'axios';
import { Header, Button, Spinner, Card, CardSection, Input } from './components/common';
import CurrentWeather from './CurrentWeather';
import SevenDayWeather from './SevenDayWeather';
import moment from 'moment';
import backgroundPic from './Assets/dmitry-bayer.jpg';
import backgroundPic1 from './Assets/tristan-taussac.jpg';
import backgroundPic2 from './Assets/chairlift_snow.jpg';
import backgroundPic3 from './Assets/borealis.jpg';
import backgroundPic4 from './Assets/sea_sun.jpg';
import backgroundPic5 from './Assets/sunshine.jpg';
import backgroundPic6 from './Assets/umbrella.jpg';
import backgroundPic7 from './Assets/andrew-haimerl-478640-unsplash.jpg';
import backgroundPic8 from './Assets/ash-edmonds.jpg';
import backgroundPic9 from './Assets/frank-mckenna.jpg';
import backgroundPic11 from './Assets/sea.jpg';
import backgroundPic12 from './Assets/weather_unsplash.jpg';




// this line is to get rid of the annoying yellow box warning.
console.ignoredYellowBox = ['Remote debugger'];

class App extends Component {
    state = {
        userInput: '',
        data10: [],
        data: {},
        location: {},
        icon: '',
        error: '',
        loading: false,
        picture: backgroundPic,
    }

    pictureChange() {
        let allPics = [backgroundPic, backgroundPic1, backgroundPic2, backgroundPic3, backgroundPic4, backgroundPic5, backgroundPic6, backgroundPic7, backgroundPic8, backgroundPic9, backgroundPic11, backgroundPic12];
        let currentPic = this.state.picture;
        let newIndex = Math.floor(Math.random(allPics) * Math.floor(allPics.length))
        let newPic = allPics[newIndex]
        this.setState({
            picture: newPic
        })
    }

    componentDidMount() {
        setInterval(() => {
            this.pictureChange()
        }, 10000);
    }

    handleChange(val) {
        this.setState({
            userInput: val
        })
    }


    getWeather() {
        this.setState({
            loading: true,
            error: '',
            userInput: '',
            data: {},
            data10: [],
            location: {},
            icon: ''
        })

        axios.get(`https://api.wunderground.com/api/17702fa3e4783439/conditions/q/${this.state.userInput}.json`)
            .then(res =>
                this.setState({
                    data: res.data.current_observation,
                    location: res.data.current_observation.display_location,
                    icon: res.data.current_observation.icon_url
                })
            )
            .catch(() => this.weatherFail());
    }

    getWeather7() {
        this.setState({
            loading: true,
            error: '',
            userInput: '',
            data: {},
            location: {},
            icon: ''
        })
        this.getWeather();
        axios.get(`https://api.wunderground.com/api/17702fa3e4783439/forecast10day/q/${this.state.userInput}.json`)
            .then(res =>
                this.setState({
                    data10: res.data.forecast.simpleforecast.forecastday
                })
            )
            .catch(() => this.weatherFail());
    }

    weatherFail() {
        this.setState({
            error: 'Location not found!',
            loading: false
        })
    }


    render() {
        //date from Moment.js library
        var now = moment().format('LL');
        var today = moment().format('dddd');
        return (
            <ImageBackground style={styles.imageStyle} source={this.state.picture}>
                <View style={styles.overlay} />
                <Card>
                    <Header headerText={'Weather App'} />
                    <CardSection>
                        <Text style={styles.dateStyle}>{today}, {now}</Text>
                    </CardSection>
                    <CardSection>
                        <Input
                            placeholder='Denver, CO or 80123'
                            label='Location'
                            value={this.state.userInput}
                            onChangeText={(val) => this.handleChange(val)}
                        />
                    </CardSection>

                    <CardSection>
                        <Button onPress={() => this.getWeather()}> Current Weather </Button>
                        <Button onPress={() => this.getWeather7()}> 7-day forecast</Button>                
                    </CardSection>

                    <CardSection>
                        <Text style={styles.errorStyle}>
                            {this.state.error}
                        </Text>
                    </CardSection>

                    <CardSection>
                        <CurrentWeather
                            data={this.state.data}
                            location={this.state.location}
                            icon={this.state.icon}
                            error={this.state.error}
                        />
                    </CardSection>
                    <CardSection >
                        <ScrollView style={{ flex: 1}}>
                                <SevenDayWeather
                                    day={this.state.data10}
                                    location={this.state.location} 
                                />
                        </ScrollView>
                    </CardSection>
                </Card>
            </ImageBackground>
        );
    }
}
const styles = {
    imageStyle: {
        flex: 1,
        width: null,
        height: null,
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#1E1312',
        opacity: .6,
    },
    dateStyle: {
        fontSize: 18,
        height: 23,
        fontWeight: '900',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#E8E1E6'
    },
    errorStyle: {
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#CE4849',
        fontWeight: '800'
    }
}
export default App;
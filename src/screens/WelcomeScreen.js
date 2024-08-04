import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaCoustom from '../components/SafeAreaCoustom';
import CoustomBtn from '../components/CoustomBtn';
import { FontsStyle, windowHeight, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl, endPoints } from '../services/api';
import Image from 'react-native-image-progress';


const WelcomeScreen = () => {
    const navigation = useNavigation()
    const [slider, setSlider] = useState(null)
    useEffect(() => {
        getPosters()
    }, [])

    const getPosters = async () => {
        const res = await axios.get(`${baseUrl}${endPoints.getSliderImages}`)
        // console.log(res.data)
        setSlider(res.data.data)
    }


    const onPress = () => {
        navigation.navigate('AppIntroFirst', { slider })
    }

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);




    return (
        <SafeAreaCoustom>
            <View style={styles.mainCard}>
                <View style={styles.imageCard}>
                    <Image
                        source={{ uri: slider?.slider_1[0] }}
                        indicator={ActivityIndicator}
                        resizeMode='contain'
                        style={{ width: '100%', flex: 1 }}
                    />

                </View>
                <View style={styles.indeGatorCard}>
                    <View style={[styles.roundIndegator, { width: 17 }]} />
                    <View style={styles.roundIndegator} />
                    <View style={styles.roundIndegator} />
                </View>
            </View>
            <View style={styles.btnCard}>
                <CoustomBtn
                    title={'Next : Notification'}
                    paddingVertical={15}
                    // borderWidth={1}
                    width={windowWidth * 0.9}
                    backgroundColor={'#22C55F'}
                    borderRadius={15}
                    titleColor={'#FFF'}
                    onPress={onPress}
                />
            </View>
        </SafeAreaCoustom>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    mainCard: {
        flex: 1,
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'red',
        width: '100%',
        justifyContent: 'flex-start'

    },
    detailsCard: {
        // borderWidth: 1,
        width: '90%',
        marginVertical: '5%',
        marginBottom: '8%'
    },
    indeGatorCard: {
        // borderWidth: 1,
        flexDirection: 'row',
        gap: 10
    },
    roundIndegator: {
        height: 10,
        backgroundColor: '#454545',
        // borderWidth: 1,
        width: 10,
        borderRadius: 5
    },
    imageCard: {
        width: '100%',
        // borderWidth: 1,
        alignItems: 'center',
        height: '80%',
        justifyContent: 'center'
    },
    btnCard: {
        position: 'absolute',
        bottom: '5%'
    }
});

import { ActivityIndicator, Alert, BackHandler, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import SafeAreaCoustom from '../components/SafeAreaCoustom';
import CoustomBtn from '../components/CoustomBtn';
import { FontsStyle, windowHeight, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import { useNavigation, useRoute } from '@react-navigation/native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

const AppIntroFirst = () => {
    const route = useRoute()
    const { slider } = route.params
    // console.log('AppIntroFirst', slider)
    const navigation = useNavigation()


    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want exit from the application?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);




    const onPress = () => {
        navigation.navigate('AppIntroSecond', { slider })
    }
    return (
        <SafeAreaCoustom>
            <View style={styles.mainCard}>
                <View style={styles.imageCard}>
                    <Image
                        source={{ uri: slider?.slider_2[0] }}
                        indicator={ActivityIndicator}
                        resizeMode='contain'
                        style={{ width: '100%', flex: 1 }}
                    />

                </View>
                <View style={styles.indeGatorCard}>
                    <View style={styles.roundIndegator} />
                    <View style={[styles.roundIndegator, { width: 17 }]} />
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

export default AppIntroFirst;

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
        marginVertical: '8%'
    },
    indeGatorCard: {
        // borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        // marginTop: '10%'
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
        height: '80%'
    },
    btnCard: {
        position: 'absolute',
        bottom: '5%'
    }
});

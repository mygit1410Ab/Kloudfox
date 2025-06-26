import { ActivityIndicator, BackHandler, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import SafeAreaCoustom from '../components/SafeAreaCoustom';
import CoustomBtn from '../components/CoustomBtn';
import { FontsStyle, windowHeight, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl, endPoints } from '../services/api';
import PagerView from 'react-native-pager-view';
import FastImage from 'react-native-fast-image';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const [slider, setSlider] = useState(null);
    const pagerRef = useRef(null);

    // Memoize slider data to avoid unnecessary re-renders
    const memoizedSlider = useMemo(() => slider, [slider]);

    const goToPage = useCallback((pageNumber) => {
        if (pagerRef.current) {
            pagerRef.current.setPage(pageNumber);
        }
    }, []);

    const fetchPosters = useCallback(async () => {
        try {
            const res = await axios.get(`${baseUrl}${endPoints.getSliderImages}`);
            setSlider(res.data.data);
        } catch (error) {
            console.error("Error fetching slider images:", error);
        }
    }, []);

    useEffect(() => {
        fetchPosters();
    }, [fetchPosters]);

    const onPressSlideOne = useCallback(() => {
        goToPage(1);
    }, [goToPage]);

    const onPressSlideTwo = useCallback(() => {
        goToPage(2);
    }, [goToPage]);

    const onPressSlideThree = useCallback(() => {
        navigation.navigate('LogIn');
    }, [navigation]);

    const SkipHandler = useCallback(() => {
        navigation.navigate('LogIn');
    }, [navigation]);

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    // Memoized Skip button component
    const SkpiBtn = useMemo(() => (
        <TouchableOpacity
            onPress={SkipHandler}
            style={styles.skipBtn}>
            <Text style={styles.skip}>{"Skip"}</Text>
        </TouchableOpacity>
    ), [SkipHandler]);

    return (
        <SafeAreaCoustom>
            <PagerView
                ref={pagerRef}
                scrollEnabled={false}
                style={styles.pagerView}
                initialPage={0}
            >
                <View style={styles.Card} key="1">
                    {SkpiBtn}
                    <FastImage
                        source={{ uri: memoizedSlider?.slider_1[0] }}
                        resizeMode='contain'
                        style={{ width: '100%', flex: 1 }}
                    />
                    <CoustomBtn
                        title={'Next : Notification'}
                        paddingVertical={15}
                        width={windowWidth * 0.9}
                        backgroundColor={'#22C55F'}
                        borderRadius={15}
                        titleColor={'#FFF'}
                        onPress={onPressSlideOne}
                    />
                </View>
                <View style={styles.Card} key="2">
                    {SkpiBtn}
                    <FastImage
                        source={{ uri: memoizedSlider?.slider_2[0] }}
                        resizeMode='contain'
                        style={{ width: '100%', flex: 1 }}
                    />
                    <CoustomBtn
                        title={'Next : Notification'}
                        paddingVertical={15}
                        width={windowWidth * 0.9}
                        backgroundColor={'#22C55F'}
                        borderRadius={15}
                        titleColor={'#FFF'}
                        onPress={onPressSlideTwo}
                    />
                </View>
                <View style={styles.Card} key="3">
                    {SkpiBtn}
                    <FastImage
                        source={{ uri: memoizedSlider?.slider_3[0] }}
                        resizeMode='contain'
                        style={{ width: '100%', flex: 1 }}
                    />
                    <CoustomBtn
                        title={'Start for free'}
                        paddingVertical={15}
                        width={windowWidth * 0.9}
                        backgroundColor={'#22C55F'}
                        borderRadius={15}
                        titleColor={'#FFF'}
                        onPress={onPressSlideThree}
                    />
                </View>
            </PagerView>
        </SafeAreaCoustom>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        height: "100%",
        width: '100%',
    },
    Card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10%',
    },
    skip: {
        color: '#22C55F',
        fontWeight: '700',
    },
    skipBtn: {
        shadowColor: '#22C55F',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: '#FFF',
        elevation: 10,
        paddingHorizontal: 10,
        padding: 5,
        borderRadius: 20,
        alignSelf: 'flex-end',
        marginRight: '6%',
    },
});

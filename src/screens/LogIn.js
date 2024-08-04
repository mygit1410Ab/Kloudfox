import { Alert, BackHandler, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaCoustom from '../components/SafeAreaCoustom';
import CoustomBtn from '../components/CoustomBtn';
import { FontsStyle, windowHeight, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { logIn } from '../services/function';
// import * as EmailValidator from 'email-validator';







const LogIn = () => {
    const [show, setShow] = useState(false)
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let unsubscribe;
        if (Platform.OS === 'ios') {
            unsubscribe = navigation.addListener('blur', gestureEndListener);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [navigation]);

    const gestureEndListener = () => {
        // console.log("Called when screen is unmounted");
    };




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

    const onPress = async () => {
        // Reset previous errors
        setEmailError(false);
        setPasswordError(false);

        // Validate email
        if (!email) {
            setEmailError(true);
            return;
        }

        // Validate password
        if (!password) {
            setPasswordError(true);
            return;
        }

        // If all validations pass, attempt to log in
        const data = {
            email,
            password
        };
        setLoading(true)
        try {

            const response = await logIn({ data });
            // console.log('logIn response========>', response);
            if (response) {
                navigation.navigate('DrawerNavigator');
            } else {
                // Handle unsuccessful login (show error, etc.)
                Alert.alert('Login failed', 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Handle error (show error message, etc.)
            Alert.alert('Error', 'An error occurred while logging in');
        } finally {
            setLoading(false)
        }
    };

    const showHandler = () => {
        setShow(!show)
    }
    return (
        <SafeAreaCoustom>
            <View style={styles.mainCard}>
                <View style={styles.imageCard}>
                    <Image
                        style={{ width: '50%', height: 80, }}
                        resizeMode='contain'
                        source={images.appLogo}
                    />
                </View>
                <View style={styles.inputCard}>
                    <Text
                        style={[FontsStyle.paragraph_text, { color: '#75788D', }]}>
                        {'Email'}
                    </Text>
                    <TextInput
                        style={[styles.inputStyle, FontsStyle.caption_text, {
                            fontSize: 18, borderColor: emailError ? 'red' : '#75788D',
                        }]}
                        placeholder='example@email.com'
                        placeholderTextColor={'#75788D'}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />
                    <View style={[styles.pwdCard, { borderColor: passwordError ? "red" : '#75788D', }]}>

                        <TextInput
                            style={[styles.passwordInputStyle, FontsStyle.caption_text, { fontSize: 18 }]}
                            placeholder='Password'
                            secureTextEntry={!show}
                            placeholderTextColor={'#75788D'}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />
                        <TouchableOpacity
                            onPress={showHandler}
                            style={styles.eyeCard}>
                            <Image
                                style={{ height: 25, width: 25, tintColor: '#75788D' }}
                                source={!show ? images.eye : images.hide}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <CoustomBtn
                    title={'Continue'}
                    paddingVertical={15}
                    // borderWidth={1}
                    width={windowWidth * 0.9}
                    backgroundColor={'#22C55F'}
                    borderRadius={15}
                    titleColor={'#FFF'}
                    onPress={onPress}
                    loading={loading}
                />
                {/* <Text style={[FontsStyle.big_title_text, { color: '#22C55F', fontWeight: '700', marginTop: '5%' }]}>
                    {'Forgot Password?'}
                </Text> */}
            </View>
        </SafeAreaCoustom>
    );
};

export default LogIn;

const styles = StyleSheet.create({
    mainCard: {
        flex: 1,
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'red',
        width: '100%',
        // justifyContent: 'center'

    },
    imageCard: {
        width: '100%',
        // borderWidth: 1,
        alignItems: 'center',
    },
    inputCard: {
        // borderWidth: 1,
        width: '90%',
        marginTop: '15%',
        marginBottom: '10%'
    },
    inputStyle: {
        // borderWidth: 1,
        width: '100%',
        // paddingHorizontal: 10,
        paddingVertical: 10,
        color: '#000',
        borderBottomWidth: 2,
        marginBottom: '5%'
    },
    passwordInputStyle: {
        // borderWidth: 1,
        width: '90%',
        // paddingHorizontal: 10,
        paddingVertical: 10,
        color: '#000',
        // borderBottomWidth: 2,
        // borderColor: '#75788D',
        // marginBottom: '5%'
    },
    pwdCard: {
        // borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,

    },
    eyeCard: {
        // borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        padding: '3%'
    }
});





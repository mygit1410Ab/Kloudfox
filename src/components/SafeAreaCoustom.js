import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeAreaCoustom = (props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.mainCard,
        {
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingTop: insets.top,
        },]}>
            {props.children}
        </View>
    );
};

export default SafeAreaCoustom;

const styles = StyleSheet.create({
    mainCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});

import { StyleSheet, Text, View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import React from 'react';
import { FontsStyle } from '../utils/fontStyle/FontsStyle';

const CoustomBtn = ({
    backgroundColor,
    borderWidth,
    title,
    onPress,
    borderColor,
    titleColor,
    height,
    activeOpacity,
    disabled,
    width,
    paddingVertical,
    borderRadius,
    loading
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={activeOpacity}
            style={[
                styles.bntStyle,
                {
                    backgroundColor: backgroundColor,
                    borderWidth: borderWidth,
                    borderColor: borderColor,
                    height: height && height,
                    width: width,
                    paddingVertical: paddingVertical,
                    borderRadius: borderRadius,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#171717',
                            shadowOffset: { width: -2, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 3,
                        },
                        android: {
                            elevation: 3,
                        },
                    }),
                },
            ]}>
            {loading ? <View style={{ flexDirection: 'row' }}>
                <ActivityIndicator size={'small'} color={'#fff'} />
                <Text style={[FontsStyle.big_title_text, { color: titleColor, fontWeight: '700' }]}>{"  Loading..."}</Text>
            </View>
                :
                <Text style={[FontsStyle.big_title_text, { color: titleColor, fontWeight: '700' }]}>{title}</Text>}
        </TouchableOpacity>
    );
};

export default CoustomBtn;

const styles = StyleSheet.create({
    bntStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

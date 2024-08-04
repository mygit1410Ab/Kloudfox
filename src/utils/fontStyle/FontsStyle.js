import { StyleSheet, Dimensions, Platform } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const FontsStyle = StyleSheet.create({
    heading_1_text: {
        fontSize: 36,
        fontFamily: Platform.OS == 'ios' ? "Poppins-Black" : "PoppinsBlack",
        color: '#000'
    },
    heading_2_text: {
        fontSize: 32,
        fontFamily: Platform.OS == 'ios' ? "Poppins-Black" : "PoppinsBlack",
        color: '#000'

    },
    heading_3_text: {
        fontSize: 24,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-Black" : "PoppinsBlack",
    },
    big_title_text: {
        fontSize: 18,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-Black" : "PoppinsBlack",
    },
    caption_text: {
        fontSize: 16,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "PoppinsRegular" : "PoppinsRegular",
    },
    bigButton_text: {
        fontSize: 14,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-Black" : "PoppinsBlack",
    },
    title_text: {
        fontSize: 16,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-SemiBold" : "PoppinsSemiBold",
    },
    small_title_text: {
        fontSize: 14,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-SemiBold" : "PoppinsSemiBold",
    },
    smallButton_text: {
        fontSize: 12,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-SemiBold" : "PoppinsSemiBold",
    },
    small_text: {
        fontSize: 12,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-Regular" : "PoppinsRegular",
    },
    paragraph_text: {
        fontSize: 14,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-Regular" : "PoppinsRegular",
    },
    textinput_paragraph_text: {
        fontSize: 16,
        color: '#000',
        fontFamily: Platform.OS == 'ios' ? "Poppins-Regular" : "PoppinsRegular",
    },
});

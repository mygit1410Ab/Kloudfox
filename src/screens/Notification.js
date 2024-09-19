import {
    FlatList, Image, ImageBackground,
    StyleSheet, Text, TouchableOpacity, View, RefreshControl,
    ActivityIndicator,
    Modal,
    Pressable,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontsStyle, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import { baseUrl, endPoints } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';




const Notification = () => {
    let allUnread = []
    const ITEM_HEIGHT = 150;
    const [data, setData] = useState([]);
    // const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [listData, setListData] = useState(null);
    const [newRes, setNewRes] = useState(0);
    const [recent, setRecent] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);





    const fetchData = async (newPage = 1) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const jwtToken = await AsyncStorage.getItem('access');
            const response = await axios.get(`${baseUrl}${endPoints.notifications}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response.data.data.messages)
            setNewRes(response.data.data.messages)
            const responseData = response.data.data.messages
            // console.log('aa', response.data.data.messages.length)

            if (!responseData) {
                // console.error('Error: No data found in response.');
                return;
            }
            setData(responseData)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLoadMore = () => {
        if (!isLoading && hasMoreData && newRes.length != 0) {
            fetchData(page + 1);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData(1);
    };


    const renderItem = ({ item }) => {
        // console.log(item)
        const modalHandler = () => {
            setSelectedItem(item);
            setModalVisible(true);
        }

        return (
            <TouchableOpacity
                onPress={modalHandler}
                style={[styles.itemCard, { shadowColor: item?.severity === 'green' ? '#22C55F' : 'red', }]}>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={item?.severity === 'green' ? images.opened : images.closed}
                        resizeMode='contain'
                        style={{ height: 40, width: 40 }}
                    />
                </View>
                <View style={{ width: '80%', height: '100%', }}>
                    <Text style={[FontsStyle.smallButton_text, { color: '#000', fontSize: 10, fontWeight: '700' }]}>
                        {item?.title}
                    </Text>
                    <Text style={[FontsStyle.small_text, { color: '#000', }]}>
                        {item?.msg}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const ListHeaderComponent = ({ item }) => {
        // console.log(item)
        const borderColor = '#4F1AF3'
        const onPressResent = () => {
            setListData(data)
            setRecent(true)
        }
        const onPressUnread = () => {
            setRecent(false)
            setListData(allUnread)
            // console.log('allUnread', allUnread.length)
        }

        return (
            <View style={styles.hearderCard}>
                <TouchableOpacity
                    onPress={onPressResent}
                    style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: recent ? 1 : 0 }]}>
                    <Text style={[FontsStyle.heading_3_text, styles.headerText, { color: '#8F8F8F', fontWeight: '500' }]}>
                        {'Recent'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressUnread}
                    style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: !recent ? 1 : 0 }]}>
                    <Text style={[FontsStyle.heading_3_text, styles.headerText, { color: '#8F8F8F', fontWeight: '500' }]}>
                        {'Unread'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }



    // console.log(data.length)
    if (data.length !== 0) {
        allUnread = data.filter((el) => {
            return el.is_read !== true; // Return true or false based on condition
        });
    }

    const madalCloseHandler = () => {
        setModalVisible(!modalVisible);
        setSelectedItem(null);
    }

    const markasReadHandler = async (selectedItem) => {
        // console.log(selectedItem)
        try {
            const jwtToken = await AsyncStorage.getItem('access');
            const data = {
                notification_id: selectedItem?.id,
                mark_all_read: false
            }
            const res = await axios.post(`${baseUrl}${endPoints.postNotifications}`, data,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                })
            // console.log('============res>', res.data)
            if (res.data) {
                setModalVisible(!modalVisible);
                setSelectedItem(null);
            }
        } catch (er) {
            console.log(er)
        }
    }

    return (
        <View style={styles.mainCard}>
            <FlatList
                renderItem={renderItem}
                data={listData ? listData : data}
                bounces={false}
                contentContainerStyle={styles.listCard}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => <ListHeaderComponent item={{ data }} />}
                ListFooterComponent={isLoading && <ActivityIndicator size="large" color="#04142E" />}
                // onEndReached={handleLoadMore}
                scrollEventThrottle={16}  // lower value for more frequent updates
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={true}  // unload items outside of view
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalStyle}>
                    <View style={styles.modalContainCard}>
                        <TouchableOpacity
                            onPress={madalCloseHandler}
                            style={{ padding: 5, alignSelf: 'flex-end' }}>
                            <Image
                                style={{ height: 40, width: 40, }}
                                source={images.cross}
                            />
                        </TouchableOpacity>
                        <Text style={[FontsStyle.title_text, { color: '#000' }]}>
                            {selectedItem?.title}
                        </Text>
                        <View style={{ width: "100%", marginTop: 20 }}>
                            <Text style={[FontsStyle.title_text, { color: '#000' }]}>
                                {"Mesage:  "}
                                <Text style={[FontsStyle.textinput_paragraph_text]}>
                                    {selectedItem?.msg}
                                </Text>
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => markasReadHandler(selectedItem)}
                            style={styles.readBtn}>
                            <Text style={[FontsStyle.smallButton_text]}>
                                Mark as Read
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


export default Notification

const styles = StyleSheet.create({
    mainCard: {
        // borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    headerBtnStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 15,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        // flex: 0.8
        width: "45%"

    },
    hearderCard: {
        // borderWidth: 1,
        width: windowWidth * 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: '4%',
        padding: 5,
        marginBottom: 20
    },
    itemCard: {
        // borderWidth: 1,
        backgroundColor: '#FFF',
        borderRadius: 15,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        width: windowWidth * 0.9,
        // paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    listCard: {
        width: windowWidth * 1,
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'red',
        // flex: 1,
        // gap: 15
    },
    modalStyle: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainCard: {
        // borderWidth: 1,
        backgroundColor: '#FFF',
        // height: '50%',
        width: windowWidth * 0.9,
        alignItems: 'center',
        // marginTop: "20%",
        borderRadius: 15,
        paddingHorizontal: "3%",
        paddingVertical: "3%"
    },
    readBtn: {
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,

    }

})



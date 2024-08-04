import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, BackHandler, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontsStyle, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, endPoints } from '../services/api';
import moment from 'moment';
import Chart from './Chart';


const HomeScreen = () => {
    let workingDomains = []
    let notWorkingDomains = []
    let newRes = []
    const ITEM_HEIGHT = 150;
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [listData, setListData] = useState(null);
    const [up, setUp] = useState(false);
    const [down, setDown] = useState(false);
    const [total, setTotal] = useState(true);


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





    // const [up, setUp] = useState([])

    const fetchData = async (newPage = 1) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const jwtToken = await AsyncStorage.getItem('access');
            const response = await axios.get(`${baseUrl}${endPoints.monitorList}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: newPage,
                    status: 'all',
                },
            });
            // console.log(response.data.data)
            newRes = response.data.data
            const responseData = response.data.data;

            if (!responseData) {
                // console.error('Error: No data found in response.');
                return;
            }

            if (newPage === 1) {
                setData(responseData);
            } else {
                setData(prevData => [...prevData, ...responseData]);
            }

            setHasMoreData(responseData.length > 0);
            setPage(newPage);
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
        return (
            <View style={styles.itemCard}>
                <View style={styles.createCard}>
                    <Text style={[FontsStyle.big_title_text, { fontWeight: '600', color: '#000' }]}>
                        {item?.domain.length > 18 ? item.domain.substring(0, 18) + '...' : item.domain}
                    </Text>
                    <Text style={[FontsStyle.small_text, { fontWeight: '600', color: '#6C757D', fontSize: 9 }]}>
                        Created {moment(item?.created_at).format("MMM D, YYYY")}
                    </Text>
                </View>
                <View style={styles.detailsCard}>
                    <View style={styles.statusCard}>
                        {
                            item?.status === "PAUSED" &&
                            <Image
                                style={{ height: 30, width: 30, tintColor: 'orange', margin: 8 }}
                                source={images.pause}
                            />
                        }

                        {
                            item?.status === "UP" &&
                            <Text style={{
                                fontWeight: 'bold',
                                color: item?.is_working === true ? "#22C55F" : '#BF232A',
                                fontFamily: Platform.OS == 'ios' ? 'Poppins-Bold' : 'PoppinsBold',
                                fontSize: 30
                            }}>
                                {"UP"}
                            </Text>
                        }
                        {
                            item?.status === "DOWN" &&
                            <Text style={{
                                fontWeight: 'bold',
                                color: item?.is_working === true ? "#22C55F" : '#BF232A',
                                fontFamily: Platform.OS == 'ios' ? 'Poppins-Bold' : 'PoppinsBold',
                                fontSize: 30
                            }}>
                                {"DOWN"}
                            </Text>
                        }

                        <Text style={[FontsStyle.small_text, { fontWeight: '600', color: '#6C757D', fontSize: 9, flexDirection: 'row' }]}>
                            {"AVAILABILITY  "}
                            <Text style={[FontsStyle.small_text, { fontWeight: '900', color: '#6C757D', fontSize: 12, flexDirection: 'row' }]}>
                                {item?.availbility}
                            </Text>
                            <Text style={[FontsStyle.small_text, { fontWeight: '600', color: '#6C757D', fontSize: 9, flexDirection: 'row' }]}>
                                {"  DOWNTIME  "}
                                <Text style={[FontsStyle.small_text, { fontWeight: '900', color: '#6C757D', fontSize: 12, flexDirection: 'row' }]}>
                                    {item?.down_time}
                                </Text>
                            </Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        {item?.graph_stats && <Chart data={item?.graph_stats} />}
                    </View>
                </View>
                <View style={{ borderWidth: 0.5, marginTop: 10, borderColor: '#E5E5E5', }} />
                <View style={styles.checkCard}>
                    <Text style={[FontsStyle.small_text, { fontWeight: '600', color: '#0D6EFD', }]}>
                        {item?.interval_def}
                    </Text>
                </View>
            </View>
        )
    }

    const ListHeaderComponent = () => {
        const borderColor = '#4F1AF3'
        const onPressTolat = () => {
            setListData(data)
            setUp(false)
            setDown(false)
            setTotal(true)
        }
        const onPressUp = () => {
            setTotal(false)
            setDown(false)
            setUp(true)

            setListData(workingDomains)
        }
        const onPressDown = () => {
            setTotal(false)
            setUp(false)
            setDown(true)
            setListData(notWorkingDomains)
        }

        return (
            <>
                <View style={styles.hearderCard}>
                    <TouchableOpacity
                        onPress={onPressTolat}
                        style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: total ? 1 : 0 }]}>
                        <Text style={[FontsStyle.caption_text, { color: '#8F8F8F', marginTop: 10 }]}>
                            Total
                        </Text>
                        <Text style={[FontsStyle.heading_2_text, { fontWeight: '700', color: '#8F8F8F', marginBottom: 10 }]}>
                            {data.length}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressUp}
                        style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: up && !down ? 1 : 0 }]}>
                        <Text style={[FontsStyle.caption_text, { color: '#8F8F8F', marginTop: 10 }]}>
                            Up
                        </Text>
                        <Text style={[FontsStyle.heading_2_text, { fontWeight: '700', color: '#22C55F', marginBottom: 10 }]}>
                            {workingDomains.length}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressDown}
                        style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: !up && down ? 1 : 0 }]}>
                        <Text style={[FontsStyle.caption_text, { color: '#8F8F8F', marginTop: 10 }]}>
                            Down
                        </Text>
                        <Text style={[FontsStyle.heading_2_text, { fontWeight: '700', color: '#BF232A', marginBottom: 10 }]}>
                            {notWorkingDomains.length}
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }



    // console.log(data)
    if (data.length !== 0) {
        workingDomains = data.filter((el) => {
            return el.is_working === true; // Return true or false based on condition
        });
        notWorkingDomains = data.filter((el) => {
            return el.is_working !== true; // Return true or false based on condition
        });
        // console.log("workingDomains", workingDomains);
        // setUp(workingDomains)
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
                onEndReached={handleLoadMore}
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
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainCard: {
        // borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
        // paddingBottom: 20,
        // overflow: 'visible'
    },
    headerBtnStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        // padding: 10,
        // paddingHorizontal: 15,
        borderRadius: 15,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        width: '27%'

    },
    hearderCard: {
        // borderWidth: 1,
        width: windowWidth * 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: '4%',
        padding: 5
    },
    itemCard: {
        // borderWidth: 1,
        backgroundColor: '#FFF',
        borderRadius: 15,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        width: '27%',
        width: windowWidth * 0.9,
        // paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 10
    },
    listCard: {
        width: windowWidth * 1,
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'red',
        // flex: 1,
        gap: 15,
        marginBottom: 100
    },
    createCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderWidth: 1,
        paddingHorizontal: 10
    },
    detailsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderWidth: 1,
        paddingHorizontal: 10
    },
    chartStyle: {
        height: 40,
        width: 120
    },
    statusCard: {
        // borderWidth: 1,
        justifyContent: 'center'
    },
    checkCard: {
        // borderWidth: 1,
        paddingHorizontal: 10,
        paddingTop: 5
    }
})
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, BackHandler, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FontsStyle, windowWidth } from '../utils/fontStyle/FontsStyle';
import { images } from '../utils/imgaes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, endPoints } from '../services/api';
import moment from 'moment';
import Chart from './Chart';


const HomeScreen = () => {
    const ITEM_HEIGHT = 150;
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [listData, setListData] = useState(null);
    const [workingDomains, setWorkingDomains] = useState([]);
    const [notWorkingDomains, setNotWorkingDomains] = useState([]);

    const [up, setUp] = useState(false);
    const [down, setDown] = useState(false);
    const [total, setTotal] = useState(true);
    const [num, setNum] = useState(false);

    const backAction = useCallback(() => {
        BackHandler.exitApp();
        return true;
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [backAction]);

    useEffect(() => {
        fetchListNumbers();
    }, []);

    const fetchListNumbers = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem('access');
            const response = await axios.get(`${baseUrl}${endPoints.metaData}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                }
            });
            setNum(response.data.data);
        } catch (er) {
            console.log(er);
        }
    };

    const fetchList = useCallback(async (newPage = 1) => {
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

            const responseData = response.data.data;

            if (!responseData || responseData.length === 0) {
                setHasMoreData(false);
            } else {
                if (newPage === 1) {

                    setData(responseData);
                    setWorkingDomains(responseData.filter((el) => el.is_working === true));
                    setNotWorkingDomains(responseData.filter((el) => el.is_working !== true));
                } else {

                    setData((prevData) => {
                        const updatedData = [...prevData, ...responseData];

                        setWorkingDomains(updatedData.filter((el) => el.is_working === true));
                        setNotWorkingDomains(updatedData.filter((el) => el.is_working !== true));
                        return updatedData;
                    });
                }
                setPage(newPage);
                setHasMoreData(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [isLoading]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMoreData) {
            fetchList(page + 1);
        }
    }, [isLoading, hasMoreData, page, fetchList]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setHasMoreData(true);
        fetchList(1);
    }, [fetchList]);

    useEffect(() => {
        fetchList(1);
    }, []);


    const renderItem = useCallback(({ item }) => {
        return (
            <View style={styles.itemCard}>
                <View style={styles.createCard}>
                    <Text style={[styles.bigTitleText, { color: '#000' }]}>
                        {item?.domain.length > 18 ? item.domain.substring(0, 18) + '...' : item.domain}
                    </Text>
                    <Text style={[styles.smallText, { color: '#6C757D' }]}>
                        Created {moment(item?.created_at).format("MMM D, YYYY")}
                    </Text>
                </View>
                <View style={styles.detailsCard}>
                    <View style={styles.statusCard}>
                        {item?.status === "PAUSED" && (
                            <Image
                                style={styles.statusImage}
                                source={images.pause}
                            />
                        )}
                        {item?.status === "UP" && (
                            <Text style={[styles.statusText, { color: item?.is_working ? "#22C55F" : '#BF232A' }]}>
                                UP
                            </Text>
                        )}
                        {item?.status === "DOWN" && (
                            <Text style={[styles.statusText, { color: item?.is_working ? "#22C55F" : '#BF232A' }]}>
                                DOWN
                            </Text>
                        )}
                        <Text style={styles.availabilityText}>
                            {"AVAILABILITY  "}
                            <Text style={styles.availabilityValue}>
                                {item?.availbility}
                            </Text>
                            {"  DOWNTIME  "}
                            <Text style={styles.downtimeValue}>
                                {item?.down_time}
                            </Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {item?.graph_stats && <Chart data={item?.graph_stats} />}
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.checkCard}>
                    <Text style={styles.intervalText}>
                        {item?.interval_def}
                    </Text>
                </View>
            </View>
        );
    }, []);

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
                            {num?.total_monitors}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressUp}
                        style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: up && !down ? 1 : 0 }]}>
                        <Text style={[FontsStyle.caption_text, { color: '#8F8F8F', marginTop: 10 }]}>
                            Up
                        </Text>
                        <Text style={[FontsStyle.heading_2_text, { fontWeight: '700', color: '#22C55F', marginBottom: 10 }]}>
                            {num?.up_monitors}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPressDown}
                        style={[styles.headerBtnStyle, { borderColor: borderColor, borderWidth: !up && down ? 1 : 0 }]}>
                        <Text style={[FontsStyle.caption_text, { color: '#8F8F8F', marginTop: 10 }]}>
                            Down
                        </Text>
                        <Text style={[FontsStyle.heading_2_text, { fontWeight: '700', color: '#BF232A', marginBottom: 10 }]}>
                            {num?.down_monitors}
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        )
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
                scrollEventThrottle={16}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={true}
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
        justifyContent: 'center',
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
    },
    bigTitleText: {
        fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'PoppinsBold',
        fontSize: 18,
        fontWeight: '600',
    },
    smallText: {
        fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'PoppinsRegular',
        fontSize: 9,
        fontWeight: '600',
    },
    statusImage: { height: 30, width: 30, tintColor: 'orange', margin: 8 },
    statusText: {
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'PoppinsBold',
    },
    availabilityText: {
        fontWeight: '600',
        color: '#6C757D',
        fontSize: 9,
        flexDirection: 'row',
    },
    availabilityValue: {
        fontWeight: '900',
        color: '#6C757D',
        fontSize: 12,
        flexDirection: 'row',
    },
    downtimeValue: {
        fontWeight: '900',
        color: '#6C757D',
        fontSize: 12,
        flexDirection: 'row',
    },
    divider: { borderWidth: 0.5, marginTop: 10, borderColor: '#E5E5E5' },
    intervalText: { fontWeight: '600', color: '#0D6EFD' },
    captionText: { color: '#8F8F8F', marginTop: 10 },
    headerCountText: { fontWeight: '700', color: '#8F8F8F', marginBottom: 10 },
})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart } from "react-native-gifted-charts"
import { LinearGradient, Stop } from 'react-native-svg'


const Chart = (data) => {
    const lineData = [{ value: 110 }, { value: 20 }, { value: 0 }, { value: 0 }, { value: 36 }, { value: 60 }, { value: 54 }, { value: 85 }]
    // console.log(data)
    // const lineData = [data.data]
    let newData = []
    data.data?.map((el) => {
        newData.push({ value: el.resp_time * 100 })
    })
    // console.log(newData.length > 0 && newData)
    // console.log(data.data)
    return (
        <View style={{ backgroundColor: '#FFF', top: 20, left: 10, overflow: 'hidden' }}>
            {newData.length > 0 && <LineChart
                // areaChart
                hideDataPoints
                isAnimated
                animationDuration={1200}
                startFillColor="red"
                startOpacity={1}
                endOpacity={0.3}
                height={40}
                width={100}
                initialSpacing={0}
                data={newData}
                spacing={12}
                thickness={3}
                hideRules
                hideYAxisText
                yAxisColor="#E5E5E5"
                showVerticalLines
                verticalLinesColor="#FFF"
                xAxisColor="#E5E5E5"
                color="#008efb"
                curved
            // lineGradient
            // lineGradientId="ggrd"
            // lineGradientComponent={() => {
            //     return (
            //         <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
            //             <Stop offset="0" stopColor={'#008efb'} />
            //             <Stop offset="0.5" stopColor={'#008efb'} />
            //             <Stop offset="1" stopColor={'red'} />
            //         </LinearGradient>
            //     );
            // }}
            />}
        </View>
    )
}

export default Chart

const styles = StyleSheet.create({})
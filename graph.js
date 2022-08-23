
var fs = require('fs')
const { template } = require('lodash')
var tradeMaxValue = 300  //临时数据
var tradeMinValue = 50   //临时数据
var tradeMiddleValue = 200 //临时数据

var backgroundLineWeight=0.5
var backgroundLineColor="black"

//主图变量
var density = 4  //only even number x轴密度
var daliyLineXAxisFactor = 1  //x轴长度因子
var daliyLineYAxisFactor = 1  //y轴长度因子

var daliyLineYPixel = 330
var daliyLineXPixel = 800
var tradeYAxisValue = []
var digitsAfterDots = 2 //百分比小数位
var wordYAixsChange = 3
var wordXAixsChange = 0
//主图padding
var daliyLinePaddingTop = 30, daliyLinePaddingBottom = 30, daliyLinePaddingLeft = 80, daliyLinePaddingRight = 30

var daliyLineDisplayXAxis = (daliyLineXPixel - daliyLinePaddingLeft - daliyLinePaddingRight) * daliyLineXAxisFactor
var daliyLineDisplayYAxis = (daliyLineYPixel - daliyLinePaddingBottom - daliyLinePaddingTop) * daliyLineYAxisFactor


//副图变量
var density = 4  //only even number x轴密度
var subgraphXAxisFactor = 1  //x轴长度因子
var subgraphYAxisFactor = 1  //y轴长度因子
var leftFontColor2 = "black", rightFontColor2 = "black", bottomFontColor2 = "black"
var OILineColor = "blue", positiveV = "red", negativeV = "green"
var backgroundLineWeight = 0.5, OILineWeight = 1

var subgraphYPixel = 330
var subgraphXPixel = 800
var VyAxisValue = [], OIyAxisValue = []
var digitsAfterDots = 2 //百分比小数位
var wordYAixsChange = 3
var wordXAixsChange = 0

//副图padding
var subgraphPaddingTop = 30, subgraphPaddingBottom = 30, subgraphPaddingLeft = 80, subgraphPaddingRight = 30
var subgraphDisplayXAxis = (subgraphXPixel - subgraphPaddingLeft - subgraphPaddingRight) * subgraphXAxisFactor
var subgraphDisplayYAxis = (subgraphYPixel - subgraphPaddingBottom - subgraphPaddingTop) * subgraphYAxisFactor




//开市/休市/闭式时间与时间间隔（与开市时间间隔，间隔单位为分钟）
var timeLineAndInterval = [
    { "Time": "21:00", "Interval": 0 },
    { "Time": "2:30/9:00", "Interval": 330 },
    { "Time": "10:15/10:30", "Interval": 405 },
    { "Time": "10:30/11:30", "Interval": 465 }]
var minData = require('./minData.js')
//计算最大值与最小值
tradeMiddleValue = minData.quote.preClose
tradeMaxValue = Math.max(...minData.minsList[4].map(o => o.price))
tradeMinValue = Math.min(...minData.minsList[4].map(o => o.price))
var biggestGap = Math.max(tradeMaxValue - tradeMiddleValue, tradeMiddleValue - tradeMinValue)



var count = 0

var yAxisValueStart = tradeMiddleValue - biggestGap
for (var i = 0; i <= density; i++) {
    tradeYAxisValue[i] = yAxisValueStart + (2 * biggestGap) * i / density
    // console.log(tradeYAxisValue[i])
}

var c = document.getElementById("dailyLineCanvas");
var ctx = c.getContext("2d");
ctx.lineWidth=backgroundLineWeight
ctx.font = 15 * daliyLineYAxisFactor + "px sans-serif"
ctx.strokeStyle = "black"
ctx.strokeRect(0, 0, daliyLineDisplayXAxis + daliyLinePaddingLeft + daliyLinePaddingRight + 2 * ctx.measureText("0.00%").width, daliyLineDisplayYAxis + daliyLinePaddingBottom + daliyLinePaddingTop + ctx.measureText("00:00").width / 2);


//定义y轴值
for (const value of tradeYAxisValue) {
    var yAixsPixel = (daliyLineDisplayYAxis + daliyLinePaddingTop) - count * ((daliyLineDisplayYAxis) / density)
    if (count < density / 2) { ctx.fillStyle = "green" }
    if (count > density / 2) { ctx.fillStyle = "red" }
    if (count == density / 2) { ctx.fillStyle = "black" }
    ctx.fillText(value, ctx.measureText("1111.1").width / 3, yAixsPixel + wordYAixsChange)
    ctx.fillText(((value / tradeMiddleValue) - 1).toFixed(digitsAfterDots) + "%", daliyLineDisplayXAxis + daliyLinePaddingLeft + daliyLinePaddingRight, yAixsPixel + wordYAixsChange)
    // if(count<density/2){ctx.fillText(value)}
    // console.log(yAixsPixel)
    // console.log(value)
    count++
}
count = 0
ctx.fillStyle = "black"
//y轴换算单位
var yAixsPixelValueTransformUnit = (daliyLineDisplayYAxis) / (2 * biggestGap)
//画y轴线

for (i = 0; i <= density; i++) {
    ctx.strokeStyle = "grey"
    ctx.setLineDash([1, 0])
    if (count == density / 2) { ctx.strokeStyle = "black"; ctx.setLineDash([1, 2]) }
    var yAixsPixel = (daliyLineDisplayYAxis + daliyLinePaddingTop) - count * ((daliyLineDisplayYAxis) / density)
    ctx.beginPath()
    ctx.moveTo(daliyLinePaddingLeft, yAixsPixel)
    ctx.lineTo(daliyLineDisplayXAxis + daliyLinePaddingLeft, yAixsPixel)
    ctx.stroke()
    ctx.closePath()
    // console.log(yAixsPixel)
    count++
}
ctx.strokeStyle = "black"
count = 0
//总时间
var totalTime = timeLineAndInterval[timeLineAndInterval.length - 1].Interval
//声明x轴单位
var xAixsPixelValueTransformUnit = (daliyLineDisplayXAxis / totalTime)
//21：00开市的case (调整开市时间在timeAndInterval里更改)
ctx.strokeStyle = "grey"
ctx.font = 15 * daliyLineXAxisFactor + "px sans-serif"

for (const value of timeLineAndInterval) {
    var textWidth = ctx.measureText(value.Time).width;
    ctx.fillText(value.Time, daliyLinePaddingLeft + value.Interval * xAixsPixelValueTransformUnit - (textWidth / 2), daliyLineDisplayYAxis + daliyLinePaddingTop + daliyLinePaddingBottom)
    ctx.beginPath()
    ctx.moveTo(daliyLinePaddingLeft + value.Interval * xAixsPixelValueTransformUnit, daliyLinePaddingTop)
    ctx.lineTo(daliyLinePaddingLeft + value.Interval * xAixsPixelValueTransformUnit, daliyLineDisplayYAxis + daliyLinePaddingTop)
    ctx.stroke()
    ctx.closePath()
}
ctx.save()
ctx.translate(daliyLinePaddingLeft, (daliyLineDisplayYAxis) / 2 + daliyLinePaddingTop)


//开始画k线
ctx.lineWidth=1
ctx.strokeStyle = "blue"
ctx.beginPath()
var yAixsLocation


for (const value of minData.minsList[4]) {
    // console.log(value)
    var yAixsLocation = (tradeMiddleValue - value.price) * yAixsPixelValueTransformUnit
    ctx.lineTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.moveTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
    count++
}
ctx.lineTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
count = 0
ctx.strokeStyle = "orange"
ctx.beginPath()
// ctx.moveTo()
for (const value of minData.minsList[4]) {
    // console.log(value)
    var yAixsLocation = (tradeMiddleValue - value.avePri) * yAixsPixelValueTransformUnit
    ctx.lineTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
    count++
}
ctx.lineTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
count = 0

ctx.save()
ctx.translate(-daliyLinePaddingLeft, daliyLineDisplayYAxis + daliyLinePaddingBottom + daliyLinePaddingTop)




//开始画交易量图


//计算最大与最小值
var VminValue = Math.min(...minData.minsList[4].map(o => o.volume))
var VmaxValue = Math.max(...minData.minsList[4].map(o => o.volume))
var OIminValue = Math.min(...minData.minsList[4].map(o => o.openInterest))
var OImaxValue = Math.max(...minData.minsList[4].map(o => o.openInterest))

var Vgap = VmaxValue - VminValue, OIgap = OImaxValue - OIminValue


ctx.strokeStyle = "black"
ctx.strokeRect(0, 0, subgraphDisplayXAxis + subgraphPaddingLeft + subgraphPaddingRight + 2 * ctx.measureText("0.00%").width, subgraphDisplayYAxis + subgraphPaddingBottom + subgraphPaddingTop + ctx.measureText("00:00").width / 2);

var count = 0

for (var i = 0; i <= density; i++) {
    VyAxisValue[i] = VminValue + Vgap / density * i
}
for (var i = 0; i <= density; i++) {
    OIyAxisValue[i] = OIminValue + OIgap / density * i
}

//左边的y轴，成交量值
ctx.font = 15 * subgraphYAxisFactor + "px sans-serif"
ctx.fillStyle = leftFontColor2
for (const value of VyAxisValue) {
    var yAixsPixel = (subgraphDisplayYAxis + subgraphPaddingTop) - count * ((subgraphDisplayYAxis) / density)
    ctx.fillText(Vgap * count, ctx.measureText("111111").width / 3, yAixsPixel + wordYAixsChange)
    count++
}
count = 0

//右边的y轴，持仓量值
ctx.fillStyle = rightFontColor2
for (const value of OIyAxisValue) {
    var yAixsPixel = (subgraphDisplayYAxis + subgraphPaddingTop) - count * ((subgraphDisplayYAxis) / density)
    if (count == 0) { ctx.fillText("(万)", subgraphDisplayXAxis + subgraphPaddingLeft + subgraphPaddingRight, yAixsPixel + wordYAixsChange) }
    else { ctx.fillText((value / 10000).toFixed(digitsAfterDots), subgraphDisplayXAxis + subgraphPaddingLeft + subgraphPaddingRight, yAixsPixel + wordYAixsChange) }
    count++
}
count = 0
ctx.fillStyle = "black"

//画y轴线
ctx.lineWidth = backgroundLineWeight
for (i = 0; i <= density; i++) {
    ctx.strokeStyle = "grey"
    var yAixsPixel = (subgraphDisplayYAxis + subgraphPaddingTop) - count * ((subgraphDisplayYAxis) / density)
    ctx.beginPath()
    ctx.moveTo(subgraphPaddingLeft, yAixsPixel)
    ctx.lineTo(subgraphDisplayXAxis + subgraphPaddingLeft, yAixsPixel)
    ctx.stroke()
    ctx.closePath()
    // console.log(yAixsPixel)
    count++
}
count = 0

//声明x轴单位
var totalTime = timeLineAndInterval[timeLineAndInterval.length - 1].Interval
var xAixsPixelValueTransformUnit = (subgraphDisplayXAxis / totalTime)
//21：00开市的case (调整开市时间在timeAndInterval里更改)
ctx.fillStyle = bottomFontColor2
ctx.font = 15 * subgraphXAxisFactor + "px sans-serif"

for (const value of timeLineAndInterval) {
    var textWidth = ctx.measureText(value.Time).width;
    ctx.fillText(value.Time, subgraphPaddingLeft + value.Interval * xAixsPixelValueTransformUnit - (textWidth / 2), subgraphDisplayYAxis + subgraphPaddingTop + subgraphPaddingBottom)
    ctx.beginPath()
    ctx.moveTo(subgraphPaddingLeft + value.Interval * xAixsPixelValueTransformUnit, subgraphPaddingTop)
    ctx.lineTo(subgraphPaddingLeft + value.Interval * xAixsPixelValueTransformUnit, subgraphDisplayYAxis + subgraphPaddingTop)
    ctx.stroke()
    ctx.closePath()
}
count = 0

ctx.save()
ctx.translate(subgraphPaddingLeft, subgraphDisplayYAxis + subgraphPaddingTop)
ctx.beginPath()
var yAixsLocation  //全局变量是为了结束线段

//y轴总持仓量换算单位
ctx.lineWidth = OILineWeight
var yAixsPixelValueTransformUnit = (subgraphDisplayYAxis) / (OIgap)
//总持仓量图
ctx.strokeStyle = OILineColor
for (const value of minData.minsList[4]) {
    // console.log(value)
    var yAixsLocation = -(value.openInterest - OIminValue) * yAixsPixelValueTransformUnit
    ctx.lineTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.moveTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
    count++
}
ctx.lineTo(count * xAixsPixelValueTransformUnit, yAixsLocation)
count = 0

//y轴交易量换算单位
var yAixsPixelValueTransformUnit = (subgraphDisplayYAxis) / (Vgap)
//交易量图
for (const value of minData.minsList[4]) {
    ctx.fillStyle = negativeV
    if (value.open < value.close) ctx.fillStyle = positiveV
    var yAixsLocation = (- value.volume) * yAixsPixelValueTransformUnit
    ctx.fillRect(count * xAixsPixelValueTransformUnit, 0, xAixsPixelValueTransformUnit, yAixsLocation);
    count++
}
count = 0
ctx.fillStyle = "black"
ctx.strokeStyle = "black"







    // console.log(yAixsPixelValueTransformUnit)

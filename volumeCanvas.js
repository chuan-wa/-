//开始画交易量图
var density = 4  //only even number x轴密度
var subgraphXAxisFactor = 1  //x轴长度因子
var subgraphYAxisFactor = 1  //y轴长度因子
var leftFontColor2 = "pink", rightFontColor2 = "purple", bottomFontColor2 = "orange"
var OILineColor="aqua",positiveV="gold",negativeV="blue"
var backgroundLineWeight=0.5,OILineWeight=1

var subgraphYPixel = 330
var subgraphXPixel = 800
var VyAxisValue = [], OIyAxisValue = []
var digitsAfterDots = 2 //百分比小数位
var wordYAixsChange = 3
var wordXAixsChange = 0

//padding
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

//计算最大与最小值
var VminValue = Math.min(...minData.minsList[4].map(o => o.volume))
var VmaxValue = Math.max(...minData.minsList[4].map(o => o.volume))
var OIminValue = Math.min(...minData.minsList[4].map(o => o.openInterest))
var OImaxValue = Math.max(...minData.minsList[4].map(o => o.openInterest))

var Vgap = VmaxValue - VminValue, OIgap = OImaxValue - OIminValue

var c = document.getElementById("volumeCanvas");
var ctx = c.getContext("2d");

ctx.strokeStyle = "pink"
ctx.strokeRect(0,0,subgraphDisplayXAxis+subgraphPaddingLeft+subgraphPaddingRight+2*ctx.measureText("0.00%").width,subgraphDisplayYAxis+subgraphPaddingBottom+subgraphPaddingTop+ctx.measureText("00:00").width/2);

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
ctx.strokeStyle=OILineColor
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

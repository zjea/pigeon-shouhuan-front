// 公共部分



// 获取现在的时间戳
function getNowTimestamp(){
	return new Date().getTime()
}

// 获取年月日时分秒
function getDateData(timestamp){
	var date = new Date(timestamp)
	var dateData = {
		year:date.getFullYear(),
		month:date.getMonth()+1<10?'0'+(date.getMonth()+1):(date.getMonth()+1),
		day:date.getDate()<10?'0'+date.getDate():date.getDate(),
		hour:date.getHours()<10?'0'+date.getHours():date.getHours(),
		minute:date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes(),
		second:date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds(),
		week:week[date.getDay()]
	}
	var data = {
		date: `${dateData.year}-${dateData.month}-${dateData.day}`,
		time: `${dateData.hour}:${dateData.minute}:${dateData.second}`,
		data: dateData
	}
	return data
}

// 星期数组
const week = ['周日','周一','周二','周三','周四','周五','周六']

// 公共部分 end....






// 获取时间戳
// 获取当前毫秒级时间戳
const getTimestamp = ()=>{
	return getNowTimestamp()
}

// 获取日期时间
// 获取现在的日期时间 YYYY-MM-DD HH:MM:SS
const getDateTime = ()=>{
	var data = timestampToDate(getNowTimestamp())
	return data
}
// 获取日期
// 获取现在的日期 YYYY-MM-DD
const getDate = ()=>{
	var data = timestampToDateNoTime(getNowTimestamp())
	return data
}

// 时间戳转换为日期格式
// Timestamp to YYYY-MM-DD HH:MM:SS
const timestampToDate = (timestamp)=>{
	var dateData = getDateData(timestamp)
	var data = `${dateData.date} ${dateData.time}`
	
	return data
}

// Timestamp to YYYY-MM-DD
const timestampToDateNoTime = (timestamp)=>{
	var dateData = getDateData(timestamp)
	var data = `${dateData.date}`
	
	return data
}

// 日期格式转换为时间戳
// YYYY-MM-DD HH:MM:SS to Timestamp
const dateToTimestamp = (DateTime)=>{
	DateTime = DateTime.replaceAll('-','/')
	return new Date(DateTime).getTime()
}

// 过去或未来时间戳距离现在的时间
// 刚刚/1分钟内、3分钟前/后、1小时前/后、1天前/后、1月前/后、2019-11-11
const timeDistance = (timestamp)=>{
	
	var m = 60*1000 // 分
	var h = 60*m    // 时
	var d = 24*h    // 天
	var M = 30*d    // 月
	var y = 12*M    // 年
	
	var now = getNowTimestamp()		//现在的时间
	var distance = null				//间隔时间
	var flag = null					//过去前 未来后
	if(now>timestamp){				//时间是过去的
		distance = now - timestamp
		flag = "前"
	}else{							//时间是未来的
		distance = timestamp - now
		flag = "后"
	}
	
	var data = null
	
	switch(true){
		case distance > y:
			data = getDateData(timestamp).date
		break
		case distance > M:
			data = `${parseInt(distance/M)}月${flag}`
		break
		case distance > d:
			data = `${parseInt(distance/d)}天${flag}`
		break
		case distance > h:
			data = `${parseInt(distance/h)}小时${flag}`
		break
		case distance > m:
			data = `${parseInt(distance/m)}分钟${flag}`
		break
		case distance < m:
			data = flag=='前'?'刚刚':'1分钟内'
		break
	}
	return data
}

// 过去时间戳简称化
// 12:01、昨天、周一、6月5日、2019年11月11日
const timeAbbreviated = (timestamp)=>{
	var dateData = getDateData(timestamp)										//传入的时间数据
	var nowDateData = getDateData(getNowTimestamp())							//现在的时间数据
	var today = dateToTimestamp(`${nowDateData.date} 00:00:00`)					//今天0点的时间戳
	var yesterday = today-24*60*60*1000											//昨天0点时间戳
	var threeDays = today-24*60*60*1000*3										//三天前0点时间戳
	var thisYear =  dateToTimestamp(`${nowDateData.data.year}-01-01 00:00:00`)		//今年0点时间戳
	switch(true){
		case timestamp >= today:
			data = `${dateData.data.hour}:${dateData.data.minute}`
		break
		case timestamp >= yesterday:
			data = '昨天'
		break
		case timestamp >= threeDays:
			data = dateData.data.week
		break
		case timestamp >= thisYear:
			data = `${dateData.data.month}月${dateData.data.day}日`
		break
		case timestamp < thisYear:
			data = `${dateData.data.year}年${dateData.data.month}月${dateData.data.day}日`
		break
	}
	
	return data
}


// 两个时间戳 计算倒计时数据
// 返回：day、hour、minute、second

// start	开始时间戳
// end		结束时间戳

const countdown = (start,end)=>{
	start = parseInt(start/1000)
	end = parseInt(end/1000)
	var distance = end - start						//间隔时间(秒)
	var data = {
		day:0,
		hour:0,
		minute:0,
		second:0
	}
	switch(true){
		case distance < 60:
			data.second = distance
		break
		case distance < 3600:
			data.second = distance % 60
			data.minute = (distance-data.second)/60
		break
		case distance < 3600*24:
			data.hour = parseInt(distance/60/60)
			data.minute = parseInt((distance-data.hour*60*60)/60)
			data.second = distance % 60
		break
		case distance >= 3600*24:
			data.day = parseInt(distance/60/60/24)
			data.hour = parseInt((distance-data.day*24*60*60)/60/60)
			data.minute = parseInt((distance-data.day*24*60*60-data.hour*60*60)/60)
			data.second = distance % 60
		break
	}
	return data
}


module.exports = {
	getTimestamp,
	getDateTime,
	getDate,
	timestampToDate,
	timestampToDateNoTime,
	dateToTimestamp,
	timeDistance,
	timeAbbreviated,
	countdown
}
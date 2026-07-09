<template>
	<view class="layout">
		<h2 style="text-align: center;">{{title}}</h2>
		<view class="cards">
<!-- 			<view class="lay-egg-num">
				<h4>产蛋数量</h4>
				<h3>400</h3>
			</view> -->
			<view class="other-num">
				<view class="one-num shed-num">
					<h4>当前鸽棚</h4>
					<h3>{{useShed.shedNum}}</h3>
				</view>
				<view class="one-num">
					<h4>产蛋数量</h4>
					<h3>{{cardData.layEggNum}}</h3>
				</view>
				<view class="one-num">
					<h4>抽蛋数量</h4>
					<h3>{{cardData.takeEggNum}}</h3>
				</view>
				<view class="one-num">
					<h4>照蛋数量</h4>
					<h3>{{cardData.lightEggNum}}</h3>
				</view>
				<view class="one-num">
					<h4>加仔数量</h4>
					<h3>{{cardData.addCubNum}}</h3>
				</view>
				<view class="one-num">
					<h4>异常数量</h4>
					<h3>{{cardData.errorNum}}</h3>
				</view>
				<view class="one-num">
					<h4>空笼数量</h4>
					<h3>{{cardData.emptyCageNum}}</h3>
				</view>
				<view class="one-num">
					<h4>存栏数量</h4>
					<h3>{{cardData.notEmptyCageNum}}</h3>
				</view>
				
			</view>
				

		</view>

		<view class="charts-box">
			<qiun-data-charts 
				type="ring"
				:opts="opts"
				:chartData="chartData"
			/>
		</view>
		<view class="change-error-type">
			<button type="primary" :plain="true" @click="changeError('蛋异常')">蛋异常</button>
			<button type="primary" :plain="true" @click="changeError('仔异常')">仔异常</button>
			<button type="primary" :plain="true" @click="changeError('种异常')">种异常</button>
		</view>
		<view class="change-date-type">
			<button type="warn" :plain="true" @click="changeDateReport('全部数据')">全部数据</button>
			<button type="warn" :plain="true" @click="changeDateReport('当月数据')">当月数据</button>
			<button type="warn" :plain="true" @click="changeDateReport('当年数据')">当年数据</button>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref} from 'vue';
import { onShow, onLoad  } from '@dcloudio/uni-app'
import { useShedStore } from '@/stores/shed';
import { useTokenStore } from '@/stores/token';
import SOtime from '../../utils/SOtime';
const useShed = useShedStore()
const useToken = useTokenStore()

const cardData = ref({})
const title = ref('全部数据')

// 当前时间、点击全部数据时时间设置为空，点击当月数据设置为yyyy-MM
const date = ref('')

// 三类异常的比例
const errorProportion = ref('')
const errorData = ref([])
const chartData = ref({})
const errorType = ref('蛋异常')

//您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
const opts = ref({
	rotate: false,
	rotateLock: false,
	color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
	padding: [5,5,5,5],
	dataLabel: true,
	enableScroll: false,
	legend: {
	  show: true,
	  position: "right",
	  lineHeight: 25
	},
	title: {
	  name: errorType,
	  fontSize: 12,
	  color: "#666666"
	},
	subtitle: {
	  name: errorProportion, //////////////////////
	  fontSize: 25,
	  color: "#7cb5ec"
	},
	extra: {
	  ring: {
		ringWidth: 40,
		activeOpacity: 0.5,
		activeRadius: 8,
		offsetAngle: 0,
		labelWidth: 15,
		border: true,
		borderWidth: 3,
		borderColor: "#FFFFFF",
		linearType: "custom"
	  }
	}
})


// 获取报表卡片数据
	const getDataReport = ()=>{
		uni.request({
			url:getApp().globalData.url+`/app/getDataReport?shedId=${useShed.shedId}&date=${date.value}`,
			header:{
				token:useToken.token
			},
			success: (res) => {
				console.log(res.data.data);
				cardData.value = res.data.data;
			},
			fail: () => {
				uni.showToast({
					title:"服务异常",
					icon:'error'
				})
			}
		})
	}

// 控制切换展示的数据
const changeDateReport = (titles)=>{
	title.value = titles;
	if(titles === '全部数据'){
		date.value = '';
		getDataReport()
		getErrorDatas()
	}else if(titles === '当月数据'){
		date.value = SOtime.getMonth();
		getDataReport()
		getErrorDatas()
	}else if(titles === '当年数据'){
		date.value = SOtime.getYear();
		getDataReport()
		getErrorDatas()
	}
}

// 获取环形图异常数据
const getErrorDatas = ()=>{
	setTimeout(()=>{
		uni.request({
			url:getApp().globalData.url+`/app/getErrorDatas?shedId=${useShed.shedId}&date=${date.value}&errorType=${errorType.value}`,
			header:{
				token:useToken.token
			},
			success: (res) => {
				
				// 设置异常类型显示的比例
				let erroeTypeNum = 0
				for(let i=0 ; i<res.data.data.length; i++){
					erroeTypeNum += res.data.data[i].value;
				}
				if(cardData.value.errorNum === 0){
					errorProportion.value = "0%"
				}else{
					errorProportion.value =  (erroeTypeNum/cardData.value.errorNum)*100 + "%"
				}
				console.log(errorProportion.value);
				let r = {
					series: [
					  {
						data: res.data.data
					  }
					]
				  };
				chartData.value = JSON.parse(JSON.stringify(r));
				console.log(chartData.value);
			},
			fail: () => {
				uni.showToast({
					title:"服务异常",
					icon:'error'
				})
			}
		})
	},300)

}
// 切换展示的异常类型
const changeError = (err)=>{
	errorType.value = err;
	console.log(errorType.value)
	getErrorDatas()
}


onLoad(()=>{
	getDataReport();
	getErrorDatas();
})

</script>

<style lang="scss" scoped>
	.layout{
		margin: 30rpx;
		.cards{
			.lay-egg-num{
				margin: 0 auto;
				// border: 1px solid;
				border-radius: 15rpx;
				height: 100rpx;
				width: 100%;
				text-align: center;
				background:
				linear-gradient(to right,#0066FF, #CCFFCC 1000rpx);
				color: white;
			}
			.other-num{
				margin-top: 20rpx;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 30rpx;
				.one-num{
					// border: 1px solid;
					border-radius: 15rpx;
					height: 100rpx;
					width: 100%;
					text-align: center;
					background:
					linear-gradient(to right,#0066FF, #CCFFCC 500rpx);
					color: whitesmoke
				}
				.shed-num{
					background:
					linear-gradient(to right,#FF3333, #CCFFCC 500rpx);
				}
			}
		}

	}
	
	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		width: 100%;
		height: 300px;
	}
	
	.change-error-type{
		display: grid;
		grid-template-columns: repeat(3,1fr);
		// gap: 20rpx;
		width: 100%;
		button{
			width: 200rpx;
		}
	}
	.change-date-type{
		margin-top: 50rpx;
		display: grid;
		grid-template-columns: repeat(3,1fr);
		// gap: 20rpx;
		button{
			width: 200rpx;
		}
	}
</style>

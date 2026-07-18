<template>
	<view class="layout">
		<view class="content">
			<view class="top">
				<view class="top-left">
					<view class="shed-num" @click="openSelectShed">养殖仓-{{shedNum}} >
					</view>
				

					<view class="breeder">{{useUser.nickname}}</view>
				</view>
				<view class="top-right" >
					<view class="num-mode" @click="openSelectCageNumMode">
						鸽笼编号模式：{{cageNumModeValue === 0 ? '1号6笼':'1号3笼'}}
					</view>
					
					
					<view class="bluetooth-text" @click="goBuleToothPage">
						<view class="bluetooth">蓝牙</view>
						<view class="text" v-if="useBlueTooth.linkStatus">剩余电量:{{useBlueTooth.quantityOfElectricity}}%</view>
						<view class="text" v-else-if="useBlueTooth.isAutoReconnecting">自动连接中...</view>
						<view class="text" v-else>未连接</view>
					</view>

				</view>
			</view>
			<view class="block">
				<view class="block-title">配置</view>
				<view class="block-content">
					<view class="block-innerblock color1" @click="goConfigurePage">
						每日工作配置
					</view>
				</view>
			</view>
			<view class="block">
				<view class="block-title">每日工作</view>
				<view class="block-content">
					<view class="block-innerblock color1" v-for="item in dayWork" @click="goWorkIndex(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="block">
				<view class="block-title">特殊工作</view>
				<view class="block-content">
					<view class="block-innerblock color2" v-for="item in specialWork" @click="goWorkIndex(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="block">
				<view class="block-title">其他工作</view>
				<view class="block-content">
					<view class="block-innerblock color3" v-for="item in ortherWork" @click="goWorkIndex(item)">
						{{item}}
					</view>
				</view>
			</view>
			
			<view class="block" v-if="pigeonErrorList !== []">
				<view class="block-title">连续3窝异常种鸽</view>
				<uni-section type="line">
					<uni-collapse >
						<uni-collapse-item v-for="pigeonError in pigeonErrorList" :title="`鸽笼编号:${pigeonError.number}${shedStore.cageMode ===1?  CommonUtils.translateLeftRight(item.leftRight) : '' }${translatePosition(pigeonError.position)}`" :key="pigeonError.cageId" :show-animation="true">
							<view class="content">
								<uni-table border stripe emptyText="暂无更多数据" >
									<!-- 表头行 -->
									<uni-tr>
										<uni-th width="50" align="center" >鸽笼编号</uni-th>
										<uni-th width="50" align="center">产蛋日期</uni-th>
										<uni-th width="50" align="center">异常情况</uni-th>
										<uni-th width="50" align="center">窝次</uni-th>
									</uni-tr>
									<!-- 表格数据行 -->
									<uni-tr v-for="item in pigeonError.newLayEggRecordFrom" :key="item.id">
										<uni-td v-if="shedStore.cageMode === 1">{{item.number}}{{CommonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
										<uni-td v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
										<uni-td>{{item.layEggTime}}</uni-td>
										<uni-td>{{item.abnormal}}</uni-td>
										<uni-td>{{item.epoch}}</uni-td>
									</uni-tr>
								
								</uni-table>

							</view>
						</uni-collapse-item>
					</uni-collapse>
				</uni-section>
			</view>
			
			<view class="outLogin">
				<button type="warn" @click="outSystem">退出系统</button>
			</view>
		</view>
		
		
		<uni-popup class="selectShedPopup" ref="selectShedPopup" type="center" :is-mask-click="true"
		>
			<view class="selectShed">
				
				<view class="title">请选择养殖仓</view>
				  <uni-data-select
					v-model="value"
					:localdata="shedNumList"
					@change="changeShed"
				  ></uni-data-select>
				<view class="selected-shed">已选择:{{shedNum}}</view>
				
				<view class="buttons">
					<view  class="cancel" @click="cancelChangeShed">取消</view>
					<view  class="ok" @click="okChangeShed">确定</view>
					
				</view>
			</view>
		</uni-popup>
		
		<uni-popup class="selectCageNumModePopup" ref="selectCageNumModePopup" type="center" :is-mask-click="true"
		>
			<view class="selectCageNumMode">
				<uni-section title="请选择鸽笼编号模式" type="line">
					<view class="uni-px-5">
						<view class="mode-text">当前模式：{{cageNumModeValue === 0 ? '1号6笼':'1号3笼'}}</view>
						<view class="mode-select">
							<uni-data-checkbox mode="button" v-model="cageNumModeValue" :localdata="cageNumModeList"></uni-data-checkbox>
						</view>
						
					</view>
				</uni-section>
				<view class="buttons">
					<view  class="cancel" @click="cancelChangeCageNumMode">取消</view>
					<view  class="ok" @click="okChangeCageNumMode">确定</view>
				</view>
			</view>
		</uni-popup>
		
		
	</view>
</template>

<script setup>
import { ref,watch,onMounted } from 'vue';
import { watchDisconnect } from '@/uni_modules/lyj-watch';
import { useShedStore } from "@/stores/shed.js"
import {useUserStore} from '@/stores/user.js'
import { useTokenStore } from '@/stores/token';
import { useBlueToothStore } from '@/stores/blueTooth';
import { useDataCatchStore } from '@/stores/dataCatch';
import CommonUtils from '@/utils/CommonUtils';
const useUser = useUserStore()
const shedStore = useShedStore()
const useToken = useTokenStore()
const useBlueTooth = useBlueToothStore()
const useDataCatch = useDataCatchStore()

// 页面基本信息
const user = ref(useUser.nickname)
const dayWork = ref(['产蛋','抽蛋','照蛋', '加仔'])
const specialWork = ref(['种鸽补笼','种鸽淘汰'])
const ortherWork = ref(['数据报表','登记异常','绑定鸽笼', '孵化机数据'])
const selectShedPopup = ref(null)
const selectCageNumModePopup = ref(null)



// 将鸽笼位置0 1 2映射为上中下
const translatePosition = (num)=>{
	if(num === 0){
		return "上"
	}
	if(num === 1){
		return "中"
	}
	if(num === 2){
		return "下"
	}
}


// 从store中获取该用户的养殖仓列表
const getShedListByStore = ()=>{
	let shedlist = shedStore.shedList;
	console.log(shedlist)
	let numList = [];
	for(let i=0; i<shedlist.length; i++){
		let num = {
			value:shedlist[i].id,
			text:shedlist[i].code
		}
		numList.push(num)
	}
	console.log(numList)
	return numList;
}

// 养殖仓选择
const value = ref(shedStore.shedId? shedStore.shedId : null)
// 从store中获取当前的养殖仓信息
const shedId =ref(shedStore.shedId)
const shedNum =ref(shedStore.shedNum)
// 养殖仓切换时的选择列表
const shedNumList = ref(getShedListByStore())
// 切换养殖仓，会把养殖仓信息存到store中
const changeShed = function(){
	let i = shedNumList.value.filter(item => item.value == value.value)
	shedId.value = i[0].value
	shedNum.value = i[0].text
}

// 选择的鸽笼编号模式
const cageNumModeValue = ref(shedStore.getCageMode());

// 哥隆编号模式选择
const cageNumModeList = ref([
	{
		text: '1号6笼',
		value: 0
	},
	{
		text: '1号3笼',
		value: 1
	},
	])



// 连续3窝异常种鸽
const pigeonErrorList = ref([]);

// 取消选择养殖仓
const cancelChangeShed =function(){
	// 取消选择，页面展示的养殖仓还是原来的养殖仓信息
	shedId.value =shedStore.shedId
	shedNum.value = shedStore.shedNum
	selectShedPopup.value.close()
}
// 确定选择切换养殖仓,store中的养殖仓信息进行更新
const okChangeShed =function(){
	shedStore.shedId = shedId.value
	shedStore.shedNum = shedNum.value
	// 查询连续3窝异常种鸽
	uni.request({
		url:getApp().globalData.url+`/app/get3PigeonErrorDatas?shedId=${shedStore.shedId}&cageNumMode=${shedStore.cageMode}`,
		header:{
			token:useToken.token
		},
		success: (res) => {
			console.log(res.data);
			pigeonErrorList.value = res.data.data;
		},
		fail: (err) => {
		}
	})
	selectShedPopup.value.close()
}
// 打开选择养殖仓弹出层
const openSelectShed = function(){
	selectShedPopup.value.open()
}


// 取消选择的鸽笼编号模式，并关闭弹出层
const cancelChangeCageNumMode = () => {
	// 重置为未选择时的默认鸽笼编号模式
	cageNumModeValue.value = shedStore.cageMode
	selectCageNumModePopup.value.close()
}

// 确定切换鸽笼编号模式，并关闭弹出层
const okChangeCageNumMode = () => {
	// 更新sotre中的信息
	shedStore.setCageMode(cageNumModeValue.value)
	// 清除所有缓存信息
	useDataCatch.cleanTableList()
	useDataCatch.cleanBindingCageList()
	// 查询连续3窝异常种鸽
	uni.request({
		url:getApp().globalData.url+`/app/get3PigeonErrorDatas?shedId=${shedStore.shedId}&cageNumMode=${shedStore.cageMode}`,
		header:{
			token:useToken.token
		},
		success: (res) => {
			console.log(res.data);
			pigeonErrorList.value = res.data.data;
		},
		fail: (err) => {
		}
	})
	selectCageNumModePopup.value.close()
}


// 打开鸽笼编号模式选择层
const openSelectCageNumMode = () => {
	selectCageNumModePopup.value.open()
}



// 跳转蓝牙连接页面
const goBuleToothPage = function(){
	uni.navigateTo({
		url:"/pages/blueTooth/blueTooth",
	})
}

// 跳转配置页
const goConfigurePage = () =>{
	uni.navigateTo({
		url:`/pages/configurePage/configurePage`,
	})
}

// 跳转每日工作相应的界面
const goWorkIndex = function(p){
	// 产蛋,抽蛋,照蛋,加仔操作需要先判断是否连接蓝牙
	if(p === '产蛋'){
		if(useBlueTooth.linkStatus){
			uni.navigateTo({
				url:`/pages/layEggList/layEggList`,
			})
		}else{
			uni.showToast({
				title:"请先连接蓝牙",
				icon:'error'
			})
		}
	}else if(p === '抽蛋'){
		if(useBlueTooth.linkStatus){
			uni.navigateTo({
				url:`/pages/takeEggList/takeEggList`,
			})
		}else{
			uni.showToast({
				title:"请先连接蓝牙",
				icon:'error'
			})
		}
	}else if(p === '照蛋'){
		if(useBlueTooth.linkStatus){
			uni.navigateTo({
				url:`/pages/irradiatedEggList/irradiatedEggList`,
			})
		}else{
			uni.showToast({
				title:"请先连接蓝牙",
				icon:'error'
			})
		}
	}else if(p === '加仔'){
		if(useBlueTooth.linkStatus){
			uni.navigateTo({
				url:`/pages/addCubList/addCubList`,
			})
		}else{
			uni.showToast({
				title:"请先连接蓝牙",
				icon:'error'
			})
		}
	}else if(p === '种鸽补笼'){
		uni.navigateTo({
			url:'/pages/breedAddCage/breedAddCage',
		})
	}else if(p === '种鸽淘汰'){
		uni.navigateTo({
			url:'/pages/breedPigeonElimination/breedPigeonElimination'
		})
	}else if(p === '登记异常'){
		useBlueTooth.removeNfcData();
		uni.navigateTo({
			url:'/pages/identificationTags/identificationTags',
		})
	}else if(p === '数据报表'){
		uni.navigateTo({
			url:'/pages/dataReport/dataReport',
		})
	}else if(p === '绑定鸽笼'){
		uni.navigateTo({
			url:`/pages/bindingCage/bindingCage`,
		})
	}
}

// 退出系统
const outSystem = ()=>{
	uni.showModal({
		title: '确定退出系统吗？',
		// content: '',
		success: function (res) {
			if (res.confirm) {
				// 清除token
				useToken.removeToken();
				// useBlueTooth.closeConnectDevice()
				// 设置连接状态为false
				useBlueTooth.setLinkStatusFalse();
				// 关闭蓝牙
				watchDisconnect();
				useBlueTooth.quantityOfElectricity = null
				uni.redirectTo({
					url:"/pages/login/login"
				})
			} else if (res.cancel) {
				
			}
		}
	});
	

}
// 进入该页面后，弹出鸽棚选择框
// onMounted(()=>{
	setTimeout(()=>{
		selectShedPopup.value.open()
	},500)
// })


// 禁用系统返回
import {
	onBackPress
} from "@dcloudio/uni-app";
// 和生命周期函数同级
// 和生命周期函数同级
// 返回值为true 不允许返回 否则允许
onBackPress((options) => {
    // 点击虚拟键或者侧滑的时候触发（不允许返回）
	if (options.from === 'backbutton') {
		return true
	}
	// 否则则允许返回
	return false;
})

</script>

<style lang="scss" scoped>
body{
	// background: #ccFFFF;
}
.layout{
	background:
	linear-gradient(to bottom,#ccFFFF, #F8F8F8 1000rpx);
	padding: 20rpx 0 20rpx 0 ;
	.content{
		width: 690rpx;
		.top{
			width: 100%;
			height: 150rpx;
			// margin: 30rpx 30rpx 0 30rpx;
			margin: 30rpx;
			
			display: grid;
			grid-template-columns: repeat(2,1fr);
			gap: 20rpx;
			border-radius: 20rpx;
			.top-left{
				
				// width: 80%;
				// padding: 25rpx;
				// padding-left: 30rpx;
				color: white;
				
				.shed-num{
					border-radius: 20rpx;
					font-weight: 600;
					display: flex;
					height: 45%;
					align-items: center;
					justify-content: center;
					background: #6633CC;
					// linear-gradient(to right,#0066FF, #6633CC);
					margin-bottom: 5%;
				}
				.breeder{
					border-radius: 20rpx;
					// margin: 5rpx 0;
					display: flex;
					height: 45%;
					align-items: center;
					justify-content: center;
					// color: black;
					background: #0066FF
					// linear-gradient(to right,#0066FF, #6633CC);
					
				}
			}
			.top-right{
				background:
				linear-gradient(to bottom,#6633CC, #0066FF);
				// width: 250rpx;
				border-radius: 20rpx;
				color: white;
				padding: 25rpx;
				padding-right: 30rpx;
				.num-mode{
					margin-bottom: 30rpx;
				}
				.bluetooth-text{
					display: flex;
					.bluetooth{
						right: 30px;
						width: 160rpx;
						// margin: 0 auto;
						// margin-top: 20rpx;
						// margin-right: -5rpx;
						border-radius: 30rpx;
						background: white;
						color: blue;
						display: flex;
						align-items: center;
						justify-content: center;
						height: 60rpx;
					}
					.text{
						display: flex;
						height: 60rpx;
						align-items: center;
						justify-content: center;
						width: 160rpx;
						font-size: 20rpx;
					}
				}

			}
		}
		.block{
			width: 690rpx;
			// height: 150rpx;
			margin: 30rpx;
			.block-title{
				height: 40rpx;
				margin: 35rpx 0 15rpx 0;
				font-weight: 700;
			}
			.block-content{
				width: 100%;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 20rpx;
				.block-innerblock{
					// width: ;
					border: 1px solid;
					height: 150rpx;
					border-radius: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 50rpx;
					font-weight: 700;
				}
				.color1{
					color: white;
					background: royalblue;
				}
				.color2{
					color: white;
					background: limegreen;
				}
				.color3{
					font-size: 40rpx;
					font-weight: 600;
					border: 1px solid #cfcfcf;
				}
			}
			
		}
		.outLogin{
			// text-align: center;
			width: 100%;
			margin: 50rpx 30rpx;
		}
		
	}
	.selectShedPopup{
		.selectShed{
			width: 600rpx;
			height: 400rpx;
			background: white;
			border-radius: 15rpx;
			.title{
				font-size: 50rpx;
				color: #0066FF;
				font-weight: 600;
				padding: 20rpx;
				text-align: center;
			}
			.uni-select__input-box{
				height: 50rpx;
			}
			.selected-shed{
				font-size: 40rpx;
				color: #0066FF;
				font-weight: 600;
				margin-top: 30rpx;
				padding: 20rpx;
				text-align: center;
			}
			.buttons{
				margin: 5rpx 30rpx;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 20rpx;
				font-weight: 600;
				color: white;
				.cancel{
					height: 80rpx;
					background: orangered;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 20rpx;
				}
				.ok{
					height: 80rpx;
					background: #0066FF;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 20rpx;
				}
			}
		}
	}
	
	.selectCageNumModePopup{
		.selectCageNumMode{
			width: 600rpx;
			height: 400rpx;
			background: white;
			border-radius: 15rpx;
			.uni-px-5 {
				padding-left: 80rpx;
				padding-right: 80rpx;
				
				.mode-text {
					font-size: 50rpx;
					color: #0066FF;
					font-weight: 600;
					padding: 20rpx;
					text-align: center;
				}
			}
			.buttons{
				margin: 5rpx 30rpx;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 20rpx;
				font-weight: 600;
				color: white;
				.cancel{
					height: 80rpx;
					background: orangered;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 20rpx;
				}
				.ok{
					height: 80rpx;
					background: #0066FF;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 20rpx;
				}
			}
		}
	}
}
</style>

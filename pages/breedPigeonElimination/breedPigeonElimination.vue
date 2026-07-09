<template>
	<view class="layout">
		<view class="condition">
			<uni-group mode="card">
				<h3 style="color: blue; text-align: center;"> 淘汰条件 </h3>
				<h4 style="color: gray;"> 条件一：2月内出现4次以上光2 </h4>
				<h4 style="color: gray;"> 条件二：2月内出现5次以上光1 </h4>
				<h4 style="color: gray;"> 条件三：产蛋总窝数大于30 </h4>
			</uni-group>
		</view>
		<view class="table">
			<uni-table :border="false" :stripe="false" emptyText="">
				<!-- 单独的表头用于固定 -->
				<uni-tr class="title"> 
					<uni-th width="60" align="center" >鸽笼编号</uni-th>
					<uni-th width="60" align="center">鸽笼状态</uni-th>
					<uni-th width="60" align="center">条件1</uni-th>
					<uni-th width="60" align="center">条件2</uni-th>
					<uni-th width="60" align="center">条件3</uni-th>
					<!-- <uni-th width="50" align="center">孵化异常</uni-th> -->
				</uni-tr>
				<uni-tr >
					
				</uni-tr>
			</uni-table>
			<!-- 产蛋列表 -->
			<scroll-view class="scro" scroll-y="true" :show-scrollbar="false">
				<uni-table :stripe="false">
					<!-- 隐藏表头 -->
						<uni-tr class="fake-title">
							<uni-th width="60"></uni-th>
							<uni-th width="60"></uni-th>
							<uni-th width="60"></uni-th>
							<uni-th width="60"></uni-th>
							<uni-th width="60"></uni-th>
						</uni-tr>
						<uni-tr  class="data" v-for="item in tableList" :key="item.id" @click="selectedCage(item.id,item.number,item.position)">
							<uni-td width="60" align="center" v-if="usrShed.cageMode === 0">{{item.number}}{{CommonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
							<uni-td width="60" align="center" v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
							<uni-td width="60" :style="{color: item.status ===1 ? 'blue':'red'}" align="center">{{item.ifExist ===0 ? '在笼':'空笼'}}</uni-td>
							<uni-td width="60" :style="{color: item.conditionOne >=4? 'red':'grey'}" align="center">{{item.conditionOne >=4 ? '符合':'不符合'}}</uni-td>
							<uni-td width="60" :style="{color: item.conditionTwo >=5 ? 'red':'grey'}" align="center">{{item.conditionTwo >=5 ? '符合':'不符合'}}</uni-td>
							<uni-td width="60" :style="{color: item.conditionThree >=30? 'red':'grey'}" align="center">{{item.conditionThree >=30 ? '符合':'不符合' }}</uni-td>
						</uni-tr>						
				</uni-table>				
			</scroll-view>
		</view>
		<view class="buttons">
			<button type="primary" @click="viewRecords">查看记录</button>
			<button type="primary" @click="eliminatCage">淘汰</button>
			<button type="warn" @click="over">结束</button>
		</view>
		
		
		<!-- 查看记录顶部弹出层 -->
		<uni-popup class="record-pop" ref="viewRecordsPopup" type="top" borderRadius="10rpx 10rpx 0rpx 0rpx" background-color="#fff" >
			<view class="inner">
				<h3 style="text-align: center;">{{selectNumber}}{{translatePosition(selectPosition)}}</h3>
				<view class="content-table" >
					<uni-table :border="true" :stripe="false" emptyText="">
						<!-- 单独的表头用于固定 -->
						<uni-tr class="title">
							<uni-th width="50" align="center">窝次</uni-th>
							<uni-th width="50" align="center">产蛋日期</uni-th>
							<uni-th width="50" align="center">产蛋间隔</uni-th>
							<uni-th width="50" align="center">留窝情况</uni-th>
							<uni-th width="50" align="center">照蛋情况</uni-th>
							<uni-th width="50" align="center">加仔情况</uni-th>
							<uni-th width="50" align="center">异常情况</uni-th>
						</uni-tr>
						<uni-tr >
							
						</uni-tr>
					</uni-table>
					<!-- 产蛋列表 -->
					<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false">
						<uni-table  :stripe="false" :border="true" emptyText="暂无数据" >
							<!-- 隐藏表头 -->
								<uni-tr class="fake-title">
									<uni-th width="50"></uni-th>
									<uni-th width="50"></uni-th>
									<uni-th width="50"></uni-th>
									<uni-th width="50"></uni-th>
									<uni-th width="50"></uni-th>
									<uni-th width="50"></uni-th>
									<uni-th width="50"></uni-th>
								</uni-tr>
								<uni-tr  class="data" v-for="item in viewRecordList" :key="item.id">
									<uni-td width="50" align="center">{{item.epoch}}</uni-td>
									<uni-td width="50" align="center">{{item.layEggTime}}</uni-td>
									<uni-td width="50" align="center">{{item.interval}}</uni-td>
									<uni-td width="50" align="center">{{isPumpingEgg(item.takeOrHatch)}}</uni-td>
									<uni-td width="50" align="center">{{isLightEgg(item.checkEgg)}}</uni-td>
									<uni-td width="50" align="center">{{isAddChild(item.addChild)}}</uni-td>
									<uni-td width="50" align="center">--</uni-td>
								</uni-tr>						
						</uni-table>				
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		
		
	</view>
	
	
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useTokenStore } from '@/stores/token';
import { useShedStore } from '@/stores/shed';
import jsonBig from 'json-bigint';
import CommonUtils from '@/utils/CommonUtils';

const usrToken = useTokenStore()
const usrShed = useShedStore()
const tableList = ref([])
let selectCageId = ''
const selectNumber = ref('')
const selectPosition = ref('')
// 控制查看记录弹窗
const viewRecordsPopup = ref(null) 
// 查看记录弹窗的列表数据
const viewRecordList = ref([])

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


// 获取列表数据
const init = ()=>{
	uni.request({
		url:getApp().globalData.url+`/app/getBreedPigeonEliminationList?shedId=${usrShed.shedId}&cageNumMode=${usrShed.cageMode}`,
		header:{
			token:usrToken.token
		},
		dataType:'String',
		success: (res) => {
			var parseData = jsonBig.parse(res.data);
			tableList.value = parseData.data
			console.log(parseData);
		},
		fail: (err) => {
			uni.showToast({
				title:"服务异常",
				icon:'error'
			})
		}
	})
}

// 选中鸽笼
const selectedCage = (cageId, number, position)=>{
	selectCageId = cageId;
	selectNumber.value = number;
	selectPosition.value = position;
}


// 查看选中数据的记录
const viewRecords = ()=>{
	if(selectNumber.value === ''){
		uni.showToast({
			title: '请选择鸽笼',
			duration: 1500,
			icon:'error'
		});
	}else{
			uni.request({
				url:getApp().globalData.url+`/app/viewRecord?number=${selectNumber.value}&position=${selectPosition.value}&shedId=${usrShed.shedId}`,
				header:{
					token:usrToken.token
				},
				success: (res) => {
					viewRecordList.value = res.data.data
					viewRecordsPopup.value.open()
				},
				fail: (err) => {
					uni.showToast({
						title:"服务异常",
						icon:'error'
					})
				}
			})
			
	}
}
// 设置查看记录列表中留窝情况显示的数据
const isPumpingEgg = (flag)=>{
	if(flag === 0){
		return "抽蛋"
	}else{
		return "孵蛋"
	}
}

// 设置查看记录列表中照蛋情况显示的数据
const isLightEgg = (flag)=>{
	if(flag === null){
		return "--"
	}else if(flag === 0){
		return "正常"
	}else if(flag === 2){
		return "光1"
	}else if(flag === 3){
		return "光2"
	}
}

// 设置查看记录列表中照蛋情况显示的数据
const isAddChild = (flag)=>{
	if(flag === null){
		return "--"
	}else if(flag === 0){
		return "加仔3"
	}else if(flag === 1){
		return "加仔4"
	}
}

// 淘汰操作
const eliminatCage = ()=>{
	if(selectCageId === ''){
		uni.showToast({
			title:"请选择鸽笼",
			icon:'error'
		})
	}else{
		uni.request({
			url:getApp().globalData.url+`/app/eliminatCage?cageId=${selectCageId}`,
			header:{
				token:usrToken.token
			},
			success: (res) => {
				uni.showToast({
					title:"操作成功",
					icon:'success'
				})
				init()
			},
			fail: (err) => {
				uni.showToast({
					title:"服务异常",
					icon:'error'
				})
			}
		})
	}
}


// 结束操作，返回上一个页面
const over = ()=>{
	uni.showModal({
		title: '结束操作？',
		success: function (res) {
			if (res.confirm) {
				uni.navigateBack()
			} else if (res.cancel) {

			}
		}
	});
	
}

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

onMounted(()=>{
	init()
})
</script>

<style lang="scss" scoped>
.layout{
	margin: 30rpx;
	.table{
		// border: 1px solid;
		box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
		height: 1000rpx;
		background-color: rgba(204, 204, 204, 0.4);
		.title{
			background-color: rgba(204, 204, 204, 0.4);
		}
		.scro{
			margin: -5rpx 0rpx 0rpx 0rpx;
			height: 900rpx;
			max-height: 880rpx;
			.fake-title{
				// height: rpx;
				.uni-table-th{
					height: 0rpx;
					padding: 5rpx
				}
			}
		}
	}
	.buttons{
		margin-top: 50rpx;
		padding: 15rpx;
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap: 10rpx;
		// background-color: rgba(204, 204, 204, 0.4);
		button{
			width: 100%;
		}
	}
	
	.record-pop{
		// width: 100%;
		.inner{
			height: 700rpx;
			margin: 30rpx;
			// border: 1px solid;
			.content-table{
				background: #F8F8F8;
				height: 630rpx;
				// width: 100%;
				.scro{
					// position: relative; /* 或者 absolute、fixed */
					//   z-index: 1000;
					width: 100%;
					margin-top: 10rpx;
					max-height: 500rpx;
					border: 1px solid darkgrey;
					.fake-title{
						height: 0rpx;
						.uni-table-th{
							height: 0rpx;
							padding: 0rpx
						}
					}
					
				}
			}
		}
	}
}
</style>

<template>
	<view class="layout">
		<view class="top">
			<h3>{{useShed.shedNum}}鸽棚</h3>
			<h3>{{useDate.layEggDate}}</h3>
		</view>
		
		<view class="table">
			<uni-table :border="false" :stripe="false" emptyText="">
				<!-- 单独的表头用于固定 -->
				<uni-tr class="title"> 
					<uni-th width="60" align="center">鸽笼编号</uni-th>
					<uni-th width="60" align="center">鸽笼状态</uni-th>
					<uni-th width="60" align="center">操作</uni-th>
				</uni-tr>
				<uni-tr >
				</uni-tr>
			</uni-table>
			<!-- 产蛋列表 -->
			<scroll-view class="scro" scroll-y="true" :show-scrollbar="false">
				<uni-table :stripe="false">
						<uni-tr class="fake-title">
							<uni-th width="60"></uni-th>
							<uni-th width="60"></uni-th>
							<uni-th width="60"></uni-th>
						</uni-tr>
						<uni-tr  class="data" v-for="item in breedAddCageList" :key="item.id">
							<uni-td width="60" align="center" v-if="useShed.cageMode === 0">{{item.number}}{{CommonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
							<uni-td width="60" align="center" v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
							<uni-td width="60" :style="{color: item.ifExist ===0 ? 'blue':'red'}" align="center">{{item.ifExist ===0 ? '在笼':'空笼'}}</uni-td>
							<uni-td width="60" ><button type="primary" @click="breedAddCub(item.id,item.number,item.leftRight,item.position)">补笼</button></uni-td>
						</uni-tr>						
				</uni-table>				
			</scroll-view>
		</view>
		<view class="card">
			<h3>空笼数量：{{breedAddCageList.length}}</h3>
		</view>
		<button type="warn" @click="over">结束</button>
		
	</view>
</template>

<script setup>
import { useShedStore } from '@/stores/shed';
import { useDateStore } from '@/stores/date';
import { useTokenStore } from '@/stores/token';
import { ref,onMounted } from 'vue';
import jsonBig from 'json-bigint';
import CommonUtils from '@/utils/CommonUtils';

const useShed = useShedStore()
const useDate = useDateStore()
const useToken = useTokenStore()

const breedAddCageList = ref([])


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

// 获取补笼列表
const getBreedAddCageList = ()=>{
	uni.request({
		url:getApp().globalData.url+`/app/getBreedAddCageList?shedId=${useShed.shedId}&cageNumMode=${useShed.cageMode}`,
		header:{
			token:useToken.token
		},
		dataType:'String',
		success: (res) => {
			var parseData = jsonBig.parse(res.data);
			breedAddCageList.value = parseData.data;
			console.log("需要补笼的鸽笼列表", breedAddCageList.value )
		},

		fail: () => {
			uni.showToast({
				title:"服务异常",
				icon:'error'
			})
		}
	})
}

// 补笼操作
const breedAddCub = (cageId,number,leftRight,position)=>{
	uni.request({
		url:getApp().globalData.url+`/app/breedAddCub?shedId=${useShed.shedId}&cageId=${cageId}`,
		header:{
			token:useToken.token
		},
		success: (res) => {
			let title;
			if(useShed.cageMode === 0){
				title = `【${number}${CommonUtils.translateLeftRight(leftRight)}${translatePosition(position)}】补笼成功`
			}else{
				title = `【${number}${translatePosition(position)}】补笼成功`
			}
			uni.showToast({
				title: title,
				icon:'success'
			})
			getBreedAddCageList()
		},
		fail: (err) => {
			uni.showToast({
				title:"服务异常",
				icon:'error'
			})
		}
	})
}

// 结束操作，返回上一个页面
const over = ()=>{
	uni.showModal({
		title: '结束操作？',
		content:'点击确定返回主页',
		success: function (res) {
			if (res.confirm) {
				uni.navigateBack()
			} else if (res.cancel) {
		
			}
		}
	})
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
	getBreedAddCageList()
})
</script>

<style lang="scss" scoped>
.layout{
	margin: 30rpx;
	.top{
		
		height: 80rpx;
		box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
		display: grid;
		grid-template-columns: repeat(2,1fr);
		gap: 30%;
		h3{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
		}
	}
	.table{
		margin-top: 30rpx;
		// border: 1px solid;
		box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
		height: 1070rpx;
		background-color: rgba(204, 204, 204, 0.4);
		.title{
			background-color: rgba(204, 204, 204, 0.4);
		}
		.scro{
			margin: -5rpx 0rpx 0rpx 0rpx;
			height: 1000rpx;
			max-height: 980rpx;
			.fake-title{
				// height: rpx;
				.uni-table-th{
					height: 0rpx;
					padding: 5rpx;
				}
			}
		}
	}
	.card{
		margin-top: 30rpx;
		height: 80rpx;
		// border: 1px solid;
	}
}
</style>

<template>

	<view class="fiex">
		<view class="button view-records" @click="viewRecords">查看记录</view>
		<view class="button record-exceptions" @click="addError">登记异常</view>
		<view class="button delete" @click="deleteOne">删除</view>
	</view>
	
	<!-- 查看记录顶部弹出层 -->
	<uni-popup class="record-pop" ref="viewRecordsPopup" type="top" borderRadius="10rpx 10rpx 0rpx 0rpx" background-color="#fff" >
		<view class="inner">
			<h3 style="text-align: center;">{{shedCode}}</h3>
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
								<uni-td width="50" align="center">{{item.abnormal}}</uni-td>
							</uni-tr>						
					</uni-table>				
				</scroll-view>
			</view>
		</view>
	</uni-popup>
	
	
	<!-- 登记异常顶部弹出层 -->
</template>

<script setup>
import { useTokenStore } from '@/stores/token';
import { useShedStore } from '@/stores/shed';
import { useDateStore } from '@/stores/date';
import { useCageStore } from '@/stores/cage';
import { useStatusStore } from '@/stores/status';
import { useDataCatchStore } from '../../stores/dataCatch';
import { useBlueToothStore } from "@/stores/blueTooth.js"
import { ref } from 'vue';
import CommonUtils from '@/utils/CommonUtils';

const useToken = useTokenStore()
const useShed = useShedStore()
const useDate = useDateStore()
const useCage = useCageStore()
const useStatus = useStatusStore()
const useBlueTooth = useBlueToothStore()

const useDataCatch = useDataCatchStore()
const props = defineProps({
    types: String,
});

// 控制查看记录弹窗
const viewRecordsPopup = ref(null) 
// 记录弹窗的鸽笼编号
const shedCode = ref('')

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

// 查看选中数据的记录
const viewRecords = ()=>{
	
	if(useCage.selectedNumber === -1 || useCage.selectedPosition){
		uni.showToast({
			title: '请选择查看的记录',
			duration: 1500,
			icon:'error'
		});
	}else{
			uni.request({
				url:getApp().globalData.url+`/app/viewRecord?number=${useCage.selectedNumber}&leftRight=${useCage.selectedLeftRight}&position=${useCage.selectedPosition}&shedId=${useShed.shedId}`,
				header:{
					token:useToken.token
				},
				success: (res) => {
					viewRecordList.value = res.data.data
				},
				fail: (err) => {
					uni.showToast({
						title:"服务异常",
						icon:'error'
					})
				}
			})
			if(useShed.cageMode === 0){
				shedCode.value = useCage.selectedNumber + CommonUtils.translateLeftRight(useCage.selectedLeftRight) + translatePosition(useCage.selectedPosition)
			}else{
				shedCode.value = useCage.selectedNumber + translatePosition(useCage.selectedPosition)
			}
			
			viewRecordsPopup.value.open()
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





const addError = ()=>{
	var key = 1;
	if(props.types === '产蛋'){
		key = 0
	}
	if(useCage.selectedRecordId === ''){
		uni.showToast({
			title: '请选择记录',
			duration: 1500,
			icon:'error'
		});
	}else{
		uni.navigateTo({
			url:`/pages/abnormalRegistration/abnormalRegistration?key=${key}`,
		})
	}
}

// 删除列表中选中的记录
const deleteOne = ()=>{
	if(useCage.selectedRecordId === ''){
		uni.showToast({
			title: '请选择删除的记录',
			duration: 1500,
			icon:'error'
		});
	}else{
		if(props.types === '产蛋'){
			console.log("---",useCage.selectedPosition)
			uni.request({
				url:getApp().globalData.url+`/app/deleteOneRecord?id=${useCage.selectedRecordId}`,
				header:{
					token:useToken.token
				},
				success: (res) => {
					let title;
					if(useShed.cageMode === 0){
						title = "【"+useCage.selectedNumber+CommonUtils.translateLeftRight(useCage.selectedLeftRight)+translatePosition(useCage.selectedPosition)+"】"+"已删除";
					}else{
						title = "【"+useCage.selectedNumber+translatePosition(useCage.selectedPosition)+"】"+"已删除";
					}
					if(res.data.code === 0){
						uni.showToast({
							title: title,
							duration:1500,
							icon:'success'
						})
					}
					useStatus.DELETE = !useStatus.DELETE;
					// 删除成功后先刷新列表，延迟1秒再清除NFC数据
					getTodayLayEggList();
					setTimeout(() => {
						removeNfcData()
					}, 1000);
				},
				fail: (err) => {
					uni.showToast({
						title: '服务异常',
						duration: 1500,
						icon:'error'
					});
				},
				complete: () => {
					// 清楚选中的记录
					// 选中记录超过5秒钟，就清除选中的记录id
					useCage.RemoveSelectedRecordId();
					useCage.RemoveSelectedNumber();
					useCage.RemoveSelectedPosition();
				}
			})
		}else if(props.types === '抽蛋'){
		// 	uni.request({
		// 		url:getApp().globalData.url+`/app/dupdateOneTakeEggRecord?id=${useCage.selectedRecordId}`,
		// 		header:{
		// 			token:useToken.token
		// 		},
		// 		success: (res) => {
		// 			if(res.data.code === 0){
		// 				uni.showToast({
		// 					title:"【"+useCage.selectedCageCode+"】"+"已删除",
		// 					duration:1500,
		// 					icon:'success'
		// 				})
		// 			}
		// 			useStatus.DELETE = !useStatus.DELETE
		// 		},
		// 		fail: (err) => {
		// 			uni.showToast({
		// 				title: '服务异常',
		// 				duration: 1500,
		// 				icon:'error'
		// 			});
		// 		}
		// 	})
			// 删除操作，对缓存中的数据进行删除
			useDataCatch.cancelLabelPumpingEgg(useCage.selectedRecordId);
			
			let title;
			if(useShed.cageMode === 0){
				title = "【"+useCage.selectedNumber+CommonUtils.translateLeftRight(useCage.selectedLeftRight)+translatePosition(useCage.selectedPosition)+"】"+"已删除";
			}else{
				title = "【"+useCage.selectedNumber+translatePosition(useCage.selectedPosition)+"】"+"已删除";
			}
			
			uni.showToast({
				title: title,
				duration:1500,
				icon:'success'
			})
			useStatus.DELETE = !useStatus.DELETE;
		
		}else if(props.types === '照蛋'){
			// uni.request({
			// 	url:getApp().globalData.url+`/app/dupdateOneLightEggRecord?id=${useCage.selectedRecordId}`,
			// 	header:{
			// 		token:useToken.token
			// 	},
			// 	success: (res) => {
			// 		if(res.data.code === 0){
			// 			uni.showToast({
			// 				title:"【"+useCage.selectedCageCode+"】"+"已删除",
			// 				duration:1500,
			// 				icon:'success'
			// 			})
			// 		}
			// 		useStatus.DELETE = !useStatus.DELETE
			// 	},
			// 	fail: (err) => {
			// 		uni.showToast({
			// 			title: '服务异常',
			// 			duration: 1500,
			// 			icon:'error'
			// 		});
			// 	}
			// })
			// 删除操作，对缓存中的数据进行删除
			useDataCatch.cancelLabelPumpingEgg(useCage.selectedRecordId);
			let title;
			if(useShed.cageMode === 0){
				title = "【"+useCage.selectedNumber+CommonUtils.translateLeftRight(useCage.selectedLeftRight)+translatePosition(useCage.selectedPosition)+"】"+"已删除";
			}else{
				title = "【"+useCage.selectedNumber+translatePosition(useCage.selectedPosition)+"】"+"已删除";
			}
			
			uni.showToast({
				title: title,
				duration:1500,
				icon:'success'
			})
			useStatus.DELETE = !useStatus.DELETE;
		}else if(props.types === '加仔'){
			// uni.request({
			// 	url:getApp().globalData.url+`/app/dupdateOneAddCubRecord?id=${useCage.selectedRecordId}`,
			// 	header:{
			// 		token:useToken.token
			// 	},
			// 	success: (res) => {
			// 		if(res.data.code === 0){
			// 			uni.showToast({
			// 				title:"【"+useCage.selectedCageCode+"】"+"已删除",
			// 				duration:1500,
			// 				icon:'success'
			// 			})
			// 		}
			// 		useStatus.DELETE = !useStatus.DELETE
			// 	},
			// 	fail: (err) => {
			// 		uni.showToast({
			// 			title: '服务异常',
			// 			duration: 1500,
			// 			icon:'error'
			// 		});
			// 	}
			// })
			// 删除操作，对缓存中的数据进行删除
			useDataCatch.cancelLabelPumpingEgg(useCage.selectedRecordId);
			let title;
			if(useShed.cageMode === 0){
				title = "【"+useCage.selectedNumber+CommonUtils.translateLeftRight(useCage.selectedLeftRight)+translatePosition(useCage.selectedPosition)+"】"+"已删除";
			}else{
				title = "【"+useCage.selectedNumber+translatePosition(useCage.selectedPosition)+"】"+"已删除";
			}
			
			uni.showToast({
				title: title,
				duration:1500,
				icon:'success'
			})
			useStatus.DELETE = !useStatus.DELETE;
		}

	}

}

</script>

<style lang="scss" scoped>
	.fiex{
		background: #F8F8F8;
		width: 700rpx;
		
		padding: 25rpx;
		height: 80rpx;
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap: 15rpx;
		.button{
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 600;
			border-radius: 10rpx;
		}
		.view-records{
			color: dodgerblue;
			background: rgba(135, 206, 250, 0.4);
			border: 1px solid dodgerblue;
		}
		.record-exceptions{
			color: coral;
			background: rgba(240, 160, 80, 0.4);
			border: 1px dodgerblue;
		}
		.delete{
			color: dodgerblue;
			background: rgba(135, 206, 250, 0.4);
			border: 1px solid dodgerblue;
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
</style>
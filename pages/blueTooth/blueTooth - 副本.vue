<template>
	<view class="layout">
		<view class="title">已发现蓝牙设备</view>
		
		
		<view v-if="blueToothList.length" class="blue-tooth-list">
			<view class="blue-tooth" v-for="(item,index) in blueToothList" :key="item">
				蓝牙设备{{index+1}}:{{item}}
			</view>
		</view>
		<view v-else class="no-blue-tooth">暂无设备，请刷新列表</view>
		<view class="serch-blue-tooth" @click="searchBlueToothDervices">
			<uni-icons type="loop" size="50" color="skyblue"></uni-icons>
			<view>查找</view>
		</view>
		
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';
	
const blueToothList = ref([])


const searchBlueToothDervices = ()=>{
	// 先对蓝夜列表清空
	blueToothList.value = [];
	
	// 1.初始化蓝牙模块
	uni.openBluetoothAdapter({
		success: (e) => {
			console.log('============1.蓝牙初始化成功=============',e);

			uni.showToast({
				title: '蓝牙设备搜索中',
				icon:'loading'
			})
			
	// 2.搜索蓝牙设备
			uni.startBluetoothDevicesDiscovery({
				powerLevel:'medium',
				allowDuplicatesKey:'false',
				success: (e) => {
					
					// 加延迟，为了设备搜索完成再获取列表
	// 3.获取设备列表
						// uni.getBluetoothDevices({
						// 	success:(devices)=>{
						// 		console.log(devices);
						// 		if(devices.devices.length ){
						// 			console.log("===========2.蓝牙外围设备搜索完成(发现设备)============");
						// 			console.log("======================设备如下========================");
						// 			console.log(devices.devices);
						// 			console.log("=====================================================");
						// 			blueToothList.value.push(devices.devices[0].deviceId)
						// 		}else{
						// 			console.log("===========2.蓝牙外围设备搜索完成(没有发现设备)============");
						// 		}
								
						// 	},
						// 	fail:()=>{
						// 		console.log("获取设备列表失败");
						// 	},
						// 	complete: () => {
						// 		// 设备获取完成后停止搜索蓝牙
						// 		console.log("===========3.设备获取完成，停止搜索蓝牙============");
								
						// 		uni.stopBluetoothDevicesDiscovery()
						// 		uni.closeBluetoothAdapter()
						// 	}
						// })
					// 
						uni.onBluetoothDeviceFound((devices)=>{
							console.log("第一个",devices.devices);
							
							

								uni.getBluetoothDevices({
									success: (devices) => {
										console.log("第二个",devices.devices);
										if(devices.devices.length ){
											// 先对蓝夜列表清空
											blueToothList.value = [];
											console.log("===========2.蓝牙外围设备搜索完成(发现设备)============");
											console.log("======================设备如下========================");
											console.log(devices.devices);
											console.log("=====================================================");
											blueToothList.value.push(devices.devices[0].deviceId)
										}else{
											console.log("===========2.蓝牙外围设备搜索完成(没有发现设备)============");
										}
									}
								})

						})
					
				},
				fail: (e) => {
					console.log('搜索设备失败',e);
				}
			})
		},
		fail: (e) => {
			if(e.code === 10001){
				uni.showToast({
				title: '请打开蓝牙',
				icon:'none'
				})
			}else{
				uni.showToast({
				title: '手机不支持蓝牙'
				})
			}
		}
	})
}
	
console.log(blueToothList.value);


</script>

<style lang="scss">
.layout{
	padding: 10rpx 30rpx 0rpx;
	.title{
		text-align: center;
		font-size: 40rpx;
		color: skyblue;
	}
	.blue-tooth-list{
		width: 100%;
		margin-top: 20rpx;
		.blue-tooth{
			margin-top: 20rpx;
			background: #f1f1f1;
			height: 150rpx;
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.no-blue-tooth{
		color: gray;
		margin-top: 20rpx;
		background: #f1f1f1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 150rpx;
		border-radius: 15rpx;
	}
	.serch-blue-tooth{
		// display: ;
		text-align: center;
		border:1px solid #f8f8f8;
		background: #f8f8f8;
		width: 150rpx;
		height: 150rpx;
		border-radius: 20rpx;
		position: fixed;
		right: 30rpx;
		bottom: 200rpx;
		view{
			color: skyblue;
		}
	}
}
</style>

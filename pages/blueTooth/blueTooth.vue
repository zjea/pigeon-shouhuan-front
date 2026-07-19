<template>
	<view class="layout">
		<view class="serch-blue-tooth" @click="useBlueTooth.searchBlueToothDervices()">
			<uni-icons type="loop" size="50" color="skyblue"></uni-icons>
			<view>查找</view>
		</view>

		<view class="section">
			<view class="section-title">已连接设备</view>
			<view v-if="connectedDevice" class="blue-tooth-list">
				<view class="blue-tooth connected-device">
					<view class="blue-tooth-info">
						<view class="device-name">{{ connectedDevice.name || connectedDevice.deviceId }}</view>
						<view class="device-id">{{ connectedDevice.deviceId }}</view>
					</view>
					<view class="blue-tooth-right">
						<view class="connected-mark">
							<uni-icons type="checkmarkempty" size="30" color="#4cd964"></uni-icons>
						</view>
						<button class="disconnect-btn" @click.stop="useBlueTooth.connetBlue(connectedDevice)">断开连接</button>
					</view>
				</view>
			</view>
			<view v-else class="no-blue-tooth">未连接设备</view>
		</view>

		<view class="section">
			<view class="section-title">连接过的设备</view>
			<view v-if="connectedDevices.length" class="blue-tooth-list">
				<view class="blue-tooth" v-for="(item,index) in connectedDevices" :key="item.deviceId"
					@click="useBlueTooth.connetBlue(item)">
					<view class="blue-tooth-info">
						<view class="device-name">{{ item.name || item.deviceId }}</view>
						<view class="device-id">{{ item.deviceId }}</view>
					</view>
				</view>
			</view>
			<view v-else class="no-blue-tooth">暂无连接过的设备</view>
		</view>

		<view class="section">
			<view class="section-title">可用设备</view>
			<view v-if="availableDevices.length" class="blue-tooth-list">
				<view class="blue-tooth" v-for="(item,index) in availableDevices" :key="item.deviceId"
					@click="useBlueTooth.connetBlue(item)">
					<view class="blue-tooth-info">
						<view class="device-name">{{ item.name || item.deviceId }}</view>
						<view class="device-id">{{ item.deviceId }}</view>
					</view>
				</view>
			</view>
			<view v-else class="no-blue-tooth">暂无可用设备，请点击查找</view>
		</view>

	</view>
</template>

<script setup>
	import { computed } from 'vue';
	import { onUnload, onShow } from '@dcloudio/uni-app'
	import { useBlueToothStore } from '@/stores/blueTooth';
	const useBlueTooth = useBlueToothStore()
	
	const connectedDevice = computed(() => {
		if (!useBlueTooth.linkStatus || !useBlueTooth.connectedBlueToothDevice) {
			return null
		}
		return useBlueTooth.blueToothList.find(d => d.deviceId === useBlueTooth.connectedBlueToothDevice)
	})
	
	const connectedDevices = computed(() => {
		const savedList = useBlueTooth.getConnectedDevices()
		if (!savedList || savedList.length === 0) return []
		const savedIds = new Set(savedList.map(d => d.deviceId))
		return useBlueTooth.blueToothList.filter(d => 
			savedIds.has(d.deviceId) && 
			d.deviceId !== useBlueTooth.connectedBlueToothDevice
		)
	})
	
	const availableDevices = computed(() => {
		const savedList = useBlueTooth.getConnectedDevices()
		const savedIds = new Set(savedList.map(d => d.deviceId))
		return useBlueTooth.blueToothList.filter(d => 
			!savedIds.has(d.deviceId) &&
			d.deviceId !== useBlueTooth.connectedBlueToothDevice
		)
	})
	
	onShow(() => {
		console.log('蓝牙页面显示')
		
		if (!useBlueTooth.linkStatus && useBlueTooth.connectedBlueToothDevice) {
			useBlueTooth.checkConnectionStatus()
		}
		
		useBlueTooth.addLastConnectedDeviceToList()
	})
	
	onUnload(()=>{
		uni.stopBluetoothDevicesDiscovery({
			success: function(res) {
				console.log('停止搜索蓝牙设备');
			}
		});
	})
</script>

<style lang="scss">
.layout{
	padding: 10rpx 30rpx 0rpx;
	.section-title{
		text-align: left;
		font-size: 32rpx;
		color: skyblue;
		margin-top: 30rpx;
		margin-bottom: 10rpx;
		font-weight: bold;
	}
	.blue-tooth-list{
		width: 100%;
		margin-top: 10rpx;
		.blue-tooth{
			margin-top: 15rpx;
			background: #f1f1f1;
			height: 140rpx;
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			.blue-tooth-info{
				display: flex;
				flex-direction: column;
				.device-name{
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
				}
				.device-id{
					font-size: 22rpx;
					color: #999;
					margin-top: 4rpx;
				}
			}
			.blue-tooth-right{
				display: flex;
				align-items: center;
				.connected-mark{
					margin-right: 20rpx;
				}
			}
			&.connected-device{
				background: #e8f5e9;
				border: 2px solid #4cd964;
				.disconnect-btn{
					background: #ff6b6b;
					color: white;
					font-size: 26rpx;
					padding: 12rpx 28rpx;
					border-radius: 20rpx;
					border: none;
					line-height: 1;
				}
			}
		}
	}
	.no-blue-tooth{
		color: gray;
		margin-top: 15rpx;
		background: #f1f1f1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 140rpx;
		border-radius: 15rpx;
		font-size: 28rpx;
	}
	.serch-blue-tooth{
		text-align: center;
		border:1px solid #f8f8f8;
		background: #f8f8f8;
		width: 150rpx;
		height: 150rpx;
		border-radius: 20rpx;
		position: fixed;
		right: 30rpx;
		bottom: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		view{
			color: skyblue;
			font-size: 24rpx;
			margin-top: 8rpx;
		}
	}
}
</style>

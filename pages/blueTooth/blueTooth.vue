<template>
	<view class="layout">
		<view class="title" @click="getCharacteristicValue">已发现蓝牙设备</view>


		<view v-if="useBlueTooth.blueToothList.length" class="blue-tooth-list">
			<view class="blue-tooth" v-for="(item,index) in useBlueTooth.blueToothList" :key="item.deviceId"
				@click="useBlueTooth.connetBlue(item)">
				蓝牙设备{{index+1}}:{{item.deviceId}}
			</view>
		</view>
		<view v-else class="no-blue-tooth">暂无设备，请刷新列表</view>
		<view class="serch-blue-tooth" @click="useBlueTooth.searchBlueToothDervices()">
			<uni-icons type="loop" size="50" color="skyblue"></uni-icons>
			<view>查找</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import { onUnload } from '@dcloudio/uni-app'
	import { useBlueToothStore } from '@/stores/blueTooth';
	const useBlueTooth = useBlueToothStore()
	
	console.log(useBlueTooth.blueToothList);
	
	// 切换别的页面时触发
	onUnload(()=>{
		useBlueTooth.blueToothList = []
		// useBlueTooth.listenCharacteristicValueChange()
		uni.stopBluetoothDevicesDiscovery({
			success: function(res) {
				console.log('停止搜索蓝牙设备');
			}
		});
		console.log(1212);
	})
	
	// import {
	// 	reactive,
	// 	ref
	// } from 'vue';

	// 	const blueToothList = ref([])
	// 	// 当前连接的蓝夜的id
	// 	const connectedBlueToothDevice = ref("")
	// 	// 当前连接的蓝牙服务的uuid
	// 	const advertisServiceUUIDs = ref("")
	// 	// 当前蓝夜连接的特征值id 
	// 	const characteristicId = ref("")
	// 	// 当前蓝夜连接的写操作特征值id 
	// 	const writeCharacteristicId = ref("")
	// 	// 连接状态
	// 	const linkStatus = ref(false)
		
	// 	const deviceSet = new Set()
		
	// 	const clearDivceSet = ()=>{
	// 		console.log(2323);
	// 		deviceSet.clear()
	// 	}
		
	// 	const info = ref(null)
	
	// 	// 查找蓝牙设备
	// 	const searchBlueToothDervices = () => {
	// 		// 先对蓝夜列表清空
	// 		blueToothList.value = [];
	// 		deviceSet.clear()
	// 		// 1.初始化蓝牙模块
	// 		uni.openBluetoothAdapter({
	// 			success: (e) => {
	// 				console.log('============1.蓝牙初始化成功=============');
	// 				// 弹出提示框，提示搜索中
	// 				uni.showToast({
	// 					title: '蓝牙设备搜索中',
	// 					icon: 'loading'
	// 				})
	
	// 				// 2.开始搜索蓝牙设备
	// 				blueToothList.value = []
	// 				uni.startBluetoothDevicesDiscovery({
	// 					// powerLevel:'medium',
	// 					// allowDuplicatesKey:'false',
	// 					success: (e) => {
	// 						// 3.监听寻找到新设备就添加到设备列表
	// 						uni.onBluetoothDeviceFound((dev) => {
	// 							//如果列表中有这条数据就不再添加
	// 							if(!deviceSet.has( dev.devices[0].deviceId) &&  (dev.devices[0].deviceId.indexOf('D8')) != -1 || (dev.devices[0].deviceId.indexOf('D9')) != -1){
	// 								console.log(dev.devices[0]);
	// 								deviceSet.add(dev.devices[0].deviceId)
	// 								blueToothList.value.push(dev.devices[0])
	// 							}
	// 						})
	// 					},
	// 					fail: (e) => {
	// 						console.log('搜索设备失败', e);
	// 					}
	// 				})
	// 			},
	// 			fail: (e) => {
	// 				if (e.code === 10001) {
	// 					uni.showToast({
	// 						title: '请打开蓝牙',
	// 						icon: 'none'
	// 					})
	// 				} else {
	// 					uni.showToast({
	// 						title: '手机不支持蓝牙'
	// 					})
	// 				}
	// 			}
	// 		})
	// 	}
	// 	console.log(blueToothList);
	
	// 	// 连接蓝牙设备
	// 	const connetBlue = (device) => {
	// 		info.value = device;
	// 		uni.createBLEConnection({
	// 			deviceId: device.deviceId, // 设备id
	// 			success: function(res) {
	// 				uni.showToast({
	// 					title: '连接成功',
	// 					icon: 'none',
	// 					duration: 2000
	// 				});
	// 				uni.stopBluetoothDevicesDiscovery({
	// 					success: function(res) {
	// 						console.log('停止搜索蓝牙设备');
	// 					}
	// 				});
	// 				connectedBlueToothDevice.value = device.deviceId
	// 				console.log(connectedBlueToothDevice.value);
	// 				console.log(device.localName);
	// 				// that.deviceId = deviceId;
	// 				setTimeout(() => {
	// 					getServiceId()
	// 				}, 3000)
	// 			},
	// 			fail: function(err) {
	// 				uni.showToast({
	// 					title: '连接失败，请重试',
	// 					icon: 'none',
	// 					duration: 2000
	// 				});
	// 			}
	// 		});
	// 	}
	
	// 	// *********************************************************
	// 	// 蓝牙设备的服务uuid
	// 	const getServiceId = () => {
	// 		uni.getBLEDeviceServices({
	// 			deviceId: connectedBlueToothDevice.value,
	// 			success(res) {
	// 				// *******************************************
	// 				ifReadServices(res)
	// 				console.log("------->", res.services);
	// 				advertisServiceUUIDs.value = res.services[3].uuid
	// 				getCharacteristicId(); // 获取特征值
					
	// 			}
	// 		});
	// 	}
	// 	// 判断是否读取到服务列表，没读取到时，自动关闭连接重新连接蓝牙
	// 	const ifReadServices = (res)=>{
	// 		console.log("res.length = ", res.services.length);
	// 		if(res.services.length === 0){
	// 			console.log(22222222);
	// 			uni.closeBLEConnection({
	// 				deviceId: connectedBlueToothDevice.value,
	// 				success:(res)=>{
	// 					console.log("连接断开")
	// 					uni.showToast({
	// 						title: '连接异常，请重试',
	// 						duration: 1000,
	// 						icon:'error'
	// 					});
	// 				},
	// 				fail: (err) => {
	// 					console.log("错误错误");
	// 				}
	// 			})
				
	// 		}
	// 	}
	
	
	// 	//  // 开启nfc自动
	// 	// let openNfc = ["62","01","01"];
		
	// 	// // 关闭nfc自动
	// 	// let closeNfc = ["62","00","00"];
	// 	// *********************************************************
	// 	// 获取蓝牙设备的特征值id
	// 	const getCharacteristicId = () => {
	// 		uni.getBLEDeviceCharacteristics({
	// 			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
	// 			deviceId: connectedBlueToothDevice.value,
	// 			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
	// 			serviceId: advertisServiceUUIDs.value,
	// 			success: (res) => {
	// 				console.log("特征服务------------<", res.characteristics);
	// 				writeCharacteristicId.value = res.characteristics[0].uuid
	// 				characteristicId.value = res.characteristics[1].uuid
	// 				console.log("特征值id------------<", characteristicId.value);
	// 				listenCharacteristicValueChange();
					
	// 				setTimeout(() => {
	// 					// writeInfo()
	// 				}, 500)
					
	// 				// writeInfo()
	// 				// getCharacteristicValue()
	// 			}
	// 		})
	// 	}
	
	
	
	// 	// *********************************************************
	// 	// 启用低功耗蓝牙设备特征值变化时的 notify 功能，rfid
	// 	const listenCharacteristicValueChange = () => {
	// 		uni.notifyBLECharacteristicValueChange({
	// 			state: true, // 启用 notify 功能
	// 			deviceId: connectedBlueToothDevice.value,
	// 			serviceId: advertisServiceUUIDs.value,
	// 			// characteristicId:characteristicId.value,
	// 			characteristicId: characteristicId.value,
	// 			success(res) {
	// 				console.log("启用 notify 功能成功", res);
	// 				// listenChange()
	// 				// getCharacteristicValue()
	// 				uni.onBLECharacteristicValueChange((res) => {
	// 					// ArrayBuffer转16进度字符串示例
	// 					// getCharacteristicValue()
	// 					console.log("接收信息1：：：：：：", res.value);
	// 					const resHex = ab2hex(res.value)
	// 					console.log("接收信息11：：：：：：", resHex);
	// 					const x = parse_blue_response(resHex)
	// 					console.log("x="+x)
	// 					const y = array16_to_number(x)
	// 					console.log("y="+y)
	// 				})
	// 			}
	// 		})
	// 	}
	
	
	// 	// buffer 数据拼接
	// 	function arr2ab(arr) {
	// 		const buffer = new ArrayBuffer(arr.length);
	// 		const dataView = new DataView(buffer);
	// 		for (var i = 0; i < arr.length; i++) {
	// 			dataView.setUint8(i, arr[i]);
	// 		}
	// 		return buffer;
	// 	}
	
	
	
	// 	// 向蓝牙设备写数据
	// 	const writeInfo = () => {
	// 		// let v = ["14"];
	
	// 		let v = ["62","01","01"];
	// 		//转16进制
	// 		let list = v.map((v) => {
	// 			return parseInt(v, 16);
	// 		});
	// 		let buffer = arr2ab(list);
	// 		console.log(buffer);
	// 		setTimeout(()=>{
	// 			uni.writeBLECharacteristicValue({
	// 				deviceId: connectedBlueToothDevice.value,
	// 				serviceId: advertisServiceUUIDs.value,
	// 				characteristicId: writeCharacteristicId.value,
	// 				value: buffer,
	// 				success(res) {
	// 					console.log('writeBLECharacteristicValue success', res)
	// 				}
	// 			})
	// 		},1000)
	// 	}
	
	
	// 	// 取消低功耗蓝牙设备特征值变化时的 notify 功能
	// 	const concealListenCharacteristicValueChange = ()=>{
	// 		// 取消监听特征值变化
	// 		uni.stopBluetoothDeviceServiceNotification({
	// 			deviceId: connectedBlueToothDevice.value,
	// 			serviceId: advertisServiceUUIDs.value,
	// 			// characteristicId:characteristicId.value,
	// 			characteristicId: characteristicId.value,
	// 		  success: function () {
	// 		    console.log('取消监听成功');
	// 		  },
	// 		  fail: function (err) {
	// 		    console.error('取消监听失败', err);
	// 		  }
	// 		});
	// 	}
	
	
	
	// 	// 监听低功耗蓝牙连接状态的改变
	// 	uni.onBLEConnectionStateChange(function (res) {
	// 	  // 该方法回调中可以用于处理连接意外断开等异常情况
	// 	  // 判断蓝牙是否
	// 	  if(res.connected){
	// 		  linkStatus.value = true
	// 	  }else{
	// 		  linkStatus.value = false
	// 	  }
	// 	  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
	// 	})
	
	
	
	// // 	// 当监听到特征值变化时，读取标签数据
	// // 	const getCharacteristicValue = () => {
	// // 		uni.readBLECharacteristicValue({
	// // 			deviceId: connectedBlueToothDevice.value,
	// // 			serviceId: advertisServiceUUIDs.value,
	// // 			characteristicId: characteristicId.value,
	// // 			success: function(res) {
	// // 				// ArrayBuffer转16进度字符串示例
	// // 				function ab2hex(buffer) {
	// // 					const hexArr = Array.prototype.map.call(
	// // 						new Uint8Array(buffer),
	// // 						function(bit) {
	// // 							return ('00' + bit.toString(16)).slice(-2)
	// // 						}
	// // 					)
	// // 					return hexArr.join('')
	// // 				}
	// // 				// 处理读取到的数据 
	// // 				console.log('读取到的数据：', ab2hex(res.value));
	
	// // 			},
	// // 			fail: function(err) {
	// // 				console.log("读取数据出错", err);
	// // 			}
	// // 		})
	// // 	}
	
	// 	// ArrayBuffer 转 16 进制字符串示例
	// 	function ab2hex(buffer) {
	// 		const hexArr = Array.prototype.map.call(
	// 			new Uint8Array(buffer),
	// 			function(bit) {
	// 				return ('00' + bit.toString(16)).slice(-2)
	// 			}
	// 		)
	// 		return hexArr.join('')
	// 	}
	
	// 	// responseData 的值为第 7 点中的 resHex
	// 	function parse_blue_response(responseData) {
	// 		console.log(responseData)
	// 		const dataList = responseData.match(/.{1,2}/g)
	// 		const [resCode, resType, resResult] = dataList.splice(0, 3)
	// 		// resCode：响应包起始码；
	// 		// resType：响应包数据类型
	// 		// resResult：响应包结果
	// 		// dataList：其他响应数据 + 空数据，Array 格式数据
	// 		return [resCode, resType, String(resResult), dataList]
	// 	}
	
	// 	function array16_to_number(arrayValue) {
	// 		const newArray = arrayValue.filter(item => String(item) !== '00' || String(item) !== '0')
	// 		const _number16 = newArray.map(hex => parseInt(hex, 16).toString(16)).join('')
	// 		return parseInt(`0x${_number16}`)
	// 	}
</script>

<style lang="scss">
	.layout {
		padding: 10rpx 30rpx 0rpx;

		.title {
			text-align: center;
			font-size: 40rpx;
			color: skyblue;
		}

		.blue-tooth-list {
			width: 100%;
			margin-top: 20rpx;

			.blue-tooth {
				margin-top: 20rpx;
				background: #f1f1f1;
				height: 150rpx;
				border-radius: 15rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.no-blue-tooth {
			color: gray;
			margin-top: 20rpx;
			background: #f1f1f1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 150rpx;
			border-radius: 15rpx;
		}

		.serch-blue-tooth {
			// display: ;
			text-align: center;
			border: 1px solid #f8f8f8;
			background: #f8f8f8;
			width: 150rpx;
			height: 150rpx;
			border-radius: 20rpx;
			position: fixed;
			right: 30rpx;
			bottom: 200rpx;

			view {
				color: skyblue;
			}
		}
	}
</style>
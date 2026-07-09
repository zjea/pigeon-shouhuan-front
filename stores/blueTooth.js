import { ref } from 'vue';
import { defineStore } from 'pinia';
import { watchConnect, getWatchVersion, watchBattery, onGetLabelId } from '@/uni_modules/lyj-watch';

export const useBlueToothStore = defineStore('blueTooth', () => {

	// 蓝牙是否初始化成功
	const isInit = ref(false)

	const blueToothList = ref([])
	// 当前连接的蓝夜的id
	const connectedBlueToothDevice = ref("")
	// 当前连接的蓝牙服务的uuid
	const advertisServiceUUIDs = ref("")
	// 当前蓝夜连接的特征值id 
	const characteristicId = ref("")
	// 当前蓝夜连接的写操作特征值id 
	const writeCharacteristicId = ref("")
	// 连接状态
	const linkStatus = ref(false)
	
	// 设置连接状态
	const setLinkStatusFalse = (data)=>{
		linkStatus.value = false;
	}
	
	// 设备电量
	const quantityOfElectricity = ref(-1)
	// 读取的nfc数据
	const nfcData = ref(null)
	

	
	// 过度用,用于区别读取的nfc数据是否重复
	const nfcDataList  = ref([])
	
	const deviceSet = new Set()
		
	// 设置读取的nfc数据
	const setNfcData = (data)=>{
		nfcData.value = data;
	}
	
	// 移除读取的nfc数据
	const removeNfcData = ()=>{
		nfcData.value = null;
	}
	


		
	// 查找蓝牙设备
	const searchBlueToothDervices = () => {
		// 先对蓝夜列表清空
		blueToothList.value = [];
		deviceSet.clear()
		
		// 未初始化
		if(!isInit.value){
			// 1.初始化蓝牙模块
			uni.openBluetoothAdapter({
				success: (e) => {
					console.log('============1.蓝牙初始化成功=============');
					
					isInit.value = true
					
					// 弹出提示框，提示搜索中
					uni.showToast({
						title: '蓝牙设备搜索中',
						icon: 'loading'
					})
			
					// 2.开始搜索蓝牙设备
					blueToothList.value = []
					uni.startBluetoothDevicesDiscovery({
						// powerLevel:'medium',
						// allowDuplicatesKey:'false',
						success: (e) => {
							// 3.监听寻找到新设备就添加到设备列表
							uni.onBluetoothDeviceFound((dev) => {
								//如果列表中有这条数据就不再添加
								if(!deviceSet.has( dev.devices[0].deviceId) &&  (dev.devices[0].deviceId.indexOf('B6') != -1 || dev.devices[0].deviceId.indexOf('D9') != -1)){
									console.log(dev.devices[0]);
									deviceSet.add(dev.devices[0].deviceId)
									blueToothList.value.push(dev.devices[0])
								}
							})
						},
						fail: (e) => {
							console.log('搜索设备失败', e);
						}
					})
			
				},
				fail: (e) => {
					if (e.code === 10001) {
						uni.showToast({
							title: '请打开蓝牙',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '手机不支持蓝牙'
						})
					}
				}
			})
		}else{
			// 初始化了，只进行蓝牙查找
			
			// 弹出提示框，提示搜索中
			uni.showToast({
				title: '蓝牙设备搜索中',
				icon: 'loading'
			})
			blueToothList.value = []
			// 若app进行多次搜索蓝牙设备需要先执行关闭搜索
			uni.stopBluetoothDevicesDiscovery({
			  success(res) {
			    console.log("停止搜索设备")
			  }
			})
			
			
			
			// 2.开始搜索蓝牙设备
			
			uni.startBluetoothDevicesDiscovery({
				// powerLevel:'medium',
				// allowDuplicatesKey:'false',
				success: (e) => {
					// 3.监听寻找到新设备就添加到设备列表
					uni.onBluetoothDeviceFound((dev) => {
						//如果列表中有这条数据就不再添加
						if(!deviceSet.has( dev.devices[0].deviceId) &&  (dev.devices[0].deviceId.indexOf('B6') != -1 || dev.devices[0].deviceId.indexOf('D9') != -1)){
							console.log(dev.devices[0]);
							deviceSet.add(dev.devices[0].deviceId)
							blueToothList.value.push(dev.devices[0])
						}
					})
				},
				fail: (e) => {
					console.log('搜索设备失败', e);
				}
			})
		}
		

	}

	// 连接蓝牙设备
	const connetBlue = (device) => {
		// console.log(blueToothList.value);
		console.log(device.deviceId);

		// sdk接口连接蓝牙
		const b = watchConnect(device.deviceId);
		connectedBlueToothDevice.value = device.deviceId
		console.log("是否连接成功："+b);
		uni.showToast({
			title: '连接中',
			icon: 'loading',
			duration: 2000
		});
		setTimeout(()=>{
			if(b){
				uni.showToast({
					title: '连接成功',
					icon: 'success',
					duration: 2000
				});
				
				// 提示蓝牙连接成功语音
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = '../../static/audio/linkBlueTooth.wav';
				innerAudioContext.onPlay(() => {
				  console.log('开始播放《蓝牙连接成功》语音...');
				});
				
				// 设置蓝牙连接状态为true
				linkStatus.value = true;
				
				// 获取手环当前电量
				let battery = watchBattery();
				quantityOfElectricity.value = battery;
				console.log("手环当前电量："+battery);
				
				// // 获取手环固件信息
				// const watchInfo = getWatchVersion();
				// console.log("手环固件信息："+watchInfo);
				
				
			}else{
				uni.showToast({
					title: '连接失败，请重试',
					icon: 'none',
					duration: 2000
				});
			}
		}, 2000);
		
		
	}


	// *********************************************************
	// 启用低功耗蓝牙设备特征值变化时的 notify 功能，rfid
	const listenCharacteristicValueChange = () => {
		var redNfc = null;
		
		// 使用sdk提供的接口来识别标签
		
		onGetLabelId(function(label){
			redNfc = label;
			if(label == nfcData.value){
				// uni.showToast({
				// 	title:"请勿重复操作",
				// 	icon:"error"
				// })
				// nfcData.value = null;
				return
			}
			nfcData.value = redNfc;
			
			// setTimeout(()=>{
			// 	nfcData.value = ""
			// },2000)

		});
		
		console.log("nfcData.value:"+nfcData.value);
		// 这部分用于产蛋和抽蛋

		
		// 这部分用于照蛋和加仔
		nfcDataList.value.push(redNfc);
		return redNfc;
	}



	
	// // 断开蓝牙设备连接
	// const closeConnectDevice = ()=>{
	// 	uni.closeBLEConnection({
	// 		deviceId: connectedBlueToothDevice.value,
	// 		success(res){
	// 			console.log("蓝牙已断开");
	// 		}
	// 	})

	// }

	
	return{
		setNfcData,
		removeNfcData,
		setLinkStatusFalse,
		searchBlueToothDervices,
		connetBlue,
		blueToothList,
		connectedBlueToothDevice,
		advertisServiceUUIDs,
		characteristicId,
		writeCharacteristicId,
		listenCharacteristicValueChange,
		// writeInfo,
		linkStatus,
		quantityOfElectricity,
		// closeConnectDevice,
		nfcData,
		nfcDataList
	};
})
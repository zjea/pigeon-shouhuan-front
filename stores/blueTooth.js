import { ref } from 'vue';
import { defineStore } from 'pinia';
import { watchConnect, getWatchVersion, watchBattery, onGetLabelId, closeGetLabelId, getLabelValue } from '@/uni_modules/lyj-watch';

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
	
	const autoReconnectTimer = ref(null)
	
	const saveConnectedDevice = (device) => {
		try {
			const deviceStr = JSON.stringify(device)
			console.log('保存设备信息:', deviceStr)
			uni.setStorageSync('lastConnectedDevice', deviceStr)
			console.log('保存连接设备成功:', device.deviceId)
		} catch (e) {
			console.error('保存连接设备失败:', e)
		}
	}
	
	const getLastConnectedDevice = () => {
		try {
			const deviceStr = uni.getStorageSync('lastConnectedDevice')
			console.log('读取保存的设备信息:', deviceStr)
			return deviceStr ? JSON.parse(deviceStr) : null
		} catch (e) {
			console.error('获取上次连接设备失败:', e)
			return null
		}
	}
	
	const autoReconnect = () => {
		const lastDevice = getLastConnectedDevice()
		console.log('自动重连检查 - 保存的设备:', lastDevice ? lastDevice.deviceId : '无')
		console.log('自动重连检查 - 当前连接状态:', linkStatus.value)
		
		if (!lastDevice || !lastDevice.deviceId) {
			console.log('自动重连失败：没有保存的连接设备')
			return
		}
		
		if (linkStatus.value) {
			console.log('自动重连跳过：蓝牙已连接')
			return
		}
		
		console.log('开始自动重连流程，目标设备:', lastDevice.deviceId)
		
		if (!isInit.value) {
			console.log('自动重连：需要初始化蓝牙适配器')
			uni.openBluetoothAdapter({
				success: (e) => {
					console.log('自动重连：蓝牙初始化成功')
					isInit.value = true
					setTimeout(() => {
						_doAutoReconnect(lastDevice)
					}, 500)
				},
				fail: (e) => {
					console.error('自动重连：蓝牙初始化失败:', e)
				}
			})
		} else {
			console.log('自动重连：蓝牙适配器已初始化')
			_doAutoReconnect(lastDevice)
		}
	}
	
	const _doAutoReconnect = (device) => {
		console.log('执行自动重连，设备ID:', device.deviceId)
		
		const b = watchConnect(device.deviceId)
		console.log('watchConnect返回:', b)
		
		connectedBlueToothDevice.value = device.deviceId
		
		setTimeout(() => {
			if (b) {
				console.log('自动重连成功！')
				linkStatus.value = true
				
				try {
					let battery = watchBattery()
					quantityOfElectricity.value = battery
					console.log('手环当前电量：', battery)
				} catch (e) {
					console.error('获取电量失败:', e)
				}
				
				uni.showToast({
					title: '蓝牙已自动连接',
					icon: 'success',
					duration: 2000
				})
				
				try {
					const innerAudioContext = uni.createInnerAudioContext()
					innerAudioContext.autoplay = true
					innerAudioContext.src = '../../static/audio/linkBlueTooth.wav'
					innerAudioContext.onPlay(() => {
						console.log('开始播放《蓝牙连接成功》语音...')
					})
				} catch (e) {
					console.error('播放语音失败:', e)
				}
			} else {
				console.log('自动重连失败，尝试扫描后重连...')
				_doAutoReconnectWithScan(device)
			}
		}, 2500)
	}
	
	const _doAutoReconnectWithScan = (device) => {
		console.log('扫描设备并重连...')
		
		let foundDevice = false
		
		uni.startBluetoothDevicesDiscovery({
			success: () => {
				console.log('开始扫描设备...')
				
				const discoveryHandler = (res) => {
					const devices = res.devices || []
					console.log('发现设备数量:', devices.length)
					
					for (let d of devices) {
						if (d.deviceId === device.deviceId) {
							console.log('发现目标设备，尝试连接...')
							foundDevice = true
							uni.offBluetoothDeviceFound(discoveryHandler)
							uni.stopBluetoothDevicesDiscovery()
							
							const b = watchConnect(device.deviceId)
							console.log('扫描后连接结果:', b)
							
							setTimeout(() => {
								if (b) {
									console.log('扫描后重连成功！')
									linkStatus.value = true
									
									try {
										let battery = watchBattery()
										quantityOfElectricity.value = battery
									} catch (e) {
										console.error('获取电量失败:', e)
									}
									
									uni.showToast({
										title: '蓝牙已自动连接',
										icon: 'success',
										duration: 2000
									})
								} else {
									console.log('扫描后连接仍失败')
								}
							}, 2500)
							return
						}
					}
				}
				
				uni.onBluetoothDeviceFound(discoveryHandler)
				
				setTimeout(() => {
					if (!foundDevice) {
						uni.offBluetoothDeviceFound(discoveryHandler)
						uni.stopBluetoothDevicesDiscovery()
						console.log('扫描超时，未发现目标设备')
					}
				}, 5000)
			},
			fail: (e) => {
				console.error('扫描设备失败:', e)
			}
		})
	}
	
	const checkConnectionStatus = () => {
		if (!connectedBlueToothDevice.value) {
			return
		}
		
		uni.getBLEDeviceConnectionState({
			deviceId: connectedBlueToothDevice.value,
			success: (res) => {
				if (res.connected) {
					linkStatus.value = true
					console.log('蓝牙连接状态正常')
				} else {
					linkStatus.value = false
					console.log('蓝牙已断开连接')
				}
			},
			fail: (err) => {
				console.error('检查连接状态失败:', err)
				linkStatus.value = false
			}
		})
	}
	
	const addLastConnectedDeviceToList = () => {
		const lastDevice = getLastConnectedDevice()
		if (!lastDevice || !lastDevice.deviceId) {
			return
		}
		
		const exists = blueToothList.value.some(item => item.deviceId === lastDevice.deviceId)
		if (!exists) {
			blueToothList.value.push(lastDevice)
			deviceSet.add(lastDevice.deviceId)
			console.log('已添加上次连接的设备到列表:', lastDevice.deviceId)
		}
	}
	
	// 设备电量
	const quantityOfElectricity = ref(-1)
	// 读取的nfc数据
	const nfcData = ref(null)
	

	
	// 过度用,用于区别读取的nfc数据是否重复
	const nfcDataList  = ref([])
	
	const deviceSet = new Set()
	
	const isListening = ref(false)
	
	const lastNfcData = ref(null)
	
	const lastNfcTime = ref(0)
		
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
							
							setTimeout(() => {
								uni.stopBluetoothDevicesDiscovery({
									success(res) {
										console.log("停止搜索设备")
									}
								})
								addLastConnectedDeviceToList()
							}, 3000)
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
					
					setTimeout(() => {
						uni.stopBluetoothDevicesDiscovery({
							success(res) {
								console.log("停止搜索设备")
							}
						})
						addLastConnectedDeviceToList()
					}, 3000)
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
				
				// 保存连接的设备，用于下次自动重连
				saveConnectedDevice(device);
				
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


	let pollTimer = null
	
	const listenCharacteristicValueChange = () => {
		if (isListening.value) {
			return
		}
		isListening.value = true
		
		onGetLabelId(function(){});
		
		pollTimer = setInterval(() => {
			try{
				const label = getLabelValue()
				if (!label || typeof label !== 'string' || label.trim() === '') {
					return
				}
				
				if (label === lastNfcData.value) {
					return
				}
				
				lastNfcData.value = label
				nfcData.value = label
				
				if (nfcDataList.value && Array.isArray(nfcDataList.value)) {
					if (nfcDataList.value.length > 50) {
						nfcDataList.value = nfcDataList.value.slice(-20)
					}
					nfcDataList.value.push(label)
				}
			}catch(e){
				console.error("RFID轮询异常:", e)
			}
		}, 500);
		
		console.log("RFID监听已开启（轮询方式）");
	}
	
	const stopListenCharacteristicValueChange = () => {
		closeGetLabelId()
		isListening.value = false
		if (pollTimer) {
			clearInterval(pollTimer)
			pollTimer = null
		}
		lastNfcData.value = null
		nfcData.value = null
		console.log("RFID监听已关闭");
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
		stopListenCharacteristicValueChange,
		// writeInfo,
		linkStatus,
		quantityOfElectricity,
		// closeConnectDevice,
		nfcData,
		nfcDataList,
		autoReconnect,
		checkConnectionStatus,
		getLastConnectedDevice,
		addLastConnectedDeviceToList
	};
})
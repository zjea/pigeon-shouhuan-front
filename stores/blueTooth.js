import { ref } from 'vue';
import { defineStore } from 'pinia';
import { watchConnect, getWatchVersion, watchBattery, onGetLabelId, closeGetLabelId, getLabelValue, watchDisconnect } from '@/uni_modules/lyj-watch';

export const useBlueToothStore = defineStore('blueTooth', () => {

	const isInit = ref(false)

	const blueToothList = ref([])
	const connectedBlueToothDevice = ref("")
	const advertisServiceUUIDs = ref("")
	const characteristicId = ref("")
	const writeCharacteristicId = ref("")
	const linkStatus = ref(false)
	
	const setLinkStatusFalse = (data)=>{
		linkStatus.value = false;
	}
	
	const autoReconnectTimer = ref(null)
	
	const saveConnectedDevice = (device) => {
		try {
			const existing = getConnectedDevices()
			const found = existing.find(d => d.deviceId === device.deviceId)
			if (!found) {
				existing.push(device)
			}
			const deviceStr = JSON.stringify(existing)
			console.log('保存设备信息:', deviceStr)
			uni.setStorageSync('connectedDevices', deviceStr)
			console.log('保存连接设备成功:', device.deviceId)
		} catch (e) {
			console.error('保存连接设备失败:', e)
		}
	}
	
	const getConnectedDevices = () => {
		try {
			const deviceStr = uni.getStorageSync('connectedDevices')
			if (deviceStr) {
				return JSON.parse(deviceStr)
			}
			const oldDeviceStr = uni.getStorageSync('lastConnectedDevice')
			if (oldDeviceStr) {
				const oldDevice = JSON.parse(oldDeviceStr)
				uni.setStorageSync('connectedDevices', JSON.stringify([oldDevice]))
				return [oldDevice]
			}
			return []
		} catch (e) {
			console.error('获取连接设备列表失败:', e)
			return []
		}
	}
	
	const getLastConnectedDevice = () => {
		const devices = getConnectedDevices()
		return devices.length > 0 ? devices[devices.length - 1] : null
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
		
		if (isAutoReconnecting.value) {
			console.log('自动重连跳过：正在重连中')
			return
		}
		
		isAutoReconnecting.value = true
		console.log('开始自动重连流程，目标设备:', lastDevice.deviceId)
		
		if (!isInit.value) {
			console.log('自动重连：需要初始化蓝牙适配器')
			uni.openBluetoothAdapter({
				success: (e) => {
					console.log('自动重连：蓝牙初始化成功')
					isInit.value = true
					setTimeout(() => {
						_scanAndReconnect(lastDevice)
					}, 500)
				},
				fail: (e) => {
					console.error('自动重连：蓝牙初始化失败:', e)
					isAutoReconnecting.value = false
				}
			})
		} else {
			console.log('自动重连：蓝牙适配器已初始化')
			_scanAndReconnect(lastDevice)
		}
	}
	
	const _scanAndReconnect = (device) => {
		console.log('开始扫描设备确认手环是否开机...')
		
		let foundDevice = false
		let stopped = false
		
		const stopDiscovery = () => {
			if (stopped) return
			stopped = true
			try {
				uni.stopBluetoothDevicesDiscovery()
			} catch (e) {
				console.error('停止扫描失败:', e)
			}
		}
		
		uni.startBluetoothDevicesDiscovery({
			success: () => {
				console.log('扫描启动成功，等待发现设备...')
				
				const discoveryHandler = (res) => {
					if (foundDevice) return
					const devices = res.devices || []
					
					for (let d of devices) {
						if (d.deviceId === device.deviceId) {
							console.log('发现目标设备，手环已开机！尝试连接...', d.deviceId)
							foundDevice = true
							stopDiscovery()
							
							const b = watchConnect(device.deviceId)
							console.log('watchConnect调用返回:', b)
							
							setTimeout(() => {
								if (b) {
									console.log('自动重连完成，标记连接状态')
									connectedBlueToothDevice.value = device.deviceId
									linkStatus.value = true
									isAutoReconnecting.value = false
									
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
									console.log('watchConnect返回false，连接失败')
									linkStatus.value = false
									connectedBlueToothDevice.value = ''
									isAutoReconnecting.value = false
									uni.showToast({
										title: '手环连接失败，请手动连接',
										icon: 'none',
										duration: 2000
									})
								}
							}, 2000)
							return
						}
					}
				}
				
				uni.onBluetoothDeviceFound(discoveryHandler)
				
				setTimeout(() => {
					if (!foundDevice) {
						stopDiscovery()
						isAutoReconnecting.value = false
						console.log('扫描超时，未发现目标设备')
						uni.showToast({
							title: '手环未开机，无法自动连接',
							icon: 'none',
							duration: 2000
						})
					}
				}, 5000)
			},
			fail: (e) => {
				console.error('扫描启动失败:', e)
				isAutoReconnecting.value = false
			}
		})
	}
	
	const isAutoReconnecting = ref(false)
	
	const checkConnectionStatus = () => {
		if (connectedBlueToothDevice.value) {
			try {
				const result = watchConnect(connectedBlueToothDevice.value)
				if (result) {
					linkStatus.value = true
				}
			} catch (e) {
				console.error('检查连接状态失败:', e)
			}
		}
	}
	
	const addLastConnectedDeviceToList = () => {
		const lastDevice = getLastConnectedDevice()
		if (lastDevice && !blueToothList.value.find(d => d.deviceId === lastDevice.deviceId)) {
			blueToothList.value.push(lastDevice)
		}
	}
	
	const deviceSet = new Set()
	const isScanning = ref(false)
	
	const searchBlueToothDervices = () => {
		if (isScanning.value) {
			console.log('正在搜索中，请稍后')
			return
		}
		isScanning.value = true
		
		blueToothList.value = []
		deviceSet.clear()
		
		if (linkStatus.value && connectedBlueToothDevice.value) {
			const lastDevice = getLastConnectedDevice()
			if (lastDevice && lastDevice.deviceId === connectedBlueToothDevice.value) {
				blueToothList.value.push(lastDevice)
				deviceSet.add(lastDevice.deviceId)
			}
		}
		
		if(!isInit.value){
			uni.openBluetoothAdapter({
				success: (e) => {
					console.log('============1.蓝牙初始化成功=============');
					isInit.value = true
					
					uni.showToast({
						title: '蓝牙设备搜索中',
						icon: 'loading'
					})
			
					blueToothList.value = []
					uni.startBluetoothDevicesDiscovery({
						success: (e) => {
							const discoveryHandler = (dev) => {
								if(!deviceSet.has( dev.devices[0].deviceId)){
									console.log(dev.devices[0]);
									deviceSet.add(dev.devices[0].deviceId)
									blueToothList.value.push(dev.devices[0])
								}
							}
							
							uni.onBluetoothDeviceFound(discoveryHandler)
							
							setTimeout(() => {
								uni.stopBluetoothDevicesDiscovery({
									success(res) {
										console.log("停止搜索设备")
									}
								})
								addLastConnectedDeviceToList()
								isScanning.value = false
							}, 3000)
						},
						fail: (e) => {
							console.log('搜索设备失败', e);
							isScanning.value = false
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
					isScanning.value = false
				}
			})
		}else{
			uni.showToast({
				title: '蓝牙设备搜索中',
				icon: 'loading'
			})
			
			uni.stopBluetoothDevicesDiscovery({
			  success(res) {
			    console.log("停止搜索设备")
			  }
			})
			
			uni.startBluetoothDevicesDiscovery({
				success: (e) => {
					const discoveryHandler = (dev) => {
						if(!deviceSet.has( dev.devices[0].deviceId)){
							console.log(dev.devices[0]);
							deviceSet.add(dev.devices[0].deviceId)
							blueToothList.value.push(dev.devices[0])
						}
					}
					
					uni.onBluetoothDeviceFound(discoveryHandler)
					
					setTimeout(() => {
						uni.stopBluetoothDevicesDiscovery({
							success(res) {
								console.log("停止搜索设备")
							}
						})
						addLastConnectedDeviceToList()
						isScanning.value = false
					}, 3000)
				},
				fail: (e) => {
					console.log('搜索设备失败', e);
					isScanning.value = false
				}
			})
		}
	}
	
	const connetBlue = (device) => {
		console.log(device.deviceId);
		
		if (linkStatus.value && connectedBlueToothDevice.value === device.deviceId) {
			console.log('断开蓝牙连接:', device.deviceId)
			
			try {
				watchDisconnect()
			} catch (e) {
				console.error('调用断开连接失败:', e)
			}
			
			linkStatus.value = false
			connectedBlueToothDevice.value = ''
			quantityOfElectricity.value = -1
			
			uni.showToast({
				title: '已断开连接',
				icon: 'none',
				duration: 2000
			})
			
			return
		}
		
		if (linkStatus.value && connectedBlueToothDevice.value !== device.deviceId) {
			console.log('切换设备，先断开当前连接:', connectedBlueToothDevice.value)
			
			try {
				watchDisconnect()
			} catch (e) {
				console.error('调用断开连接失败:', e)
			}
			
			linkStatus.value = false
			connectedBlueToothDevice.value = ''
			quantityOfElectricity.value = -1
		}
		
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
				
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = '../../static/audio/linkBlueTooth.wav';
				innerAudioContext.onPlay(() => {
				  console.log('开始播放《蓝牙连接成功》语音...');
				});
				
				linkStatus.value = true;
				
				if (!blueToothList.value.find(d => d.deviceId === device.deviceId)) {
					blueToothList.value.push(device)
				}
				
				let battery = watchBattery();
				quantityOfElectricity.value = battery;
				console.log("手环当前电量："+battery);
				
				saveConnectedDevice(device);
				
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
	let lastReadTime = 0
	let lastNfcData = ref('')
	
	const nfcData = ref("")
	
	const nfcDataList = ref([])
	
	const listenCharacteristicValueChange = () => {
		onGetLabelId(function(){});
		pollTimer = setInterval(() => {
			const now = Date.now()
			if (now - lastReadTime < 800) {
				return
			}
			try {
				const label = getLabelValue()
				if (label && label !== lastNfcData.value) {
					lastReadTime = now
					lastNfcData.value = label
					nfcData.value = label
				}
			} catch (e) {
				console.error('读取标签值失败:', e)
			}
		}, 500);
	}
	
	const stopListenCharacteristicValueChange = () => {
		if (pollTimer) {
			clearInterval(pollTimer)
			pollTimer = null
		}
		try {
			closeGetLabelId()
		} catch (e) {
			console.error('关闭标签监听失败:', e)
		}
		lastNfcData.value = ''
		nfcData.value = ''
	}
	
	const removeNfcData = () => {
		nfcData.value = ''
		lastNfcData.value = ''
	}
	
	const getCharacteristicValue = () => {
		return nfcData.value
	}
	
	const quantityOfElectricity = ref(-1)
	
	return {
		blueToothList,
		connectedBlueToothDevice,
		advertisServiceUUIDs,
		characteristicId,
		writeCharacteristicId,
		linkStatus,
		setLinkStatusFalse,
		nfcData,
		nfcDataList,
		autoReconnect,
		checkConnectionStatus,
		getLastConnectedDevice,
		getConnectedDevices,
		addLastConnectedDeviceToList,
		searchBlueToothDervices,
		connetBlue,
		listenCharacteristicValueChange,
		stopListenCharacteristicValueChange,
		getCharacteristicValue,
		removeNfcData,
		isAutoReconnecting,
		quantityOfElectricity
	};
})

<template>
	<view class="layout">
		<view class="title" @click="getCharacteristicValue">已发现蓝牙设备</view>
		
		
		<view v-if="blueToothList.length" class="blue-tooth-list">
			<view class="blue-tooth" v-for="(item,index) in blueToothList" :key="item.deviceId" @click="connetBlue(item)">
				蓝牙设备{{index+1}}:{{item.deviceId}}
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
// 当前连接的蓝夜的id
const connectedBlueToothDevice = ref("")
// 当前连接的蓝牙服务的uuid
const advertisServiceUUIDs = ref("")
// 当前蓝夜连接的特征值id 
const characteristicId = ref("")
// 当前蓝夜连接的写操作特征值id 
const writeCharacteristicId = ref("")



// 查找蓝牙设备
const searchBlueToothDervices = ()=>{
	// 先对蓝夜列表清空
	blueToothList.value = [];
	// 1.初始化蓝牙模块
	uni.openBluetoothAdapter({
		success: (e) => {
			console.log('============1.蓝牙初始化成功=============');
				// 弹出提示框，提示搜索中
				uni.showToast({
					title: '蓝牙设备搜索中',
					icon:'loading'
				})
				
				// 2.开始搜索蓝牙设备
				uni.startBluetoothDevicesDiscovery({
					// powerLevel:'medium',
					// allowDuplicatesKey:'false',
					success: (e) => {
						// 3.监听寻找到新设备就添加到设备列表
						uni.onBluetoothDeviceFound((dev)=>{
							console.log(dev.devices[0]);
							//如果列表中有这条数据就不再添加
							const isHave = blueToothList.value.filter(item => item.deviceId == dev.devices[0].deviceId)
							if(isHave.length > 0) return;
							blueToothList.value.push(dev.devices[0])
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
console.log(blueToothList);

// 连接蓝牙设备
const connetBlue= (device)=>{
  uni.createBLEConnection({
    deviceId: device.deviceId, // 设备id
    success: function(res) {
      uni.showToast({
        title: '连接成功',
        icon: 'none',
        duration: 2000
      });
      uni.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log('停止搜索蓝牙设备');
        }
      });
	  connectedBlueToothDevice.value = device.deviceId
	  console.log(connectedBlueToothDevice.value);
	  console.log(device.localName);
      // that.deviceId = deviceId;
	  setTimeout(()=>{
		  getServiceId()
	  },2000)
    },
    fail: function(err) {
      uni.showToast({
        title: '连接失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  });
}

// *********************************************************
// 蓝牙设备的服务uuid
const getServiceId = ()=>{
  uni.getBLEDeviceServices({
    deviceId: connectedBlueToothDevice.value,
    success(res) {
		console.log("------->",res.services);
		advertisServiceUUIDs.value = res.services[3].uuid
      // that.serviceId = res.services[0].uuid; // 假设取第一个服务的UUID
      getCharacteristicId(); // 获取特征值
    }
  });
}

// *********************************************************
// 获取蓝牙设备的特征值id
const getCharacteristicId = ()=>{
	uni.getBLEDeviceCharacteristics({
		// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
		deviceId:connectedBlueToothDevice.value,
		// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
		serviceId:advertisServiceUUIDs.value,
		success: (res) => {
			console.log("------------<",res.characteristics);
			writeCharacteristicId.value = res.characteristics[0].uuid
			characteristicId.value = res.characteristics[1].uuid
			console.log("特征值id------------<",characteristicId.value);
			setTimeout(()=>{
				listenCharacteristicValueChange();
			},500)
			writeInfo()
			// getCharacteristicValue()
		}
	})	
}


function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
	new Uint8Array(buffer),
	function (bit) {
	  return ('00' + bit.toString(16)).slice(-2)
	}
  )
  return hexArr.join('')
}	

// *********************************************************
// 启用低功耗蓝牙设备特征值变化时的 notify 功能，rfid
const listenCharacteristicValueChange = ()=>{
	uni.notifyBLECharacteristicValueChange({
		state: true, // 启用 notify 功能
		deviceId:connectedBlueToothDevice.value,
		serviceId:advertisServiceUUIDs.value,
		// characteristicId:characteristicId.value,
		characteristicId:characteristicId.value,-
		success(res) {
			console.log("启用 notify 功能成功",res);
			// listenChange()
			// getCharacteristicValue()
			uni.onBLECharacteristicValueChange((res)=>{
				// ArrayBuffer转16进度字符串示例
				// getCharacteristicValue()
				console.log("接收信息1：：：：：：",res.value);
				console.log("接收信息11：：：：：：",ab2hex(res.value));
			})
		}
	})
}

// 
// const listenChange = ()=>{
// 	uni.onBLECharacteristicValueChange((res)=>{
// 		// ArrayBuffer转16进度字符串示例
// 		// getCharacteristicValue()
// 		console.log("接收信息1：：：：：：",res.value);
// 		console.log("接收信息11：：：：：：",ab2hex(res.value));
// 	})
// 	getCharacteristicValue()
// }

    // buffer 数据拼接
    function arr2ab(arr) {
      const buffer = new ArrayBuffer(arr.length);
      const dataView = new DataView(buffer);
      for (var i = 0; i < arr.length; i++) {
        dataView.setUint8(i, arr[i]);
      }
      return buffer;
	}

// 向蓝牙设备写数据
const writeInfo = ()=>{
	// 向蓝牙设备发送一个0x00的16进制数据
	// const command = new Uint8Array(3);
	// command[0] = 0x62; // 命令标识
	// command[1] = 0x01; // 自动读卡功能
	// command[2] = 0x01; // 卡片信息上传功能
	// console.log(command);
	
	// let v = ["62", "00", "01"];
	// //转16进制
	// let list = v.map((v) => {
	// 	return parseInt(v, 16);
	// });
	// let buffer = arr2ab(list);
	// console.log(buffer);
	
	// 构造命令数据，例如开启NFC自动读卡和卡片信息上传
	let commandData = new Uint8Array([0x62, 0x01, 0x01]);
	console.log(commandData.buffer);
	uni.writeBLECharacteristicValue({
		deviceId:connectedBlueToothDevice.value,
		serviceId:advertisServiceUUIDs.value,
		characteristicId:writeCharacteristicId.value,
		value: commandData.buffer,
			success(res) {
			console.log('writeBLECharacteristicValue success', res)
		}
	})
}

// 当监听到特征值变化时，读取标签数据
const getCharacteristicValue = ()=>{
	uni.readBLECharacteristicValue({
		deviceId:connectedBlueToothDevice.value,
		serviceId:advertisServiceUUIDs.value,
		characteristicId:characteristicId.value,
		success: function(res) {
			// ArrayBuffer转16进度字符串示例
			function ab2hex(buffer) {
			  const hexArr = Array.prototype.map.call(
			    new Uint8Array(buffer),
			    function (bit) {
			      return ('00' + bit.toString(16)).slice(-2)
			    }
			  )
			  return hexArr.join('')
			}	
			// 处理读取到的数据 
			console.log('读取到的数据：',ab2hex(res.value));
			
		},
		fail: function(err){
			console.log("读取数据出错",err);
		}
	})
}

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

<template>
	<view class="layout">
		<view class="search">
			<uni-search-bar :radius="100" @confirm="search" @cancel="cancel" @focus="focus" placeholder="请输入鸽棚"></uni-search-bar>
		</view>
		<view class="card">
			
			<!-- 1号6笼模式 -->
			<uni-table border :stripe="false" v-if="useShed.cageMode === 0" >
				<!-- 表头行 -->
				<uni-tr>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item in cageList" :key="item.id" @click="selectedCage(item.id)">
					<uni-td align="center" width="200" style="font-size: 40rpx;">{{item.number}}{{commUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
					<uni-td>
						<button type="primary" v-if="item.panelCode" @click="unbind(item.id)">解除绑定</button>
						<button type="warn" v-else @click="startBind(item.id)">鸽笼未绑定</button>
					</uni-td>
				</uni-tr>
			</uni-table>
			
			<!-- 1号3笼模式 -->
			<uni-table border :stripe="false" v-else>
				<!-- 表头行 -->
				<uni-tr>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item in cageList" :key="item.id" @click="selectedCage(item.id)">
					<uni-td align="center" width="200" style="font-size: 40rpx;">{{item.number}}{{translatePosition(item.position)}}</uni-td>
					<uni-td>
						<button type="primary" v-if="item.panelCode" @click="unbind(item.id)">解除绑定</button>
						<button type="warn" v-else @click="startBind(item.id)">鸽笼未绑定</button>
					</uni-td>
				</uni-tr>
			</uni-table>

		</view>
		
		<view v-if="isWaitingForTag" class="waiting-modal">
			<view class="waiting-content">
				<uni-icons type="scan" size="80" color="#007aff"></uni-icons>
				<text class="waiting-text">请贴RFID标签</text>
				<text class="waiting-tip">已选择鸽笼：{{selectedCageInfo}}</text>
				<button type="default" @click="cancelBind">取消</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue';
import { onShow, onBackPress, onUnload } from '@dcloudio/uni-app'
import { useTokenStore } from '@/stores/token';
import { useShedStore } from '@/stores/shed';
import { useBlueToothStore } from '@/stores/blueTooth';
import { useDataCatchStore } from '@/stores/dataCatch';
import jsonBig from 'json-bigint'
import commUtils from '@/utils/CommonUtils.js'

const useToken = useTokenStore()
const useShed = useShedStore()
const useBlueTooth = useBlueToothStore()
const useDataCatch = useDataCatchStore()

const fontColor = ref("black")

const button = ref(false)
const cageList = ref([])
const cageListBack = ref([])

const selectCage = ref('')

const isWaitingForTag = ref(false)
const selectedCageInfo = ref('')
const pendingCageId = ref('')



// 获取鸽笼列表数据
const getCageList = ()=>{
	
	// 先判断缓存中有没有列表数据，有则从缓存获取
	let list = useDataCatch.getBindingCageList();
	if(list.length != 0){
		console.log("缓存获取数据");
		cageList.value = list;
		cageListBack.value = list;
	}else{
		console.log("后台获取数据");
		uni.request({
			url:getApp().globalData.url+`/app/getCageList?shedId=${useShed.shedId}&cageNumMode=${useShed.cageMode}`,
			header:{
				token:useToken.token
			},
			dataType: 'String',
			success: (res) => {
				cageList.value = jsonBig.parse(res.data).data;
				console.log("鸽笼列表为：",cageList.value);
				// 对查询的列表进行缓存
				useDataCatch.setBindingCageList(jsonBig.parse(res.data).data);
				
				cageListBack.value = jsonBig.parse(res.data).data;
			},
			fail: (err) => {
				uni.showToast({
					title:"服务异常",
					icon:'error',
					duration:1500
				})
			}
		})
	}
	

}

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


// 点击鸽笼
const selectedCage = (cageId)=>{
	selectCage.value = cageId
	console.log(selectCage.value);
}

const startBind = (cageId)=>{
	selectCage.value = cageId
	pendingCageId.value = cageId
	
	const item = cageList.value.find(c => c.id === cageId)
	if(item){
		selectedCageInfo.value = item.number + (useShed.cageMode === 0 ? commUtils.translateLeftRight(item.leftRight) : '') + translatePosition(item.position)
	}
	
	isWaitingForTag.value = true
	
	useBlueTooth.listenCharacteristicValueChange()
	
	setTimeout(() => {
		if(isWaitingForTag.value){
			cancelBind()
			uni.showToast({
				title:"超时，请重试",
				icon:"none",
				duration:1500
			})
		}
	}, 10000)
}

const cancelBind = ()=>{
	isWaitingForTag.value = false
	pendingCageId.value = ''
	useBlueTooth.stopListenCharacteristicValueChange()
	useBlueTooth.removeNfcData()
}

watch(()=> useBlueTooth.nfcData,
	async (newNfc)=>{
		try{
			if(!isWaitingForTag.value) return
			if(newNfc === null || typeof newNfc !== 'string' || newNfc.trim() === '') return
			
			isWaitingForTag.value = false
			
			const result = await useDataCatch.bandingCage(pendingCageId.value, newNfc);
			
			if(result && result.conflict && result.existingCage){
				const existingCage = result.existingCage
				const existingCageName = existingCage.number + (useShed.cageMode === 0 ? commUtils.translateLeftRight(existingCage.leftRight) : '') + translatePosition(existingCage.position)
				
				uni.showModal({
					title: '标签已绑定',
					content: '该标签已绑定到"'+ existingCageName +'"，确定要绑定到当前鸽笼吗？',
					confirmText: '确定绑定',
					cancelText: '取消',
					success: async (modalRes) => {
						if(modalRes.confirm){
							await useDataCatch.bandingCage(pendingCageId.value, newNfc, true);
							try{
								const list = useDataCatch.getBindingCageList();
								if(list && Array.isArray(list)){
									cageList.value = list;
									cageListBack.value = list;
								}
							}catch(listErr){
								console.error("获取鸽笼列表异常:", listErr)
							}
						}else{
							uni.showToast({
								title:"已取消绑定",
								icon:"none",
								duration:1500
							})
						}
						useBlueTooth.stopListenCharacteristicValueChange()
						useBlueTooth.removeNfcData()
						pendingCageId.value = ''
					},
					fail: () => {
						useBlueTooth.stopListenCharacteristicValueChange()
						useBlueTooth.removeNfcData()
						pendingCageId.value = ''
					}
				})
				return
			}
			
			try{
				const list = useDataCatch.getBindingCageList();
				if(list && Array.isArray(list)){
					cageList.value = list;
					cageListBack.value = list;
				}
			}catch(listErr){
				console.error("获取鸽笼列表异常:", listErr)
			}
			
			useBlueTooth.stopListenCharacteristicValueChange()
			useBlueTooth.removeNfcData()
			pendingCageId.value = ''
			
		}catch(e){
			console.error("绑定鸽笼操作异常:", e)
			isWaitingForTag.value = false
			useBlueTooth.stopListenCharacteristicValueChange()
			useBlueTooth.removeNfcData()
			pendingCageId.value = ''
			uni.showToast({
				title:"操作异常",
				icon:"error",
				duration:1500
			})
		}
	}
)



// 解除绑定
const unbind = (cageId)=>{
	console.log("取消绑定id：", cageId);
	uni.showModal({
		title: '是否解绑',
		success: function (res) {
			if (res.confirm) {
				useDataCatch.unBandingCage(cageId);
				cageList.value = useDataCatch.getBindingCageList();
				cageListBack.value = useDataCatch.getBindingCageList();
				// uni.request({
				// 	url:getApp().globalData.url+`/app/unbindCage?cageId=${cageId}`,
				// 	header:{
				// 		token:useToken.token
				// 	},
				// 	success: (res) => {
				// 		console.log(res.data);
				// 		getCageList()
				// 	},
				// 	fail: (err) => {
				// 		uni.showToast({
				// 			title:"服务异常",
				// 			icon:'error',
				// 			duration:1500
				// 		})
				// 	}
				// })
				
			}
		}
	});
}


// 后台批量更新绑定鸽笼列表数据
const doBandingCageList = () => {
	uni.request({
		url:getApp().globalData.url+`/app/bandingCageList`,
		method:"POST",
		data: cageList.value,
		header:{
			token:useToken.token
		},
		success: (res) => {
			// 清除本地缓存
			useDataCatch.cleanBindingCageList();
		},
		fail: (err) => {
			uni.showToast({
				title:"服务异常",
				icon:'error',
				duration:1500
			})
		},
	})
}



// 根据鸽笼编号搜索
const search = (keyword)=>{
	// 搜索为空时什么都不做
	if(keyword.value === ''){

	}else{
		// 过滤
		let list = cageList.value.filter(item => {
			let cageNum;
			// 1号6笼模式
			if(useShed.cageMode === 0){
				cageNum = item.number + commUtils.translateLeftRight(item.leftRight) + translatePosition(item.position)
			}else{
				cageNum = item.number + translatePosition(item.position)
			}
			
			return cageNum.includes(keyword.value)
		})
		cageList.value = list
	}
}
// 获取焦点时刷新列表
const focus = ()=>{
	cageList.value = cageListBack.value
}

// 搜索框点击取消
const cancel = ()=>{
	cageList.value = cageListBack.value
}

// onMounted(()=>{
	
// })
onShow(()=>{
	getCageList()
})

onBackPress(()=>{
	cancelBind()
	doBandingCageList();
})

onUnload(()=>{
	cancelBind()
})

</script>

<style lang="scss" scoped>
.layout{
	padding: 30rpx;
	.search{
		
	}
	.card{
		.cageCode{
			height: 70rpx;
			padding: 10rpx;
			font-size: 60rpx;
			text-align: center;
			font-weight: 600;
		}
	}
}

.waiting-modal{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	
	.waiting-content{
		background: white;
		border-radius: 20rpx;
		padding: 60rpx 80rpx;
		text-align: center;
		
		.waiting-text{
			display: block;
			font-size: 36rpx;
			color: #333;
			margin-top: 30rpx;
		}
		
		.waiting-tip{
			display: block;
			font-size: 28rpx;
			color: #999;
			margin-top: 20rpx;
			margin-bottom: 40rpx;
		}
		
		button{
			width: 200rpx;
		}
	}
}
</style>

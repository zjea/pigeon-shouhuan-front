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
						<button type="warn" v-else>鸽笼未绑定</button>
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
						<button type="warn" v-else>鸽笼未绑定</button>
					</uni-td>
				</uni-tr>
			</uni-table>

		</view>
	</view>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue';
import { onShow, onBackPress } from '@dcloudio/uni-app'
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

// 显示的自己颜色
const fontColor = ref("black")

// 控制显示绑定按钮或解绑按钮
const button = ref(false)
// 鸽笼列表
const cageList = ref([])
// 备份鸽笼列表
const cageListBack = ref([])

// 点击选中鸽笼
const selectCage = ref('')



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

// 绑定鸽笼，需要监听是否读取到nfc数据
watch(()=> useBlueTooth.nfcData,
	(newNfc)=>{ // newNfc就是读取的数据
		if(newNfc !== null){
			// 操作缓存的鸽笼列表信息，最后进行批量更新
			useDataCatch.bandingCage(selectCage.value, newNfc);
			cageList.value = useDataCatch.getBindingCageList();
			cageListBack.value = useDataCatch.getBindingCageList();
			
			// uni.request({
			// 	url:getApp().globalData.url+`/app/bindCage?cageId=${selectCage.value}&shedId=${useShed.shedId}&label=${newNfc}`,
			// 	header:{
			// 		token:useToken.token
			// 	},
			// 	success: (res) => {
			// 		console.log(res.data);
			// 		if(res.data.data === null){
			// 			uni.showToast({
			// 				title:"该标签已被绑定",
			// 				icon:"error"
			// 			})
			// 		}else{
			// 			uni.showToast({
			// 				title:"绑定成功",
			// 				icon:'success'
			// 			})
			// 			// // store中的nfc标签值置为空
						
			// 			selectCage.value = ''
			// 			getCageList()
			// 		}
			// 		useBlueTooth.removeNfcData();
					
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
	useBlueTooth.listenCharacteristicValueChange()
	getCageList()
})

onBackPress(()=>{
	doBandingCageList();
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
</style>

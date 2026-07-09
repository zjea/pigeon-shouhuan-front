<template>
	<view class="out-layout">
		<view class="layout">
			<view class="out-box">
				<h2 style="text-align: center;">请用手环靠近标签</h2>
				<view class="box">
					<uni-icons type="scan" size="100"></uni-icons>
				</view>
			</view>	
		</view>
		<view class="over-button">
			<button style="margin-top: 50rpx;" type="warn" @click="onindex">结束</button>
		</view>
		
	</view>
	
</template>

<script setup>
import { watch } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { useBlueToothStore } from '@/stores/blueTooth';	
import { useTokenStore } from '@/stores/token';
import { useCageStore } from '@/stores/cage';
import { useShedStore } from '@/stores/shed';
import jsonBig from 'json-bigint';
const useToken = useTokenStore()
const useCage = useCageStore()
const useBlueTooth = useBlueToothStore()	
const useShed = useShedStore()


// 返回首页
const onindex = ()=>{
	uni.navigateBack()
}


// todo 有bug
watch(()=> useBlueTooth.nfcData,
	(newNfc,oldNfc)=>{ // newNfc就是读取的数据
		// // 先清空音频播报列表
		// audioList.value = []
		if(newNfc === null){
			return
		}else{
			// useCage.setSelectedCageCode()
			// 先查询一下label对应的鸽笼
			uni.request({
				url:getApp().globalData.url+`/app/getCageInfoByLabel?label=${newNfc}&shedId=${useShed.shedId}`,
				header:{
					token:useToken.token
				},
				dataType:'String',
				success: (res) => {
					const parseData = jsonBig.parse(res.data);
					
					if(parseData.data === null){
						uni.showToast({
							title:"未绑定鸽笼",
							icon:'error'
						})
					}else{
						console.log(parseData.data);
						useCage.setSelectedRecordId(parseData.data.id);
						useCage.setSelectedNumber(parseData.data.number);
						useCage.setSelectedPosition(parseData.data.position);
						uni.navigateTo({
							url:"/pages/abnormalRegistration/abnormalRegistration?key=2",
						})
					}
				},
				fail: (err) => {
					uni.showToast({
						title:"服务异常",
						icon:'error'
					})
				}
			})
		}
		
	}
)


// 禁用系统返回
import {
	onBackPress
} from "@dcloudio/uni-app";
// 和生命周期函数同级
// 和生命周期函数同级
// 返回值为true 不允许返回 否则允许
onBackPress((options) => {
	// 点击虚拟键或者侧滑的时候触发（不允许返回）
	if (options.from === 'backbutton') {
		return true
	}
	// 否则则允许返回
	return false;
})

onShow (()=>{
 	useBlueTooth.listenCharacteristicValueChange()
})
</script>

<style lang="scss" scoped>
.out-layout{
	height: 100%;
	.layout{
		background:
		linear-gradient(to bottom,#ccFFFF, #F8F8F8 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80%;
		
		.out-box{
			// margin: 30rpx;
			width: 600rpx;
			height: 400rpx;
			border: 5px dashed deepskyblue;
			border-radius: 15rpx;
			.box{
				margin-top: 70rpx;
				border-radius: 15rpx;
				text-align: center;
			}
		}
	}
	.over-button{
		margin: 0rpx 30rpx;
	}
}

</style>

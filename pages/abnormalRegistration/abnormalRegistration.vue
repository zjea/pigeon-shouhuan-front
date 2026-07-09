<template>
	<view class="layout">
		<h2 style="text-align: center;" v-if="useShed.cageMode === 0">{{useCage.selectedNumber}}{{CommonUtils.translateLeftRight(useCage.selectedLeftRight)}}{{translatePosition(useCage.selectedPosition)}}</h2>
		<h2 style="text-align: center;" v-else>{{useCage.selectedNumber}}{{translatePosition(useCage.selectedPosition)}}</h2>
		<view class="all-error">
			<uni-group title="蛋异常" mode="card">
				<view class="p-error">
					<view v-for="(item) in eggError.slice(0, 6)" :key="item.id" 
					:class="{ default: item.color === 'default', active: item.color === 'active' }" 
					@click="eggErrorButton(item.id,item.text)">{{item.text}}</view>
				</view>
			</uni-group>
			
			<uni-group title="仔异常" mode="card">
				<view class="p-error">
					<view v-for="(item) in  eggError.slice(6, 10)" :key="item.id" 
					:class="{ default: item.color === 'default', active: item.color === 'active' }" 
					@click="eggErrorButton(item.id,item.text)">{{item.text}}</view>
				</view>
			</uni-group>
			
			<uni-group title="种异常" mode="card">
				<view class="p-error">
					<view v-for="(item) in  eggError.slice(10, 13)" :key="item.id" 
					:class="{ default: item.color === 'default', active: item.color === 'active' }" 
					@click="eggErrorButton(item.id,item.text)">{{item.text}}</view>
				</view>
			</uni-group>
		</view>

		<view class="bottom-button">
			<button type="default" @click="cancel">取消</button>
			<button type="primary" @click="commitError">确定</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { useTokenStore } from '@/stores/token';
import { useCageStore } from '@/stores/cage';
import { useShedStore } from '../../stores/shed';
import { useDataCatchStore } from '../../stores/dataCatch';
import { onLoad } from "@dcloudio/uni-app";
import {
    onMounted,
    getCurrentInstance
  } from 'vue';
import CommonUtils from '@/utils/CommonUtils';



const useToken = useTokenStore()
const useCage = useCageStore()
const useShed = useShedStore()
const useDataCatch = useDataCatchStore()

// 用于区分是通过标签录入异常信息，还是在抽蛋、照蛋、加仔页面录入异常信息
const key = ref('list')

	// const cageCode = ref(useCage.selectedNumber)

	const eggError = ref([
		{ id: 1, color: 'default', text: '光蛋' },
		{ id: 2, color: 'default', text: '死精' },
		{ id: 3, color: 'default', text: '破蛋' },
		{ id: 4, color: 'default', text: '沙壳' },
		{ id: 5, color: 'default', text: '软壳' },
		{ id: 6, color: 'default', text: '小蛋' },
	// ])
	// const cubError = ref([
		{ id: 7, color: 'default', text: '喂仔差' },
		{ id: 8, color: 'default', text: '踩仔' },
		{ id: 9, color: 'default', text: '啄羽' },
		{ id: 10, color: 'default', text: '死仔' },
	// ])
	// const breedError = ref([
		{ id: 11, color: 'default', text: '不孵蛋/冷蛋' },
		{ id: 12, color: 'default', text: '不抱窝' },
		{ id: 13, color: 'default', text: '死种' }
	])
	
	// 选中的异常类型
	const errorType = ref('')
	
	
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
	
	// 控制选中时按钮颜色变化
	const  eggErrorButton = (index,text)=>{
		// 重置所有按钮的颜色
		eggError.value.forEach((btn) => {
		  if (index === btn.id) {
			btn.color = 'active'; // 点击的按钮变色
		  } else {
			btn.color = 'default'; // 其他按钮恢复默认颜色
		  }
		})
		errorType.value = text
	}
	
	// 取消异常登记
	const cancel = ()=>{
		uni.navigateBack()
	}
	
	// 提交异常
	const commitError = ()=>{
		
		if(errorType.value === ''){
			uni.showToast({
				title:"未选择异常",
				icon:'error'
			})
		}else{
			// 若是从抽蛋等页面跳转过来，修改缓存中的数据的异常信息
			if(key.value == 1){
				useDataCatch.abnormalRegistration(useCage.selectedRecordId, errorType.value);
				// 清楚选中的记录
				// 选中记录超过5秒钟，就清除选中的记录id
				useCage.RemoveSelectedRecordId();
				useCage.RemoveSelectedNumber();
				useCage.RemoveSelectedPosition();
				// 回到记录页面
				uni.navigateBack()
				uni.showToast({
					title:"异常登记成功",
					icon:'success'
				})
				console.log("从抽蛋等页面跳转过来")
			}else{
				// 若是从读取标签页面跳转过来，修改数据库中的数据的异常信息 
				console.log(useShed.cageMode)
				uni.request({
					url:getApp().globalData.url+`/app/abnormalRegistration?number=${useCage.selectedNumber}&leftRight=${useCage.selectedLeftRight}&position=${useCage.selectedPosition}&shedId=${useShed.shedId}&errorType=${errorType.value}`,
					header:{
						token:useToken.token
					},
					success: (res) => {
						console.log("从读取标签页面跳转过来")
						// 回到记录页面
						uni.navigateBack()
						uni.showToast({
							title:"异常登记成功",
							icon:'success'
						})
					},
					fail: (err) => {
						// 回到记录页面
						uni.navigateBack()
						uni.showToast({
							title:"服务异常",
							icon:'error'
						})
					}
				})
			}
			

		}
	}
	
	// onShow((key)=>{
	// 	console.log("key",key)
	//     key.value = key;
	// })
	onLoad((options)=>{
		key.value = options.key;
		console.log("key.value",key.value)
		
		
	})
	
</script>

<style lang="scss" scoped>
.layout{
	.all-error{
		.p-error{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap: 20rpx;
			// .button{
			// 	border: 1px solid ;
			// 	height: 90rpx;
			// 	display: flex;
			// 	justify-content: center;
			// 	align-items: center;
			// 	border-radius: 15rpx;
			// }
			.default {
				background-color: #fff; 
				color: #000; 
				border: 1px solid ;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 15rpx;
				}
			.active { 
				background-color: #007aff; 
				color: #fff; 
				border: 1px solid ;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 15rpx;
				}
		}
	}
	.bottom-button{
		margin-top: 200rpx;
		// border: 1px solid;
		display: grid;
		grid-template-columns: repeat(2,1fr);
		gap: 20rpx;
		button{
			height: 100rpx;
			width: 90%;
		}
	}
}


</style>

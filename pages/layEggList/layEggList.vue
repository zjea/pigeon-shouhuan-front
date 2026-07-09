<template>
	<view class="layout">
		<!-- 日期 -->
		<top-date types="产蛋"></top-date>
		<!-- 按钮列表 -->
		<top-button-list types="产蛋"></top-button-list>
		<!-- 表格展示 -->
		<common-table types="产蛋"></common-table>
		<!-- 底部按钮 -->
		<view class="bottom">
			<button type="primary" @click="displyShowPoup" class="launch">今日统计</button>
			<button type="warn" @click="displyOverPoup" class="over">结束</button>
		</view>
		
	<!-- 	参考官方文档
		<uni-popup ref="overPopup" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="是否结束操作并退出？"  @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup> -->
		
		<!-- 底部弹出层 -->
		<uni-popup class="count-pop" ref="infoPopup" type="bottom" borderRadius="10rpx 10rpx 0rpx 0rpx" background-color="#fff" >
			<view class="popup">
				<view class="day-count">今日统计</view>
				<view class="popup-left">总窝数：{{countEpoch}}</view>
				<view class="popup-right">孵化异常：{{countErrorEpoch}} （{{errorProportion}}%）</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { closeGetLabelId } from '@/uni_modules/lyj-watch';
import { useCageStore } from '@/stores/cage.js';
import { useBlueToothStore } from '@/stores/blueTooth';
const useCage = useCageStore()
const useBlueTooth = useBlueToothStore()

	const infoPopup = ref(null)
	// const overPopup = ref(null)
	// const type = ref("")
	// 总窝数
	const countEpoch = ref(0)
	// 孵化异常数
	const countErrorEpoch = ref(0)
	// 异常比例
	const errorProportion = ref(0)
	
	// #######################################
	// 需要播放的音频列表
	const audioList  = ref(['../../static/audio/1.mp3','../../static/audio/up.mp3','../../static/audio/layEggSuccess.mp3'])
	// 当前播放音频，初始为0
	let currentIndex  = 0
	// 创建音频播放实例
	const audioContext  = uni.createInnerAudioContext();
	// #######################################
	
	// 今日统计弹窗
	const displyShowPoup = () => {
		infoPopup.value.open()
		// 总窝数，根据产蛋列表来计算的
		countEpoch.value = useCage.layEggCount
		// 孵化异常数
		countErrorEpoch.value = useCage.layEggErrorCount
		if(useCage.takeEggCount !== 0){
			// 孵化异常比例
			errorProportion.value = (useCage.layEggErrorCount / useCage.layEggCount)*100
		}
	}

	
	// 结束操作提示弹窗
	const displyOverPoup = () =>{
		// ##################################################
		// overPopup.value.open()
		uni.showModal({
			title: '确定结束产蛋操作吗？',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					// 关闭标签连续读取
					closeGetLabelId();
					
					uni.navigateBack() // 回到上一个页面
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	
	// 取消操作结束，关闭弹窗
	const dialogClose = ()=>{
		overPopup.value.close()
	}
	
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
	
</script>

<style lang="scss" scoped>
.layout{
	border-radius: 30rpx;
	.bottom{
		height: 100rpx;
		// border: 1px solid;
		display: flex;
		padding: 25rpx;
		// align-items: center;
		
		.launch{
			height: 100%;
			width: 60%;
			margin-right: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.over{
			width: 40%;
			margin-left: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
	}
	.over-pop{
		.popup{
			height: 300rpx;
			width: 500rpx;
			background: #fff;
		}
	}
	.count-pop{
		.popup{
			height: 300rpx;
			background: #fff;
			padding: 40rpx 30rpx 0;
			border-radius: 10rpx;
			overflow: hidden;
			.day-count{
				font-size: 50rpx;
				text-align: center;
				color: skyblue;
			}
			.popup-left{
				margin-top: 30rpx;
				font-size: 40rpx;
			}
			.popup-right{
				margin-top: 30rpx;
				font-size: 40rpx;
			}
		}
	}
}
</style>

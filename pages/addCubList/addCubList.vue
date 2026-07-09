<template>
	<view class="layout">
			<top-date types="加仔"></top-date>
			<top-button-list types="加仔"></top-button-list>
			<common-table types="加仔"></common-table>
			<view class="bottom">
				<button type="primary" @click="displyShowPoup" class="launch">今日统计</button>
				<button type="warn" @click="displyOverPoup" class="over">结束</button>
			</view>
			
			<!-- 参考官方文档 -->
<!-- 			<uni-popup ref="overPopup" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="是否结束操作并退出？"  @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup> -->
			
			<!-- 底部弹出层 -->
			<uni-popup class="count-pop" ref="infoPopup" type="bottom" borderRadius="10rpx 10rpx 0rpx 0rpx" background-color="#fff" >
				<view class="popup">
					<view class="day-count">今日统计</view>
					<view class="popup-one">
						<view class="title">总窝数：</view>
						<view class="num">{{addCubCountEpoch}}</view>
					</view>
					<view class="popup-one">
						<view class="title">孵化异常：</view>
						<view class="num">{{addCubCountErrorEpoch}}（{{addCubCountErrorEpochProportion}}%）</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</template>
	
	<script setup>
	import { ref } from 'vue';
	import { closeGetLabelId } from '@/uni_modules/lyj-watch';
	import { useCageStore } from '@/stores/cage';
	import { useDataCatchStore } from '../../stores/dataCatch';
	import {useTokenStore} from '@/stores/token.js'
	const useCage = useCageStore()
	const useDataCatch = useDataCatchStore()
		const useToken = useTokenStore()
		const infoPopup = ref(null)
		const overPopup = ref(null)
		
		// 今日统计的总窝数
		const addCubCountEpoch = ref(0)
		// 今日统计的孵化异常数
		const addCubCountErrorEpoch = ref(0)
		// 比例
		const addCubCountErrorEpochProportion = ref(0)
		
		// 今日统计弹窗
		const displyShowPoup = () => {
			infoPopup.value.open()
			// 使用照蛋页面的store
			addCubCountEpoch.value = useCage.addCubCount;
			addCubCountErrorEpoch.value = useCage.addCubErrorCount;
			if(useCage.addCubCount !== 0){
				addCubCountErrorEpochProportion.value = (useCage.addCubCount/useCage.addCubErrorCount)*100
			}
		}
		
	// 结束提示弹窗
	const displyOverPoup = () =>{
		uni.showModal({
			title: '确定结束加仔操作吗？',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					// 将缓存数据全部提交到后台。 todo
					uni.request({
						url:getApp().globalData.url+`/app/addAddCubRecordList`,
						method: 'POST',
						data:useDataCatch.getTableList(),
						header:{
							token:useToken.token
						},
						success: (res) => {
							console.log(res)
							if(res.data.code != 0){
								uni.showToast({
									title: '数据录入失败',
									duration: 2000,
									icon:'error'
								});
							}
							// 清空缓存
							useDataCatch.cleanTableList();
						},
						fail: (e) => {
							uni.showToast({
								title: '数据录入失败',
								duration: 2000,
								icon:'error'
							});
						}
					
					})
					
					// 关闭标签连续读取
					closeGetLabelId();
					
					uni.navigateBack() // 回到上一个页面
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
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
				height: 380rpx;
				background: #fff;
				padding: 40rpx 30rpx 0;
				border-radius: 10rpx;
				overflow: hidden;
				.day-count{
					font-size: 50rpx;
					text-align: center;
					color: skyblue;
				}
				.popup-one{
					// border: 1px solid;
					margin-left: 30rpx;
					margin-right: 30rpx;
					margin-top: 15rpx;
					font-size: 40rpx;
					display: grid;
					grid-template-columns: repeat(2,1fr);
					gap: 20rpx;
					// background: #f1f1f1;
					border-radius: 10rpx;
					.title{
						// border: 1px solid;
						text-align: right;
						// width: 40%;
					}
					.num{
						// border: 1px solid;
						text-align: left;
						// width: 40%;
					}
				}
			}
		}
	}
	</style>
	

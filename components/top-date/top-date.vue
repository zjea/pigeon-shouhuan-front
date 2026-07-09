<template>
	<view class="layout">
		<view class="change-date">
			<view v-if="isDateList" @click="changeDate" class="inner">
				<uni-icons type="calendar" size="25"></uni-icons>
				<view class="date">{{showDate}}</view>
				<view>{{useTakeEggType.takeEggTypeText}}</view>
			</view>
			<view v-else class="inner">
				<uni-icons type="calendar" size="25"></uni-icons>
				<view class="date">{{todayDate}}</view>
			</view>
		</view>

<!-- 		<view v-if="isDateList" class="change-list">
			<view class="inner">
				<uni-icons  type="settings" size="25"></uni-icons>
				<view class="text">查看全部</view>
			</view>
		</view> -->
		
		<!-- 日期选择弹窗 -->
		<!-- 底部弹出层 -->
		<uni-popup ref="dateSelectPopup" type="bottom" borderRadius="10rpx 10rpx 0rpx 0rpx" background-color="#fff" >
			<view class="date-pop">
				<view class="date" v-for="(item,index) in dates" :key="index" @click="selectDate(item)">
					{{item}}
				</view>
			</view>
		</uni-popup>
	</view>
		
</template>

<script setup>
import { ref,onMounted  } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { useDateStore } from '@/stores/date';
import { useTakeEggTypeStore } from '../../stores/takeEggType';
const useDate = useDateStore()
const useTakeEggType = useTakeEggTypeStore();
const dateSelectPopup = ref(null)

const props = defineProps({
    types: String,
});

// 控制时间选择器是否可以点击后弹框
const isDateList = ref(false)

// 产蛋页面的日期展示
const todayDate = ref(useDate.layEggDate)
// 抽蛋、照蛋、加仔页面的日期展示
const showDate = ref('')
// 抽蛋、照蛋、加仔页面的日期选择列表
const dates = ref([])


const init = ()=>{
	console.log(props.types);
	
	if(props.types === "产蛋"){
		return
	}else if(props.types === '抽蛋'){
		// 设置时间选择器点击后可以弹框
		isDateList.value = !isDateList.value
		// 弹框时展示的日期列表
		dates.value = useDate.takeEggDates
		// 设置页面展示的当前产蛋操作的日期
		showDate.value = dates.value [0]
	}else if(props.types === '照蛋'){
		// 设置时间选择器点击后可以弹框
		isDateList.value = !isDateList.value
		// 弹框时展示的日期列表
		dates.value = useDate.irradiatedEggDates
		// 设置页面展示的当前照蛋操作的日期
		showDate.value = dates.value [0]
	}else if(props.types === '加仔'){
		// 设置时间选择器点击后可以弹框
		isDateList.value = !isDateList.value
		// 弹框时展示的日期列表
		dates.value = useDate.addCubDates
		// 设置页面展示的当前加仔操作的日期
		showDate.value = dates.value [0]
	}
}
// 点击日期选择器，打开弹窗
const changeDate = ()=>{
	dateSelectPopup.value.open()
}

// 点击弹窗的日期，切换当前显示的日期，并关闭弹窗
const selectDate = (selected)=>{
	// 切换当前显示的日期
	showDate.value=selected;
	// 将选择到的日期存到对应操作的store日期中
	if(props.types === "产蛋"){
		return
	}else if(props.types === '抽蛋'){
		useDate.setCurrentSelectedTakeEggDate(selected)
	}else if(props.types === '照蛋'){
		useDate.setCurrentSelectedIrradiatedEggDate(selected)
	}else if(props.types === '加仔'){
		useDate.setCurrentSelectedAddCubDate(selected)
	}
	
	//关闭弹窗 
	dateSelectPopup.value.close();
}

onMounted (()=>{
	init()
})




</script>

<style lang="scss" scoped>

.layout{
	display: grid;
	grid-template-columns: repeat(2,1fr);
	gap: 200rpx;
	width: 700rpx;
	margin: 0rpx 25rpx;

	// .change-list{
	// 	// border: 1px solid;
	// 	position: relative;
	// 	font-size: 30rpx;
	// 	font-weight: 600;
	// 	.inner{
	// 		display: flex;
	// 		position: absolute;
	// 		right: 0; /* 紧贴右边框 */
	// 		top: 50%;
	// 		transform: translateY(-50%); /* 垂直居中 */
	// 	}

	// }
	.change-date{
		// border: 1px solid;
		padding: 40rpx 0rpx;
		position: relative;
		font-size: 30rpx;
		font-weight: 600;
		width: 700rpx;
		.inner{
			display: flex;
			position: absolute;
			left: 0; /* 紧贴右边框 */
			top: 50%;
			width: 100%;
			transform: translateY(-50%); /* 垂直居中 */
		}	
	}
	.date-pop{
		height: 150rpx;
		margin: 35rpx 20rpx;
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap: 20rpx;
		.date{
			background: skyblue;
			border-radius: 10rpx;
			display: flex;
			font-size: 30rpx;
			font-weight: 600;
			justify-content: center;
			align-items: center;
		}

	}
}


</style>
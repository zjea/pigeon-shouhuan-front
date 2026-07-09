<template>
	<view class="configurePage">
		<uni-section title="每日工作配置" sub-title="配置抽蛋|照蛋|加仔间隔时间" type="line">
			<uni-group title="产蛋后几天进行抽蛋" mode="card">
				<view class="date-text"> 当前设置为：{{takeEggIntervalValue}}天 </view>
				<view class="interval-value-text">
					<uni-number-box width="160" v-model="takeEggIntervalValue" @change="changeValue('takeEgg')" />
				</view>
			</uni-group>
			<uni-group title="产蛋后几天进行照蛋" mode="card">
				<view class="date-text"> 当前设置为：{{lightEggIntervalValue}}天 </view>
				<view class="interval-value-text" >
					<uni-number-box width="160" v-model="lightEggIntervalValue" @change="changeValue('lightEgg')" />
				</view>
			</uni-group>
			<uni-group title="产蛋后几天进行加仔" mode="card">
				<view class="date-text"> 当前设置为：{{addChildIntervalValue}}天 </view>
				<view class="interval-value-text">
					<uni-number-box width="160" v-model="addChildIntervalValue" @change="changeValue('addChild')" />
				</view>
			</uni-group>
		</uni-section>
		<uni-section title="鸽笼操作顺序配置" sub-title="可根据个人习惯进行配置" type="line">
			<uni-group mode="card">
				<radio-group @change="doOrderConfigChange">
					<uni-row v-for="(item, index) in orderConfig">
						<uni-col :span="10">
							<view class="order-config-text"><radio :value="item.value" :checked="index === current" />{{item.name}}</view>
						</uni-col>
						<uni-col :span="14">
							<image style="max-width: 100%; max-height: 300rpx;" :src="item.img" />
						</uni-col>
						<hr v-if="index !== 2"/>
					</uni-row>
				</radio-group>
	
			</uni-group>
		</uni-section>

	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useShedStore } from '@/stores/shed';
import { useConfigDataStore } from '@/stores/configData';

const shedStore = useShedStore();
const configDataStore = useConfigDataStore();

	// 设置的抽蛋间隔，默认2天
	const takeEggIntervalValue = ref(1);
	// 设置的照蛋间隔
	const lightEggIntervalValue = ref(1);
	// 设置的加仔间隔
	const addChildIntervalValue = ref(1);
	
	// 鸽笼操作顺序配置
	const orderConfig = ref([
		{
			value: 0,
			name: '顺序操作模式',
			img: '../../static/image/ORDER.png'
		},
		{
			value: 1,
			name: '相邻操作模式1',
			img: '../../static/image/FIRSTADJACENT.png'
		},
		{
			value: 2,
			name: '相邻操作模式2',
			img: '../../static/image/LASTADJACENT.png'
		}
	])
	// 鸽笼操作顺序
	const current = ref(configDataStore.isOrder);

	// 当改变时，需要更新全局store的间隔时间
	const changeValue = (type) => {
		if(type === 'takeEgg'){
			shedStore.takeEggInterval = takeEggIntervalValue.value;
			console.log(shedStore.takeEggInterval)
		}
		else if(type === 'lightEgg'){
			shedStore.lightEggInterval = lightEggIntervalValue.value;
		}
		else{
			shedStore.addChildInterval = addChildIntervalValue.value;
		}
	}
	
	// 切换操作鸽笼顺序
	const doOrderConfigChange = (evt) => {
		for (let i = 0; i < orderConfig.value.length; i++) {
			if (orderConfig.value[i].value === evt.detail.value) {
				current.value = i;
				// 更新configDataStroe中的鸽笼操作顺序
				configDataStore.isOrder = current.value;
				console.log("当前操作顺序为：",configDataStore.isOrder)
				break;
			}
		}
	}
	
	
	// 进入页面后，取store中存储的配置
	onMounted(()=>{
		takeEggIntervalValue.value = shedStore.takeEggInterval;
		lightEggIntervalValue.value = shedStore.lightEggInterval;
		addChildIntervalValue.value = shedStore.addChildInterval;
	})
	
</script>

<style lang="scss" scoped>
	.date-text {
		text-align: center;
		color: blue;
	}
	.interval-value-text{
		margin-top: 30rpx;
		// width: 230rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
	}
	.order-config-text{
		height: 300rpx;
		display: flex;
		align-items: center; /* 垂直居中 */
		color: blue;
	}
	

</style>
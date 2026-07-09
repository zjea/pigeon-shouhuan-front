import { ref } from 'vue';
import { defineStore } from 'pinia';


export const useShedStore = defineStore('shed', () => {
	// 养殖仓
	const shedId = ref("");
	const shedNum = ref("");

	const shedList = ref([]);

	const setShedId = (data)=>{
		shedId.value = data
	}
	const setShedNum = (data)=>{
		shedNum.value = data
	}
	const setShedList = (data)=>{
		shedList.value = data
	}
	
	// 鸽笼编号模式，默认就是0(1号6笼)
	const cageMode = ref(0)
	const cageModeText = ref('1号6笼')
	const setCageMode = (mode)=>{
		cageMode.value = mode
		cageModeText.value = mode === 0? '1号6笼':'1号3笼'
		
		// 本地磁盘缓存
		try {
			uni.setStorageSync('storage_cageMode', mode);
			console.log('本地磁盘备份成功。');
		} catch (e) {
			// error
			console.log('本地磁盘备份失败。');
		}
	}
	
	// 获取鸽笼编号模式
	const getCageMode = () => {
		// 1.先获取本地缓存中的鸽笼模式
		let localCatchCageMode = uni.getStorageSync('storage_cageMode');
		// 2. 判断当前鸽笼编号模式和本地缓存的鸽笼编号模式时候相同，且本地缓存是否为空
		// 若当前鸽笼编号模式和本地缓存的鸽笼编号模式不一致，使用缓存的编号
		if((cageMode.value !== localCatchCageMode) &&  (localCatchCageMode !== null)){
			cageMode.value = localCatchCageMode
			cageModeText.value = localCatchCageMode === 0? '1号6笼':'1号3笼'
			console.log("当前使用本地缓存中的鸽笼编号模式")
		}
		
		return cageMode.value;
	}
	
	
	// // 本地缓存获取鸽笼模式编号
	// const getLocalCatchCageMode = () => {
	// 	try {
	// 		cageMode.value = uni.getStorageSync('storage_cageMode');
	// 		cageModeText.value = cageMode.value === 0? '1号6笼':'1号3笼'
	// 	} catch (e) {
	// 		// error
	// 		console.log('本地磁盘获取失败。',e);
	// 	}
	// }
	
	
	// 设置每日工作配置
	// 设置的抽蛋间隔，默认2天
	const takeEggInterval = ref(2);
	// 设置的照蛋间隔
	const lightEggInterval = ref(5);
	// 设置的加仔间隔
	const addChildInterval = ref(18);
	
	
	return {
		shedId,
		shedNum,
		shedList,
		setShedId,
		setShedNum,
		setShedList,
		
		cageMode,
		cageModeText,
		setCageMode,
		getCageMode,
		
		takeEggInterval,
		lightEggInterval,
		addChildInterval
	};
},
{
	persist:true
}); 
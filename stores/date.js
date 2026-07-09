import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import SOtime from '@/utils/SOtime';
import { useShedStore } from '@/stores/shed.js';

export const useDateStore = defineStore('date', () => {

	const shedStore = useShedStore();
	/**
	 * 当为抽蛋时，从shedStore中获取配置页面设置的抽蛋间隔
	 * 照蛋时，从shedStore中获取配置页面设置的照蛋间隔
	 * 加仔时，从shedStore中获取配置页面设置的加仔间隔
	 * 
	 * dateNum表示要显示前多少天的日期，比如抽蛋，dateNum=5表示需要
	 * 当前日期减去2、3、4、5、6天的日期
	 */
	const getTakeEggDates = (passDate ,dateNum)=>{
		let dateList = []
		// 只显示五天的抽蛋日期，及当前日期减去2、3、4、5、6天，就可以得到过去日期产蛋时间
		for(let i=passDate; i<passDate+dateNum; i++){
			// 减去的天数的总毫秒数
			let ss = i * 24 * 60 * 60 * 1000
			let date = SOtime.getBeforeDate(ss)
			dateList.push(date)
		}
		console.log(passDate)
		console.log(dateList)
		return dateList
	}
	

	// 日期列表，今天会显示两天以前的日期。这是因为抽蛋需要产蛋两天后才进行
	const takeEggDates = ref(getTakeEggDates(shedStore.takeEggInterval,6));
	const irradiatedEggDates = ref(getTakeEggDates(shedStore.lightEggInterval,6));
	const addCubDates = ref(getTakeEggDates(shedStore.addChildInterval,6));
	
	// const takeEggDates = ref(getTakeEggDates(2,6));
	// const irradiatedEggDates = ref(getTakeEggDates(5,6));
	// const addCubDates = ref(getTakeEggDates(18,6));

	// 产蛋页面显示的日期,也就是今天的日期
	const layEggDate = ref(SOtime.getDate());
	// 当前的抽蛋、照蛋、加仔日期
	const currentSelectedTakeEggDate = ref(takeEggDates.value[0])
	const currentSelectedIrradiatedEggDate = ref(irradiatedEggDates.value[0])
	const currentSelectedAddCubDate = ref(addCubDates.value[0])
	
	
	// 监听配置的变化，每变化一次，重新执行一次时间计算
	watch(
		() => shedStore.takeEggInterval,
		(newDate) => {
		takeEggDates.value = getTakeEggDates(newDate,6)
		currentSelectedTakeEggDate.value = takeEggDates.value[0]
	})
	watch(
		() => shedStore.lightEggInterval,
		(newDate) => {
		irradiatedEggDates.value = getTakeEggDates(newDate,6)
		currentSelectedIrradiatedEggDate.value = takeEggDates.value[0]
	})
	watch(
		() => shedStore.addChildInterval,
		(newDate) => {
		addCubDates.value = getTakeEggDates(newDate,6)
		currentSelectedAddCubDate.value = takeEggDates.value[0]
	})

	
	// 设置当前的抽蛋、照蛋、加仔日期
	const setCurrentSelectedTakeEggDate = (date)=>{
		currentSelectedTakeEggDate.value = date;
		// console.log(currentSelectedTakeEggDate.value)
	}
	const setCurrentSelectedIrradiatedEggDate = (date)=>{
		currentSelectedIrradiatedEggDate.value = date;
	}
	const setCurrentSelectedAddCubDate = (date)=>{
		currentSelectedAddCubDate.value = date;
	}

	
	return {
		layEggDate,
		takeEggDates,
		irradiatedEggDates,
		addCubDates,
		currentSelectedTakeEggDate,
		currentSelectedIrradiatedEggDate,
		currentSelectedAddCubDate,
		setCurrentSelectedTakeEggDate,
		setCurrentSelectedIrradiatedEggDate,
		setCurrentSelectedAddCubDate
	};
}); 
import { ref } from 'vue';
import { defineStore } from 'pinia';


export const useCageStore = defineStore('cage', () => {
	/**
	 * 产蛋页面
	 */
	// 今日产蛋记录总数
	const layEggCount = ref(0)
	
	const setLayEggCount = (count)=>{
		layEggCount.value = count
	}
	
	// 今日产蛋异常总数
	const layEggErrorCount = ref(0)
	
	const setLayEggErrorCount = (count)=>{
		layEggErrorCount.value = count
	}
	
	/**
	 * 抽蛋页面
	 */
	// 抽蛋记录总数(总窝数)
	const takeEggCount = ref(0)
	
	const setTakeEggCount = (count)=>{
		takeEggCount.value = count
	}
	
	// 建议抽蛋总数
	const takeEggSuggestCount = ref(0)
	
	const setTakeEggSuggestCount = (count)=>{
		takeEggSuggestCount.value = count
	}
	
	// 实际抽蛋总数
	const takeEggActuallyCount = ref(0)
	
	const setTakeEggActuallyCount = (count)=>{
		takeEggActuallyCount.value = count
	}
	
	// 异常总数
	const takeEggErrorCount = ref(0)
	
	const setTakeEggErrorCount = (count)=>{
		takeEggErrorCount.value = count
	}
	
	/**
	 * 照蛋页面
	 */
	// 照蛋记录总数(总窝数)
	const irradiateEggCount = ref(0)
	
	const setIrradiateEggCount = (count)=>{
		irradiateEggCount.value = count
	}
	// 异常总数
	const irradiateEggErrorCount = ref(0)
	
	const setIrradiateEggErrorCount = (count)=>{
		irradiateEggErrorCount.value = count
	}
	
	/**
	 * 加仔页面
	 */
	// 照蛋记录总数(总窝数)
	const addCubCount = ref(0)
	
	const setAddCubCount = (count)=>{
		addCubCount.value = count
	}
	// 异常总数
	const addCubErrorCount = ref(0)
	
	const setAddCubErrorCount = (count)=>{
		addCubErrorCount.value = count
	}
	
	/**
	 * 
	 */
	// 选中的产产蛋记录id
	const selectedRecordId = ref('');

	const setSelectedRecordId = (id)=>{
		selectedRecordId.value = id;
	}
	
	const RemoveSelectedRecordId = ()=>{
		selectedRecordId.value = '';
	}
	
	// 选中的鸽笼编号由number、position组成
	
	const selectedNumber = ref(-1);
	const selectedLeftRight = ref(-1)
	const selectedPosition = ref(-1);
	const setSelectedNumber = (code)=>{
		selectedNumber.value = code;
	}
	
	const RemoveSelectedNumber = ()=>{
		selectedNumber.value = -1;
	}
	
	const setSelectedLeftRight = (code)=>{
		selectedLeftRight.value = code;
	}
	
	const RemoveSelectedLeftRight = ()=>{
		selectedLeftRight.value = -1;
	}
	
	const setSelectedPosition = (code)=>{
		selectedPosition.value = code;
	}
	
	const RemoveSelectedPosition = ()=>{
		selectedPosition.value = -1;
	}
	
	

	return {
		layEggCount,
		setLayEggCount,
		layEggErrorCount,
		setLayEggErrorCount,

		takeEggCount,
		setTakeEggCount,
		takeEggSuggestCount,
		setTakeEggSuggestCount,
		takeEggActuallyCount,
		setTakeEggActuallyCount,
		takeEggErrorCount,
		setTakeEggErrorCount,
		
		irradiateEggCount,
		setIrradiateEggCount,
		irradiateEggErrorCount,
		setIrradiateEggErrorCount,

		addCubCount,
		setAddCubCount,
		addCubErrorCount,
		setAddCubErrorCount,

		selectedRecordId,
		setSelectedRecordId,
		RemoveSelectedRecordId,
		
		selectedNumber,
		selectedPosition,
		selectedLeftRight,
		setSelectedNumber,
		RemoveSelectedNumber,
		setSelectedLeftRight,
		RemoveSelectedLeftRight,
		setSelectedPosition,
		RemoveSelectedPosition
	};
}); 
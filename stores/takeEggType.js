import { ref } from 'vue';
import { defineStore } from 'pinia';


export const useTakeEggTypeStore = defineStore('takeEggType', () => {
	// 默认全抽
	const takeEggType = ref(0);
	
	const takeEggTypeText = ref("全抽");


	const setTakeEggType = (data)=>{
		takeEggType.value = data
	}
	const setTakeEggTypeText = (data)=>{
		takeEggTypeText.value = data
	}


	return {
		takeEggType,
		takeEggTypeText,
		setTakeEggType,
		setTakeEggTypeText
	};
},
{
	persist:true
}); 
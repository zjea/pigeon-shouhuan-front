import { ref } from 'vue';
import { defineStore } from 'pinia';
import IS_ORDER_ENUM from '@/Enum/isOrderEnum';
/**
 * 保存全局的配置
 */
export const useConfigDataStore = defineStore('configData', ()=>{
	
	// 鸽笼操作顺序：
	// 0：顺序操作
	// 1：从1号笼开始相邻操作
	// 2：从最后一个笼子开始相邻 操作
	// 默认为顺序操作
	const isOrder = ref(IS_ORDER_ENUM.ORDER)

	return{
		isOrder
	}
	
})
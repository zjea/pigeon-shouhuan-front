import { ref } from 'vue';
import { defineStore } from 'pinia';



export const useStatusStore = defineStore('status', () => {

	// 产蛋列表删除状态，删除一次，变量改变一次，列表组件就可以根据这个状态的改变来觉得是否刷新列表
	const DELETE = ref(false);
	return{
		DELETE
	}
}); 
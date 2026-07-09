import { ref } from 'vue';
import { defineStore } from 'pinia';


export const useUserStore = defineStore('user', () => {
	// 用户id
	const userId = ref("");
	// 账号
	const username = ref("");
	// 别名
	const nickname = ref("")
	// 基地id
	const baseId = ref("");
	// 所管理的葛鹏
	const shedList = ref([])
	
	const setUserId = (data)=>{
		userId.value = data
	}
	const setUsername = (data)=>{
		username.value = data
	}
	const setNickname = (data)=>{
		nickname.value = data
	}
	const setBaseId = (data)=>{
		baseId.value = data
	}	

	const setShedList = (data) => {
		shedList.value = data
	}
	
	return {
		userId,
		username,
		nickname,
		baseId,
		shedList,
		setUserId,
		setUsername,
		setNickname,
		setBaseId,
		setShedList
	};
},{
	persist:true
}); 
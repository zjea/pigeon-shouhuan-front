import { ref } from 'vue';
import { defineStore } from 'pinia';


export const useDataCatchStore = defineStore('dataCatch', () => {
	///////////////////////////////////////// 抽蛋、照蛋、加仔
	// 抽蛋、照蛋、加仔共用列表数据
	const tableList = ref([]);
	
	// 列表数据备份，删除数据时从这里复制过去
	var tableListBackups = ref([]);
	
	// 当前nfc标签鸽笼的下一个鸽笼信息，用于抽蛋、照蛋、加仔操作成功后的语音播放下一个鸽笼
	const nextCageNumber = ref(-1)
	const nextCageLeftRight = ref(-1)
	const nextCagePosition = ref(-1)
	
	
	// 设置列表数据（使用手机内存进行缓存），同时在手机本地磁盘备份一份
	const setTableList = (list) => {
		tableList.value = list;
		// 由于直接赋值是浅拷贝，tableList.value修改了，tableListBackups.value也会改变，需要先转换一下类型在赋值。
		tableListBackups = JSON.parse(JSON.stringify(list));
		
		try {
			uni.setStorageSync('storage_tableList', list);
			uni.setStorageSync('storage_tableListBackups', tableListBackups);
			console.log('本地磁盘备份成功。');
		} catch (e) {
			// error
			console.log('本地磁盘备份失败。');
		}
	}
	
	// 获取列表数据
	const getTableList = () => {
		// 先从内存获取缓存数据，若内存中不存在或丢失，则从手机磁盘获取
		if(tableList.value.length != 0){
			return tableList.value;
		}
		
		
		try {
			tableList.value = uni.getStorageSync('storage_tableList');
			// 由于从手机磁盘获取数据，说明之前的内存数据都丢失了，所以备份列表数据也需要从本地磁盘获取一次
			tableListBackups = uni.getStorageSync('storage_tableListBackups');
			if (storageTableList) {
				console.log('本地磁盘获取成功。',storageTableList);
			}
		} catch (e) {
			// error
			console.log('本地磁盘获取失败。',e);
		}

		
		return tableList.value;
		
	}
	
	// 清空列表数据
	const cleanTableList = () => {
		tableList.value = [];
		
		try {
			uni.removeStorageSync('storage_tableList');
			uni.removeStorageSync('storage_tableListBackups');
			console.log('本地磁盘清除成功。');
		} catch (e) {
			// error
			console.log('本地磁盘清除失败。',e);
		}


	}
	
	
	// 修改某条数据的抽蛋状态。修改为已抽蛋
	const setLabelTakeOrHatch = (label) => {
		
		var nowCageIndex;
		
		tableList.value.filter(item => {
			if(item.panelCode == label){
				item.takeOrHatch = 0;
				nowCageIndex = tableList.value.indexOf(item);
			}
			
		} )
		// 最后一个鸽笼，下一个为第一个
		if(nowCageIndex === tableList.value.length-1){
			nextCageNumber.value = tableList.value[0].number;
			nextCageLeftRight.value = tableList.value[0].leftRight;
			nextCagePosition.value = tableList.value[0].position;
		// 否则为下一个鸽笼
		}else{
			nextCageNumber.value = tableList.value[nowCageIndex+1].number;
			nextCageLeftRight.value = tableList.value[nowCageIndex+1].leftRight;
			nextCagePosition.value = tableList.value[nowCageIndex+1].position;
		}

		try {
			uni.setStorageSync('storage_tableList', tableList.value);
			console.log('本地磁盘更新抽蛋状态成功。');
		} catch (e) {
			// error
			console.log('本地磁盘更新抽蛋状态失败。');
		}
		
	} 
	
	// 修改某条数据的照蛋状态，正常、光1、光2
	const setLabelLightEgg = (label, status) => {
		var nowCageIndex;
		tableList.value.filter(item => {
			if(item.panelCode == label){
				item.lightEgg = status;
				nowCageIndex = tableList.value.indexOf(item);
			}
		} )
		// 最后一个鸽笼，下一个为第一个
		if(nowCageIndex === tableList.value.length-1){
			nextCageNumber.value = tableList.value[0].number;
			nextCageLeftRight.value = tableList.value[0].leftRight;
			nextCagePosition.value = tableList.value[0].position;
		// 否则为下一个鸽笼
		}else{
			nextCageNumber.value = tableList.value[nowCageIndex+1].number;
			nextCageLeftRight.value = tableList.value[nowCageIndex+1].leftRight;
			nextCagePosition.value = tableList.value[nowCageIndex+1].position;
		}
	
		try {
			uni.setStorageSync('storage_tableList', tableList.value);
			console.log('本地磁盘更新照蛋状态成功。');
		} catch (e) {
			// error
			console.log('本地磁盘更新照蛋状态失败。');
		}
		
	} 
	
	// 修改某条数据的加仔状态，加仔3、加仔4
	const setLabelAddChild = (label, status) => {
		var nowCageIndex;
		tableList.value.filter(item => {
			if(item.panelCode == label){
				item.addChild = status;
				nowCageIndex = tableList.value.indexOf(item);
			}
		} )
	
		// 最后一个鸽笼，下一个为第一个
		if(nowCageIndex === tableList.value.length-1){
			nextCageNumber.value = tableList.value[0].number;
			nextCageLeftRight.value = tableList.value[0].leftRight;
			nextCagePosition.value = tableList.value[0].position;
		// 否则为下一个鸽笼
		}else{
			nextCageNumber.value = tableList.value[nowCageIndex+1].number;
			nextCageLeftRight.value = tableList.value[nowCageIndex+1].leftRight;
			nextCagePosition.value = tableList.value[nowCageIndex+1].position;
		}
		
		try {
			uni.setStorageSync('storage_tableList', tableList.value);
			console.log('本地磁盘更新加仔状态成功。');
		} catch (e) {
			// error
			console.log('本地磁盘更新加仔状态失败。');
		}
	} 
	
	
	// 抽蛋、照蛋、加仔页面异常登记
	const abnormalRegistration = (id, abnormal) => {
		tableList.value.filter(item => {
			if(item.id == id){
				item.abnormal = abnormal;
			}
		} )
		
		try {
			uni.setStorageSync('storage_tableList', tableList.value);
			console.log('本地磁盘更新异常登记成功。');
		} catch (e) {
			// error
			console.log('本地磁盘更新异常登记失败。');
		}
	}
	
	// 撤回操作 在top-button-list.vue进行编写
	const cancelLabelPumpingEgg = (id) => {

	console.log("item---", id);
		
		// 在备份列表中查询抽蛋操作之前的数据,需要使用json格式化，避免浅拷贝
		var preItem = JSON.parse(JSON.stringify(
			tableListBackups.filter(item => {
				if(item.id == id){
					return item;
				}
			})
		))
		
		console.log("preItem---", tableListBackups);
		var list = tableList.value.map(index => {
			console.log("index---", index);
			if(index.id == id){
				console.log("index---", preItem[0]);
				return index = preItem[0];
			}else{
				return index;
			}
		} )
	
		
		try {
			uni.setStorageSync('storage_tableList', list);
			console.log('本地磁盘撤回操作成功。');
		} catch (e) {
			// error
			console.log('本地磁盘撤回操作失败。');
		}
		
		tableList.value = list;
	}
	
	///////////////////////////////////////// 绑定鸽笼
	const bindingCageList = ref([])
	
	var bindingCageListBackups = []
	
	// 设置列表数据（使用手机内存进行缓存），同时在手机本地磁盘备份一份
	const setBindingCageList = (list) => {
		bindingCageList.value = list;
		// 由于直接赋值是浅拷贝，bindingCageList.value修改了，tableListBackups.value也会改变，需要先转换一下类型在赋值。
		bindingCageListBackups = JSON.parse(JSON.stringify(list));
		try {
			uni.setStorageSync('storage_bindingCageList', list);
			uni.setStorageSync('storage_bindingCageListBackups', bindingCageListBackups);
			console.log('本地磁盘备份成功。');
		} catch (e) {
			// error
			console.log('本地磁盘备份失败。');
		}
	}
	
	// 获取列表数据
	const getBindingCageList = () => {
		console.log("bindingCageList.value",bindingCageList.value);
		// 先从内存获取缓存数据，若内存中不存在或丢失，则从手机磁盘获取
		if(bindingCageList.value.length != 0){
			return bindingCageList.value;
		}
		
		try {
			bindingCageList.value = uni.getStorageSync('storage_bindingCageList');
			// 由于从手机磁盘获取数据，说明之前的内存数据都丢失了，所以备份列表数据也需要从本地磁盘获取一次
			bindingCageListBackups = uni.getStorageSync('storage_bindingCageListBackups');

			console.log('本地磁盘获取成功。',bindingCageList.value);
			
		} catch (e) {
			// error
			console.log('本地磁盘获取失败。',e);
		}
	
		
		return bindingCageList.value;
		
	}
	
	// 清空列表数据
	const cleanBindingCageList = () => {
		bindingCageList.value = [];
		
		try {
			uni.removeStorageSync('storage_bindingCageList');
			uni.removeStorageSync('storage_bindingCageListBackups');
			console.log('本地磁盘绑定鸽笼列表清除成功。');
		} catch (e) {
			// error
			console.log('本地磁盘绑定鸽笼列表清除失败。',e);
		}
	}
	
	const checkLabelBinding = (nfcValue, excludeCageId = null) => {
		if(!nfcValue || !bindingCageList.value || !Array.isArray(bindingCageList.value)){
			return null
		}
		for(let item of bindingCageList.value){
			if(!item || typeof item.id === 'undefined') continue;
			if(item.panelCode === nfcValue){
				if(excludeCageId && JSON.stringify(item.id) === JSON.stringify(excludeCageId)){
					continue
				}
				return item
			}
		}
		return null
	}
	
	// 绑定鸽笼
	const bandingCage = async(cageId, nfcValue, force = false) => {
		try{
			if(!cageId){
				console.warn("绑定失败：cageId为空")
				return
			}
			if(!nfcValue){
				console.warn("绑定失败：nfcValue为空")
				return
			}
			if(!bindingCageList.value || !Array.isArray(bindingCageList.value)){
				console.warn("绑定失败：bindingCageList不是有效数组")
				return
			}
			
			console.log("绑定id：", cageId);
			let found = false;
			
			if(!force){
				const existingCage = checkLabelBinding(nfcValue, cageId)
				if(existingCage){
					return {
						success: false,
						conflict: true,
						existingCage: existingCage
					}
				}
			}
			
			for(let item of bindingCageList.value){
				if(!item || typeof item.id === 'undefined') continue;
				
				if(item.panelCode === nfcValue && JSON.stringify(item.id) !== JSON.stringify(cageId)){
					item.panelCode = null;
				}
			}
			
			for(let item of bindingCageList.value){
				if(!item || typeof item.id === 'undefined') continue;
				
				if(JSON.stringify(item.id) === JSON.stringify(cageId)){
					found = true;
					console.log("绑定中...")
					item.panelCode = nfcValue;
					uni.showToast({
						title:"绑定成功",
						icon:"success"
					})
					break;
				}
			}
			
			if(!found){
				console.warn("未找到匹配的鸽笼:", cageId)
				uni.showToast({
					title:"未找到鸽笼",
					icon:"error"
				})
				return { success: false, conflict: false }
			}
			
			try {
				uni.setStorageSync('storage_bindingCageList', bindingCageList.value);
				console.log('本地磁盘更新绑定鸽笼列表状态成功。');
			} catch (e) {
				console.error('本地磁盘更新绑定鸽笼列表失败:', e);
			}
			
			return { success: true, conflict: false }
		}catch(e){
			console.error("bandingCage异常:", e)
			uni.showToast({
				title:"绑定异常",
				icon:"error"
			})
			return { success: false, conflict: false }
		}
	}
	
	// 取消绑定
	const unBandingCage = async(cageId) => {
		console.log("取消绑定id：", cageId);
		bindingCageList.value.filter(item => {
			console.log("取消绑定item：", item.id);
			if(JSON.stringify(item.id) === JSON.stringify(cageId)){
				console.log("修改");
				item.panelCode = null;
			}
		} )
		
		try {
			uni.setStorageSync('storage_bindingCageList', bindingCageList.value);
			console.log('本地磁盘更新绑定鸽笼列表状态成功。');
		} catch (e) {
			// error
			console.log('本地磁盘更新绑定鸽笼列表状态成功。');
		}
	}
	
	
	return{
		setTableList,
		getTableList,
		cleanTableList,
		setLabelTakeOrHatch,
		setLabelLightEgg,
		setLabelAddChild,
		abnormalRegistration,
		cancelLabelPumpingEgg,
		
		setBindingCageList,
		getBindingCageList,
		cleanBindingCageList,
		checkLabelBinding,
		bandingCage,
		unBandingCage,
		
		nextCageNumber,
		nextCageLeftRight,
		nextCagePosition
		
	}
	
})
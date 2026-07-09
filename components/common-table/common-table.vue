<template>

		<view class="content-table" >
				<uni-table :border="false" :stripe="false" emptyText="">
					<!-- 单独的表头用于固定 -->
					<uni-tr class="title">
						<uni-th width="55" align="center" >鸽笼
						编号</uni-th>
						<uni-th width="50" align="center">产蛋间隔</uni-th>
						<uni-th width="50" align="center">抽蛋</uni-th>
						<uni-th width="50" align="center">照蛋</uni-th>
						<uni-th width="50" align="center">加仔</uni-th>
						<uni-th width="50" align="center">孵化异常</uni-th>
						<uni-th width="50" align="center">窝次</uni-th>
					</uni-tr>
					<uni-tr >
						
					</uni-tr>
				</uni-table>
				<!-- 产蛋列表 -->
				<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-if="props.types === '产蛋'">
					<uni-table  :stripe="false" emptyText="暂无数据" >
						<!-- 隐藏表头 -->
							<uni-tr class="fake-title">
								<uni-th width="55"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
							</uni-tr>
							<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="selectLayEggDate(item.id,item.number,item.leftRight,item.position)">
								<uni-td width="55" align="center" v-if="useShed.cageMode === 0">{{item.number}}{{CommeonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="55" align="center" v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="50" align="center">{{item.interval}}</uni-td>
								<uni-td width="50" align="center">--</uni-td>
								<uni-td width="50" align="center">--</uni-td>
								<uni-td width="50" align="center">--</uni-td>
								<uni-td width="50" align="center">{{item.abnormal? item.abnormal : '--'}}</uni-td>
								<uni-td width="50" align="center">{{item.epoch}}</uni-td>
							</uni-tr>						
					</uni-table>				
				</scroll-view>
				
				<!-- 抽蛋列表 -->
				<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-else-if="props.types === '抽蛋'">
					<uni-table  :stripe="false" emptyText="暂无数据" >
						<!-- 隐藏表头 -->
							<uni-tr class="fake-title">
								<uni-th width="55"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
							</uni-tr>
							<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="selectLayEggDate(item.id,item.number,item.leftRight,item.position)">
								<uni-td width="55" align="center" v-if="useShed.cageMode === 0">{{item.number}}{{CommeonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="55" align="center" v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="50" align="center">{{item.interval}}</uni-td>
								<uni-td width="50" align="center" style="color: blue;">{{isRecommend(item.takeOrHatch)}}</uni-td>
								<uni-td width="50" align="center">--</uni-td>
								<uni-td width="50" align="center">--</uni-td>
								<uni-td width="50" align="center">{{item.abnormal? item.abnormal : '--'}}</uni-td>
								<uni-td width="50" align="center">{{item.epoch}}</uni-td>
							</uni-tr>						
					</uni-table>				
				</scroll-view>
				
				<!-- 照蛋列表 -->
				<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-else-if="props.types === '照蛋'">
					<uni-table  :stripe="false" emptyText="暂无数据" >
						<!-- 隐藏表头 -->
							<uni-tr class="fake-title">
								<uni-th width="55"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
							</uni-tr>
							<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="selectLayEggDate(item.id,item.number,item.leftRight,item.position)">
								<uni-td width="55" align="center" v-if="useShed.cageMode === 0">{{item.number}}{{CommeonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="55" align="center" v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="50" align="center">{{item.interval}}</uni-td>
								<uni-td width="50" align="center">留窝</uni-td>
								<uni-td width="50" align="center" style="color: blue;">{{isLight(item.lightEgg)}}</uni-td>
								<uni-td width="50" align="center">--</uni-td>
								<uni-td width="50" align="center">{{item.abnormal? item.abnormal : '--'}}</uni-td>
								<uni-td width="50" align="center">{{item.epoch}}</uni-td>
							</uni-tr>						
					</uni-table>				
				</scroll-view>
				
				<!-- 加仔 -->
				<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-else-if="props.types === '加仔'">
					<uni-table  :stripe="false" emptyText="暂无数据" >
						<!-- 隐藏表头 -->
							<uni-tr class="fake-title">
								<uni-th width="55"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
								<uni-th width="50"></uni-th>
							</uni-tr>
							<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="selectLayEggDate(item.id,item.number,item.leftRight,item.position)">
								<uni-td width="55" align="center" v-if="useShed.cageMode === 0">{{item.number}}{{CommeonUtils.translateLeftRight(item.leftRight)}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="55" align="center" v-else>{{item.number}}{{translatePosition(item.position)}}</uni-td>
								<uni-td width="50" align="center">{{item.interval}}</uni-td>
								<uni-td width="50" align="center">留窝</uni-td>
								<uni-td width="50" align="center">{{isLight(item.lightEgg)}}</uni-td>
								<uni-td width="50" align="center"  style="color: blue;">{{isAdd(item.addChild)}}</uni-td>
								<uni-td width="50" align="center">{{item.abnormal? item.abnormal : '--'}}</uni-td>
								<uni-td width="50" align="center">{{item.epoch}}</uni-td>
							</uni-tr>						
					</uni-table>				
				</scroll-view>
				
				<!-- 照蛋状态选择弹窗 -->
				<uni-popup  background-color="#fff" ref="selectLightEggStatusPopup" type="center" border-radius="10px 10px 10px 10px">
					<view class="light-egg-popup">
						<h3 style="text-align: center;">请选择照蛋状态</h3>
						<view class="button-list">
							<view v-for="item in lightEggStatus" :key="item.id" 
							:class="{ default: item.color === 'default', active: item.color === 'active'}"
							 @click="lightEggStatusButton(item.id,item.text)">{{item.text}}</view>
						</view>
						<view class="button-list-v2">
							<button type="default" @click="onconcel">取消</button>
							<button type="primary" @click="oncommit">确定</button>
						</view>
					</view>
				</uni-popup>
				
				<!-- 加仔数量选择弹窗 -->
				<uni-popup  background-color="#fff" ref="selectAddCubNumPopup" type="center" border-radius="10px 10px 10px 10px">
					<view class="add-cub-popup">
						<h3 style="text-align: center;">请选择加仔个数</h3>
						<view class="button-list">
							<view v-for="item in selectAddCubNums" :key="item.id" 
							:class="{ default: item.color === 'default', active: item.color === 'active'}"
							 @click="addCubNumButton(item.id,item.text)">{{item.text}}</view>
						</view>
						<view class="button-list-v2">
							<button type="default" @click="onconcelAddcub">取消</button>
							<button type="primary" @click="oncommitAddcub">确定</button>
						</view>
					</view>
				</uni-popup>
				
				<!-- 抽蛋模式选择弹窗，只在抽蛋页面弹出 -->
				<uni-popup class="selectTakeEggTypePopup" ref="selectTakeEggTypePopup" type="center" :is-mask-click="true"
				>
					<view class="selectTakeEggType">
						
						<view class="title">请选择抽蛋模式</view>
						  <uni-data-select
							v-model="value"
							:localdata="takeEggTypeList"
							@change="changeTakeEggType"
						  ></uni-data-select>
						<view class="selected-takeEggType">已选择:{{takeEggTypeText}}</view>
						
						<view class="buttons">
							<view  class="cancel" @click="cancelChangeTakeEggType">取消</view>
							<view  class="ok" @click="okChangeTakeEggType">确定</view>
							
						</view>
					</view>
				</uni-popup>
		</view>

</template>

<script setup>
import { ref,watch,onMounted } from 'vue';
import { onShow, onLoad } from '@dcloudio/uni-app'
import { useTokenStore } from '@/stores/token';
import { useShedStore } from '@/stores/shed';
import { useDateStore } from '@/stores/date';
import { useCageStore } from '@/stores/cage';
import { useStatusStore } from '@/stores/status';
import { useDataCatchStore } from '@/stores/dataCatch';
import { useTakeEggTypeStore } from '@/stores/takeEggType';
import jsonBig from 'json-bigint'
import { useBlueToothStore } from '@/stores/blueTooth.js';
import { useConfigDataStore } from '@/stores/configData';

import CommeonUtils from '@/utils/CommonUtils'

const useToken = useTokenStore()
const useShed = useShedStore()
const useDate = useDateStore()
const useCage = useCageStore()
const useStatus = useStatusStore()
const useDataCatch = useDataCatchStore()
const useTakeEggType = useTakeEggTypeStore()
const useBlueTooth = useBlueToothStore()
const useConfigData = useConfigDataStore()

const props = defineProps({
    types: String,
});

// 表格数据
const tableData = ref([])

// 获取今日日期 格式2022-10-13
const layEggDate = ref(useDate.layEggDate)
// 获取抽蛋操作时显示的日期
const takeEggDate = ref(useDate.currentSelectedTakeEggDate)
// 获取照蛋操作时显示的日期
const irradiatedEggDate = ref(useDate.currentSelectedIrradiatedEggDate)
// 获取加仔操作时显示的日期
const addCubDate = ref(useDate.currentSelectedAddCubDate)
// 保存nfc数据
const label = ref(null)

// 照蛋状态选择弹窗
const selectLightEggStatusPopup = ref(null)
// 照蛋状态列表
const lightEggStatus = ref([
	{ id: 0, color: 'default', text: '正常' },
	{ id: 1, color: 'default', text: '单蛋' },
	{ id: 2, color: 'default', text: '光1' },
	{ id: 3, color: 'default', text: '光2' }
])
// 选中的照蛋状态
const selectedLightEgg = ref(null)

// 加仔个数选择弹窗
const selectAddCubNumPopup = ref(null)
// 加仔状态列表
const selectAddCubNums = ref([
	{ id: 0, color: 'default', text: '加仔3' },
	{ id: 1, color: 'default', text: '加仔4' }
])
// 选中加仔状态
const selectedAddCubNum = ref(null)

// 控制抽蛋模式选择弹窗
const selectTakeEggTypePopup = ref(null);
// 抽蛋模式选择列表
const takeEggTypeList = ref([
	{
		"value": 0,
		"text": "全抽"
	},
	{
		"value": 1,
		"text": "一窝一抽"
	},
	{
		"value": 2,
		"text": "两窝一抽"
	},
]);
// 抽蛋模式选择
const value = ref(useTakeEggType.takeEggType);
const takeEggType = ref(useTakeEggType.takeEggType);
const takeEggTypeText = ref(useTakeEggType.takeEggTypeText);
// 切换抽蛋模式
const changeTakeEggType = ()=>{
	let i = takeEggTypeList.value.filter(item => item.value == value.value)
	takeEggType.value = i[0].value
	takeEggTypeText.value = i[0].text
}
// 取消选择抽蛋模式
const cancelChangeTakeEggType =function(){
	// 取消选择，页面展示的养殖仓还是原来的养殖仓信息
	takeEggType.value =useTakeEggType.takeEggType
	takeEggTypeText.value = useTakeEggType.takeEggTypeText
	selectTakeEggTypePopup.value.close()
}
// 确定选择的抽蛋模式
const okChangeTakeEggType =function(){
	useTakeEggType.takeEggType = takeEggType.value
	useTakeEggType.takeEggTypeText = takeEggTypeText.value
	// 查询抽蛋信息
	getTakeEggList()
	selectTakeEggTypePopup.value.close()
	
}



// 将鸽笼位置0 1 2映射为上中下
const translatePosition = (num)=>{
	if(num === 0){
		return "上"
	}
	if(num === 1){
		return "中"
	}
	if(num === 2){
		return "下"
	}
}


// watch(
// 	() => useDataCatch.tableListBackups,
// 	(newDate) => {
// 		console.log("备份列表更新了："+newDate);
// })

// 监听抽蛋操作页面的时间变化，每变化一次，重新执行一次查询表格数据
watch(
	() => useDate.currentSelectedTakeEggDate,
	(newDate) => {
	takeEggDate.value = newDate
	// 清除一次缓存
	useDataCatch.cleanTableList();
	getTakeEggList()
})

// 监听照蛋操作页面的时间变化，每变化一次，重新执行一次查询表格数据
watch(
	() => useDate.currentSelectedIrradiatedEggDate,
	(newDate) => {
	irradiatedEggDate.value = newDate
	useDataCatch.cleanTableList();
	getIrradiatedEggList()
})

// 监听加仔操作页面的时间变化，每变化一次，重新执行一次查询表格数据
watch(
	() => useDate.currentSelectedAddCubDate,
	(newDate) => {
	addCubDate.value = newDate
	useDataCatch.cleanTableList();
	getAddCubList()
})


// 操作成功播放下一个鸽笼的信息语音  // todo: 需要根据鸽笼编号模式添加播放 左、右语音
const playNextCageAudio = (type) => {
	let successType = null;
	if(type === '抽蛋'){
		successType = 'takeEggSuccess.mp3';
	}else if(type === '照蛋'){
		if(selectedLightEgg.value === 0){
			successType = 'lightEggNormal.wav';
		}else if(selectedLightEgg.value === 2){
			successType = 'ligheEggLight1.wav';
		}else if(selectedLightEgg.value === 3){
			successType = 'ligheEggLight2.wav';
		}
	}else if(type === '加仔'){
		if(selectedAddCubNum.value === 1){
			successType = 'addCub4.wav';
		}else{
			successType = 'addCub3.wav';
		}
	}
	
	// 获取当前标签的下一个鸽笼信息，用于后续的下一个鸽笼语音播放
	let nextCageNum = useDataCatch.nextCageNumber;
	let nextCagePos = useDataCatch.nextCagePosition;
	
	// 将鸽笼编号拆解为位数
	let nextCageNumDigits = CommeonUtils.getDigits(nextCageNum);
	// 将鸽笼位置翻译为上、中、下
	let nextCagePosTure = CommeonUtils.translatePositions(nextCagePos);
	
	console.log(nextCageNumDigits);
	console.log(nextCagePosTure);
	
	// 播放抽蛋成功语音，以及下一个需要操作的鸽笼
	// #######################################
	// 创建音频播放实例(操作成功音频)
	let audioContext1  = uni.createInnerAudioContext();
	audioContext1.src = `../../static/audio/${successType}`;
	audioContext1.play();
	
	let audioContext2  = uni.createInnerAudioContext();
	// 产蛋操作成功播放完后，播放（下一个音频）
	audioContext1.onEnded(()=>{
		audioContext2.src = '../../static/audio/next.wav';
		audioContext2.play();
		if (audioContext) {
		  try {
			audioContext.pause();
			audioContext.destroy()
			audioContext = null
		  } catch (e) {
			//TODO handle the exception
		  }
		}
	})
	
	let nextAudioContext = null;
	let preAudioContext = audioContext2;
	
	
	// 播放（鸽笼编号语音）
	for(let i = 0; i < nextCageNumDigits.length; i++){
		nextAudioContext  = uni.createInnerAudioContext();
		preAudioContext.onEnded(()=>{
			nextAudioContext.src = `../../static/audio/${nextCageNumDigits[i]}.mp3`;
			nextAudioContext.play();
			if (audioContext) {
			  try {
				audioContext.pause();
				audioContext.destroy()
				audioContext = null
			  } catch (e) {
				//TODO handle the exception
			  }
			}
		})
		
		preAudioContext = nextAudioContext;
	} 
	
	
	// 临时变量，为了解决是否需要播放左或右的语音
	let audioContextIfLeftOrRight = preAudioContext;
	
	
	// 如果为1笼6号的哥隆编号模式，还需要播放左或右的语音
	if(useShed.cageMode === 0){
		let audioContextLeftOrRight  = uni.createInnerAudioContext();
		
		// 将鸽笼左、右翻译为left、right
		let nextCageLeftRight= CommeonUtils.translateLeftRight2(useDataCatch.nextCageLeftRight);
		
		
		// 播放鸽笼左或右语音
		audioContextIfLeftOrRight.onEnded(()=>{
			audioContextLeftOrRight.src = `../../static/audio/${nextCageLeftRight}.wav`;
			audioContextLeftOrRight.play();
			if (audioContext) {
			  try {
				audioContext.pause();
				audioContext.destroy()
				audioContext = null
			  } catch (e) {
				//TODO handle the exception
			  }
			}
		})
		audioContextIfLeftOrRight = audioContextLeftOrRight;
	}
	
	
	
	let audioContextPos  = uni.createInnerAudioContext();
	// 播放鸽笼位置语音
	audioContextIfLeftOrRight.onEnded(()=>{
		audioContextPos.src = `../../static/audio/${nextCagePosTure}.mp3`;
		audioContextPos.play();
		if (audioContext) {
		  try {
			audioContext.pause();
			audioContext.destroy()
			audioContext = null
		  } catch (e) {
			//TODO handle the exception
		  }
		}
	})
	
}



const lastAssignedTime = ref(new Date());
// 监听手环是否读取了nfc数据，读取了就要进行相关的产蛋、抽蛋操作
watch(()=> useBlueTooth.nfcData,
	(newNfc,oldNfc)=>{ // newNfc就是读取的数据
	console.log("新读取的数据："+newNfc);
	// // 先清空音频播报列表
	// audioList.value = []
	if(newNfc === null){
		return
	}

		// 产蛋页面
		if(props.types === "产蛋"){
			// 判断是否录入同样的数据了
			var labelExists = tableData.value.some(function(item) {
			    return item.panelCode === newNfc;
			});
			if(labelExists){
				console.log(labelExists);
				uni.showToast({
					title:"请勿重复操作",
					icon:'error'
				})
				return
			}
			label.value = newNfc;
			uni.request({
				url:getApp().globalData.url+`/app/addLayEggRecord?date=${layEggDate.value}&shedId=${useShed.shedId}&label=${label.value}`,
				header:{
					token:useToken.token
				},
				success: (res) => {
					if(res.data.code === 4002){
						uni.showToast({
							title:"服务异常",
							icon:'error'
						})
					}else if(res.data.code === 4003){
						uni.showToast({
							title:"未绑定鸽笼",
							icon:'error'
						})
					}else if(res.data.code === 4004){
						uni.showToast({
							title:"空笼",
							icon:'error'
						})
					}else{
						/////////////////////////去掉播报具体的鸽笼号，后面可以加上
						// let resList = res.data.data.split('')
						// for(let i=0;i<resList.length;i++){
						// 	// 添加音频播报列表
						// 	//'../../static/audio/1.mp3','../../static/audio/up.mp3','../../static/audio/layEggSuccess.mp3'
						// 	if(resList[i] === "上" || resList[i] === "中" || resList[i] === "下"){
						// 		if(resList[i] === "上"){
						// 			audioList.value.push(`../../static/audio/up.mp3`)
						// 		}else if(resList[i] === "中"){
						// 			audioList.value.push(`../../static/audio/middle.mp3`)
						// 		}else{
						// 			audioList.value.push(`../../static/audio/lower.mp3`)
						// 		}
						// 	}else{
						// 		audioList.value.push(`../../static/audio/${resList[i]}.mp3`)
						// 	}
						// }
						
						// #######################################
						// 创建音频播放实例
						const audioContext  = uni.createInnerAudioContext();
						audioContext.src = '../../static/audio/layEggSuccess.mp3';
						audioContext.autoplay = true;
						
						audioContext.onEnded(()=>{
							if (audioContext) {
							  try {
							    audioContext.pause();
							    audioContext.destroy()
							    audioContext = null
							  } catch (e) {
							    //TODO handle the exception
							  }
							}
						})
						
						// #######################################
					}
					getTodayLayEggList();
				},
				fail: () => {
					uni.showToast({
						title:"服务异常",
						icon:'error'
					})
				}
			})
		}
		// 抽蛋页面
		if(props.types === "抽蛋"){
			label.value = newNfc;
			// 判断是否为列表的鸽笼，不是就不能进行抽蛋
			var labelExists = tableData.value.some(function(item) {
			    return item.panelCode === newNfc;
			});
			if(!labelExists){
				uni.showToast({
					title:"非列表鸽笼",
					icon:'error'
				})
				// 创建音频播放实例
				const audioContext = uni.createInnerAudioContext();
				audioContext.src = '../../static/audio/nonListPigeonCage.wav';
				audio.sessionCategory = "ambient";
				audioContext.play(); 
				audioContext.onEnded(()=>{
					if (audioContext) {
					  try {
					    audioContext.pause();
					    audioContext.destroy()
					    audioContext = null
					  } catch (e) {
					    //TODO handle the exception
					  }
					}
				})
				return
			}else{
				// 标签存在，对缓存中的对应数据进行状态修改，修改为已抽蛋
				useDataCatch.setLabelTakeOrHatch(newNfc);
				
				// ##################语音播报#####################
				playNextCageAudio('抽蛋');
				// #######################################
			}
			
		
		}
		// 照蛋页面
		if(props.types === "照蛋"){
			label.value = newNfc;
			// 判断是否为列表的鸽笼，不是就不能进行抽蛋
			var labelExists = tableData.value.some(function(item) {
			    return item.panelCode === newNfc;
			});
			if(!labelExists){
				uni.showToast({
					title:"非列表鸽笼",
					icon:'error'
				})
				// 创建音频播放实例
				const audioContext  = uni.createInnerAudioContext();
				audioContext.src = '../../static/audio/nonListPigeonCage.wav';
				audioContext.autoplay = true;
				
				audioContext.onEnded(()=>{
					if (audioContext) {
					  try {
					    audioContext.pause();
					    audioContext.destroy()
					    audioContext = null
					  } catch (e) {
					    //TODO handle the exception
					  }
					}
				})
				return
			}
			// 先弹出选择框，进行照蛋状态的选择
			selectLightEggStatusPopup.value.open();
		}
		// 加仔页面
		if(props.types === "加仔"){
			label.value = newNfc;
			// 判断是否为列表的鸽笼，不是就不能进行抽蛋
			var labelExists = tableData.value.some(function(item) {
			    return item.panelCode === newNfc;
			});
			if(!labelExists){
				uni.showToast({
					title:"非列表鸽笼",
					icon:'error'
				})
				// 创建音频播放实例
				const audioContext  = uni.createInnerAudioContext();
				audioContext.src = '../../static/audio/nonListPigeonCage.wav';
				audioContext.autoplay = true;
				
				audioContext.onEnded(()=>{
					if (audioContext) {
					  try {
					    audioContext.pause();
					    audioContext.destroy()
					    audioContext = null
					  } catch (e) {
					    //TODO handle the exception
					  }
					}
				})
				return
			}
			// 先弹出选择框，进行照蛋状态的选择
			selectAddCubNumPopup.value.open();
		}
	}, {
	  // deep选项确保即使新旧值相同，也能触发监听
	  deep: true
	}
)
	// 控制选中时按钮颜色变化
	const  lightEggStatusButton = (index,text)=>{
		// 重置所有按钮的颜色
		lightEggStatus.value.forEach((btn) => {
		  if (index === btn.id) {
			btn.color = 'active'; // 点击的按钮变色
		  } else {
			btn.color = 'default'; // 其他按钮恢复默认颜色
		  }
		})
		selectedLightEgg.value = index
	}
	
	
	// 取消更新照蛋记录
	const onconcel = ()=>{
		selectLightEggStatusPopup.value.close();
	}
	
	// 更新一条照蛋记录
	const oncommit = ()=>{
		// 更新缓存
		useDataCatch.setLabelLightEgg(label.value, selectedLightEgg.value);
		// #######################################
		// // 创建音频播放实例
		// const audioContext  = uni.createInnerAudioContext();
		// // 正常
		// if(selectedLightEgg.value === 1){
		// 	audioContext.src = '../../static/audio/lightEggNormal.wav';
		// }else if(selectedLightEgg.value === 2){
		// 	audioContext.src = '../../static/audio/ligheEggLight1.wav';
		// }else{
		// 	audioContext.src = '../../static/audio/ligheEggLight2.wav';
		// }
		// audioContext.autoplay = true;
		// audioContext.onEnded(()=>{
		// 	if (audioContext) {
		// 	  try {
		// 		audioContext.pause();
		// 		audioContext.destroy()
		// 		audioContext = null
		// 	  } catch (e) {
		// 		//TODO handle the exception
		// 	  }
		// 	}
		// })
		// // #######################################
		// ##################语音播报#####################
		playNextCageAudio('照蛋');
		// #######################################
		
	selectLightEggStatusPopup.value.close();
	getIrradiatedEggList()
	
	}
	
	// 控制选中时按钮颜色变化
	const  addCubNumButton = (index,text)=>{
		// 重置所有按钮的颜色
		selectAddCubNums.value.forEach((btn) => {
		  if (index === btn.id) {
			btn.color = 'active'; // 点击的按钮变色
		  } else {
			btn.color = 'default'; // 其他按钮恢复默认颜色
		  }
		})
		selectedAddCubNum.value = index
	}
	
	
	// 取消更新照蛋记录
	const onconcelAddcub = ()=>{
		selectAddCubNumPopup.value.close();
	}
	
	// 更新一条加仔记录
	const oncommitAddcub = ()=>{
		// 更新缓存
		useDataCatch.setLabelAddChild(label.value, selectedAddCubNum.value);
		// // #######################################
		// // 创建音频播放实例
		// const audioContext  = uni.createInnerAudioContext();
		// // 正常
		// if(selectedAddCubNum.value === 1){
		// 	audioContext.src = '../../static/audio/addCub4.wav';
		// }else{
		// 	audioContext.src = '../../static/audio/addCub3.wav';
		// }
		// audioContext.autoplay = true;
		// audioContext.onEnded(()=>{
		// 	if (audioContext) {
		// 	  try {
		// 		audioContext.pause();
		// 		audioContext.destroy()
		// 		audioContext = null
		// 	  } catch (e) {
		// 		//TODO handle the exception
		// 	  }
		// 	}
		// })
		// // #######################################
		// ##################语音播报#####################
		playNextCageAudio('加仔');
		// #######################################
		selectAddCubNumPopup.value.close();
		getAddCubList()
	}	


// 监听是否有删除记录，有的话删除后需要刷新列表
watch(()=> useStatus.DELETE,
	(newStatus)=>{
		console.log(newStatus);
		if(props.types === "产蛋"){
			// 查询今天已经录入产蛋的信息
			getTodayLayEggList()
		}else if(props.types === '抽蛋'){
			// 查询需要抽蛋的列表
			getTakeEggList()
		}else if(props.types === '照蛋'){
			getIrradiatedEggList()
		}else if(props.types === '加仔'){
			getAddCubList()
		}
	}
)

// 根据传入的prop判断列表需要展示的数据类型
const init = ()=>{
	// console.log(props);
	if(props.types === "产蛋"){
		// 查询今天已经录入产蛋的信息
		getTodayLayEggList()
	}else if(props.types === '抽蛋'){
		// 查询需要抽蛋的列表
		// getTakeEggList()
		// 弹出抽蛋模式选择框，点击确定后开始查询需要抽蛋的列表
		setTimeout(()=>{
			selectTakeEggTypePopup.value.open()
		},500)
	}else if(props.types === '照蛋'){
		getIrradiatedEggList()
	}else if(props.types === '加仔'){
		getAddCubList()
	}
}


/**
 * 查询今天已经录入产蛋的信息
 */
const getTodayLayEggList = ()=>{
	uni.request({
		url:getApp().globalData.url+`/app/getLayEggFrom?date=${layEggDate.value}&shedId=${useShed.shedId}&cageNumMode=${useShed.cageMode}`,
		header:{
			token:useToken.token
		},
		dataType: 'String',
		success: (res) => {
			console.log("》今日已产蛋列表：",res);
			var parseRes = jsonBig.parse(res.data)
			if(parseRes.code === 0){
				console.log("》今日已产蛋列表：", parseRes.data);
				tableData.value = parseRes.data
				console.log("》今日已产蛋列表：", tableData.value);
				// 将今日产蛋总数存储到store中
				useCage.setLayEggCount(tableData.value.length)
				// 将有异常的数据总数存储到store中
				useCage.setLayEggErrorCount(tableData.value.filter(item => item.abnormal).length); 
				// console.log(useCage.layEggErrorCount);
			}
		},
		fail: (err) => {
			uni.showToast({
				title: '服务异常',
				duration: 1500,
				icon:'error'
			});
		}
	})
}
// 当错误录入产蛋信息时，点击相应的行后再点击删除就可已删除记录,查看记录同理
const selectLayEggDate = (selectedId,selectedNumber,selectedLeftRight,selectedPosition)=>{
	console.log("当前选中的记录：", selectedId);
	useCage.setSelectedRecordId(selectedId);
	useCage.setSelectedNumber(selectedNumber);
	useCage.setSelectedLeftRight(selectedLeftRight);
	useCage.setSelectedPosition(selectedPosition);
	// // 选中记录超过5秒钟，就清除选中的记录id 
	// // todo: 有bug
	// setTimeout(()=>{
	// 	useCage.RemoveSelectedRecordId();
	// 	useCage.RemoveSelectedCageCode();
	// },5000)
}



/**
 * 查询需要抽蛋的列表数据,c先从缓存取，缓存没有则直接向后台请求
 */
const getTakeEggList = ()=>{
	
	var datalist =  useDataCatch.getTableList();
	console.log("数据长度", datalist.length)
	if(datalist.length != 0){
		// 从缓存取数据
		tableData.value = datalist;
		console.log("从缓存取数据", datalist)
	}else{
		console.log("从后台取数据")
		uni.request({
			url:getApp().globalData.url+`/app/getTakeEggFrom?date=${takeEggDate.value}&shedId=${useShed.shedId}&cageNumMode=${useShed.cageMode}&type=${takeEggType.value}&isOrder=${useConfigData.isOrder}`,
			header:{
				token:useToken.token
			},
			dataType: 'String',
			success: (res) => {
				var parseRes = jsonBig.parse(res.data)
				console.log(parseRes)
				if(parseRes.code === 0){
					// 将查询到的列表数据进行缓存
					useDataCatch.setTableList(parseRes.data);
					// 从缓存取数据
					tableData.value = useDataCatch.getTableList();
					
					// 将抽蛋记录的总窝数存储到store中
					useCage.setTakeEggCount(tableData.value.length)
					// 将抽蛋记录的建议抽蛋数存储到store中(推荐抽蛋)
					useCage.setTakeEggSuggestCount(tableData.value.filter(item => item.pumpingEgg===2).length)
					// 将抽蛋记录的实际抽蛋数存储到store中（实际抽蛋）
					useCage.setTakeEggActuallyCount(tableData.value.filter(item => item.pumpingEgg===1).length)
					// 将抽蛋记录的异常数存储到store中
					useCage.setTakeEggErrorCount(tableData.value.filter(item => item.abnormal).length); 
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '服务异常',
					duration: 1500,
					icon:'error'
				});
			}
		})
	}

}
// 新增抽蛋信息

// 显示是否推荐抽蛋
const isRecommend = (num)=>{

	if(num == 0){
		return "√"
	}else if(num == 1){
		return "留窝"
	}else if(num == 2){
		return "推荐"
	}else if(num == 3){
		return "不推荐"
	}
}



/**
 * 查询需要照蛋的别表数据
 */
const getIrradiatedEggList = ()=>{
	
	var datalist =  useDataCatch.getTableList();
	if(datalist.length != 0){
		// 从缓存取数据
		tableData.value = datalist;
		console.log("从缓存取数据", datalist)
	}else{
		uni.request({
			url:getApp().globalData.url+`/app/getLightEggFrom?date=${irradiatedEggDate.value}&cageNumMode=${useShed.cageMode}&shedId=${useShed.shedId}&isOrder=${useConfigData.isOrder}`,
			header:{
				token:useToken.token
			},
			dataType:'String',
			success: (res) => {
				
				var parseData = jsonBig.parse(res.data);
				
				if(parseData.code === 0){
					// tableData.value = res.data.data
					// 将查询到的列表数据进行缓存
					useDataCatch.setTableList(parseData.data);
					// 从缓存取数据
					tableData.value = useDataCatch.getTableList();
					
					// 将照蛋记录的总窝数存储到store中
					useCage.setIrradiateEggCount(tableData.value.length)
					// 将照蛋记录的异常数存储到store中
					useCage.setIrradiateEggErrorCount(tableData.value.filter(item => item.abnormal).length)
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '服务异常',
					duration: 1500,
					icon:'error'
				});
			}
		})
	}
}
// 新增照蛋信息

// 显示照蛋状态
const isLight = (num)=>{

	if(num === 0){
		return "正常"
	}else if(num === 1){
		return "单蛋"
	}else if(num === 2){
		return "光1"
	}else if(num === 3){
		return "光2"
	}else{
		return "未照蛋"
	}
}



/**
 * 查询需要加仔的列表数据
 */
const getAddCubList = ()=>{
	
	var datalist =  useDataCatch.getTableList();
	if(datalist.length != 0){
		// 从缓存取数据
		tableData.value = datalist;
		console.log("从缓存取数据", datalist)
	}else{
		uni.request({
			url:getApp().globalData.url+`/app/getAddCubFrom?date=${addCubDate.value}&cageNumMode=${useShed.cageMode}&shedId=${useShed.shedId}&isOrder=${useConfigData.isOrder}`,
			header:{
				token:useToken.token
			},
			dataType:'String',
			success: (res) => {
				
				var parseData = jsonBig.parse(res.data);
				if(parseData.code === 0){
					// tableData.value = res.data.data
					// 将查询到的列表数据进行缓存
					useDataCatch.setTableList(parseData.data);
					// 从缓存取数据
					tableData.value = useDataCatch.getTableList();
					
					// 将加仔记录的总窝数存储到store中
					useCage.setAddCubCount(tableData.value.length)
					// 将照蛋记录的异常数存储到store中
					useCage.setAddCubErrorCount(tableData.value.filter(item => item.abnormal).length)
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '服务异常',
					duration: 1500,
					icon:'error'
				});
			}
		})
		
	}

}

// 显示加仔情况
const isAdd = (num)=>{

	if(num == 0){
		return "加仔3"
	}else if(num == 1){
		return "加仔4"
	}else{
		return "未加仔"
	}
}


onShow (()=>{
	init();
	console.log("出发了");
 	useBlueTooth.listenCharacteristicValueChange();
})



</script>

<style lang="scss" scoped>
	.content-table{
		background: #F8F8F8;
		padding: 10rpx 25rpx;
		width: 700rpx;
		height: 1080rpx;
		.title{
			background-color: rgba(204, 204, 204, 0.4);

		}
			
		.scro{
			// position: relative; /* 或者 absolute、fixed */
			//   z-index: 1000;
			margin-top: 10rpx;
			max-height: 950rpx;
			.fake-title{
				height: 0rpx;
				.uni-table-th{
					height: 0rpx;
					padding: 0rpx
				}
			}
			
		}
		
		.selectTakeEggTypePopup{
			.selectTakeEggType{
				width: 600rpx;
				height: 400rpx;
				background: white;
				border-radius: 15rpx;
				.title{
					font-size: 50rpx;
					color: #0066FF;
					font-weight: 600;
					padding: 20rpx;
					text-align: center;
				}
				.uni-select__input-box{
					height: 50rpx;
				}
				.selected-takeEggType{
					font-size: 40rpx;
					color: #0066FF;
					font-weight: 600;
					margin-top: 30rpx;
					padding: 20rpx;
					text-align: center;
				}
				.buttons{
					margin: 5rpx 30rpx;
					display: grid;
					grid-template-columns: repeat(2,1fr);
					gap: 20rpx;
					font-weight: 600;
					color: white;
					.cancel{
						height: 80rpx;
						background: orangered;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 20rpx;
					}
					.ok{
						height: 80rpx;
						background: #0066FF;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 20rpx;
					}
				}
			}
		}
		
		.light-egg-popup{
			width: 650rpx;
			height: 430rpx;
			// border: 1px solid;
			.button-list{
				margin: 40rpx 20rpx 20rpx 20rpx;
				display: grid;
				grid-template-columns: repeat(2,2fr);
				gap: 15rpx;
				.default {
					background-color: #fff; 
					color: #000; 
					border: 1px solid ;
					height: 90rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15rpx;
				}
				.active { 
					background-color: #007aff; 
					color: #fff; 
					border: 1px solid ;
					height: 90rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15rpx;
				}
			}
			.button-list-v2{
				margin: 30rpx;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 15rpx;
				button{
					width: 200rpx;
				}
			}
		}
		.add-cub-popup{
			width: 650rpx;
			height: 350rpx;
			// border: 1px solid;
			.button-list{
				margin: 40rpx 20rpx 20rpx 20rpx;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 15rpx;
				.default {
					background-color: #fff; 
					color: #000; 
					border: 1px solid ;
					height: 90rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15rpx;
				}
				.active { 
					background-color: #007aff; 
					color: #fff; 
					border: 1px solid ;
					height: 90rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15rpx;
				}
			}
			.button-list-v2{
				margin: 30rpx;
				display: grid;
				grid-template-columns: repeat(2,1fr);
				gap: 15rpx;
				button{
					width: 200rpx;
				}
			}
		}
	}



</style>
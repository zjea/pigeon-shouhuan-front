<template>
	<view class="layout">
		<view class="pic">
			<image src="../../static/logo.png"></image>
		</view>
		<view class="login-box">
			<view class="inner-box">
				<h3 class="title">鸽子信息采集系统</h3>
				<view class="uinput uni-form-item uni-column">
					<input class="uni-input" v-model="LoginFrom.username" placeholder="请输入账号" />
				</view>
				<view class="uinput" >
					<input class="uni-input" v-model="LoginFrom.password" password placeholder="请输入密码" />
				</view>
				<label class="chbox">
					<checkbox :value="isRemaber"/>记住账号
				</label>
				<view class="login-button" >
					<button type="primary" size="default" plain="true" @click="login">登录</button>
				</view>				
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import jsonBig from 'json-bigint'
const LoginFrom = ref({
	username:'',
	password:''
})
const isRemaber = ref(false)


import {useTokenStore} from '@/stores/token.js'
import {useUserStore} from '@/stores/user.js'
import { useShedStore } from '../../stores/shed';
const useToken = useTokenStore()
const useUser = useUserStore()
const useShed = useShedStore()

const login = function(){
	// 登录验证
	uni.request({
		method:'POST',
		url:getApp().globalData.url+"/app/login",
		data:LoginFrom.value,
		success: (res) => {
			// 账号密码验证成功
			if(res.data.code === 0){
				// 登陆成功，将token存储到store中
				useToken.setToken(res.data.token)
				setUseUserStore()
				setUseShedStore()
				
				uni.showToast({
					title: '登录成功',
					duration: 1000,
					icon:'loading'
				});
				
				// 需要延迟一点时间，不然手机登陆后不会展示信息
				setTimeout(()=>{
					uni.navigateTo({
						url:"/pages/index/index"
					})
				},1000)
			}else{
				uni.showToast({
					title: '账号或密码错误',
					duration: 1500,
					icon:'error'
				});
			}
		},
		fail: (err) => {
			uni.showToast({
				title: '服务异常',
				duration: 2000,
				icon:'error'
			});
		}
	})
	
	if(isRemaber){
		// 若勾选了记住账号，将账号存储在本地
		uni.setStorage({
			key: 'storage_username',
			data: LoginFrom.value.username,
			success: function () {
				console.log('success');
			}
		});
	}else{
		uni.removeStorage({
			key: 'storage_username',
			success: function (res) {
				console.log('success');
			}
		});

	}

	
	
	//更具token查询用户信息，将信息存储到store中
	const setUseUserStore = ()=>{
		uni.request({
			method:'POST',
			url:getApp().globalData.url+"/breed/user/app/getUserInfoByToken",
			header:{
				token:useToken.token
			},
			dataType:'String',
			success: (res) => {
				
				const jsonData = jsonBig.parse(res.data)
				// 登陆成功，将用户信息存储到store中
				useUser.setUserId(jsonData.data.id)
				useUser.setUsername(jsonData.data.name)
				useUser.setNickname(jsonData.data.name)
				useUser.setBaseId(jsonData.data.baseId)
				useShed.setShedList(jsonData.data.userShedList)
				// console.log(res.data.data.userId);
				// console.log(res.data.data.username);
				// console.log(res.data.data.nickname);
				// console.log(res.data.data.baseId);
			}
		})
	}

	const setUseShedStore = ()=>{
		// //更具token查询Shed列表
		// uni.request({
		// 	method:'POST',
		// 	url:getApp().globalData.url+"/breed/pigeonshed/app/getUserShedByToken",
		// 	header:{
		// 		token:useToken.token
		// 	},
		// 	success: (res) => {
		// 		// console.log(res.data);
		// 		// 登陆成功，将用户相关Shed信息存储到store中
		// 		useShed.setShedList(res.data.data)
		// 	}
		// })
		useShed.setShedList(useShed.setShedList)
	}
	
}


onMounted(()=>{
	try {
		const value = uni.getStorageSync('storage_username');
		if (value) {
			LoginFrom.value.username = value;
			console.log(value);
		}
	} catch (e) {
		// error
	}

})


</script>

<style lang="scss" scoped>
// body{
// 	height: 300rpx;
// }
.layout{
	 overflow: hidden;
	 .pic{
		 // border: 1px solid;
		 margin: 50rpx auto;
		 width: 200rpx;
		 height: 200rpx;
		 border-radius: 100%;
		 background: skyblue;
		 image{
			 width: 100%;
			 height: 100%;
		 }
	 }
	.login-box{
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		border-radius: 20rpx;
		margin: 50rpx auto;
		width: 600rpx;
		height: 600rpx;
		.inner-box{
			margin: 0rpx 20rpx 0 20rpx;
			// border: 1px solid red;
			.title{
				text-align: center;
				padding: 30rpx 0 80rpx 0;
			}
			.uinput{
				width: 500rpx;
				height: 80rpx;
				border: 1px solid #CCCCCC;
				margin: 20rpx auto;
				border-radius: 20rpx;
				.uni-input{
					display: flex;
					height: 100%;
					align-items: center;
					margin-left: 30rpx;
				}
			}
			label{
				margin-left: 28rpx;
			}
			.login-button{
				width: 500rpx;
				margin: 50rpx auto;
			}
		}
		
	}
}


</style>

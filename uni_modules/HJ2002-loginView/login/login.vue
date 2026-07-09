<template>
  <view class="page">
    <view class="top-background-raduis"> </view>
    <view class="login-box">
      <view class="login-card-title">
        <view class="login-card-title-content"> 账号密码登录 </view>
      </view>
      <view class="login-card-input">
        <!-- 输入框头部图标 -->
        <uni-easyinput
          class="hj-input"
          v-model="value"
          focus
          maxlength="30"
          :trim="true"
          @focus="UserNamePassWrodFocusBorderStyle"
          :styles="inputColorConfigToUserName"
          @blur="UserNamePassWrodBlurBorderStyle"
          placeholder="请输入账号"
        ></uni-easyinput>
        <!-- 输入框头部图标 -->
        <uni-easyinput
          class="hj-input"
          v-model="value"
          type="password"
          @focus="PassWordFocusBorderStyle"
          @blur="PassWordBlurBorderStyle"
          :styles="inputColorConfigToPassWord"
          placeholder="请输入密码"
        ></uni-easyinput>
      </view>
      <view class="login-card-loginIn">
        <view class="login-card-loginIn-btn">
          登 录
        </view>
      </view>
       <view class="login-bottom-info">
         忘记密码
       </view>
    </view>
     <view class="bottom-message">
       登录/注册代表你已同意《xxx使用协议》
     </view>
  </view>
</template>

 
<script>
//import {  } from "@/common/api/{$}.js";
export default {
  data() {
    return {
      // 输入框边框颜色默认值
      colorDefault:'#b4b4b4',
      // 输入框边框聚焦值
      colorFocusColor:'#3cb79a',
      // 输入框颜色配置
      inputColorConfigToUserName: {
        color: "#000000",
        disableColor: "#eee",
        borderColor: "#b4b4b4",
      },
      // 输入框颜色配置
      inputColorConfigToPassWord: {
        color: "#000000",
        disableColor: "#eee",
        borderColor: "#b4b4b4",
      },
      value: "",
    };
  },
  //监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad
  onInit() {},
  //监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参）
  onLoad() {},
  //监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
  onReady() {},
  //监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
  beforeDestroy() {},
  //页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。
  onReachBottom() {},
  onShareAppMessage() {},
  created() {},
  methods: {
    // 输入框聚焦变换边框样式
    UserNamePassWrodFocusBorderStyle(){
      this.inputColorConfigToUserName.borderColor
      = this.colorFocusColor;
    },
    PassWordFocusBorderStyle(){
      this.inputColorConfigToPassWord.borderColor
      = this.colorFocusColor;
    },
    // 输入框失去焦点变换边框样式
    UserNamePassWrodBlurBorderStyle(){
      this.inputColorConfigToUserName.borderColor
      = this.colorDefault;
    },
    PassWordBlurBorderStyle(){
      this.inputColorConfigToPassWord.borderColor
      = this.colorDefault;
    },

  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.page {
  position: relative;
  height: 100vh;
}
.top-background-raduis {
  height: 30%;
  background-color: #d8d8d8;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}
/deep/ .is-input-border{
  border-radius: 7px !important;
}
/deep/ .uni-easyinput__content{
  min-height: 39px !important;
}
.hj-input {
  margin-top: 15rpx;
}
.hj-input:nth-child(2) {
  margin-top: 35rpx;
}
.login-box {
  top: 20%;
  position: absolute;
  width: 80%;
  left: 10%;
  right: 10%;
  height: 550rpx;
  padding: 30rpx;
  background-color: white;
  border-radius: 40rpx;
  box-shadow: 9px 9px 6px #e3e3e3;
  .login-card-input {
    // background-color: violet;
    height: 50%;
    padding: 5rpx;
  }
  .login-card-title {
    height: 20%;
    // background-color: black;
    padding: 10rpx;
    display: flex;
    justify-content: center;
    .login-card-title-content {
      font-size: 1.2em;
      color: #3cb79a;
      border-bottom: 3px solid #3cb79a;
    }
  }
  .login-card-loginIn{
    height: 25%;
    display: flex;
    justify-content: center;
    padding: 10rpx;
    align-items: center;
    .login-card-loginIn-btn{
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #3cb79a;
      width: 100%;
      font-size: 1.2em;
      height: 80%;
      border-radius: 40rpx;
      color: white;
    }
  }
  .login-bottom-info{
    height: 5%;
    display: flex;
    font-size: 0.7em;
    color: #3cb79a;
    justify-content: end;

  }
}
.bottom-message{
  position: absolute;
  height: 70rpx;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 0.9em;
  overflow: hidden;
  color: #969898;
  bottom: 40rpx;
}
</style>
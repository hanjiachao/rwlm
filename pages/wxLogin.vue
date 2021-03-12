<template>
	<view class="page">
		<headerBar id="header" :showBg="false"></headerBar>
		<image class="bg" src="/static/loginBg.png"></image>
		<view class="login">
			<image class="loginBg" src="/static/frameBg.png"></image>
			<view class="frame">
				<block v-if="step == 1">
					<button class="btn" :class="step != 1 || 'active'" @getuserinfo="getUserInfo" open-type="getUserInfo">授权</button>
					<view class="btn">登录</view>
				</block>
				<block v-if="step == 2">
					<view class="btn">已授权</view>
					<button class="btn" :class="step != 2 || 'active'" @getphonenumber="getMobile" open-type="getPhoneNumber">登录</button>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '@/utils/common'
	import header from '@/components/header'
	export default {
		components: {
			headerBar: header
		},
		data() {
			return {
				step: uni.getStorageSync('userInfo') ? 2 : 1
			}
		},
		methods:{
			getUserInfo(e){
				if (e.detail.userInfo) {
					uni.login({
						provider: 'weixin',
						success: res => {
							uni.setStorageSync('userInfo',e.detail.userInfo)
							this.step = 2
							this.getOpenId(res.code)
						}
					})
				}
			},
			getOpenId(code) {
				common.ajax({
					url: 'Login/getOpenid',
					showLoading: false,
					data: {
						code: code
					},
					success: res => {
						uni.setStorageSync('sessionKey',res.session_key)
						uni.setStorageSync('openId',res.openid)
						this.step = 2
					},
					fail: res => {
						common.toast(res.msg)
					}
				})
			},
			getMobile(e){
				if(this.mobile){
					this.login()
				}else if(e.detail.errMsg == 'getPhoneNumber:ok'){
					common.ajax({
						url: 'Login/getMobileData',
						data: {
							se_key: uni.getStorageSync('sessionKey'),
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						},
						success: res => {
							let mobile = res.list.phoneNumber
							uni.setStorageSync('mobile',mobile)
							this.register()
						}
					})
				}
			},
			register(){
				common.ajax({
					url: 'Login/wxRegister',
					data: {
						openid: uni.getStorageSync('openId'),
						mobile: uni.getStorageSync('mobile'),
						nickname: uni.getStorageSync('userInfo').nickName,
						headimg: uni.getStorageSync('userInfo').avatarUrl
					},
					success: res => {
						uni.setStorageSync('token',res.access_token)
						let pages = getCurrentPages()
						let page = pages[pages.length - 2]
						page.onLoad()
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.page{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.bg{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		.login{
			width: 600rpx;
			height: 630rpx;
			position: relative;
			.loginBg{
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				z-index: -1;
			}
			.frame{
				width: 510rpx;
				height: 360rpx;
				position: absolute;
				left: 50rpx;
				bottom: 50rpx;
				padding-top: 50rpx;
				box-sizing: border-box;
				.title{
					font-size: 30rpx;
					line-height: 50rpx;
					font-weight: bold;
					text-align: center;
				}
				.tip{
					color: #999;
					text-align: center;
				}
				.btn{
					width: 210rpx;
					margin: 40rpx auto;
					line-height: 70rpx;
					border-radius: 35rpx;
					text-align: center;
					font-size: 30rpx;
					color: #fff;
					background: #E7E6EB;
					&.active{background: linear-gradient(90deg, #3654D4, #F745F1)}
				}
			}
		}
	}
</style>

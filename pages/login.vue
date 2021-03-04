<template>
	<view class="page">
		<image class="bg" src="/static/loginBg.png"></image>
		<view class="login">
			<image class="loginBg" src="/static/loginFrame.png"></image>
			<view class="frame">
				<view class="title">请输入邀请码</view>
				<input ref="codeInput" type="password" placeholder="请输入邀请码" v-model="code">
				<view class="btn" @click="login">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '@/utils/common'
	export default {
		data() {
			return {
				code: '',
				mobile: ''
			}
		},
		methods:{
			login(){
				if(!this.code){
					common.toast('请输入邀请码')
					return false
				}
				common.ajax({
					url: 'Login/verifyInviteCode',
					showLoading: false,
					data: {
						invite_code: this.code
					},
					success: res => {
						uni.setStorageSync('inviteCode',this.code)
						uni.switchTab({
							url: 'index'
						})
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
				input{
					width: 440rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 30rpx;
					text-align: center;
					background: #E7E6EB;
					margin: 30rpx auto 0;
					z-index: 10000;
				}
				.btn{
					margin: 40rpx auto 0;
					width: 210rpx;
					line-height: 70rpx;
					border-radius: 35rpx;
					text-align: center;
					font-size: 30rpx;
					color: #fff;
					background: linear-gradient(90deg, #3654D4, #F745F1);
				}
			}
		}
	}
</style>

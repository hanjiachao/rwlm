<template>
	<view class="page" v-if="showLogin">
		<view class="loginContent">
			<image class="img" src="/static/logo.png" mode="widthFix"></image>
			<view class="btns">
				<button class="login" @getuserinfo="getUserInfo" open-type="getUserInfo">微信账号登录</button>
				<view class="cancel" @click="cancel">暂不登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '@/utils/common'
	export default {
		props: {
			showLogin: {
				type: Boolean,
				value: false,
			}
		},
		data() {
			return {
				
			}
		},
		methods:{
			getUserInfo(e){
				let info = e.detail
				if (info.userInfo) {
					let that = this
					uni.login({
						provider: 'weixin',
						success: function (res) {
							info.code = res.code
							that.login(info)
						}
					})
				}
				this.cancel()
			},
			login(info) {
				common.ajax({
					url: 'User/third',
					data: {
						rawData: info.rawData,
						code: info.code,
						platform: 'wechatmini'
					},
					success: res => {
						let data = res.data
						uni.setStorageSync('token',data.userinfo.token)
						uni.setStorageSync('userInfo',data.userinfo)
						uni.setStorageSync('loginInfo',data.thirdinfo)
						this.$parent.getPage()
					},
					fail: res => {
						common.toast(res.msg)
					}
				})
			},
			cancel(){
				this.$emit('hideLogin')
			}
		}
	}
</script>

<style lang="less" scoped>
	.page{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loginContent{
		width: 560rpx;
		border-radius: 24rpx;
		overflow: hidden;
		.img{
			width: 100%;
			height: 370rpx;
			display: block;
		}
		.btns{
			height: 170rpx;
			padding-top: 60rpx;
			background: #fff;
			.login{
				width: 360rpx;
				line-height: 72rpx;
				border-radius: 36rpx;
				background: linear-gradient(#f22, #d00);
				color: #fff;
				font-size: 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 auto;
				.loginIcon{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
			}
			.cancel{
				line-height: 75rpx;
				color: #606F52;
				font-size: 26rpx;
				text-align: center;
			}
		}
	}
</style>

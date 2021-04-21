<template>
	<view class="header" :class="{'bg': showBg,'android': isAndroid}">
		<view class="statusBar"></view>
		<image class="back" src="/static/back.png" v-if="showBack" @click="goBack"></image>
		<view class="text" :style="'color:' + color">{{title}}</view>
	</view>
</template>

<script>
	import common from '@/utils/common'
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#fff'
			},
			showBg: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				showBack: false,
				back: 1,
				isLoginPage: false,
				isAndroid: false
			}
		},
		mounted() {
			this.isAndroid = uni.getSystemInfoSync().platform === 'android'
			let pages = getCurrentPages()
			let page = pages[pages.length - 1]
			let isLoginPage = page.route == 'pages/wxLogin'
			if(isLoginPage || pages.length > 1){
				this.isLoginPage = isLoginPage
				this.showBack = true
			}
		},
		methods:{
			goBack(){
				let pages = getCurrentPages()
				if(this.isLoginPage){
					if(pages.length > 2){
						uni.navigateBack({
							delta: 2
						})
					}else{
						uni.switchTab({
							url: 'index'
						})
					}
				}else{
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.header{
		padding-bottom: 15rpx;
		&.android{
			padding-bottom: 5rpx;
			.statusBar{padding-top: 20rpx}
		}
		&.bg{
			background: url(/static/headerBg.png);
			background-size: 100% auto;
		}
		.statusBar{
			height: var(--status-bar-height);
		}
		.back{
			position: absolute;
			width: 36rpx;
			height: 36rpx;
			padding: 17rpx 20rpx;
		}
		.text{
			font-size: 28rpx;
			line-height: 70rpx;
			text-align: center;
		}
	}
</style>

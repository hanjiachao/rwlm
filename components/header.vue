<template>
	<view class="header" :class="!showBg || 'bg'">
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
				showBack: false
			}
		},
		mounted() {
			if(getCurrentPages().length > 1){
				this.showBack = true
			}
		},
		methods:{
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less" scoped>
	.header{
		padding-bottom: 15rpx;
		&.bg{
			background: url(/static/headerBg.png);
			background-size: 100% auto;
		}
		.statusBar{height: var(--status-bar-height)}
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

<template>
	<view>
		<headerBar id="header" title="个人中心" :showBg="false"></headerBar>
		<image class="bg" src="/static/bg.png"></image>
		<view class="info">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<view class="name">{{name}}</view>
		</view>
		<view class="content">
			<view class="list" v-if="list.length">
				<view class="item" v-for="(item,index) in list" :key="index" @click="goPage(item.url)">
					<image class="icon" :src="`/static/personal${index + 1}.png`" mode="widthFix"></image>
					<view class="text">{{item.name}}</view>
					<image class="arrow" src="/static/right.png"></image>
				</view>
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
				name: '',
				avatar: '',
				list: []
			}
		},
		onShow(){
			this.getInfo()
		},
		onLoad(){
			common.loading()
		},
		methods: {
			getInfo(){
				common.ajax({
					url: 'User/getUserData',
					showLoading: false,
					success: res => {
						let data = res.list
						let status = data.us_is_white == '是'
						uni.setStorageSync('isWhite',status)
						this.avatar = data.us_headimg
						this.name = data.us_nickname
						this.list = [
							{name: '金币',url: 'purse'},
							{name: '任务',url: 'taskList'},
							{name: '礼品兑换',url: 'exchange'}
						]
					}
				})
			},
			goPage(url){
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="less">
	.bg{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.info{
		padding: 80rpx 0 180rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.avatar{
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
			margin: 0 40rpx 0 50rpx
		}
		.name{
			font-size: 36rpx;
			color: #fff;
		}
	}
	.content{
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		padding-top: 15rpx;
		position: absolute;
		width: 100%;
		height: calc(100% - 530rpx);
		left: 0;
		bottom: 0;
		.list{
			width: 700rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 10rpx 0;
			position: absolute;
			left: 25rpx;
			top: -60rpx;
			box-shadow: 0 1rpx 20rpx 0 rgba(4, 0, 0, 0.1);
			.item{
				height: 90rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin: 0 20rpx;
				border-bottom: 1rpx solid #f5f5f5;
				&:last-child{border: none}
				.icon{width: 40rpx}
				.text{
					width: calc(90% - 80rpx);
					font-size: 30rpx;
					color: #555;
				}
				.arrow{
					width: 14rpx;
					height: 25rpx;
				}
			}
		}
	}
</style>

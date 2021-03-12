<template>
	<view v-if="showPage">
		<headerBar id="header" title="个人中心" :showBg="false"></headerBar>
		<image class="bg" src="/static/headerBg.png"></image>
		<view class="listBg"></view>
		<view class="info">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<view class="name">{{name}}</view>
		</view>
		<view class="menu">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goPage(item.url)">
				<image class="icon" :src="`/static/personal${index + 1}.png`" mode="widthFix"></image>
				<view class="text">{{item.name}}</view>
				<image class="arrow" src="/static/right.png"></image>
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
				list: [
					{name: '带货达人',url: 'bindCode'},
					{name: '金币',url: 'purse'},
					{name: '任务',url: 'taskList'},
					{name: '礼品兑换',url: 'exchange'},
					{name: '购买记录',url: 'historyList'},
					{name: '我的地址',url: 'addressList'},
					{name: '投诉建议',url: 'suggestion'},
					{name: '常见问题',url: 'questionList'}
				],
				showPage: false
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
						uni.setStorageSync('isVip',status)
						this.avatar = data.us_headimg
						this.name = data.us_nickname
						this.showPage = true
					}
				})
			},
			goPage(url){
				if(url == 'bindCode' && uni.getStorageSync('isVip')){
					uni.switchTab({
						url: 'vip'
					})
					return false
				}
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
		height: 450rpx;
		z-index: -1;
	}
	.listBg{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: calc(100% - 430rpx);
		z-index: -1;
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}
	.info{
		padding: 40rpx 0 80rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.avatar{
			width: 130rpx;
			height: 120rpx;
			border-radius: 50%;
			margin: 0 40rpx 0 50rpx
		}
		.name{
			font-size: 36rpx;
			color: #fff;
		}
	}
	.menu{
		width: 700rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 10rpx 0;
		margin: 0 auto;
		box-shadow: 0 1rpx 20rpx 0 rgba(4, 0, 0, 0.1);
		.item{
			height: 90rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 0 20rpx;
			border-bottom: 1rpx solid #f5f5f5;
			&:last-child{border: none}
			.icon{
				width: 40rpx;
				height: 40rpx;
			}
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
</style>

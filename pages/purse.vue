<template>
	<view>
		<headerBar id="header" title="金币" :showBg="false"></headerBar>
		<view class="info">
			<navigator url="exchange" hover-class="none">
				<view class="row">
					<image class="icon" src="/static/coins.png"></image>
					<view class="coins">{{coins}}</view>
					<image class="arrow" src="/static/rightW.png"></image>
				</view>
				<view class="tip">我的金币</view>
			</navigator>
			<view class="title">金币明细</view>
		</view>
		<view class="list">
			<view class="item" :class="item.bi_type == '收入' ? 'income' : 'payment'" v-for="(item,index) in list" :key="index">
				<view class="text">
					<view>{{item.bi_remark}}</view>
					<view>{{item.time}}</view>
				</view>
				<view class="coin">
					<view>{{item.bi_type == '收入' ? '+' : '-'}}{{item.bi_gold}}</view>
					<image class="icon" src="/static/coin.png"></image>
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
				list: [],
				coins: '',
				page: 1,
				limit: 10,
				refresh: true
			}
		},
		onLoad() {
			common.loading('加载中...')
		},
		onShow() {
			this.page = 1
			this.list = []
			this.getList()
		},
		onReachBottom(){
			if(this.refresh){
				this.getList()
			}
		},
		methods: {
			getList(){
				common.ajax({
					url: 'User/getMyBillList',
					showLoading: false,
					data: {
						page: this.page,
						limit: this.limit
					},
					success: res => {
						this.coins = parseFloat(res.user_gold).toString()
						this.list = this.page == 1 ? res.list : this.list.concat(res.list)
						this.refresh = res.list.length == this.limit
						this.page = this.page + 1
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{background: #fff}
	.info{
		padding-top: calc(var(--status-bar-height) + 85rpx);
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 350rpx;
		background: #fff;
		&:after{
			width: 140%;
			height: 380rpx;
			position: absolute;
			left: -20%;
			top: 0;
			z-index: -1;
			content: '';
			border-radius: 0 0 50% 50%;
			background: url(/static/headerBg.png);
			background-size: 100% 100%;
		}
		.row{
			height: 100rpx;
			padding-top: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.icon{
				width: 36rpx;
				height: 36rpx;
			}
			.coins{
				font-size: 72rpx;
				font-weight: bold;
				color: #fff;
				margin: 0 20rpx;
			}
			.arrow{
				width: 16rpx;
				height: 30rpx;
				margin-right: 20rpx;
			}
		}
		.tip{
			font-size: 30rpx;
			line-height: 40rpx;
			color: #fff;
			text-align: center;
			letter-spacing: 6rpx;
		}
		.title{
			margin-top: 80rpx;
			font-size: 34rpx;
			font-weight: bold;
			line-height: 90rpx;
			text-indent: 60rpx;
			position: relative;
			border-bottom: 20rpx solid #E7E6EB;
			&::after{
				content: '';
				display: block;
				position: absolute;
				left: 32rpx;
				top: 28rpx;
				width: 10rpx;
				height: 36rpx;
				border-radius: 6rpx;
				background: linear-gradient(173deg, #0550E8, #FE589A);
			}
		}
	}
	.list{
		height: calc(100% - 110rpx);
		padding: 370rpx 0 20rpx;
		overflow: auto;
		.item{
			width: 700rpx;
			margin: 20rpx auto;
			border-radius: 20rpx;
			box-shadow: 0 1rpx 20rpx 0 rgba(4, 0, 0, 0.1);
			box-sizing: border-box;
			padding: 20rpx 35rpx 20rpx 45rpx;
			position: relative;
			z-index: -1;
			&:before{
				content: '';
				display: block;
				position: absolute;
				width: 20rpx;
				height: 100%;
				left: 0;
				top: 0;
			}
			&.income:before{background: url(/static/incomeBg.png);background-size: 100% 100%}
			&.payment:before{background: url(/static/paymentBg.png);background-size: 100% 100%}
			.text{
				height: 60rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&>view{
					&:nth-child(1){
						font-size: 30rpx;
						font-weight: bold;
					}
					&:nth-child(2){
						font-size: 24rpx;
						color: #bbb;
					}
				}
			}
			.coin{
				height: 60rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				&>view{font-size: 36rpx}
				.icon{
					width: 36rpx;
					height: 36rpx;
					margin-left: 15rpx;
				}
			}
		}
	}
</style>

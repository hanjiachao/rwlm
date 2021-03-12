<template>
	<view>
		<headerBar id="header" title="购买记录" color="#fff"></headerBar>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index">
				<image class="img" :src="item.gi_cover_absolute_path" mode="aspectFill"></image>
				<view class="info">
					<view class="title">{{item.gi_name}}</view>
					<view class="text overflow">{{item.time}}</view>
					<view class="coin">
						<view>-{{item.gr_gift_gold}}</view>
						<image class="icon" src="/static/coin.png"></image>
					</view>
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
				coins: 0,
				list: [],
				page: 1,
				limit: 10,
				refresh: true
			}
		},
		onReachBottom(){
			if(this.refresh){
				this.getList()
			}
		},
		onShow() {
			this.page = 1
			this.getList()
		},
		onLoad() {
			common.loading()
		},
		methods: {
			getList(){
				common.ajax({
					url: 'User/getGiftRecordList',
					showLoading: false,
					data: {
						page: this.page,
						limit: this.limit
					},
					success: res => {
						this.list = this.page == 1 ? res.list : this.list.concat(res.list)
						this.refresh = res.list.length == this.limit
						this.page = this.page + 1
						this.coins = res.user_gold
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{background: #fff}
	.list{
		padding: 15rpx 0;
		.item{
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.img{
				width: 280rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
			.info{
				width: 380rpx;
				.title{
					line-height: 40rpx;
					font-size: 30rpx;
					color: #333;
					font-weight: bold;
				}
				.text{
					line-height: 40rpx;
					font-size: 22rpx;
					color: #999;
				}
				.coin{
					height: 60rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30rpx;
					&>view{font-size: 36rpx;}
					.icon{
						width: 36rpx;
						height: 36rpx;
						margin-left: 15rpx;
					}
				}
			}
		}
	}
</style>

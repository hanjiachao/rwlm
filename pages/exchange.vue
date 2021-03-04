<template>
	<view>
		<headerBar id="header" title="礼品兑换" color="#fff"></headerBar>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index" @click="exchange(item)">
				<image class="img" :src="item.gi_cover_absolute_path" mode="aspectFill"></image>
				<view class="info">
					<view class="title">{{item.gi_name}}</view>
					<view class="text overflow">{{item.gi_description}}</view>
					<view class="cost">
						<view class="price">库存<text>{{item.gi_number}}</text></view>
						<view class="coin">
							<text>{{item.gi_gold}}</text>
							<image class="icon" src="/static/coin.png"></image>
						</view>
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
			exchange(item){
				if(item.gi_gold > this.coins){
					common.toast('金币不足')
					return false
				}
				uni.navigateTo({
					url: `addressList?giftId=${item.gi_id}`
				})
			},
			getList(){
				common.ajax({
					url: 'User/getGiftList',
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
				width: 360rpx;
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
				.cost{
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price{
						font-size: 24rpx;
						height: 50rpx;
						color: #bbb;
						display: flex;
						align-items: center;
						text{
							font-size: 36rpx;
							color: #FF2942;
							margin-left: 10rpx;
						}
					}
					.coin{
						width: 128rpx;
						height: 48rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: url(/static/btnLine.png);
						background-size: 100% 100%;
						text{font-size: 24rpx}
						image{
							width: 36rpx;
							height: 36rpx;
							margin-left: 8rpx;
						}
					}
				}
			}
		}
	}
</style>

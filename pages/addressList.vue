<template>
	<view>
		<headerBar id="header" title="收货地址" color="#fff"></headerBar>
		<navigator class="addBtn" url="editAddress" hover-class="none">
			<text>新增地址</text>
			<image src="/static/right.png"></image>
		</navigator>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index" @click="confirmExchange(item.ua_id)">
				<view class="info">
					<view>{{item.ua_name}}</view>
					<view>{{item.ua_mobile}}</view>
				</view>
				<view class="address">{{item.ua_province}}{{item.ua_city}}{{item.ua_county}}{{item.ua_address}}</view>
				<view class="btns">
					<view class="btn" @click.stop="editAddress(item.ua_id)">
						<image src="/static/edit.png" mode="widthFix"></image>
						<text>编辑</text>
					</view>
					<view class="btn" @click.stop="confirmRemove(item.ua_id)">
						<image src="/static/remove.png" mode="widthFix"></image>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '@/utils/common'
	import header from '@/components/header'
	import cityList from '@/components/lb-picker/lib/area-data-min'
	export default {
		components: {
			headerBar: header
		},
		data() {
			return {
				giftId: '',
				list: [],
				page: 1,
				limit: 1000
			}
		},
		onShow(){
			this.getList()
		},
		onLoad(options) {
			common.loading()
			this.giftId = options.giftId
		},
		methods: {
			getList(){
				common.ajax({
					url: 'User/getUserAddressList',
					showLoading: false,
					data: {
						page: this.page,
						limit: this.limit
					},
					success: res => {
						this.list = res.list
					}
				})
			},
			editAddress(id){
				uni.navigateTo({
					url: `editAddress?id=${id}`
				})
			},
			confirmExchange(id){
				if(!this.giftId){
					return false
				}
				uni.showModal({
					content: '确定使用该地址兑换礼品吗？',
					success: res => {
						if(res.confirm){
							this.exchange(id)
						}
					}
				})
			},
			exchange(id){
				common.ajax({
					url: 'User/exchangeGift',
					data: {
						gi_id: this.giftId,
						ua_id: id
					},
					success: res => {
						common.toast('兑换成功')
						setTimeout(() => {
							let pages = getCurrentPages()
							if(pages[pages.length - 1].route == 'pages/addressList'){
								uni.navigateBack()
							}
						},1500)
					}
				})
			},
			confirmRemove(id){
				uni.showModal({
					content: '确定要删除吗？',
					success: res => {
						if(res.confirm){
							this.remove(id)
						}
					}
				})
			},
			remove(id){
				common.ajax({
					url: 'User/delAddress',
					data: {
						ua_id: id
					},
					success: res => {
						this.getList()
						common.toast(res.msg)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.addBtn{
		margin-top: 20rpx;
		height: 90rpx;
		padding: 0 25rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		font-weight: bold;
		image{
			width: 15rpx;
			height: 26rpx;
		}
	}
	.list{
		.item{
			margin-top: 20rpx;
			padding: 0 25rpx;
			background: #fff;
			.info{
				display: flex;
				justify-content: space-between;
				align-items: center;
				&>view{
					line-height: 90rpx;
					&:nth-child(1){font-size: 28;font-weight: bold}
					&:nth-child(2){color: #8F8C9A}
				}
			}
			.address{
				color: #8F8C9A;
				line-height: 30rpx;
				min-height: 90rpx;
			}
			.btns{
				border-top: 1rpx solid #E7E6EB;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.btn{
					display: flex;
					justify-content: center;
					align-items: center;
					height: 80rpx;
					margin-left: 45rpx;
					color: #8F8C9A;
					image{
						width: 24rpx;
						height: 24rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>

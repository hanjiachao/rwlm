<template>
	<view>
		<headerBar id="header" title="会员" color="#fff"></headerBar>
		<block v-if="showPage">
			<view class="userInfo">
				<image class="avatar" :src="info.us_headimg" mode="aspectFill"></image>
				<view class="info">
					<view class="name">{{info.us_nickname}}</view>
					<view class="text">{{info.us_member_end_time}} 到期</view>
				</view>
			</view>
			<image :src="item.ar_absolute_path" mode="widthFix" v-for="(item,index) in list" :key="index"></image>
		</block>
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
				info: '',
				showPage: false
			}
		},
		onShow() {
			this.getInfo()
		},
		onLoad() {
			this.getImg()
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
						this.info = res.list
						this.showPage = true
					}
				})
			},
			getImg(){
				common.ajax({
					url: 'Index/getMemberImage',
					showLoading: false,
					success: res => {
						this.list = res.list
					}
				})
			}
		}
	}
</script>

<style lang="less">
	image{width: 100%}
	.userInfo{
		height: 200rpx;
		background: #6e5ef5;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.avatar{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin: 0 30rpx;
		}
		.info{
			padding-bottom: 10rpx;
			.name{
				font-size: 28rpx;
				line-height: 50rpx;
				color: #fff;
				font-weight: bold;
			}
			.text{
				font-size: 24rpx;
				line-height: 40rpx;
				color: #fff;
			}
		}
	}
</style>

<template>
	<view>
		<headerBar id="header" title="详情页"></headerBar>
		<block v-if="showPage">
			<swiper autoplay circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
				<swiper-item v-for="(item,index) in detail.banner" :key="index">
					<image :src="item.gi_absolute_path" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="info">
				<view class="title">{{detail.go_name}}</view>
				<view class="text">
					<view class="price">¥<text>{{detail.go_price}}</text></view>
					<view class="cost">
						<view>可得金币</view>
						<view>+{{detail.go_gold}}</view>
						<image class="icon" src="/static/coin.png"></image>
					</view>
				</view>
			</view>
			<view class="row" @click="goVideo">
				<image class="icon" src="/static/video.png" mode="widthFix"></image>
				<text>视频素材</text>
				<image class="arrow" src="/static/right.png"></image>
			</view>
			<view class="detail">
				<view class="title">商品详情</view>
				<image class="img" :src="item.gi_absolute_path" v-for="(item,index) in detail.good_detail" :key="index" @click="preview(item.gi_absolute_path)"></image>
				<!-- <u-parse :content="richText" :imageProp="{mode: 'widthFix'}"></u-parse> -->
			</view>
			<view class="btn" @click="copy">复制链接</view>
		</block>
	</view>
</template>

<script>
	import common from '@/utils/common'
	import header from '@/components/header'
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
			headerBar: header,
			uParse: uParse
		},
		data() {
			return {
				id: '',
				detail: '',
				richText: '<p>123</p><img src="https://img-cdn-tc.dcloud.net.cn/uploads/avatar/001/67/43/81_avatar_max.jpg">',
				showPage: false
			}
		},
		onLoad(options) {
			if(options){
				this.id = options.id
			}
			this.getDetail()
		},
		methods: {
			getDetail(){
				common.ajax({
					url: 'Index/getGoodDetail',
					data: {
						good_id: this.id
					},
					success: res => {
						this.detail = res.list
						this.showPage = true
					}
				})
			},
			goVideo(){
				// if(!uni.getStorageSync('isVip')){
				// 	uni.navigateTo({
				// 		url: 'bindCode'
				// 	})
				// 	return false
				// }
				if(!common.checkVip()){
					return false
				}
				uni.navigateTo({
					url: `videoList?id=${this.id}`
				})
			},
			copy(){
				uni.setClipboardData({
				    data: this.detail.go_link,
				    success: () => {
				        common.toast('复制成功')
				    }
				})
			},
			preview(image){
				uni.previewImage({
					urls: [image]
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("@/components/u-parse/u-parse.css");
	swiper{
		height: 450rpx;
		swiper-item{
			image{
				width: 100%;
				height: 450rpx;
			}
		}
	}
	.info{
		background: #fff;
		padding: 20rpx 0 40rpx;
		.title{
			line-height: 60rpx;
			font-weight: bold;
			padding-left: 50rpx;
			font-size: 34rpx;
			position: relative;
			&:before{
				content: '';
				position: absolute;
				width: 10rpx;
				height: 40rpx;
				left: 24rpx;
				top: 10rpx;
				background: linear-gradient(173deg, #0550E8, #FE589A);
				border-radius: 5rpx;
			}
		}
		.text{
			height: 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.price{
				padding-left: 50rpx;
				font-size: 18rpx;
				color: #FF2942;
				text{font-size: 36rpx}
			}
			.cost{
				width: 270rpx;
				border-left: 1rpx solid rgba(0,0,0,0.3);
				display: flex;
				justify-content: center;
				align-items: center;
				:nth-child(1){color: #A5A5A5}
				:nth-child(2){
					margin: 0 10rpx;
					font-size: 36rpx;
				}
				.icon{
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
	.row{
		padding: 0 35rpx 0 50rpx;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-top: 1rpx solid #E7E6EB;
		.icon{
			width: 40rpx;
			height: 40rpx;
		}
		text{
			font-size: 30rpx;
			width: 560rpx;
		}
		.arrow{
			width: 14rpx;
			height: 26rpx;
		}
	}
	.detail{
		background: #fff;
		margin-top: 20rpx;
		.title{
			font-weight: bold;
			font-size: 30rpx;
			line-height: 120rpx;
			text-align: center;
		}
		.img{
			width: 100%;
		}
	}
	.btn{
		width: 250rpx;
		line-height: 85rpx;
		background: linear-gradient(90deg, #3654D4, #F745F1);
		box-shadow: 0 3rpx 59rpx 0 rgba(60, 54, 212, 0.67);
		border-radius: 10rpx;
		text-align: center;
		color: #fff;
		font-size: 26rpx;
		position: fixed;
		left: calc(50% - 125rpx);
		bottom: 100rpx;
	}
</style>

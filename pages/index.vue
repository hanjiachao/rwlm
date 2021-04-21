<template>
	<view>
		<headerBar id="header" title="首页"></headerBar>
		<image class="pageBg" src="/static/bg.png"></image>
		<input class="search" disabled confirm-type="search" placeholder="请输入商品名称" @click="goList"/>
		<swiper class="banner" autoplay circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
			<swiper-item v-for="(item,index) in banner" :key="index" @click="goBanner(item)">
				<image :src="item.ba_absolute_path" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="recommend" v-if="recommendList.length">
			<view class="title">
				<image class="titleBg" src="/static/titleBg.png"></image>
				<view class="text">
					<view class="line"></view>
					<view>今日爆款推荐</view>
					<view>产品推荐 创新无限</view>
				</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in recommendList" :key="index" @click="goDetail(item)">
					<image class="img" :src="item.go_cover_absolute_path" mode="aspectFill"></image>
					<view class="info">
						<view class="title overflow">精选羊肉物美价廉精选羊肉物美价廉</view>
						<view class="cost">
							<view class="price">￥<text>{{item.go_price}}</text></view>
							<view class="coin">
								<text>可得金币</text>
								<text>+{{item.go_gold}}</text>
								<image class="icon" src="/static/coin.png"></image>
							</view>
						</view>
						<view class="commission">
							<text>佣金：{{item.go_commission}}元</text>
							<text>佣金比例：{{parseFloat(item.go_commission_ratio)}}%</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="product" v-if="navList.length">
			<view class="title">
				<image class="titleBg" src="/static/titleBg.png"></image>
				<view class="text">
					<view class="line"></view>
					<view>优选好货</view>
					<view>平台优选 带货无忧</view>
				</view>
			</view>
			<scroll-view class="navList" scroll-x :scroll-into-view="`nav${navIndex}`" scroll-with-animation>
				<view class="item" :class="navIndex != index || 'active'" :id="`nav${index}`" v-for="(item,index) in navList" :key="index" @click="changeNav(index)">{{item.ca_name}}</view>
			</scroll-view>
			<view class="list">
				<view class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
					<image class="img" :src="item.go_cover_absolute_path" mode="aspectFill"></image>
					<view class="info">
						<view class="title">{{item.go_name}}</view>
						<view class="text overflow">提供全套家政服务和一对一管家</view>
						<view class="cost">
							<view class="price">￥<text>{{item.go_price}}</text></view>
							<view class="coin">
								<text>可得金币</text>
								<text>+{{item.go_gold}}</text>
								<image class="icon" src="/static/coin.png"></image>
							</view>
						</view>
						<view class="commission">
							<text>佣金：{{item.go_commission}}元</text>
							<text>佣金比例：{{parseFloat(item.go_commission_ratio)}}%</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<video id="video" :src="video" v-if="showVideo" @fullscreenchange="hideVideo" @ended="showVideo = false"></video>
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
				banner: [],
				navList: [],
				navIndex: 0,
				showLogin: false,
				recommendList: [],
				list: [],
				page: 1,
				limit: 10,
				refresh: true,
				video: '',
				showVideo: false,
				searchStyle: ''
			}
		},
		onReachBottom(){
			if(this.refresh){
				this.getList()
			}
		},
		onLoad() {
			this.getFirst()
		},
		methods: {
			changeNav(index){
				this.navIndex = index
				this.refreshList()
			},
			goList(){
				uni.navigateTo({
					url: 'list'
				})
			},
			goBanner(item){
				// if(!uni.getStorageSync('isWhite')){
				// 	common.toast('您现在暂时没有体验权限哦！')
				// 	return false
				// }
				uni.navigateTo({
					url: `detail?id=${item.ba_good_id}`
				})
			},
			getFirst(){
				common.ajax({
					url: 'Index/getHomeData',
					data: {
						type: '产品',
						limit: this.limit
					},
					success: res => {
						this.banner = res.banner
						this.navList = res.cate
						this.recommendList = res.label
						this.list = res.good
						this.page = 2
						this.refresh = res.good.length == this.limit
					}
				})
			},
			getNav(){
				common.ajax({
					url: 'Index/getCateList',
					showLoading: false,
					data: {
						type: '产品',
						limit: this.limit
					},
					success: res => {
						this.navList = res.cate_list
						this.navIndex = 0
						this.refreshList()
					}
				})
			},
			getList(){
				common.ajax({
					url: 'Index/getGoodList',
					data: {
						type: '产品',
						cate_id: this.navList[this.navIndex].ca_id,
						page: this.page,
						limit: this.limit
					},
					success: res => {
						this.list = this.page == 1 ? res.list : this.list.concat(res.list)
						this.refresh = res.list.length == this.limit
						this.page = this.page + 1
					}
				})
			},
			refreshList(){
				this.page = 1
				this.getList()
			},
			goDetail(item){
				// if(!uni.getStorageSync('isWhite')){
				// 	common.toast('您现在暂时没有体验权限哦！')
				// 	return false
				// }
				// if(this.tabIndex < 2){
					uni.navigateTo({
						url: `detail?id=${item.go_id}`
					})
				// }else{
				// 	this.video = item.go_absolute_path
				// 	this.showVideo = true
				// 	this.videoContext = uni.createVideoContext('video',this)
				// 	this.videoContext.requestFullScreen()
				// 	this.videoContext.play()
				// }
			},
			hideVideo(e){
				this.showVideo = e.detail.fullScreen
			},
			goLink(item){
				uni.showActionSheet({
					itemList: ['打电话','复制微信'],
					success: res => {
						let btnIndex = res.tapIndex
						if(btnIndex == 0){
							uni.makePhoneCall({
							    phoneNumber: item.se_mobile
							})
						}else if(btnIndex == 1){
							uni.setClipboardData({
							    data: item.se_weixin,
							    success: () => {
							        common.toast('复制成功')
							    }
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	video{position: fixed;z-index: -1;left: 0;top: -100%}
	.pageBg{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
	}
	.search{
		background: #fff;
		margin: 10rpx 30rpx 0;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		box-sizing: border-box;
	}
	.banner{
		width: 700rpx;
		height: 300rpx;
		margin: 30rpx auto;
		border-radius: 20rpx;
		overflow: hidden;
		transform: translateY(0);
		swiper-item{
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.recommend,.product{
		&>.title{
			position: relative;
			height: 100rpx;
			.titleBg{
				width: 100%;
				height: 100%;
			}
			.text{
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				z-index: 1;
				.line{
					width: 10rpx;
					height: 36rpx;
					border-radius: 5rpx;
					background: #fff;
					margin-left: 25rpx;
				}
				&>view{
					color: #fff;
					&:nth-child(2){
						margin-left: 20rpx;
						font-size: 32rpx;
						font-weight: bold;
					}
					&:nth-child(3){
						margin-left: 30rpx;
						font-size: 24rpx;
					}
				}
			}
		}
	}
	.recommend{
		border-bottom: 20rpx solid #E7E6EB;
		.list{
			padding: 30rpx 25rpx 10rpx;
			background: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			.item{
				width: 48%;
				margin-bottom: 30rpx;
				box-shadow: 4rpx 5rpx 12rpx 0 rgba(0, 0, 0, 0.21);
				border-radius: 10rpx;
				overflow: hidden;
				.img{
					width: 100%;
					height: 250rpx;
				}
				.info{
					padding: 15rpx 20rpx 25rpx;
					.title{
						font-size: 30rpx;
						line-height: 50rpx;
						font-weight: bold;
					}
					.cost{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price{
							font-size: 20rpx;
							color: #FF2942;
							text{font-size: 32rpx}
						}
						.coin{
							height: 50rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							text{
								&:nth-child(1){
									font-size: 16rpx;
									color: #999;
								}
								&:nth-child(2){
									font-size: 26rpx;
									margin: 0 8rpx;
								}
							}
							image{
								width: 30rpx;
								height: 30rpx;
							}
						}
					}
					.commission{
						color: #555;
						font-size: 18rpx;
						margin-top: 10rpx;
						text{
							&:nth-child(1){margin-right: 20rpx}
						}
					}
				}
			}
		}
	}
	.product{
		padding-top: 10rpx;
		background: #e7e6eb;
		.navList{
			white-space: nowrap;
			background: #fff;
			.item{
				display: inline-block;
				font-size: 28rpx;
				line-height: 80rpx;
				padding: 0 25rpx;
				position: relative;
				&.active{
					font-size: 36rpx;
					font-weight: bold;
					&:after{
						content: '';
						position: absolute;
						width: 48rpx;
						height: 10rpx;
						left: calc(50% - 24rpx);
						bottom: 15rpx;
						background: url(/static/textLine.png);
						background-size: 100% 100%;
						opacity: 0.6;
					}
				}
			}
		}
		.list{
			background: #fff;
			padding-bottom: 20rpx;
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
					width: 375rpx;
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
						margin: 10rpx 0 18rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price{
							font-size: 20rpx;
							color: #FF2942;
							text{font-size: 36rpx}
						}
						.coin{
							height: 50rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							text{
								&:nth-child(1){
									font-size: 24rpx;
									color: #999;
								}
								&:nth-child(2){
									font-size: 36rpx;
									margin: 0 8rpx 0 4rpx;
								}
							}
							image{
								width: 36rpx;
								height: 36rpx;
							}
						}
					}
					.commission{
						color: #FF2942;
						font-size: 22rpx;
						text{
							&:nth-child(1){margin-right: 30rpx}
						}
					}
					.linkBtn{
						margin-top: 35rpx;
						width: 160rpx;
						line-height: 52rpx;
						border-radius: 26rpx;
						text-align: center;
						color: #fff;
						background: linear-gradient(90deg, #3654D4, #F745F1);
					}
				}
			}
		}
	}
</style>

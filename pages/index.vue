<template>
	<view>
		<headerBar id="header" title="首页" :showBg="false"></headerBar>
		<image class="bg" src="/static/bg.png"></image>
		<swiper class="banner" autoplay circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
			<swiper-item v-for="(item,index) in banner" :key="index" @click="goBanner(item)">
				<image :src="item.ba_absolute_path" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<scroll-view class="tabList" scroll-x :scroll-into-view="`tab${tabIndex}`" scroll-with-animation>
			<view class="item" :class="tabIndex != index || 'active'" :id="`tab${index}`" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">
				<image class="img" :src="`/static/indexNav${index + 1}.png`" mode="aspectFill"></image>
				<image class="arrow" src="/static/navArrow.png"></image>
			</view>
		</scroll-view>
		<view class="product">
			<scroll-view class="navList" scroll-x :scroll-into-view="`nav${navIndex}`" scroll-with-animation>
				<view class="item" :class="navIndex != index || 'active'" :id="`nav${index}`" v-for="(item,index) in navList" :key="index" @click="changeNav(index)">{{item.ca_name}}</view>
			</scroll-view>
			<view class="list">
				<view class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
					<image class="img" :src="item.go_cover_absolute_path" mode="aspectFill"></image>
					<view class="info">
						<view class="title">{{item.go_name}}</view>
						<view class="text overflow">提供全套家政服务和一对一管家</view>
						<block v-if="tabIndex < 2">
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
						</block>
						<view class="linkBtn" v-else @click.stop="goLink(item)">联系方式</view>
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
				tabList: ['抖音','TikTok','直播带货'],
				tabIndex: 0,
				navList: [],
				navIndex: 0,
				showLogin: false,
				list: [],
				page: 1,
				limit: 10,
				refresh: true,
				video: '',
				showVideo: false
			}
		},
		onReachBottom(){
			if(this.refresh){
				this.getList()
			}
		},
		onLoad() {
			this.checkLogin()
			this.getInfo()
		},
		methods: {
			checkLogin(){
				if(!uni.getStorageSync('inviteCode')){
					uni.redirectTo({
						url: 'login'
					})
				}
			},
			hideLogin(){
				this.showLogin = false
			},
			changeTab(index){
				this.tabIndex = index
				this.list = []
				this.getNav()
			},
			changeNav(index){
				this.navIndex = index
				this.refreshList()
			},
			goBanner(item){
				if(!uni.getStorageSync('isWhite')){
					common.toast('您现在暂时没有体验权限哦！')
					return false
				}
				uni.navigateTo({
					url: `detail?id=${item.ba_good_id}`
				})
			},
			getInfo(){
				common.ajax({
					url: 'Index/getHomeData',
					data: {
						type: this.tabList[this.tabIndex],
						limit: this.limit
					},
					success: res => {
						this.banner = res.banner
						this.navList = res.cate
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
						type: this.tabList[this.tabIndex],
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
						type: this.tabList[this.tabIndex],
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
				this.list = []
				this.getList()
			},
			goDetail(item){
				if(!uni.getStorageSync('isWhite')){
					common.toast('您现在暂时没有体验权限哦！')
					return false
				}
				if(this.tabIndex < 2){
					uni.navigateTo({
						url: `detail?id=${item.go_id}`
					})
				}else{
					this.video = item.go_absolute_path
					this.showVideo = true
					this.videoContext = uni.createVideoContext('video',this)
					this.videoContext.requestFullScreen()
					this.videoContext.play()
				}
			},
			hideVideo(e){
				this.showVideo = e.detail.fullScreen
			},
			goLink(item){
				if(!uni.getStorageSync('isWhite')){
					common.toast('您现在暂时没有体验权限哦！')
					return false
				}
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
	.bg{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.banner{
		width: 700rpx;
		height: 300rpx;
		margin: 25rpx auto 0;
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
	.tabList{
		margin-top: 50rpx;
		height: 250rpx;
		white-space: nowrap;
		.item{
			position: relative;
			display: inline-block;
			padding-left: 25rpx;
			height: 250rpx;
			&:last-child{margin-right: 25rpx}
			&.active{
				.arrow{opacity: 1}
			}
			.img{
				width: 290rpx;
				height: 190rpx;
				border-radius: 10rpx 50rpx 10rpx 10rpx;
			}
			.arrow{
				width: 110rpx;
				height: 35rpx;
				position: absolute;
				left: calc(50% - 55rpx);
				bottom: 0;
				opacity: 0;
			}
		}
	}
	.product{
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		padding-top: 15rpx;
		.navList{
			white-space: nowrap;
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
			min-height: 480rpx;
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

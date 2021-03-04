<template>
	<view>
		<headerBar id="header" title="教程"></headerBar>
		<view class="page">
			<scroll-view class="navList" scroll-x :scroll-into-view="`nav${navIndex}`" scroll-with-animation>
				<view class="item" :class="navIndex != index || 'active'" :id="`nav${index}`" v-for="(item,index) in navList" :key="index" @click="changeNav(index)">{{item.ca_name}}</view>
			</scroll-view>
			<view class="list">
				<view class="item" v-for="(item,index) in list" :key="index" @click="play(item.go_absolute_path)">
					<view class="imgContent">
						<image class="img" :src="item.go_cover_absolute_path" mode="aspectFill"></image>
						<image class="play" src="/static/play.png"></image>
					</view>
					<view class="info">
						<view class="title">{{item.go_name}}</view>
						<view class="text overflow">{{item.go_description}}</view>
						<view class="btn">
							<view class="text">点击观看</view>
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
				navList: [],
				navIndex: 0,
				list: [1,1,1,1,1],
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
			this.getNav()
		},
		methods: {
			play(video){
				if(!common.checkLogin()){
					return false
				}
				this.video = video
				this.showVideo = true
				this.videoContext = uni.createVideoContext('video',this)
				this.videoContext.requestFullScreen()
				this.videoContext.play()
			},
			hideVideo(e){
				this.showVideo = e.detail.fullScreen
			},
			changeNav(index){
				this.navIndex = index
				this.refreshList()
			},
			getNav(){
				common.ajax({
					url: 'Index/getCateList',
					data: {
						type: '教程',
						limit: this.limit
					},
					success: res => {
						this.navList = res.cate_list
						this.list = res.good_list
					}
				})
			},
			getList(){
				common.ajax({
					url: 'Index/getGoodList',
					data: {
						type: '教程',
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
			}
		}
	}
</script>

<style lang="less">
	video{position: fixed;z-index: -1;left: 0;top: -100%}
	.page{
		background: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		.navList{
			position: fixed;
			top: calc(var(--status-bar-height) + 85rpx);
			background: #fff;
			white-space: nowrap;
			z-index: 10000;
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
			padding-top: 80rpx;
			.item{
				padding: 20rpx 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				.imgContent{
					width: 280rpx;
					height: 200rpx;
					border-radius: 10rpx;
					position: relative;
					overflow: hidden;
					.img{
						width: 100%;
						height: 100%;
					}
					.play{
						width: 48rpx;
						height: 48rpx;
						position: absolute;
						top: calc(50% - 24rpx);
						left: calc(50% - 24rpx);
					}
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
					.btn{
						width: 260rpx;
						background: url(/static/btnBg.png);
						background-size: 100% 100%;
						margin-top: 50rpx;
						.text{
							width: 85%;
							line-height: 70rpx;
							color: #fff;
							font-size: 28rpx;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>

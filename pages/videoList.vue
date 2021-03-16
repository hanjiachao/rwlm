<template>
	<view>
		<headerBar id="header" title="视频列表"></headerBar>
		<view class="content">
			<view class="title">
				<text>成品参考</text>
				<text>参考视频</text>
			</view>
			<view class="list">
				<view class="item" @click="play(item.gm_absolute_path)" v-for="(item,index) in worksList" :key="index">
					<image class="img" :src="item.gm_cover_absolute_path" mode="aspectFill"></image>
					<image class="play" src="/static/play.png"></image>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="title">
				<text>精品素材</text>
				<text>不限量下载</text>
			</view>
			<view class="list">
				<view class="item" @click="play(item.gm_absolute_path)" v-for="(item,index) in materialList" :key="index">
					<image class="img" :src="item.gm_cover_absolute_path" mode="aspectFill"></image>
					<image class="play" src="/static/play.png"></image>
					<view class="download" @click.stop="createTask(item.gm_absolute_path)">
						<image src="/static/download.png"></image>
						<text>下载</text>
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
				id: '',
				worksList: [],
				materialList: [],
				page: 1,
				limit: 1000,
				video: '',
				showVideo: false
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getList()
		},
		methods: {
			getList(){
				common.ajax({
					url: 'Index/getMaterialList',
					data: {
						good_id: this.id,
						page: this.page,
						limit: this.limit
					},
					success: res => {
						this.worksList = res.reference_list
						this.materialList = res.download_list
					}
				})
			},
			play(video){
				this.video = video
				this.showVideo = true
				this.videoContext = uni.createVideoContext('video',this)
				this.videoContext.requestFullScreen()
				this.videoContext.play()
			},
			hideVideo(e){
				this.showVideo = e.detail.fullScreen
			},
			createTask(video){
				common.ajax({
					url: 'Index/createTask',
					data: {
						good_id: this.id
					},
					success: res => {
						this.download(video)
					}
				})
			},
			download(video){
				common.loading('保存中...')
				uni.downloadFile({
				    url: video,
				    success: res => {
				        if (res.statusCode === 200) {
							this.save(res.tempFilePath)
				        }else{
							uni.hideLoading()
						}
				    }
				})
			},
			save(path){
				uni.saveVideoToPhotosAlbum({
					filePath: path,
					success: res => {
						common.toast('保存成功')
					},
					fail: res => {
						if(res.errMsg == 'saveVideoToPhotosAlbum:fail auth deny'){
							common.toast('保存失败,请在设置中打开相册权限')
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	video{position: fixed;z-index: -1;left: 0;top: -100%}
	.content{
		margin-top: 20rpx;
		padding: 0 25rpx;
		background: #FFF;
		.title{
			display: flex;
			align-items: center;
			position: relative;
			height: 120rpx;
			padding-left: 30rpx;
			&:before{
				content: '';
				position: absolute;
				width: 10rpx;
				height: 40rpx;
				left: 0;
				top: 40rpx;
				background: linear-gradient(173deg, #0550E8, #FE589A);
				border-radius: 5rpx;
			}
			text{
				&:nth-child(1){
					font-size: 34rpx;
					font-weight: bold;
				}
				&:nth-child(2){
					color: #A5A5A5;
					margin-left: 30rpx;
				}
			}
		}
		.list{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			flex-direction: row;
			.item{
				width: 30%;
				position: relative;
				margin-right: 35rpx;
				margin-bottom: 50rpx;
				border-radius: 12rpx;
				overflow: hidden;
				&:nth-of-type(3n){margin-right: 0}
				.img{
					width: 210rpx;
					height: 260rpx;
					border-radius: 12rpx 12rpx 0 0;
				}
				.play{
					width: 44rpx;
					height: 44rpx;
					position: absolute;
					left: calc(50% - 22rpx);
					top: 108rpx;
				}
				.download{
					height: 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					box-shadow: inset 0 -2rpx 6rpx 0 rgba(0, 0, 0, 0.18);
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

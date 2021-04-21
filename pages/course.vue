<template>
	<view>
		<headerBar id="header" title="教程"></headerBar>
		<block v-if="isVerify">
			<view class="page">
				<image class="banner" :src="banner" mode="widthFix"></image>
				<scroll-view class="navList" scroll-x :scroll-into-view="`nav${navIndex}`" scroll-with-animation>
					<view class="item" :class="navIndex != index || 'active'" :id="`nav${index}`" v-for="(item,index) in navList" :key="index" @click="changeNav(index)">{{item}}</view>
				</scroll-view>
				<view class="list">
					<view class="item" v-for="(item,index) in list" :key="index" @click="confirmPlay(item)">
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
		</block>
		<view class="richText" v-else>
			<view>新手入门</view>
			<view>“悦货小程序”使用必听课。（讲述小程序的板块内容，介绍使用“悦货APP” 创作发布视频？介绍使用后达人获得的利益）</view>
			<view>“疫后”新商机在哪里？（主要讲述当下的商业环境，悦货可以带来的新的商业模式。）</view>
			<view>没有团队如何做好抖音？</view>
			<view>成长进阶</view>
			<view>如何给账号做定位？</view>
			<view>如何发布带商品的视频？</view>
			<view>抖音小店、橱窗和小黄车的区别在哪里？分别需要怎样开通？</view>
			<view>作品如何上热门提升播放量？</view>
			<view>超级短视频标题撰写技巧？（1）什么是短视频标题；（2）短视频标题的作用是什么？（3）提升短视频标题的技巧有哪些？</view>
			<view>如何打造账号的垂直度？</view>
			<view>如何提高与粉丝之间的粘性？</view>
			<view>抖音账号评论区如何运营？（1）为什么要运营评论区（2）常见的运营方式：见好就赞；反复疑问；热点追踪；引导互动。</view>
			<view>介绍“剪映”的功能与使用技巧？</view>
			<view>如何使用“剪映”做出卡点视频？</view>
			<view>如何使用“剪映”剪辑同款视频？</view>
			<view>如何使用“剪映”拍摄同款热门视频？</view>
			<view>如何通过“剪映”添加特效，制作成多重效果的视频？</view>
			<view>如何通过”剪映”制作平行世界特效?</view>
			<view>如何通过”剪映”制作卡拉OK视频字幕？</view>
			<view>“绿幕抠像”到底是如何完成的？教你如何使用 PR 完成。</view>
			<view>如何从 0 到 1 搭建一个短视频团队？</view>
			<view>高级研修</view>
			<view>如何打造账号的带货标签？</view>
			<view>如何开通和使用商品分享功能？开通步骤和条件满足，添加商品。</view>
			<view>带货账号如何起号与包装能快速开播？</view>
			<view>如何开通直播带货功能？</view>
			<view>直播带货需要准备哪些设备？</view>
			<view>带货直播运营的禁忌与雷区规避？</view>
			<view>抖音直播带货的常见技巧有哪些？</view>
			<view>如何获得直播间的流量？</view>
			<view>主播能力如何提升？</view>
			<view>如何写好直播脚本？</view>
			<view>如何提升直播间流量与转化率？</view>
			<view>直播带货设备环境如何搭建？（1）空间布置；（2）灯光布置；（3）道具准备如何利用 DOU+投放精准带货？</view>
			<view>带货主播人设如何打造？（1）为什么要做主播人设定位？（2）人设定位五部曲。（3）成功主播人设案例拆解及定位建议（4）如何让人设深入人心。</view>
			<view>从 0 到 1 搭建一场直播带货需要准备哪些工作？“人、货、场”分别指什么？人（有人设、能说、懂货），货（选品、价格、买赠活动），场（直播间场景和氛围）。</view>
			<view>直播的开播时长和频次有何规率？</view>
			<view>如何设计一场具有吸引力的直播？</view>
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
				banner: '',
				navList: ['必学','进阶','高阶'],
				navIndex: 0,
				list: [],
				page: 1,
				limit: 10,
				refresh: true,
				video: '',
				showVideo: false,
				isVerify: uni.getStorageSync('isVerify')
			}
		},
		onReachBottom(){
			if(this.refresh){
				this.getList()
			}
		},
		onLoad() {
			this.getBanner()
			this.getList()
		},
		methods: {
			confirmPlay(item){
				if(!common.getToken()){
					return false
				}
				if(this.navIndex == 1 && item.change_status == '未兑换'){
					uni.showModal({
						title: '提示',
						content: `确定要消耗${item.go_gold}积分观看该课程吗？`,
						success: res => {
							if(res.confirm){
								this.buyCourse(item.go_id)
							}
						}
					})
					return false
				}
				// if(this.navIndex == 2 && !uni.getStorageSync('isVip')){
				// 	uni.navigateTo({
				// 		url: 'bindCode'
				// 	})
				// 	return false
				// }
				if(this.navIndex == 2){
					if(!common.checkVip()){
						return false
					}
				}
				this.video = item.go_absolute_path
				this.play()
			},
			play(){
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
			buyCourse(id){
				common.ajax({
					url: 'Index/exchangeAdvanceGood',
					data: {
						go_id: id
					},
					success: res => {
						this.play()
						this.refreshList()
					}
				})
			},
			getBanner(){
				common.ajax({
					url: 'Index/getBannerPath',
					data: {
						type: '教程'
					},
					success: res => {
						this.banner = res.banner
					}
				})
			},
			getList(){
				common.ajax({
					url: 'Index/getGoodList',
					data: {
						type: `${this.navList[this.navIndex]}教程`,
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
		.banner{width: 100%}
		.navList{
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
			// padding-top: 80rpx;
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
	.richText{
		padding: 15rpx 3%;
		view{line-height: 40rpx}
	}
</style>

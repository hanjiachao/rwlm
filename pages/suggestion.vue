<template>
	<view>
		<headerBar id="header" title="投诉建议" color="#fff"></headerBar>
		<view class="row">
			<view class="title">请选择您要反馈的意见类型：</view>
			<view class="typeList">
				<view class="item" :class="{'active':typeIndex == index}" v-for="(item,index) in typeList" :key="index" @click="typeIndex = index">{{item}}</view>
			</view>
		</view>
		<view class="row">
			<view class="title">请留下您的宝贵意见：</view>
			<textarea maxlength="150" placeholder="请在此处输入,我们会非常重视,并不断改进我们的服务.." v-model="text"/>
			<view class="tip">还可以输入<text>{{150 - text.length}}</text>字</view>
		</view>
		<view class="row">
			<view class="title">添加图片：</view>
			<view class="imgList">
				<view class="item" @click="chooseImg" v-if="imgList.length < 3">
					<image class="img" src="/static/addImg.jpg" mode="aspectFill"></image>
				</view>
				<view class="item" v-for="(item,index) in imgList" :key="index">
					<image class="img" :src="item" mode="aspectFill"></image>
					<image class="remove" src="/static/close.png" mode="widthFix" @click="removeImg(index)"></image>
				</view>
			</view>
			<view class="tip">最多添加3张图片，本项选填</view>
		</view>
		<view class="row">
			<view class="input">
				<view class="label">联系方式：</view>
				<input type="number" v-model="mobile">
			</view>
		</view>
		<view class="submit" @click="submit">提交</view>
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
				typeList: ['投诉','功能异常','商品问题','素材问题','课程问题','其他建议'],
				typeIndex: 0,
				text: '',
				imgList: [],
				mobile: '',
				isSubmit: false
			}
		},
		onLoad() {
			
		},
		methods: {
			chooseImg(){
				uni.chooseImage({
					count: 1,
					success: res => {
						this.uploadImg(res.tempFilePaths[0])
					}
				})
			},
			uploadImg(img){
				uni.uploadFile({
					url: `${common.getAjaxUrl()}UploadFile/uploadFileSingle`,
					filePath: img,
					name: 'imgfile',
					success: (res) => {
						let imgUrl = JSON.parse(res.data).result.image_absolute_path
						this.imgList.push(imgUrl)
					}
				})
			},
			removeImg(index){
				this.imgList.splice(index,1)
			},
			checkData(){
				let tip = ''
				if(!this.text){
					tip = '内容不能为空'
				}else if(!this.mobile){
					tip = '请输入联系方式'
				}else if(!common.checkMobile(this.mobile)){
					tip = '手机号码格式错误'
				}
				if(tip){
					common.toast(tip)
				}
				return !tip
			},
			submit(){
				if(!this.checkData() || this.isSubmit){
					return false
				}
				this.isSubmit = true
				let imgList = this.imgList
				common.ajax({
					url: 'User/createComplain',
					data: {
						cate_name: this.typeList[this.typeIndex],
						content: this.text,
						mobile: this.mobile,
						file_1: imgList.length ? imgList[0] : '',
						file_2: imgList.length > 1 ? imgList[1] : '',
						file_3: imgList.length > 2 ? imgList[2] : ''
					},
					success: res => {
						common.toast('提交成功')
						setTimeout(() => {
							uni.navigateBack()
						},1500)
					},
					fail: res => {
						this.isSubmit = false
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{padding-bottom: 5rpx}
	.row{
		background: #fff;
		padding: 10rpx 30rpx 25rpx;
		margin-top: 20rpx;
		&:nth-child(4){margin-top: 2rpx}
		&:nth-child(5){padding: 0 30rpx}
		.title{
			font-size: 30rpx;
			line-height: 90rpx;
			font-weight: bold;
		}
		.typeList{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.item{
				margin-right: 25rpx;
				margin-bottom: 20rpx;
				width: 170rpx;
				line-height: 70rpx;
				border-radius: 35rpx;
				text-align: center;
				color: #555;
				border: 1rpx solid #ddd;
				box-sizing: border-box;
				&.active{
					background: #7c54d9;
					color: #fff;
				}
			}
		}
		textarea{
			width: 100%;
			line-height: 30rpx;
			height: 210rpx;
		}
		.tip{
			color: #aaa;
			text{
				color: #000;
				margin: 0 5rpx;
			}
		}
		.imgList{
			margin-bottom: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.item{
				position: relative;
				margin-right: 20rpx;
				.img{
					width: 180rpx;
					height: 180rpx;
				}
				.remove{
					position: absolute;
					width: 40rpx;
					height: 40rpx;
					right: 0;
					top: 0;
				}
			}
		}
		.input{
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.label{
				font-size: 30rpx;
				font-weight: bold;
			}
			input{
				width: calc(100% - 150rpx);
				height: 100rpx;
				line-height: 100rpx;
				text-align: right;
				font-size: 28rpx;
			}
		}
	}
	.submit{
		background: #d6d8e7;
		color: #fff;
		margin: 30rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		border-radius: 15rpx;
	}
</style>

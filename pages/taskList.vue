<template>
	<view>
		<headerBar id="header" title="任务" color="#fff"></headerBar>
		<view class="pickerList">
			<picker :range="statusList" @change="changeStatus">
				<view class="picker">
					<text>{{statusIndex ? statusList[statusIndex] : '状态'}}</text>
					<image src="/static/down.png" mode="widthFix"></image>
				</view>
			</picker>
		</view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index" @click="showReason(item)">
				<image class="img" :src="item.go_cover_absolute_path" mode="aspectFill"></image>
				<view class="info">
					<view class="title">{{item.go_name}}</view>
					<view class="text overflow">{{item.go_description}}</view>
					<view class="operation">
						<block>
							<view class="status s1" v-if="item.ta_status == '待提交'">{{item.ta_status}}</view>
							<view class="status s2" v-if="item.ta_status == '审核中'">{{item.ta_status}}</view>
							<view class="status s3" v-if="item.ta_status == '已通过'">{{item.ta_status}}</view>
							<view class="status s4" v-if="item.ta_status == '已驳回'">{{item.ta_status}}</view>
						</block>
						<image class="btn" :src="`/static/editBtn${item.update_status ? '' : 'G'}.png`" @click.stop="getTask(item)"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="fixContent" v-if="showTask">
			<view class="modal">
				<view class="title">提示</view>
				<view class="row">
					<input type="text" placeholder="请输入抖音链接" v-model="taskUrl"/>
					<view class="copy" @click="copy">粘贴</view>
				</view>
				<view class="btns">
					<view @click="showTask = false">取消</view>
					<view @click="submit">确定</view>
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
				statusList: ['全部','待提交','审核中','已通过','已驳回'],
				statusIndex: 0,
				list: [],
				page: 1,
				limit: 1000,
				taskUrl: '',
				showTask: false,
				copyStatus: true,
				taskId: ''
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				common.ajax({
					url: 'User/getMyTaskList',
					data: {
						page: this.page,
						limit: this.limit,
						status: this.statusIndex ? this.statusList[this.statusIndex] : ''
					},
					success: res => {
						this.list = res.list
					}
				})
			},
			getTask(item){
				if(item.update_status == 1){
					this.showTask = true
					this.taskUrl = ''
					this.taskId = item.ta_id
				}
			},
			showReason(item){
				if(item.ta_status != '已驳回'){
					return false
				}
				uni.showModal({
					title: '驳回原因',
					content: item.ta_reason
				})
			},
			submit(){
				if(!this.taskUrl){
					common.toast('请输入抖音链接')
					return false
				}
				this.showTask = false
				common.ajax({
					url: 'User/submitTask',
					data: {
						ta_id: this.taskId,
						link: this.taskUrl
					},
					success: res => {
						common.toast(res.msg)
						this.getList()
					}
				})
			},
			copy(){
				uni.getClipboardData({
					success: res => {
						this.taskUrl = res.data
						common.toast('粘贴成功')
					}
				})
			},
			changeStatus(e){
				this.statusIndex = parseInt(e.detail.value)
				this.getList()
			}
		}
	}
</script>

<style lang="less">
	.pickerList{
		width: 100%;
		padding: 25rpx;
		background: #EAECF3;
		position: fixed;
		left: 0;
		top: calc(var(--status-bar-height) + 85rpx);
		picker{
			display: inline-block;
			.picker{
				padding: 0 30rpx;
				height: 48rpx;
				border-radius: 22rpx;
				font-size: 24rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #16126D;
				background: #fff;
				image{
					width: 15rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.list{
		padding: 70rpx 0rpx 15rpx;
		.item{
			margin: 20rpx 25rpx;
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			background: #fff;
			border-radius: 20rpx;
			.img{
				width: 184rpx;
				height: 135rpx;
				border-radius: 10rpx;
			}
			.info{
				width: 420rpx;
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
				.operation{
					margin-top: 5rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.status{
						font-size: 24rpx;
						height: 50rpx;
						display: flex;
						align-items: center;
						&.s1{color: #890DE8}
						&.s2{color: #FEAD00}
						&.s3{color: #36D336}
						&.s4{color: #E80D0D}
					}
					.btn{
						width: 128rpx;
						height: 48rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}
	.fixContent{
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10000;
		.modal{
			width: 450rpx;
			background: #fff;
			border-radius: 20rpx;
			padding-top: 20rpx;
			.title{
				font-size: 30rpx;
				line-height: 50rpx;
				font-weight: bold;
				text-align: center;
			}
			.row{
				margin: 20rpx 0 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				input{
					width: 230rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
				}
				.copy{
					padding: 0 15rpx;
					line-height: 50rpx;
					color: #007AFF;
					position: absolute;
					right: 7%;
					top: 0;
					z-index: 10;
				}
			}
			.btns{
				display: flex;
				justify-content: center;
				align-items: center;
				border-top: 2rpx solid #ddd;
				&>view{
					width: 50%;
					line-height: 80rpx;
					text-align: center;
					&:nth-child(1){border-right: 2rpx solid #ddd}
				}
			}
		}
	}
</style>

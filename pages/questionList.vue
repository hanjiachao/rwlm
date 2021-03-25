<template>
	<view>
		<headerBar id="header" title="常见问题" color="#fff"></headerBar>
		<view class="list">
			<view class="item" :class="{'active': questionIndex == index}" v-for="(item,index) in list" :key="index" @click="changeIndex(index)">
				<view class="title">{{item.ar_title}}</view>
				<view class="info" v-if="questionIndex == index" @click.stop>{{item.ar_content}}</view>
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
				list: [],
				questionIndex: 0
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				common.ajax({
					url: 'Index/getQuestionList',
					success: res => {
						this.list = res.list
					}
				})
			},
			changeIndex(index){
				this.questionIndex = this.questionIndex == index ? -1 : index
			}
		}
	}
</script>

<style lang="less">
	.list{
		margin: 30rpx;
		.item{
			border-radius: 10rpx;
			overflow: hidden;
			background: #fff;
			margin-bottom: 15rpx;
			&.active{
				.title{
					background: #6e5ef5;
					color: #fff;
				}
			}
			.title{
				padding: 0 30rpx;
				line-height: 80rpx;
			}
			.info{
				padding: 15rpx 30rpx;
				line-height: 40rpx;
			}
		}
	}
</style>

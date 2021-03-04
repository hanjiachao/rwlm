<template>
	<view>
		<headerBar id="header" title="会员" color="#fff"></headerBar>
		<image :src="item.ar_absolute_path" mode="widthFix" v-for="(item,index) in list" :key="index"></image>
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
				list: []
			}
		},
		onLoad() {
			this.getImg()
		},
		methods: {
			getImg(){
				common.ajax({
					url: 'Index/getMemberImage',
					success: res => {
						this.list = res.list
					}
				})
			}
		}
	}
</script>

<style>
	image{width: 100%}
</style>

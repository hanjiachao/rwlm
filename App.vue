<script>
	import common from '@/utils/common'
	export default {
		onLaunch: function() {
			if(!uni.getStorageSync('token')){
				return false
			}
			common.ajax({
				url: 'User/getUserData',
				showLoading: false,
				success: res => {
					let status = res.list.us_is_white == '是'
					uni.setStorageSync('isVip',status)
				}
			})
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	page{background: #eaecf3;padding-top: calc(var(--status-bar-height) + 85rpx)}
	view{font-size: 24rpx;color: #3e3e3e}
	image,video{display: block}
	button{margin: 0;padding: 0}
	#header{position: fixed;width: 100%;left: 0;top: 0;z-index: 10000}
	.input-placeholder,.textarea-placeholder{color: #c2c2c2}
	.overflow{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all}
</style>

const ajaxUrl = 'http://renwulianmeng.haozhicheng.weyoui.cn/index.php/Home/'

export default class common {
	static ajax(params) {
		let showLoading = typeof params.showLoading == 'boolean' ? params.showLoading : true
		let sendToken = typeof params.sendToken == 'boolean' ? params.sendToken : true
		let showError = typeof params.showError == 'boolean' ? params.showError : true
		let timeout = 5000
		let timer = setTimeout(() => {
			common.toast('网络超时')
			request.abort()
		}, timeout)
		if (showLoading || showLoading && params.loadingText) {
			common.loading(params.loadingText)
		}
		let data = params.data || {}
		let token = uni.getStorageSync('token')
		if(token && sendToken){
			data.access_token = token
		}
		uni.request({
			url: ajaxUrl + params.url,
			method: params.type || 'post',
			data: data,
			header: {'content-type': 'application/x-www-form-urlencoded'},
			success: res => {
				uni.hideLoading()
				if(params.success){
					if(res.data.status == 'SUCCESS'){
						params.success(res.data.result)
					}else{
						if(res.data.errorCode == '100008'){
							common.toast(uni.getStorageSync('token'))
							if(uni.getStorageSync('token')){
								// token过期
							}else if(uni.getStorageSync('userInfo')){
								// 注册
							}
							uni.navigateTo({
								url: 'wxLogin'
							})
							return false
						}
						if(params.fail){
							params.fail(res.data.result)
						}
						if(showError){
							common.toast(res.data.result.msg)
						}
					}
				}
			},
			fail: res => {
				uni.hideLoading()
				if(params.fail){
					params.fail(res.data.result)
				}
			},
			complete: res => {
				clearTimeout(timer)
				uni.stopPullDownRefresh()
				if(params.complete){
					params.complete(res.data.result)
				}
			}
		})
	}
	
	static checkLogin() {
		let isLogin = uni.getStorageSync('token') ? true : false
		if(!isLogin){
			// #ifdef MP-WEIXIN
			uni.navigateTo({
				url: 'wxLogin'
			})
			// #endif
			// #ifdef APP-PLUS
			uni.setStorageSync('token','2e806879a68ddc382356147b1d7522cc')
			isLogin = true
			// #endif
		}
		return isLogin
	}
	
	static toast(title, icon) {
		uni.showToast({
			title: title ? title.toString() : '',
			icon: icon || 'none'
		})
	}
	
	static loading(title) {
		uni.showLoading({
			title: title ? title.toString() : '加载中...'
		})
	}
	
	static checkMobile(mobile) {
		let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
		return reg.test(mobile)
	}
}
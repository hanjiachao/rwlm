<template>
	<view>
		<headerBar id="header" title="我的地址" color="#fff"></headerBar>
		<view class="row">
			<view class="label">收货人姓名</view>
			<input type="text" placeholder="请输入收货人姓名" v-model="form.name">
		</view>
		<view class="row">
			<view class="label">联系方式</view>
			<input type="number" placeholder="请输入联系方式" v-model="form.mobile">
		</view>
		<view class="row">
			<view class="label">收货城市</view>
			<lb-picker class="picker" :class="city || 'gray'" mode="multiSelector" :list="cityList" :level="3" @confirm="changeAddress">{{city || '请选择城市'}}</lb-picker>
		</view>
		<view class="row textRow">
			<view class="label">收货地址</view>
			<textarea placeholder="请输入详细地址" v-model="form.address"/>
		</view>
		<view class="row textRow">
			<view class="label">备注</view>
			<textarea placeholder="请输入备注信息" v-model="form.remark"/>
		</view>
		<view class="btn" @click="submit">保存</view>
	</view>
</template>

<script>
	import common from '@/utils/common'
	import header from '@/components/header'
	import cityList from '@/components/lb-picker/lib/area-data-min'
	export default {
		components: {
			headerBar: header
		},
		data() {
			return {
				cityList: cityList,
				city: '',
				form: {
					ua_id: '',
					name: '',
					mobile: '',
					province: '',
					city: '',
					county: '',
					address: '',
					remark: ''
				}
			}
		},
		onLoad(options) {
			if(options.id){
				this.form.ua_id = options.id
				this.getDetail()
			}
		},
		methods: {
			getDetail(){
				let id = this.form.ua_id
				common.ajax({
					url: 'User/getUserAddressDetail',
					data: {
						ua_id: id
					},
					success: res => {
						let form = res.list
						this.form = {
							ua_id: id,
							name: form.ua_name,
							mobile: form.ua_mobile,
							province: form.ua_province,
							city: form.ua_city,
							county: form.ua_county,
							address: form.ua_address,
							remark: form.ua_remark
						}
						this.city = `${form.ua_province}-${form.ua_city}-${form.ua_county}`
					}
				})
			},
			changeAddress(e){
				let list = e.item
				let city = ''
				list.map((item,index) => {
					city += item.label
					if(index < list.length - 1){
						city += '-'
					}
				})
				this.city = city
				this.form.province = list[0].label
				this.form.city = list[1].label
				this.form.county = list[2].label
			},
			submit(){
				if(!this.checkForm()){
					return false
				}
				common.ajax({
					url: 'User/editUserAddress',
					data: this.form,
					success: res => {
						uni.navigateBack()
					}
				})
			},
			checkForm(){
				let form = this.form
				let tip = ''
				if(!form.name){
					tip = '请输入收货人姓名'
				}else if(!form.mobile){
					tip = '请输入联系方式'
				}else if(!common.checkMobile(this.form.mobile)){
					tip = '手机号码格式错误'
				}else if(!this.city){
					tip = '请选择城市'
				}else if(!form.address){
					tip = '请输入详细地址'
				}else if(!form.remark){
					tip = '请输入备注信息'
				}
				if(tip){
					common.toast(tip)
				}
				return !tip
			}
		}
	}
</script>

<style lang="less">
	.row{
		margin-top: 20rpx;
		line-height: 40rpx;
		padding: 0 25rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: #fff;
		&.textRow{
			display: block;
			.label{
				line-height: 50rpx !important;
				padding-top: 20rpx;
			}
		}
		.label{
			width: 170rpx;
			font-size: 28rpx;
			line-height: 90rpx;
			font-weight: bold;
		}
		input{
			width: 500rpx;
			line-height: 90rpx;
			height: 90rpx;
		}
		.picker{
			width: 500rpx;
			line-height: 90rpx;
			height: 90rpx;
			&.gray .lb-picker-default-slot{color: #bbb}
		}
		textarea{
			width: 100%;
			line-height: 30rpx;
			height: 150rpx;
			margin-left: -6rpx;
		}
	}
	.btn{
		width: 200rpx;
		line-height: 85rpx;
		background: linear-gradient(90deg, #3654D4, #F745F1);
		box-shadow: 0 3rpx 59rpx 0 rgba(60, 54, 212, 0.67);
		border-radius: 10rpx;
		text-align: center;
		color: #fff;
		font-size: 26rpx;
		margin: 80rpx auto 0;
	}
</style>

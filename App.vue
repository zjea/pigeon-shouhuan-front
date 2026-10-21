<script>
	import addKeepalive from '@/uni_modules/fdm-keepalive'

	export default {
		globalData: {

			// 手机调试时使用，需要电脑ip
			url:'http://8.134.49.112:9081',
			// url:'http://192.168.1.142:9081',
			userId: '',
			userName: '',
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide');
			addKeepalive();
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
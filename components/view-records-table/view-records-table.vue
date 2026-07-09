<template>
	<view class="content-table" >
			<uni-table :border="false" :stripe="false" emptyText="">
				<!-- 单独的表头用于固定 -->
				<uni-tr class="title">
					<uni-th width="50" align="center" >窝次</uni-th>
					<uni-th width="55" align="center">产蛋间隔</uni-th>
					<uni-th width="50" align="center">抽蛋</uni-th>
					<uni-th width="50" align="center">照蛋</uni-th>
					<uni-th width="50" align="center">加仔</uni-th>
					<uni-th width="50" align="center">异常</uni-th>
					<uni-th width="50" align="center">窝次</uni-th>
				</uni-tr>
				<uni-tr >
					
				</uni-tr>
			</uni-table>
			<!-- 产蛋列表 -->
			<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-if="props.types === '产蛋'">
				<uni-table  :stripe="false" emptyText="暂无数据" >
					<!-- 隐藏表头 -->
						<uni-tr class="fake-title">
							<uni-th width="55"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
						</uni-tr>
						<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="selectLayEggDate(item.id,item.cageCode)">
							<uni-td width="55" align="center">{{item.cageCode}}</uni-td>
							<uni-td width="50" align="center">{{item.interval}}</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">{{item.epoch}}</uni-td>
						</uni-tr>						
				</uni-table>				
			</scroll-view>
			
			<!-- 抽蛋列表 -->
			<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-else-if="props.types === '抽蛋'">
				<uni-table  :stripe="false" emptyText="暂无数据" >
					<!-- 隐藏表头 -->
						<uni-tr class="fake-title">
							<uni-th width="55"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
						</uni-tr>
						<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="select(item.id)">
							<uni-td width="55" align="center">{{item.cageCode}}</uni-td>
							<uni-td width="50" align="center">{{item.interval}}</uni-td>
							<uni-td width="50" align="center">{{isRecommend(item.pumpingEgg)}}</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">{{item.epoch}}</uni-td>
						</uni-tr>						
				</uni-table>				
			</scroll-view>
			
			<!-- 照蛋列表 -->
			<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-else-if="props.types === '照蛋'">
				<uni-table  :stripe="false" emptyText="暂无数据" >
					<!-- 隐藏表头 -->
						<uni-tr class="fake-title">
							<uni-th width="55"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
						</uni-tr>
						<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="select(item.id)">
							<uni-td width="55" align="center">{{item.cageCode}}</uni-td>
							<uni-td width="50" align="center">{{item.interval}}</uni-td>
							<uni-td width="50" align="center">留窝</uni-td>
							<uni-td width="50" align="center">正常</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">{{item.epoch}}</uni-td>
						</uni-tr>						
				</uni-table>				
			</scroll-view>
			
			<!-- 加仔 -->
			<scroll-view class="scro"  scroll-y="true" :show-scrollbar="false" v-else-if="props.types === '加仔'">
				<uni-table  :stripe="false" emptyText="暂无数据" >
					<!-- 隐藏表头 -->
						<uni-tr class="fake-title">
							<uni-th width="55"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
							<uni-th width="50"></uni-th>
						</uni-tr>
						<uni-tr  class="data" v-for="item in tableData" :key="item.id" @click.native="select(item.id)">
							<uni-td width="55" align="center">{{item.cageCode}}</uni-td>
							<uni-td width="50" align="center">{{item.interval}}</uni-td>
							<uni-td width="50" align="center">留窝</uni-td>
							<uni-td width="50" align="center">正常</uni-td>
							<uni-td width="50" align="center">加仔4</uni-td>
							<uni-td width="50" align="center">--</uni-td>
							<uni-td width="50" align="center">{{item.epoch}}</uni-td>
						</uni-tr>						
				</uni-table>				
			</scroll-view>
	</view>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
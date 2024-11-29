<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎回来: {{ name }}</div>

    <!-- ECharts 图表展示 -->
    <div ref="echartsContainer" class="chart-container"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import * as echarts from 'echarts'
import { getUserGrowth } from '@/api/user';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      growthData: [] // 存储从 API 获取到的用户增长数据
    }
  },
  mounted() {
    // 在组件加载完成后获取数据
    this.fetchUserGrowthData()
  },
  methods: {
    // 获取用户增长数据
    async fetchUserGrowthData() {
      try {
        getUserGrowth().then(res => {
          const userGrowthData = res.data // 获取返回的数据
          // console.log(res.data)
          this.renderUserGrowthChart(userGrowthData) // 渲染图表
        }).catch(err => {
          console.error(err);
        })  // 调用后端接口
      } catch (error) {
        console.error('获取用户增长数据失败:', error)
      }
    },

    // 渲染用户增长折线图
    renderUserGrowthChart(userGrowthData) {
      // 提取月份和用户增长数量
      const months = userGrowthData.map(item => item.date) // 月份
      const userCounts = userGrowthData.map(item => item.userCount) // 用户增长数

      // 获取图表容器
      const chartElement = this.$refs.echartsContainer

      // 初始化图表
      const chart = echarts.init(chartElement)

      // 设置图表配置项
      const options = {
        title: {
          text: '用户注册增长趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: {
            rotate: 45  // 让月份标签旋转 45 度，避免重叠
          }
        },
        yAxis: {
          type: 'value',
          name: '用户数量'
        },
        series: [
          {
            data: userCounts,
            type: 'line',
            smooth: false, // 平滑曲线
            areaStyle: {}  // 填充区域
          }
        ]
      }

      // 使用配置项渲染图表
      chart.setOption(options)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}

.dashboard-text {
  font-size: 30px;
  line-height: 46px;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>

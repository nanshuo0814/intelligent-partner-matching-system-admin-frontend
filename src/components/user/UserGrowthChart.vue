<template>
    <div>
        <h3>User Growth Chart</h3>
        <!-- 显示用户增长数据，使用 ref 引用 DOM 元素 -->
        <div v-if="userGrowthData.length > 0" ref="pieChart" style="width: 100%; height: 400px;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    props: {
        userGrowthData: {
            type: Array,
            required: true,
        },
    },
    watch: {
        // 监听 userGrowthData 数据变化，重新渲染图表
        userGrowthData(newData) {
            if (newData && newData.length > 0) {
                this.$nextTick(() => {
                    this.renderPieChart(newData);
                });
            }
        },
    },
    mounted() {
        // 使用 nextTick 等待 DOM 渲染完成后再初始化图表
        this.$nextTick(() => {
            if (this.userGrowthData.length > 0) {
                this.renderPieChart(this.userGrowthData);
            }
        });
    },
    methods: {
        renderPieChart(data) {
            const chartDom = this.$refs.pieChart;
            const myChart = echarts.init(chartDom);

            // 格式化数据为适合 ECharts 的格式
            const chartData = data.map(item => ({
                value: item.count,  // 假设数据项中有 count 字段
                name: item.month,   // 假设数据项中有 month 字段
            }));

            // 配置饼图选项
            const option = {
                title: {
                    text: 'User Growth by Month',
                    subtext: '增长数据',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)',
                },
                series: [
                    {
                        name: 'User Growth',
                        type: 'pie',
                        radius: '50%',
                        data: chartData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            };

            myChart.setOption(option);

            // 监听窗口大小变化，自动调整图表大小
            window.addEventListener('resize', () => {
                myChart.resize();
            });
        },
    },
};
</script>

<style scoped>
h3 {
    text-align: center;
}
</style>

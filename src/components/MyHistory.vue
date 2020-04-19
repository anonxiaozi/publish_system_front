<template>
    <div style="line-height: normal;">
        <div>
            <el-input placeholder="URL、文案名称" v-model="historySearch" style="width: 350px; margin-bottom: 12px;">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="getHistoryAgain" style="margin-left: 10px;"></el-button>
        </div>
        <el-row>
            <el-col :span="22" :offset="1">
                <el-table name="" ref="multipleTable" tooltip-effect="dark" :data="NewHistory.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                    <el-table-column prop="link" label="URL" width="500">
                        <template slot-scope="scope">
                            <a :href="scope.row.link" target="_blank" style="text-decoration:none; color: green">{{scope.row.link}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cr" label="文案" width="150">
                    </el-table-column>
                    <el-table-column prop="datetime" label="发布时间" width="200">
                    </el-table-column>
                    <el-table-column fixed="right" label="" width="200">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.monitor" active-color="#13ce66" inactive-color="#ff4949" @change="changeMonitor(scope.row.link, scope.row.monitor)">
                            </el-switch>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div class="block" style="margin-top: 20px">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="NewHistory.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[7, 9, 11, 13, 15]" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            distHistory: [],
            NewHistory: [],
            currentPage: 1,
            pageSize: 11,
            historySearch: '',
            link: ''
        }
    },
    mounted() {
        this.getHistory()
    },
    methods: {
        getHistory() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/record',
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.distHistory = resp.data.message;
                        this.NewHistory = resp.data.message;
                        this.historySearch = '';
                        this.showMsg('历史记录已刷新', 'success')
                    } else {
                        this.showMsg(resp.data.message, 'error', 0)
                    }
                })
                .catch(err => {
                    this.showNotify('访问失败', err, 'error', 0)
                })
        },
        showMsg(data, type, duration = 3000) {
            this.$message({
                showClose: true,
                message: data,
                type: type,
                center: true,
                duration: duration
            })
        },
        showNotify(title, message, type, duration = 3000) {
            this.$notify({
                title: title,
                message: message,
                type: type,
                duration: duration
            })
        },
        getHistoryAgain() {
            this.getHistory();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        handleSizeChange: function(size) {
            this.pageSize = size;
        },
        fetchHistory(val) {
            var historyList = [];
            this.currentPage = 1;
            this.NewHistory = this.distHistory;
            this.NewHistory.map(dist => {
                if (dist.link.search(val) != -1 || (dist.cr.search(val) != -1)) {
                    historyList.push(dist)
                }
            });
            this.NewHistory = historyList;
        },
        changeMonitor(link, monitor) {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/monitor',
                    method: 'post',
                    data: { 'link': link, 'monitor': monitor },
                    transformRequest: [function(data) {
                        let result = '';
                        for (let item in data) {
                            result += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
                        }
                        return result;
                    }],
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.showNotify(link, resp.data.message, 'success')
                    } else {
                        this.showNotify(link + '失败', resp.data.message, 'failed', 0)
                    }
                })
                .catch(err => {
                    this.showMsg(err, 'error', 0)
                })
        },
    },
    watch: {
        historySearch(val, oldVal) {
            this.fetchHistory(val)
        }
    }
}
</script>
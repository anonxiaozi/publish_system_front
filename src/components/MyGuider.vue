<template>
    <div style="line-height: normal;">
        <div>
            <el-input placeholder="" v-model="guiderSearch" style="width: 280px; margin-bottom: 12px;">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="getGuiderAgain" style="margin-left: 10px;"></el-button>
        </div>
        <el-row>
            <el-col :span="22" :offset="1">
                <el-table name="ipRecord" ref="multipleTable" tooltip-effect="dark" :data="newGuiders.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                    <el-table-column prop="url" label="URL" width="350%">
                    	<template slot-scope="scope">
							<a :href="scope.row.url" target="_blank" style="text-decoration:none; color: green">{{scope.row.url}}</a>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="cr" label="文案" width="150%">
                    </el-table-column>
                    <el-table-column label="客服信息" width="500%">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.record.default.name}} | {{scope.row.record.default.id}} | {{scope.row.record.default.call}} |
                                {{scope.row.record.default.phone}} | <br><a href="scope.row.record.default.img" target="_blank">{{scope.row.record.default.img}}</a>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="record.default.company" label="公司" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column fixed="right" label="" width="200%">
                        <template slot-scope="scope">
                            <el-tag type="success" effect="dark" @click="showDetailHostDialog(scope.row, scope.$index)">详细</el-tag>&nbsp;
                            <el-tag type="warning" effect="dark" @click="showEditHostDialog(scope.row, scope.$index)">修改</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div class="block" style="margin-top: 20px">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="guiders.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[6, 9, 11, 13]" :page-size="pageSize">
            </el-pagination>
        </div>
        <!-- <EditHost :host="host" @to-hidenEditDialog="hidenEditDialog" :dialogFormVisible="dialogFormVisible" :formLabelWidth="formLabelWidth" @to-refreshEditHost="refreshEditHost"></EditHost> -->
        <!-- <NewHost @to-hidenAddDialog="hidenAddDialog" :newdialogFormVisible="newdialogFormVisible" :formLabelWidth="formLabelWidth" @to-refreshHost="refreshHost"></NewHost> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            guiderSearch: '',
            guiders: [],
            newGuiders: [],
            currentPage: 1,
            pageSize: 9,
        }
    },
    created() {
        this.getGuider()
    },
    methods: {
        getGuider() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/guider',
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.guiders = resp.data.message;
                        this.newGuiders = resp.data.message;
                        this.hostSearch = '';
                        this.showMsg('客服信息已刷新', 'success')
                    } else {
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify('访问失败', err, 'error')
                })
        },
        showMsg(data, type) {
            this.$message({
                showClose: true,
                message: data,
                type: type,
                center: true,
            })
        },
        showNotify(title, message, type) {
            this.$notify({
                title: title,
                message: message,
                type: type,
                duration: 3000
            })
        },
        getGuiderAgain() {

        },
        showDetailHostDialog() {

        },
        showEditHostDialog() {

        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        handleSizeChange: function(size) {
            this.pageSize = size;
        },
    }
}
</script>
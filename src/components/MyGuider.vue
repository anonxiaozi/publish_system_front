<template>
    <div style="line-height: normal;">
        <div>
            <el-input placeholder="URL、文案名称、客服ID" v-model="guiderSearch" style="width: 350px; margin-bottom: 12px;">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="getGuiderAgain" style="margin-left: 10px;"></el-button>
        </div>
        <el-row>
            <el-col :span="22" :offset="1">
                <el-table name="ipRecord" ref="multipleTable" tooltip-effect="dark" :data="newGuiders.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                    <el-table-column prop="url" label="URL">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" target="_blank" style="text-decoration:none; color: green">{{scope.row.url}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cr" label="文案">
                    </el-table-column>
                    <el-table-column label="客服信息">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.record.default.name}} | {{scope.row.record.default.id}} | {{scope.row.record.default.call}} |
                                {{scope.row.record.default.phone}} | <br><a href="scope.row.record.default.img" target="_blank" style="color: green">{{scope.row.record.default.img}}</a>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="record.default.company" label="公司" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column fixed="right" label="" width="160">
                        <template slot-scope="scope">
                            <el-tag type="success" effect="dark" @click="showDetailGuiderDialog(scope.row, scope.$index)">详细</el-tag>&nbsp;
                            <el-tag type="warning" effect="dark" @click="showEditGuiderDialog(scope.row)">修改</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div class="block" style="margin-top: 20px">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="guiders.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[7, 9, 11, 13]" :page-size="pageSize">
            </el-pagination>
        </div>
        <MyGuiderDetail :guider="guider" :GuiderDialogVisible="DetailDialogVisible" @to-hidenDetail="hidenDetail"></MyGuiderDetail>
        <MyGuiderEdit :guider="guider" :GuiderDialogVisible="EditDialogVisible" @to-hidenEdit="hidenEdit" @to-refreshRecord="updateRecord"></MyGuiderEdit>
    </div>
</template>
<script>
import MyGuiderDetail from './MyGuiderDetail.vue'
import MyGuiderEdit from './MyGuiderEdit.vue'

export default {
    data() {
        return {
            guiderSearch: '',
            guiders: [],
            newGuiders: [],
            currentPage: 1,
            pageSize: 7,
            guider: {},
            DetailDialogVisible: false,
            EditDialogVisible: false,
        }
    },
    mounted() {
        this.getGuider();
        var pz = localStorage.getItem('guiderPageSize');
        if (pz) {
            this.pageSize = Number(pz);
        }
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
            this.getGuider();
        },
        showDetailGuiderDialog(guider, idx) {
            this.guider = guider;
            this.DetailDialogVisible = true;
        },
        showEditGuiderDialog(guider, idx) {
            this.guider = JSON.parse(JSON.stringify(guider));
            this.EditDialogVisible = true;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        handleSizeChange: function(size) {
            this.pageSize = size;
            localStorage.setItem('guiderPageSize', size);
        },
        fetchGuider(val) {
            var guiderList = [];
            this.currentPage = 1;
            this.newGuiders = this.guiders;
            this.newGuiders.map(guider => {
                if (guider.record.default.id) {
                    if (guider.url.search(val) != -1 || (guider.cr.search(val) != -1) || (guider.record.default.id.search(val) != -1)) {
                        guiderList.push(guider)
                    }
                } else {
                    if (guider.url.search(val) != -1 || (guider.cr.search(val) != -1)) {
                        guiderList.push(guider)
                    }
                }
            });
            this.newGuiders = guiderList;
        },
        hidenDetail(val) {
            this.DetailDialogVisible = val;
            this.guider = {};
        },
        hidenEdit(val) {
            this.EditDialogVisible = false;
            this.guider = {};
        },
        updateRecord(guider) {
            var idx = this.guiders.findIndex(data => {
                return data.url == guider.url
            });
            this.$set(this.guiders[idx], 'record', guider.record)
        }
    },
    watch: {
        guiderSearch(val, oldVal) {
            this.fetchGuider(val)
        }
    },
    components: {
        MyGuiderDetail,
        MyGuiderEdit,
    }
}
</script>
<template>
    <div>
        <el-dialog title="" :visible.sync="buttonDialogVisible" center :before-close="hidenButtonDialog">
            <el-form>
                <el-form-item label="文案名称:" :label-width="formLabelWidth">
                    <el-input v-model="template" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="发布地址:" :label-width="formLabelWidth">
                    <el-input v-model="url"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div style="float: left">
                    <el-button type="success" @click=setOnline>上线</el-button>
                    <el-button type="danger" @click=setOffline>下线</el-button>
                    <el-button type="warning" @click=doUpdate>更新</el-button>
                </div>
                <div style="float: right;">
                    <el-button @click="hidenButtonDialog" type="info">返 回</el-button>
                    <el-button type="primary" @click="publish">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="template + ' 文案更新结果'" :visible.sync="urlDialogVisible" center :before-close="hidenUrlDialog">
            <el-table :data="urls" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="url" label="URL">
                    <template slot-scope="scope">
                        <span style="cursor: pointer" @click="toLink(scope.row.url)">{{scope.row.url}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="更新结果">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <div style="float: right;">
                    <el-button @click="hidenUrlDialog" type="info">确 认</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            url: '',
            status: 0,
            urls: [],
            urlDialogVisible: false,
        }
    },
    props: ['template', 'online', 'buttonDialogVisible', 'formLabelWidth'],
    methods: {
        publish() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/distribute',
                    method: 'post',
                    data: { 'cr_name': this.template, 'url': this.url },
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
                        this.$notify({
                            title: '发布成功',
                            dangerouslyUseHTMLString: true,
                            message: '<a href="' + this.url + '" target="_blank" style="text-decoration:none;">' + this.url + '</a>',
                            duration: 8000
                        })
                    } else {
                        this.showNotify('失败', resp.data.message, 'failed', 5000)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .then(() => {
                    this.hidenButtonDialog();
                })
        },
        changeTmpStatus() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/status/' + this.template + '/' + this.status,
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.showNotify('成功', resp.data.message, 'success');
                        this.$emit('to-changeOnlineStatus', this.template, resp.data.data)
                    } else {
                        this.showNotify('失败', resp.data.message, 'failed')
                    }
                })
                .catch(err => {
                    this.showNotify('失败', err, 'failed')
                })
                .then(() => {
                    this.hidenButtonDialog()
                })
        },
        doUpdate() {
            var loading = this.$loading({
                lock: true,
                text: '等待更新 ' + this.template + ' 文案的结果...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http({
                    url: 'http://' + this.remoteAddr + '/update_cr/' + this.template,
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.urls = resp.data.message;
                        loading.close();
                        this.showUrlDialog()
                    } else {
                        this.showNotify('失败', resp.data.message, 'failed')
                    }
                })
                .catch(err => {
                    this.showNotify('失败', err, 'failed')
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
        hidenButtonDialog() {
            this.url = '';
            this.$emit('to-hidenButtonDialog', false)
        },
        setOnline() {
            this.status = 1;
            this.changeTmpStatus()
        },
        setOffline() {
            this.status = 0;
            this.changeTmpStatus()
        },
        showUrlDialog() {
            // this.hidenButtonDialog();
            this.urlDialogVisible = true
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.status == '更新成功') {
                return 'success-row';
            } else {
                return 'failed-row';
            }
        },
        hidenUrlDialog() {
            this.urls = [];
            this.urlDialogVisible = false
        },
        toLink(url) {
            window.open(url)
        }
    }
}
</script>
<style>
.el-table .failed-row {
    background: #f56c6c;
}

.el-table .success-row {
    background: #94ca794d;
}
</style>
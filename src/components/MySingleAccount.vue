<template>
    <el-dialog :title="account" :visible.sync="AccountDialogVisible" center :before-close="handleClose">
        <el-checkbox :indeterminate="isIndeterminate" v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="selectUrl" @change="handleSelectUrlChange">
            <el-checkbox v-for="url in urls" :label="url" :key="url">{{url}}</el-checkbox>
        </el-checkbox-group>
        <el-divider>客服</el-divider>
        <el-form :model="record">
            <el-card shadow="hover" header="" style="margin-bottom: 8px;" v-for="(cr_info, cr_name, idx) in record" :key="idx">
                <el-form-item :label="cr_name">
                    <el-button style="float: right; padding: 3px" type="danger" icon="el-icon-circle-close" v-if="cr_name !== 'default'" @click="removeRecord(cr_name)">删除</el-button>
                    <el-button style="float: right; padding: 3px; margin-right: 18px;" type="success" icon="el-icon-document-add" @click="addRecord()">新增</el-button>
                </el-form-item>
                <el-form-item required>
                    <el-switch v-model="cr_info.choice" inactive-text="日期" inactive-value="date" active-text="星期" active-value="week" v-if="isNew(cr_name)">
                    </el-switch>
                </el-form-item>
                <el-form-item label="开始时间" label-width="100px" required>
                    <el-input v-model="cr_info.start_time" v-if="isDefault(cr_name)" readonly></el-input>
                    <el-date-picker v-model="cr_info.start_time" v-else-if="cr_info.choice == 'date'" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                    <el-select v-model="cr_info.start_time" placeholder="选择星期" v-else-if="cr_info.choice == 'week'">
                        <el-option v-for="item in weekdays" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结束时间" label-width="100px" required>
                    <el-input v-model="cr_info.end_time" v-if="isDefault(cr_name)" readonly></el-input>
                    <el-date-picker v-model="cr_info.end_time" v-else-if="cr_info.choice == 'date'" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                    <el-select v-model="cr_info.end_time" placeholder="选择星期" v-else-if="cr_info.choice == 'week'">
                        <el-option v-for="item in weekdays" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ID" label-width="100px" required>
                    <el-input v-model="cr_info.id"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="100px" required>
                    <el-input v-model="cr_info.name"></el-input>
                </el-form-item>
                <el-form-item label="称呼" label-width="100px" required>
                    <el-input v-model="cr_info.call"></el-input>
                </el-form-item>
                <el-form-item label="二维码地址" label-width="100px" required>
                    <el-input v-model="cr_info.img"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px" required>
                    <el-input v-model="cr_info.phone"></el-input>
                </el-form-item>
                <el-form-item label="公司" label-width="100px" required>
                    <el-input v-model="cr_info.company"></el-input>
                </el-form-item>
            </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="hidenDialog">取 消</el-button>
            <el-button type="primary" @click="checkInput">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            selectAll: false,
            isIndeterminate: true,
            selectUrl: [],
            record: {
                'default': {
                    'start_time': 'default',
                    'end_time': 'default',
                    'id': '',
                    'name': '',
                    'call': '',
                    'img': '',
                    'phone': '',
                    'company': ''
                }
            },
            weekdays: [
                { value: '1', label: '星期一' },
                { value: '2', label: '星期二' },
                { value: '3', label: '星期三' },
                { value: '4', label: '星期四' },
                { value: '5', label: '星期五' },
                { value: '6', label: '星期六' },
                { value: '7', label: '星期日' },
            ]
        }
    },
    props: ['account', 'urls', 'AccountDialogVisible'],
    methods: {
        hidenDialog() {
            this.record = {
                'default': {
                    'start_time': 'default',
                    'end_time': 'default',
                    'id': '',
                    'name': '',
                    'call': '',
                    'img': '',
                    'phone': '',
                    'company': ''
                }
            };
            this.selectUrl = [];
            this.$emit('to-hidenDialog', false)
        },
        handleSelectAll(val) {
            this.selectUrl = val ? this.urls : [];
            this.isIndeterminate = false;
        },
        handleSelectUrlChange(val) {
            let selectCount = val.length;
            this.selectAll = selectCount === this.urls.length;
            this.isIndeterminate = selectCount > 0 && selectCount < this.urls.length;
        },
        removeRecord(cr_name) {
            this.$delete(this.record, cr_name)
        },
        addRecord() {
            var name = 'new' + (Object.keys(this.record).length - 1)
            this.$set(this.record, name, {
                'start_time': '',
                'end_time': '',
                'id': '',
                'name': '',
                'call': '',
                'phone': '',
                'company': '',
                'choice': ''
            })
        },
        isDefault(val) {
            return true ? val == 'default' : false
        },
        isNew(val) {
            return true ? val.indexOf("new") != -1 : false
        },
        submitRecord() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/update_record',
                    method: 'post',
                    data: { 'urls': JSON.stringify(this.selectUrl), 'record': JSON.stringify(this.record) },
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
                        this.showNotify('账户 ' + this.account, resp.data.message, 'success')
                    } else {
                        this.showNotify('失败', resp.data.message, 'failed', 0)
                    }
                })
                .catch(err => {
                    this.showNotify('失败', err, 'failed', 0)
                })
                .then(() => {
                    this.hidenDialog();
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
        checkInput() {
        	for (var r in this.record) {
        		for (var i in this.record[r]) {
        			if (this.record[r][i] == '') {
        				this.showNotify('错误', i + ' 为必填', 'failed')
        				return false
        			}
        		}
        	}
        	this.submitRecord()
        },
        handleClose() {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.hidenDialog()
                })
                .catch(_ => {});
        }
    }
}
</script>
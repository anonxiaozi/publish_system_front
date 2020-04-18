<template>
    <el-dialog :title="guider.cr + ': ' + guider.url" :visible.sync="GuiderDialogVisible" center :before-close="hidenGuiderDialog">
        <el-form :model="guider">
            <el-card shadow="hover" header="" style="margin-bottom: 8px;" v-for="(cr_info, cr_name, idx) in guider.record" :key="idx">
                <el-form-item :label="cr_name">
                    <el-button style="float: right; padding: 3px" type="danger" icon="el-icon-circle-close" v-if="cr_name !== 'default'" @click="removeRecord(cr_name)">删除</el-button>
                    <el-button style="float: right; padding: 3px; margin-right: 18px;" type="success" icon="el-icon-document-add" @click="addRecord()">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-switch v-model="cr_info.choice" inactive-text="日期" inactive-value="date" active-text="星期" active-value="week" v-if="isNew(cr_name)" @change="changeDateFormat(cr_name, cr_info.choice)">
                    </el-switch>
                </el-form-item>
                <el-form-item label="开始时间" label-width="100px">
                    <el-input v-model="cr_info.start_time" v-if="isDefault(cr_name)" readonly></el-input>
                    <el-date-picker v-model="cr_info.start_time" v-else-if="cr_info.choice == 'date'" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                    <el-select v-model="cr_info.start_time" placeholder="选择星期" v-else-if="cr_info.choice == 'week'">
                        <el-option v-for="item in weekdays" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="cr_info.start_time" v-else></el-input>
                </el-form-item>
                <el-form-item label="结束时间" label-width="100px">
                    <el-input v-model="cr_info.end_time" v-if="isDefault(cr_name)" readonly></el-input>
                    <el-date-picker v-model="cr_info.end_time" v-else-if="cr_info.choice == 'date'" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                    <el-select v-model="cr_info.end_time" placeholder="选择星期" v-else-if="cr_info.choice == 'week'">
                        <el-option v-for="item in weekdays" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="cr_info.end_time" v-else></el-input>
                </el-form-item>
                <el-form-item label="ID" label-width="100px">
                    <el-input v-model="cr_info.id"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="100px">
                    <el-input v-model="cr_info.name"></el-input>
                </el-form-item>
                <el-form-item label="称呼" label-width="100px">
                    <el-input v-model="cr_info.call"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="cr_info.phone"></el-input>
                </el-form-item>
                <el-form-item label="公司" label-width="100px">
                    <el-input v-model="cr_info.company"></el-input>
                </el-form-item>
            </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="hidenGuiderDialog">取 消</el-button>
            <el-button type="primary" @click="hidenGuiderDialog">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
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
    props: ['guider', 'GuiderDialogVisible'],
    methods: {
        hidenGuiderDialog() {
            this.$emit('to-hidenEdit', false)
        },
        splitTime(val, idx) {
            if (val === "default") {
                return val
            } else {
                return val.split('-')[idx]
            }
        },
        removeRecord(cr_name) {
            this.$delete(this.guider.record, cr_name)
            Object.keys(this.guider.record)
        },
        addRecord() {
            var name = 'new' + (Object.keys(this.guider.record).length - 1)
            this.$set(this.guider.record, name, {
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
        changeDateFormat(cr_name, cr_choice) {
            console.log(cr_name, cr_choice)
        }
    }
}
</script>
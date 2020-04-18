<template>
    <el-dialog :title="guider.cr + ': ' + guider.url" :visible.sync="GuiderDialogVisible" center :before-close="hidenGuiderDialog">
        <el-form :model="guider">
            <el-card shadow="hover" header="" style="margin-bottom: 8px;" v-for="(cr_info, cr_name, idx) in guider.record" :key="idx">
                <el-form-item :label="cr_name">
                    <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-circle-close" v-if="cr_name !== 'default'" @click="removeRecord(cr_name)">删除</el-button>
                </el-form-item>
                <el-form-item label="开始时间" label-width="100px">
                    <el-input v-model="cr_info.start_time"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" label-width="100px">
                    <el-input v-model="cr_info.end_time"></el-input>
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
        return {}
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
        }
    }
}
</script>
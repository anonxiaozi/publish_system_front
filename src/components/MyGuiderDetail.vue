<template>
    <div>
        <el-dialog :title="guider.cr + ': ' + guider.url" :visible.sync="GuiderDialogVisible" center :before-close="hidenGuiderDialog">
            <el-row :gutter="12">
                <el-col :span="24" v-for="(cr_info, cr, idx) in guider.record" :key="idx" style="margin-bottom: 20px;">
                    <el-card shadow="hover" :header="cr" style="color: green">
                        {{cr_info.id}} | {{cr_info.name}} | {{cr_info.phone}} | {{cr_info.call}} |
                        {{cr_info.company}}<br>
                        <a :href="cr_info.img" style="text-decoration: none;" target="_blank">{{cr_info.img}}</a>
                    </el-card>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hidenGuiderDialog" type="primary">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    props: ['guider', 'GuiderDialogVisible'],
    methods: {
        hidenGuiderDialog() {
            this.$emit('to-hidenDetail', false)
        },
    }
}
</script>
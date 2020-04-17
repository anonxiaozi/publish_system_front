<template>
    <div>
        <el-row :span="22" :offset="1">
            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" v-for="(online, template, idx) in templates" :key="idx">
                <el-button :type="online? 'primary': 'info'" style="width: 150px; height: 60px; margin-bottom: 20px;" @click="showButtonDialog(online, template)">
                    {{template}}
                </el-button>
            </el-col>
        </el-row>
        <MyButtonDialog :formLabelWidth="formLabelWidth" :template="current_template" :online="current_online" :buttonDialogVisible="buttonDialogVisible" @to-hidenButtonDialog="hidenButtonDialog" @to-changeOnlineStatus="changeOnlineStatus">
        </MyButtonDialog>
    </div>
</template>
<script>
import MyButtonDialog from './MyButtonDialog.vue'
export default {
    data() {
        return {
            templates: Array,
            formLabelWidth: '120px',
            current_template: '',
            current_online: '',
            buttonDialogVisible: false
        }
    },
    created() {
        this.getTemplates()
    },
    methods: {
        getTemplates() {
            this.$http({
                    url: 'http://' + this.remoteAddr,
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.templates = resp.data.message;
                        this.showMsg('刷新文案成功', 'success')
                    } else {
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify(resp.status, resp.data, 'error')
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
        showButtonDialog(online, template) {
        	this.current_online = online;
        	this.current_template = template;
        	this.buttonDialogVisible = true;
        },
        hidenButtonDialog(val){
        	this.buttonDialogVisible = false;
        	this.current_online = '';
        	this.current_template = '';
        },
        changeOnlineStatus(tmp, status) {
        	this.templates[tmp] = status
        }
    },
    components: {
        MyButtonDialog,
    }
}
</script>
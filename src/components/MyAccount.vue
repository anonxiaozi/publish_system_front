<template>
    <el-row>
        <el-col :xs="20" :sm="10" :md="8" :lg="6" :xl="4" v-for="(account, idx) in accounts" :key="idx">
            <el-button type="primary" round style="width: 300px; height: 60px; margin-bottom: 20px; color:white" @click="getSingleAccount(account)">
                {{account}}
            </el-button>
        </el-col>
        <MySingleAccount :urls="urls" :account="account" :AccountDialogVisible="AccountDialogVisible" @to-hidenDialog="hidenDialog"></MySingleAccount>
    </el-row>
</template>
<script type="text/javascript">
import MySingleAccount from './MySingleAccount.vue'

export default {
    data() {
        return {
            accounts: [],
            account: '',
            urls: [],
            AccountDialogVisible: false
        }
    },
    created() {
        this.getAccount()
    },
    methods: {
        getAccount() {
            this.$http({
                    url: 'http://' + this.remoteAddr + '/accounts',
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.accounts = resp.data.message;
                        this.showMsg('账号信息已刷新', 'success')
                    } else {
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify('访问失败', err, 'error')
                })
        },
        getSingleAccount(account) {
            this.account = account;
            this.$http({
                    url: 'http://' + this.remoteAddr + '/account/' + account,
                    method: 'get',
                })
                .then(resp => {
                    if (resp.data.status == 200) {
                        this.urls = resp.data.message;
                        this.showSingleDialog()
                    } else {
                        this.showMsg(resp.data.message, 'warning')
                    }
                })
                .catch(err => {
                    this.showNotify('访问失败', err, 'error', 0)
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
        showNotify(title, message, type, duration=3000) {
            this.$notify({
                title: title,
                message: message,
                type: type,
                duration: duration
            })
        },
        showSingleDialog() {
            this.AccountDialogVisible = true;
        },
        hidenDialog() {
            this.AccountDialogVisible = false;
            this.account = '';
            this.urls = [];
        }
    },
    components: {
        MySingleAccount,
    }
}
</script>
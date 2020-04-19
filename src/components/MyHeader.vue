<template>
    <div>
        <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" background-color="#24292e" text-color="#fff700" active-text-color="#0eff0e">
            <el-menu-item index="templates" @click="GoTemplates">文案</el-menu-item>
            <el-menu-item index="guider" @click="GoGuider">客服</el-menu-item>
            <el-menu-item index="account" @click="GoAccount">账号</el-menu-item>
            <el-menu-item index="history" @click="GoHistory">记录</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    created() {
        this.activeTab = this.$route.path.substr(1);
    },
    data() {
        return {
            user: localStorage.getItem('user'),
            activeTab: 'hosts',
            ip_addr: ''
        };
    },
    methods: {
        GoTemplates() {
            this.$router.push('/templates').catch(err => { err })
        },
        GoGuider() {
            this.$router.push('/guider').catch(err => { err })
        },
        GoAccount() {
            this.$router.push('/account').catch(err => { err })
        },
        GoHistory() {
            this.$router.push('/history').catch(err => { err })
        },
    },
}
</script>
<style>
.el-icon-arrow-down {
    font-size: 12px;
}

.demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
</style>
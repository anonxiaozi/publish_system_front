<template>
    <div>
        <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" background-color="#3b8e49" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="templates" @click="GoTemplates">模板列表</el-menu-item>
            <el-menu-item index="guider" @click="GoGuider">客服</el-menu-item>
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
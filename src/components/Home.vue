<template>
    <div>
        <a href="javascript:;" @click="logout">退出</a>
    </div>
</template>

<script>
export default {
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="less" scoped>

</style>
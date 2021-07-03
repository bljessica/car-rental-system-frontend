<template>
  <n-message-provider>
    <n-dialog-provider>
      <LoginOrRegister v-if="$route.name === 'loginOrRegister'" />
      <router-view v-else></router-view>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script>
import LoginOrRegister from './containers/LoginOrRegister/index.vue'

export default {
  name: 'App',
  components: {
    LoginOrRegister
  }
}
</script>

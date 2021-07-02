<template>
  <n-message-provider>
    <LoginOrRegister />
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

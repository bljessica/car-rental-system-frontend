<template>
  <div class="login-or-register-container">
    <div class="login-or-register__form-wrapper">
      <n-tabs
        default-value="login"
        show-divider
        style="margin: 0 auto;"
        justify-content="space-evenly"
        type="line">
        <n-tab-pane name="login" tab="登录">
          <n-form
            :rules="loginFormRules"
            :label-width="80"
            label-placement="left"
            :model="loginFormValue"
            ref="loginFormRef"
            style="padding: 20px;">
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="loginFormValue.username" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input
                type="password"
                show-password-toggle
                v-model:value="loginFormValue.password"
                placeholder="请输入密码" />
            </n-form-item>
            <n-button @click="handleLoginFormValidateClick" type="primary" style="width: 100%;">确定</n-button>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="register" tab="注册">
          <n-form
            :label-width="80"
            :rules="registerFormRules"
            :model="registerFormValue"
            label-placement="left"
            ref="registerFormRef"
            style="padding: 20px;">
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="registerFormValue.username" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item
              label="密码"
              path="password">
              <n-input
                type="password"
                show-password-toggle
                v-model:value="registerFormValue.password"
                placeholder="请输入密码" />
            </n-form-item>
            <n-form-item
              label="确认密码"
              path="passwordConfirm">
              <n-input
                type="password"
                show-password-toggle
                v-model:value="registerFormValue.passwordConfirm"
                placeholder="请确认密码" />
            </n-form-item>
            <n-form-item label="真实姓名" path="realName">
              <n-input v-model:value="registerFormValue.realName" placeholder="请输入真实姓名" />
            </n-form-item>
            <n-form-item
              label="联系电话"
              path="phone">
              <n-input v-model:value="registerFormValue.phone" placeholder="请输入联系电话" />
            </n-form-item>
            <n-form-item
              label="邮箱"
              path="email">
              <n-input v-model:value="registerFormValue.email" placeholder="请输入邮箱" />
            </n-form-item>
            <n-button @click="handleRegisterValidateClick" type="primary" style="width: 100%;">确定</n-button>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

export default {
  setup () {
    const router = useRouter()
    const $message = useMessage()
    const loginFormRef = ref(null)
    const registerFormRef = ref(null)
    const loginFormValue = ref({
      username: '',
      password: ''
    })
    const registerFormValue = ref({
      username: '',
      password: '',
      passwordConfirm: '',
      realName: '',
      phone: '',
      email: ''
    })
    return {
      router,
      loginFormRef,
      registerFormRef,
      loginFormValue,
      registerFormValue,
      loginFormRules: {
        username: {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: ['input', 'blur']
        }
      },
      registerFormRules: {
        username: {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        password: {
          required: true,
          validator (rule, value) {
            if (!value) {
              return new Error('请输入密码')
            } else if (value.length < 6) {
              return new Error('密码长度不少于六位')
            }
            return true
          },
          trigger: ['input', 'blur']
        },
        passwordConfirm: {
          required: true,
          validator (rule, value) {
            console.log(value)
            if (!value) {
              return new Error('请重复输入密码')
            } else if (registerFormValue.value.password !== value) {
              return new Error('两次输入的密码不一致')
            }
            return true
          },
          trigger: 'blur'
        },
        realName: {
          required: true,
          message: '请输入真实姓名',
          trigger: ['input', 'blur']
        },
        phone: {
          required: true,
          validator (rule, value) {
            const phoneReg = /^1[358]\d{9}$/
            if (!phoneReg.test(value)) {
              return new Error('电话号码格式不正确')
            }
            return true
          },
          trigger: 'blur'
        },
        email: {
          required: true,
          validator (rule, value) {
            const emailReg = /[\d\w._-]+@[\d\w]+\.[\w]+/
            if (!emailReg.test(value)) {
              return new Error('邮箱格式不正确')
            }
            return true
          },
          trigger: 'blur'
        }
      },
      handleLoginFormValidateClick (e) {
        loginFormRef.value.validate((errors) => {
          if (!errors) {
            $message.success('登陆成功，1秒后将跳转到首页')
            setTimeout(() => {
              router.push({ name: 'dashBoard' })
            }, 1000);
          } else {
            console.log(errors)
            $message.error('校验失败，请重新输入')
          }
        })
      },
      handleRegisterValidateClick (e) {
        registerFormRef.value.validate((errors) => {
          if (!errors) {
            $message.success('注册成功')
          } else {
            console.log(errors)
            $message.error('校验失败，请重新输入')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.login-or-register-container {
  background: url('../../assets/loginOrRegisterBg.jpg') no-repeat 100% 100%;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.login-or-register__form-wrapper {
  background: #fff;
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 20px 0 0;
}
</style>

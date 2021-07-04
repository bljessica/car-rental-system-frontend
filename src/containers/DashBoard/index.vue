<template>
  <n-layout class="dashboard-container" style="width: 100vw;height: 100vh;overflow: hidden;">
    <n-layout class="dashboard__header">
      <h1 style="width: 200px;margin: 0;">汽车租赁系统</h1>
      <div class="dashboard__header__userinfo">
        <span style="display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 140px;">
          欢迎你，{{currentUsername}}！
        </span>
        <span @click="$router.push({name: 'loginOrRegister'})" style="cursor: pointer;">登出</span>
      </div>
    </n-layout>
    <n-layout class="dashboard__content" v-if="!selectedCar">
      <div class="dashboard__content__tabs-wrapper">
        <span @click="currentTab = 'all'" :class="{'is-active': currentTab === 'all'}">所有车辆</span>
        <n-divider vertical ></n-divider>
        <span @click="currentTab = 'release'" :class="{'is-active': currentTab === 'release'}">我发布的车辆</span>
        <n-divider vertical ></n-divider>
        <span @click="currentTab = 'rent'" :class="{'is-active': currentTab === 'rent'}">我租的车辆</span>
        <n-button @click="openModal('add')">发布车辆</n-button>
      </div>
      <n-layout :native-scrollbar="false" style="height: calc(100vh - 180px);">
        <div class="dashboard__content__cars-wrapper">
          <CarCard
            :displayStatus="currentTab"
            v-for="car in cars"
            :key="car.carId"
            :carId="car.carId"
            :ownerName="car.ownerName"
            :carType="car.carType"
            :carDesc="car.carDesc"
            :carPrice="car.carPrice"
            :spotAddress="car.spotAddress"
            :carStatus="car.carStatus"
            @openModal="openModal($event, car)"
            @selectCar="selectedCar = car"
          />
        </div>
      </n-layout>
    </n-layout>
    <!-- 所选车辆信息 -->
    <n-layout
      class="dashboard__content"
      v-else
      :native-scrollbar="false"
      style="height: calc(100vh - 100px);">
      <n-button round style="margin: 20px 0;" @click="selectedCar = null">
        <template #icon>
          <n-icon>
            <ArrowBack />
          </n-icon>
        </template>
        返回
      </n-button>
      <CarCard
        :displayStatus="currentTab"
        :key="selectedCar.carId"
        :carId="selectedCar.carId"
        :ownerName="selectedCar.ownerName"
        :carType="selectedCar.carType"
        :carDesc="selectedCar.carDesc"
        :carPrice="selectedCar.carPrice"
        :spotAddress="selectedCar.spotAddress"
        :carStatus="selectedCar.carStatus"
        @openModal="openModal($event, selectedCar)"
      />
      <h3>
        事故记录
      </h3>
      <n-data-table :columns="accidentColumns" :data="accidentData" :pagination="accidentPagination" />
      <h3>
        评价记录
      </h3>
      <n-data-table :columns="commentColumns" :data="commentData" :pagination="commentPagination" />
    </n-layout>
    <!-- 弹出确认模态框 -->
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :title="`确定要${modalActionText}吗？`"
      positive-text="确认"
      @positive-click="submitCallback"
      @negative-click="cancelCallback"
      negative-text="取消"
      @update:show="!$event && cancelCallback()"
    >
      <!-- 编辑车辆信息 -->
      <n-form
        v-if="modalType === 'edit' || modalType === 'add'"
        :rules="carInfoFormRules"
        :label-width="80"
        :model="carInfoFormValue"
        ref="carInfoFormRef"
        style="margin-top: 20px;"
      >
        <n-form-item label="车辆id" label-placement="left" path="carId">
          <n-input v-model:value="carInfoFormValue.carId" placeholder="请输入车辆id" />
        </n-form-item>
        <n-form-item label="车主" label-placement="left" path="ownerName">
          <n-input v-model:value="carInfoFormValue.ownerName" placeholder="请输入车主" />
        </n-form-item>
        <n-form-item label-placement="left" label="类型" path="carType">
          <n-input v-model:value="carInfoFormValue.carType" placeholder="请输入类型" />
        </n-form-item>
        <n-form-item label-placement="left" label="描述" path="carDesc">
          <n-input v-model:value="carInfoFormValue.carDesc" placeholder="请输入描述" />
        </n-form-item>
        <n-form-item label-placement="left" label="价格" path="carPrice">
          <n-input-number v-model:value="carInfoFormValue.carPrice" placeholder="请输入价格" />
        </n-form-item>
        <n-form-item label-placement="left" label="停车地址" path="spotAddress">
          <n-input v-model:value="carInfoFormValue.spotAddress" placeholder="请输入停车地址" />
        </n-form-item>
        <n-form-item label-placement="left" label="车辆状态" path="carStatus">
          <n-input v-model:value="carInfoFormValue.carStatus" placeholder="请输入车辆状态" />
        </n-form-item>
      </n-form>
      <!-- 输入反馈或评价内容 -->
      <n-input
        v-else-if="modalType === 'accident' || modalType === 'comment'"
        v-model:value="modalInputValue"
        type="textarea"
        placeholder="请输入内容"
      />
      <n-rate :count="10"  v-if="modalType === 'comment'" v-model:value="commentPoint" />
    </n-modal>
  </n-layout>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted, watch } from 'vue'
import CarCard from '/@/components/CarCard.vue'
import { useMessage } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'
import accidentColumns from './accidentColumns.js'
import commentColumns from './commentColumns.js'

const dialogType = {
  add: '发布车辆',
  edit: '编辑车辆信息',
  rent: '租车',
  accident: '反馈事故',
  comment: '评价',
  delete: '删除车辆'
}

export default {
  components: {
    CarCard,
    ArrowBack
  },
  setup () {
    const ins = getCurrentInstance()
    const global = ins.root.appContext.config.globalProperties
    const modalActionText = computed(() => {
      return dialogType[modalType.value]
    })
    const currentUsername = computed(() => global.user.username)
    const commentPoint = ref(10)
    const accidentData = ref([])
    const accidentPagination = ref({
      pageSize: 10
    })
    const commentData = ref([])
    const commentPagination = ref({
      pageSize: 10
    })
    const selectedCar = ref(null) // 点击进入车辆详情的车
    watch(selectedCar.value, () => {
      // TODO:获取车辆事故和评价记录
    })
    const operatingCar = ref(null) // 进行评价等操作的车
    const cars = ref([])
    const currentTab = ref('all')
    const $message = useMessage()
    const showModal = ref(false)
    const modalType = ref('rent')
    const modalInputValue = ref('')
    const carInfoFormRef = ref(null)
    const getCars = async () => {
      const res = await global.$api.getCars({
        type: currentTab.value,
        userId: global.user.userId
      })
      if (res.code === 0) {
        cars.value = res.data
      } else {
        $message.error(res.msg)
      }
    }
    onMounted(async () => {
      await getCars()
    })
    const carInfoFormRules = ref({
      carId: [
        {
          required: true,
          message: '请输入车id',
          trigger: 'blur'
        }
      ],
      ownerName: [
        {
          required: true,
          message: '请输入车主',
          trigger: 'blur'
        }
      ],
      carType: [
        {
          required: true,
          message: '请输入类型',
          trigger: 'blur'
        }
      ],
      carDesc: [
        {
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }
      ],
      carPrice: [
        {
          type: 'number',
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }
      ],
      spotAddress: [
        {
          required: true,
          message: '请输入停车地址',
          trigger: 'blur'
        }
      ],
      carStatus: [
        {
          required: true,
          message: '请输入车辆状态',
          trigger: 'blur'
        }
      ]
    })
    const carInfoFormValue = ref({
      carId: '',
      ownerName: '',
      carType: '',
      carDesc: '',
      carPrice: 100000,
      spotAddress: '',
      carStatus: ''
    })
    const resetCarInfoFormValue = () => {
      carInfoFormValue.value = {
        carId: '',
        ownerName: '',
        carType: '',
        carDesc: '',
        carPrice: 100000,
        spotAddress: '',
        carStatus: ''
      }
    }
    const handleCarInfoFormValidateClick = (e) => {
      return carInfoFormRef.value.validate(async (errors) => {
        if (!errors) {
          let res = null
          if (modalType.value === 'edit') {
            res = await global.$api.editCar(carInfoFormValue.value)
          } else { // 发布车辆
            res = await global.$api.releaseCar(carInfoFormValue.value)
          }
          if (res.code === 0) {
            $message.success(res.msg)
            showModal.value = false
            resetCarInfoFormValue()
            await getCars()
            return true
          } else {
            $message.error(res.msg)
            return false
          }
        } else {
          $message.error('校验失败，请重新输入')
          return false
        }
      })
    }
    const openModal = (type, car) => {
      car && (operatingCar.value = car)
      modalType.value = type
      showModal.value = true
    }
    const submitCallback = async () => {
      if (modalType.value === 'edit' || modalType.value === 'add') { // 车辆信息修改或发布车辆
        return handleCarInfoFormValidateClick()
      } else {
        let res = null
        if (modalType.value === 'accident') {
          res = await global.$api.addAccident({
            carId: operatingCar.value.carId,
            userId: global.user.userId,
            accidentDesc: modalInputValue.value
          })
        } else if (modalType.value === 'comment') {
          res = await global.$api.addComment({
            carId: operatingCar.value.carId,
            userId: global.user.userId,
            commentDesc: modalInputValue.value,
            commentPoint: commentPoint.value
          })
        } else if (modalType.value === 'rent') {
          res = await global.$api.rent({
            carId: operatingCar.value.carId,
            userId: global.user.userId
          })
        } else if (modalType.value === 'delete') {
          res = await global.$api.deleteCar({
            carId: operatingCar.value.carId,
            userId: global.user.userId
          })
        }
        if (res.code === 0) {
          $message.success(res.msg)
          if (modalType.value === 'delete') {
            await getCars()
          }
        } else {
          $message.error(res.msg)
          return false
        }
      }
    }
    const cancelCallback = () => {
      modalInputValue.value = ''
      commentPoint.value = 10
      resetCarInfoFormValue()
    }
    return {
      currentUsername,
      modalActionText,
      commentPoint,
      accidentColumns,
      accidentData,
      accidentPagination,
      commentColumns,
      commentData,
      commentPagination,
      selectedCar,
      cars,
      currentTab,
      showModal,
      modalType,
      modalInputValue,
      carInfoFormRef,
      carInfoFormRules,
      carInfoFormValue,
      openModal,
      submitCallback,
      cancelCallback
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard__header {
  height: 100px;
  padding: 10px 50px;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  :deep(.n-layout-scroll-container) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.dashboard__header__userinfo {
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dashboard__content {
  height: calc(100vh - 100px);
  margin: 0 20px;
}
.dashboard__content__tabs-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 20px 0;
  .n-divider {
    background-color: #999 !important;
  }
  &>span {
    color: #999;
    cursor: pointer;
    &.is-active {
      color: black
    }
  }
}
.dashboard__content__cars-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>

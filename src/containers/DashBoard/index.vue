<template>
  <n-layout class="dashboard-container" style="width: 100vw;height: 100vh;overflow: hidden;">
    <n-layout class="dashboard__header">
      <h1 style="width: 200px;margin: 0;">汽车租赁系统</h1>
      <div class="dashboard__header__userinfo">
        <span style="display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 140px;">欢迎你，{{username}}！</span>
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
        <n-button @click="releaseCar">发布车辆</n-button>
      </div>
      <n-layout :native-scrollbar="false" style="height: calc(100vh - 250px);">
        <div class="dashboard__content__cars-wrapper">
          <CarCard
            v-for="car in cars"
            :key="car.carId"
            :carId="car.carId"
            :ownerName="car.ownerName"
            :carType="car.carType"
            :carDesc="car.carDesc"
            :carPrice="car.carPrice"
            :spotAddress="car.spotAddress"
            :carStatus="car.carStatus"
            @openModal="openModal"
            @selectCar="selectedCar = car"
          />
        </div>
      </n-layout>
      <n-pagination v-model:page="pageIdx" :page-count="pageCount" style="margin: 20px 0;" />
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
        :key="selectedCar.carId"
        :carId="selectedCar.carId"
        :ownerName="selectedCar.ownerName"
        :carType="selectedCar.carType"
        :carDesc="selectedCar.carDesc"
        :carPrice="selectedCar.carPrice"
        :spotAddress="selectedCar.spotAddress"
        :carStatus="selectedCar.carStatus"
        @openModal="openModal"
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
        v-if="modalType === 'edit'"
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
        v-else-if="modalType === 'feedback' || modalType === 'comment'"
        v-model:value="modalInputValue"
        type="textarea"
        placeholder="请输入内容"
      />
      <n-input-number
        style="margin-top: 10px;"
        :min="0"
        :max="10"
        v-if="modalType === 'comment'"
        v-model:value="commentPoint"></n-input-number>
    </n-modal>
  </n-layout>
</template>

<script>
import { ref, computed } from 'vue'
import CarCard from '/@/components/CarCard.vue'
import { useMessage } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'
import accidentColumns from './accidentColumns.js'
import commentColumns from './commentColumns.js'

const dialogType = {
  edit: '编辑车辆信息',
  rent: '租车',
  feedback: '反馈事故',
  comment: '评价',
  delete: '删除车辆'
}

export default {
  components: {
    CarCard,
    ArrowBack
  },
  setup () {
    const releaseCar = () => {
      openModal('edit')
      isReleasingCar.value = true
    }
    const isReleasingCar = ref(false)
    const modalActionText = computed(() => {
      if (modalType.value !== 'edit') {
        return dialogType[modalType.value]
      } else {
        if (isReleasingCar.value) {
          return '发布车辆'
        }
        return '编辑车辆信息'
      }
    })
    const commentPoint = ref(10)
    const accidentData = ref([])
    const accidentPagination = ref({
      pageSize: 10
    })
    const commentData = ref([])
    const commentPagination = ref({
      pageSize: 10
    })
    const selectedCar = ref(null)
    const cars = ref(Array.from({ length: 9 }, () => ({
      carId: 'test111',
      ownerName: 'deng',
      carType: 'FonTeng',
      carDesc: 'good',
      carPrice: 2100000,
      spotAddress: 'here',
      carStatus: 'done'
    })))
    const username = ref('deng')
    const currentTab = ref('all')
    const pageIdx = ref(1)
    const pageSize = ref(9)
    const pageCount = computed(() => Math.ceil(cars.value.length / pageSize.value))
    const $message = useMessage()
    const showModal = ref(false)
    const modalType = ref('rent')
    const modalInputValue = ref('')
    const carInfoFormRef = ref(null)
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
      return carInfoFormRef.value.validate((errors) => {
        if (!errors) {
          $message.success('车辆信息修改成功')
          showModal.value = false
          resetCarInfoFormValue()
          return true
        } else {
          console.log(errors)
          $message.error('校验失败，请重新输入')
          return false
        }
      })
    }
    const openModal = (type) => {
      if (type === 'edit') {
        isReleasingCar.value = false
      }
      modalType.value = type
      showModal.value = true
    }
    const submitCallback = () => {
      if (modalType.value !== 'edit') {
        $message.success(`${dialogType[modalType.value]}成功！`)
      } else {
        return handleCarInfoFormValidateClick()
      }
    }
    const cancelCallback = () => {
      modalInputValue.value = ''
      commentPoint.value = 10
      resetCarInfoFormValue()
    }
    return {
      releaseCar,
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
      username,
      currentTab,
      pageIdx,
      pageCount,
      dialogType,
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
:deep(.n-pagination) {
  justify-content: center;
}
</style>

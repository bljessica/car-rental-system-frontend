<template>
  <n-card
    class="car-card-container"
    :segmented="{
      content: 'hard',
    }">
    <!-- 标题 -->
    <template #header>
      <div class="car-card___header">
        <div class="car-card___header__info">
          <span style="margin-right: 5px;cursor: pointer;">{{carId}}</span>
          <n-tag type="success">{{carStatus}}</n-tag>
        </div>
        <div class="car-card___header__actions">
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <BrushOutline @click="openModal('edit')" />
              </n-icon>
            </template>
            <span>编辑车辆信息</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <ArchiveOutline @click="openModal('rent')" />
              </n-icon>
            </template>
            <span>租车</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <AlertCircleOutline @click="openModal('feedback')" />
              </n-icon>
            </template>
            <span>事故反馈</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <CreateOutline @click="openModal('comment')" />
              </n-icon>
            </template>
            <span>使用评价</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <TrashOutline @click="openModal('delete')" />
              </n-icon>
            </template>
            <span>删除车辆</span>
          </n-popover>
        </div>
      </div>
    </template>
    <!-- 内容 -->
    <div class="car-card__content">
      <span style="grid-area: a;">车主：{{ownerName}}</span>
      <span style="grid-area: b;">类型：{{carType}}</span>
      <span style="grid-area: c;">描述：{{carDesc}}</span>
      <span style="grid-area: d;">价格：{{carPrice}}</span>
      <span style="grid-area: e;">停车地址：{{spotAddress}}</span>
    </div>
    <!-- 弹出确认模态框 -->
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :title="`确定要${dialogType[modalType]}吗？`"
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
        <n-form-item label="车主" label-placement="left" path="owner">
          <n-input v-model:value="carInfoFormValue.owner" placeholder="请输入车主" />
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
      </n-form>
      <!-- 输入反馈或评价内容 -->
      <n-input
        v-else-if="modalType === 'feedback' || modalType === 'comment'"
        v-model:value="modalInputValue"
        type="textarea"
        placeholder="请输入内容"
      />
    </n-modal>
  </n-card>
</template>

<script>
import { BrushOutline, ArchiveOutline, AlertCircleOutline, CreateOutline, TrashOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const dialogType = {
  edit: '编辑车辆信息',
  rent: '租车',
  feedback: '反馈事故',
  comment: '评价',
  delete: '删除车辆'
}

export default {
  components: {
    BrushOutline,
    ArchiveOutline,
    AlertCircleOutline,
    CreateOutline,
    TrashOutline
  },
  props: {
    carId: {
      type: String,
      default: 'test car'
    },
    ownerName: {
      type: String,
      default: 'deng'
    },
    carType: {
      type: String,
      default: 'BMW'
    },
    carDesc: {
      type: String,
      default: 'Very New.................!Very New.................!Very New.................!Very New.................!Very New.................!'
    },
    carPrice: {
      type: Number,
      default: 500000
    },
    spotAddress: {
      type: String,
      default: 'My home'
    },
    carStatus: {
      type: String,
      default: 'ready'
    }
  },
  setup () {
    const $message = useMessage()
    const showModal = ref(false)
    const modalType = ref('rent')
    const modalInputValue = ref('')
    const carInfoFormRef = ref(null)
    const carInfoFormRules = ref({
      owner: [
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
      ]
    })
    const carInfoFormValue = ref({
      owner: '',
      carType: '',
      carDesc: '',
      carPrice: 100000,
      spotAddress: ''
    })
    const handleCarInfoFormValidateClick = (e) => {
      return carInfoFormRef.value.validate((errors) => {
        if (!errors) {
          $message.success('车辆信息修改成功')
          showModal.value = false
          return true
        } else {
          console.log(errors)
          $message.error('校验失败，请重新输入')
          return false
        }
      })
    }
    const openModal = (type) => {
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
    }
    return {
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

<style lang="scss" scoped>
.car-card__content {
  display: grid;
  grid-template-areas: 'a b'
                       'c c'
                       'd e';
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  height: 90px;
  &>span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.car-card___header, .car-card___header__info, .car-card___header__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.car-card___header__actions {
  :deep(.n-icon) {
    margin: 0 3px;
    cursor: pointer;
  }
}
</style>

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
          <span style="margin-right: 5px;">{{carId}}</span>
          <n-tag type="success">{{carStatus}}</n-tag>
        </div>
        <div class="car-card___header__actions">
          <n-icon size="24">
            <ArchiveOutline @click="openDialog('rent')" />
          </n-icon>
          <n-icon size="24">
            <AlertCircleOutline @click="openDialog('feedback')" />
          </n-icon>
          <n-icon size="24">
            <ChatboxEllipsesOutline @click="openDialog('comment')" />
          </n-icon>
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
  </n-card>
</template>

<script>
import { ArchiveOutline, AlertCircleOutline, ChatboxEllipsesOutline } from '@vicons/ionicons5'
import { useDialog, useMessage } from 'naive-ui'

const dialogType = {
  rent: '租车',
  feedback: '反馈事故',
  comment: '评价'
}

export default {
  components: {
    ArchiveOutline,
    AlertCircleOutline,
    ChatboxEllipsesOutline
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
    const $dialog = useDialog()
    const $message = useMessage()
    const openDialog = (type) => {
      $dialog.success({
        title: `确定要${dialogType[type]}吗？`,
        positiveText: '确定',
        onPositiveClick: () => {
          $message.success('耶！')
        }
      })
    }
    return {
      openDialog
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

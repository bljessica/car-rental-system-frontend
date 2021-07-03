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
          <span style="margin-right: 5px;cursor: pointer;" @click="$emit('selectCar')">{{carId}}</span>
          <n-tag type="success">{{carStatus}}</n-tag>
        </div>
        <div class="car-card___header__actions">
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <BrushOutline @click="$emit('openModal', 'edit')" />
              </n-icon>
            </template>
            <span>编辑车辆信息</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <ArchiveOutline @click="$emit('openModal', 'rent')" />
              </n-icon>
            </template>
            <span>租车</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <AlertCircleOutline @click="$emit('openModal', 'feedback')" />
              </n-icon>
            </template>
            <span>事故反馈</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <CreateOutline @click="$emit('openModal', 'comment')" />
              </n-icon>
            </template>
            <span>使用评价</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="24">
                <TrashOutline @click="$emit('openModal', 'delete')" />
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
      <span style="grid-area: c;">价格：{{carPrice}}</span>
      <span style="grid-area: d;">停车地址：{{spotAddress}}</span>
      <span style="grid-area: e;">描述：{{carDesc}}</span>
    </div>

  </n-card>
</template>

<script>
import { BrushOutline, ArchiveOutline, AlertCircleOutline, CreateOutline, TrashOutline } from '@vicons/ionicons5'

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
  }
}
</script>

<style lang="scss" scoped>
.car-card__content {
  display: grid;
  grid-template-areas: 'a b'
                       'c d'
                       'e e';
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

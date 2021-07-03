<template>
  <n-layout class="dashboard-container" style="width: 100vw;height: 100vh;overflow: hidden;">
    <n-layout class="dashboard__header">
      <h1 style="width: 200px;margin: 0;">汽车租赁系统</h1>
      <div class="dashboard__header__userinfo">
        <span style="display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 140px;">欢迎你，{{username}}！</span>
        <span @click="$router.push({name: 'loginOrRegister'})" style="cursor: pointer;">登出</span>
      </div>
    </n-layout>
    <n-layout class="dashboard__content" style="height: calc(100vh - 100px);margin: 0 20px;">
      <div class="dashboard__content__tabs-wrapper">
        <span @click="currentTab = 'all'" :class="{'is-active': currentTab === 'all'}">所有车辆</span>
        <n-divider vertical ></n-divider>
        <span @click="currentTab = 'release'" :class="{'is-active': currentTab === 'release'}">我发布的车辆</span>
        <n-divider vertical ></n-divider>
        <span @click="currentTab = 'rent'" :class="{'is-active': currentTab === 'rent'}">我租的车辆</span>
      </div>
      <n-layout :native-scrollbar="false" style="height: calc(100vh - 250px);">
        <div class="dashboard__content__cars-wrapper">
          <CarCard v-for="i in carNum" :key="i" />
        </div>
      </n-layout>
      <n-pagination v-model:page="pageIdx" :page-count="pageCount" style="margin: 20px 0;" />
    </n-layout>
  </n-layout>
</template>

<script>
import { ref, computed } from 'vue'
import CarCard from '/@/components/CarCard.vue'

export default {
  components: {
    CarCard
  },
  setup () {
    const username = ref('deng')
    const currentTab = ref('all')
    const pageIdx = ref(1)
    const pageSize = ref(9)
    const carNum = ref(9)
    const pageCount = computed(() => Math.ceil(carNum.value / pageSize.value))
    return {
      username,
      currentTab,
      pageIdx,
      carNum,
      pageCount
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard__header {
  height: 100px;
  // width: 100%;
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

<template>
  <isLoading :active="isLoading"></isLoading>
  <div class="text-end">
    <button type="button" class="btn btn-primary"
      @click="openCouponModal(true)">
      新增一個優惠卷
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, key) in coupons" :key="key">
        <td>{{ item.title }}</td>
        <td class="text-right">
          {{ item.percent }}
        </td>
        <td class="text-right">
          {{ $filters.date(item.due_date) }}
        </td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm"
              @click="openCouponModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm"
              @click="openDelCouponModal(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <Pagination
    :pages="pagination"
    @emit-page="getCoupons"></Pagination>

  <CouponModal ref="couponModal"
    :coupon="tempCoupon"
    @update-coupon="updateCoupon"></CouponModal>

  <DeleteModal ref="delModal"
    :item="tempCoupon"
    @del-item="delCoupon"></DeleteModal>

</template>

<script>
import CouponModal from '@/components/CouponModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Pagination from '@/components/Pagination.vue'


export default {
  components: {
    CouponModal,
    DeleteModal,
    Pagination
  },
  props: {
    config: Object,
  },
  data () {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
      },
      isNew: false,
      isLoading: false,
      currentPage: 1
    }
  },
  methods: {
    getCoupons (page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`
      this.isLoading = true;
      this.$http.get(api)
        .then((res) => {
          this.coupons = res.data.coupons
          this.pagination = res.data.pagination
          this.isLoading = false
        })
    },
    openCouponModal (isNew, item) {
      if (isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
        }
      } else {
        this.tempCoupon = { ...item }
      }
      // 確認狀態:新增/編輯
      this.isNew = isNew
      const couponComponent = this.$refs.couponModal
      couponComponent.showModal()
    },
    updateCoupon (item) {
      this.tempCoupon = item
      // 新增
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`
      let httpMethod = 'post';
      let resString = '新增優惠券';
      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`
        httpMethod = 'put';
        resString = '更新優惠券';
      }
      const couponComponent = this.$refs.couponModal
      this.$http[httpMethod](api, { data: this.tempCoupon }).then((response) => {
        couponComponent.hideModal();
        if (response.data.success) {
          this.$httpMessageState(response, resString);
          this.getCoupons();
        } else {
          this.$httpMessageState(response, resString);
          this.getCoupons();
        }
      })
    },
    openDelCouponModal (item) {
      this.tempCoupon = { ...item }
      const delCouponComponent = this.$refs.delModal;
      delCouponComponent.showModal()
    },
    delCoupon () {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
      const httpMethod = 'delete'
      const deleteComponent = this.$refs.delModal
      this.$http[httpMethod](api).then((res) => {
        deleteComponent.hideModal()
        this.getCoupons(this.currentPage);
        this.isLoading = true;
      })
    }
  },
  created () {
    this.getCoupons()
  }
}
</script>

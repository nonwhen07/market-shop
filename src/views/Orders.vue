<template>
  <isLoading :active="isLoading"></isLoading>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">購買時間</th>
        <th>Email</th>
        <th width="120">購買款項</th>
        <th width="120">應付金額</th>
        <th width="100">是否付款</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, key) in orders" :key="key">
        <tr v-if="orders.length"
            :class="{'text-secondary': !item.is_paid}">
          <td>{{ $filters.date(item.create_at) }}</td>
          <td>
            <span v-text="item.user.email" v-if="item.user"></span>
          </td>
          <td class="text-right">
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }} {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">
            {{ item.total }}
          </td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" :id="`paidSwitch${item.id}`"
                     v-model="item.is_paid"
                     @change="updatePaid(item)">
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
                @click="openModal(false, item)">檢視</button>
              <button class="btn btn-outline-danger btn-sm"
                @click="openDeleteOrderModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <!-- 目前沒有資料會導致Pagination抱錯 -->
  <Pagination
    :pages="pagination"
    @emit-pages="getOrders"></Pagination>
  <OrderModal
    ref="orderModal"
    :order="tempOrder"
    @update-paid="updatePaid"></OrderModal>
  <DeleteModal
    ref="delModal"
    :item="tempOrder"
    @del-item="delOrder"></DeleteModal>
</template>

<script>
import OrderModal from '@/components/OrderModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Pagination from '@/components/Pagination.vue'

export default {
  data() {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      isNew: false,
      isLoading: false,
      currentPage: 1
    }
  },
  components: {
    OrderModal,
    DeleteModal,
    Pagination
  },
  inject: ['emitter'],
  methods: {
    getOrders(page = 1){
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.isLoading = true
      this.$http.get(api)
        .then((res) => {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
          this.isLoading = false
        })
    },
    opemModal(isNew, item){
      this.tempOrder = { ...item }
      const orderComponent = this.$refs.OrderModal
      orderComponent.showModal()
    },
    openDeleteOrderModal(item){
      this.tempOrder = { ...item }
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    updatePaid(item){
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;
      const paid = {
        is_paid: item.is_paid,
      };
      this.$http.put(api, {date: paid}).then((res) => {
        this.isLoading = false;
        this.getOrders(this.currentPage);
        this.$httpMessageState(res, '更新付款狀態');
      })
    },
    delOrder(){
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`
      this.isLoading = true;
      const httpMethod = 'delete';
      this.$http[httpMethod](api).then((res) => {
        console.log('deleteOrder res : ', res);
        const delComponent = this.$refs.delModal;
        delComponent.hideModal();
        this.getOrders(this.currentPage);
        this.isLoading = false;
      })
    }
  },
  created() {
    this.getOrders();
    console.log(process.env.VUE_APP_API);
  }
}
</script>

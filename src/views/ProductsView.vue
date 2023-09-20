<template>
  <isLoading :active="isLoading"></isLoading>
  <div class="text-end">
    <button type="button" class="btn btn-primary"
      @click="openModal(true)">
      新增一個產品
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{item.category}}</td>
        <td>{{item.title}}</td>
        <td class="text-right">
          {{item.origin_price}}
        </td>
        <td class="text-right">
          {{item.price}}
        </td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm"
              @click="openDeleteProductModal(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <ProductModal ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"></ProductModal>

  <DeleteModal ref="delModal"
    :item="tempProduct"
    @del-item="deleteProduct"></DeleteModal>
</template>

<script>
import ProductModal from '@/components/ProductModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'

export default {
  data () {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false
    }
  },
  components: {
    ProductModal,
    DeleteModal
  },
  inject: ['emitter'],
  methods: {
    getProducts () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`
      this.isLoading = true
      this.$http.get(api)
        .then((res) => {
          this.products = res.data.products
          this.pagination = res.data.pagination
          this.isLoading = false
        })
    },
    openModal (isNew, item) {
      if (isNew) {
        this.tempProduct = {}
      } else {
        this.tempProduct = { ...item }
      }
      // 確認狀態:新增/編輯
      this.isNew = isNew
      const productComponent = this.$refs.productModal
      productComponent.showModal()
    },
    updateProduct (item) {
      this.tempProduct = item
      // const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      // 新增
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      let httpMethod = 'post'
      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`
        httpMethod = 'put'
      }
      const productComponent = this.$refs.productModal
      this.$http[httpMethod](api, { data: this.tempProduct }).then((res) => {
        // console.log(res)
        productComponent.hideModal()
        if (res.data.success) {
          this.getProducts()
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功'
          })
        } else {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新失敗',
            content: res.data.message.join('、')
          })
        }
      })
    },
    openDeleteProductModal (item) {
      this.tempProduct = { ...item }
      const deleteProductComponent = this.$refs.delModal
      deleteProductComponent.showModal()
    },
    deleteProduct () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`
      const httpMethod = 'delete'
      const deleteComponent = this.$refs.delModal
      this.$http[httpMethod](api).then((res) => {
        // console.log('deleteProduct res : ', res)
        deleteComponent.hideModal()
        this.getProducts()
      })
    }
  },
  created () {
    this.getProducts()
  }
}
</script>

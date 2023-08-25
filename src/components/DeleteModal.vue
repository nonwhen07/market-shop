<template>
  <div class="modal fade" id="delModal" tabindex="-1" role="dialog"
       aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <span>刪除 {{ item.title }}</span>
          </h5>
          <button type="button" class="btn-close"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除 <strong class="text-danger">{{ item.title }}</strong> (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary"
                  data-bs-dismiss="modal">取消
          </button>
          <button type="button" class="btn btn-danger"
                  @click="$emit('del-item')">確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 將重複的內容移至 modalMixin.js
// import Modal from 'bootstrap/js/dist/modal'
import modalMixin from '@/mixins/modalMixin'

export default {
  props: {
    item: {}
  },
  data () {
    return {
      modal: ''
    }
  },
  // 將重複的內容移至 modalMixin.js
  // methods: {
  //   showModal () {
  //     this.modal.show()
  //   },
  //   hideModal () {
  //     this.modal.hide()
  //   }
  // },
  // mounted () {
  //   // var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
  //   // 指向外層的 ref dom 元素
  //   this.modal = new Modal(this.$refs.modal)
  // },
  mixins: [modalMixin]

}
</script>

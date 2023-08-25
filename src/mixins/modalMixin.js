import Modal from 'bootstrap/js/dist/modal'

export default {
  methods: {
    showModal () {
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    }
  },
  mounted () {
    // var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
    // 指向外層的 ref dom 元素
    this.modal = new Modal(this.$refs.modal)
  }
}

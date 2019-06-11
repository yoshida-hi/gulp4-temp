/**
 * common.js
 * Author: Yoshida Hiroyuki
 * ---------------------------------------------------------------------- */

// 以下はひつな時にコメント削除
// var $WIN = $(window)
// var $DOC = $(document)

// 処理1
const setFuga = {
  init() {
    this.setEvent()
  },
  setEvent() {
    $('.js-fuga').on('click', el => {
      el.preventDefault()
      $('.js-fuga-button').submit()
    })
  },
}

$(() => {
  // 処理1
  if ($('.js-hoge').length) {
    setFuga.init()
  }
})

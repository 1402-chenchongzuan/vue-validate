
vue 表单验证

import validate from 'vue-va'

Vue.use(validate);

例:v-va="'/[0-9]$/'"



修改全局默认配置 main.js

validate.option({

  raise:'',   触发表单验证的方式  如keyup,blur,focus，change等事件  默认keyup

  sColor:'',  成功时,border和msg的颜色     默认#67c23a

  eColor:''   失败时,border和msg的颜色     默认#f56c6c

});


全局扩展规则  main.js

validate.extend({   扩展rules

  number(){

   return  /[0-9]/.test(this.value)
  }
})

自带rules：{
  email,
  mobile,
  tel,
  cardId,
  integer
 }


 v-va

 1.使用元素，必须是input  否则抛出错误

 2.必须存在name   否则抛出错误

 3.如果验证规则不存在或者正则格式错误  则抛出错误


data-va-raise  更改当前input触发表单验证的方式

data-va-msg    自定义错误说明,若不自定义则采用 `the field ${name} has error`

v-va.border    是否开启边框

v-va.msg       msg存在时,会输出data-va-msg的错误说明，若data-va-msg不存在，则使用 `the field ${name} has error`

v-va.disable   禁止开启空值验证,不加则默认开启空值验证

v-va.validator 自定义认证,认证规则不是正则时开启

例:const validatePassword = function (value) {
           return value.length < this.maxNum
                                     };

submit        this.$validator.validate()   ===>return Promise

              .then()   返回success

              .catch() 返回errMsg 当前错误


vue 表单验证
===



#### npm安装

```
npm install vue-va --save
```


#### 引入
```
import validate from 'vue-va'
 Vue.use(validate);
```

#### 用法
```
 <input type='text' name='cs' v-va.border.msg="'/[0-9]$/'" data-va-msg="最后一位必须是数字"  />
```






###### 修改全局默认配置 main.js

```
validate.option({

  raise:'',   触发表单验证的方式  如keyup,blur,focus，change等事件  默认keyup

  sColor:'',  成功时,border和msg的颜色     默认#67c23a

  eColor:''   失败时,border和msg的颜色     默认#f56c6c

});
```

######  全局扩展规则 main.js

```
validate.extend({   扩展rules
  number(){
   return  /[0-9]/.test(this.value)
  }
})
```

######自带rules：{email, mobile, tel, cardId,  integer}


####  submit 提交表单触发事件


```
       this.$validator.validate()
              .then()     //所有v-va绑定的input已经成功通过检测，返回success
              .catch((errMsg)=>{}) //返回errMsg 当前最早data-va-msg触发的错误信息
```

##  v-va使用注意


##### 1.使用元素，必须是input  否则抛出错误

##### 2.必须存在name   否则抛出错误

##### 3.如果验证规则不存在或者正则格式错误  则抛出错误


### 参数规范
#####data-va-raise    更改当前input触发表单验证的方式

#####data-va-msg      自定义错误说明,若不自定义则采用 `the field ${name} has error`

#####v-va.border      是否开启边框

#####v-va.msg         会在input下方输出data-va-msg的错误说明，若data-va-msg不存在，则使用 `the field ${name} has error`

#####v-va.disable     关闭空值验证,如不加disable，则默认开启空值验证

#####data-va-validator   自定义验证规则

例:
```

 <input type='text' name='cs' :data-va-validator="va" v-va.border.msg="'/[0-9]$/'" data-va-msg="长度需大于五位，且最后一位必须是数字"  />

   const validatePassword = function (value) {
     return value.length > 5
   }
   export default {
       data(){
         return {
             va:validatePassword
         }
       }
   }
```


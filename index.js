/**
 * Created by Administrator on 2018/5/10.
 */

import Vue from 'vue';
import * as Validate from './validate';



export default {
  install(){
    Vue.mixin(Validate.mixin);
    Vue.directive('va',Validate.directive);
  },
  mixin:Validate.mixin,
  directive:Validate.directive,
  extend:Validate.validate.extend,
  option:Validate.validate.option
}

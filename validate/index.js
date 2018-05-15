/**
 * Created by Administrator on 2018/5/1.
 */


(function(global,factory){
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.VeeValidate = factory());
})(this,function(){

  let __OPTION__ = {
    submitMsg(name){
      return `the field ${name} has error`
    },
    raise: 'keyup',
    className: 'validate-msg',
    sColor: '#67c23a',
    eColor: '#f56c6c'
  };
  let __RULES__ = {
    require(){
      return this.value !== '';
    },
    regex(reg){
      return eval(reg).test(this.value)
    },
    email(){
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.value)
    },
    mobile(){  //手机号码验证
      return /^[1][3578]\\d{9}$/.test(this.value)
    },
    tel(){   //座机号码验证
      return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(this.value)
    },
    cardId(){
      return /(^\d{15}$)|(^\d{17}(\d|x|X)$)/i.test(this.value)
    },
    integer(){
      return /^\d+$/.test(this.value)
    }
  };

  function propEq(val, prop) {
    return (obj) => {
      let key = prop ? obj[prop] : obj;
      return obj && key === val;
    }
  }

  function ruleFormat(rules) {
    let strRules = rules.substring(1, rules.length - 1);
    return strRules.split(/\|/g);
  }

  function isRegExp(text) {
    let reg = /^\/.*(i|g|m|\/)$/;
    return reg.test(text);
  }

  function error(text) {
    throw new Error(text)
  }

  function insertAfter(newElement, targetElement) {
    let parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
      parent.appendChild(newElement, targetElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  }

  function removeSiblingsClass(el, className) {
    for (let i = 0; i < el.parentNode.childNodes.length; i++) {
      if (el.parentNode.childNodes[i].className === className) {
        el.parentNode.removeChild(el.parentNode.childNodes[i])
      }
    }
  }

  function createAfterTag(el, options) {
    let tag = document.createElement('p');
    tag.style.color = options.eColor;
    tag.className = options.className;
    tag.innerText = options.msg||options.submitMsg(name);
    insertAfter(tag, el)
  }

  function selectData(data) {
    let reg = /^va/;
    let obj = {};
    for (let i in data) {
      if (reg.test(i)) {
        let key = i.toLocaleLowerCase().replace(reg, '');
        obj[key] = data[i];
      }
    }
    return obj;
  }

  function isAccordRule(ruleArr, rulesName, __RULES__, that) {
    let result = true;

    if(that.dataset.vaValidator){
      let ex={
        getFn:eval("("+that.dataset.vaValidator+")")
      };
      result=ex.getFn.call(this,that.value);
      if (!result)return result;
    }

      ruleArr.some((item) => {
        if (rulesName.findIndex(propEq(item)) !== -1) {
          result = __RULES__[item].call(that);
          if (!result)return true;
        }
        else if (isRegExp(item)) {
          result = __RULES__['regex'].call(that, item);
          if (!result)return true;
        }
        else {
          error('validate RegExp error');
        }
      });
    return result;
  }

  function validateResult(){
    return new Promise((resolve, reject) => {
      let key=Object.values(this.errMsg);
      key.some((item,index)=>{
        if(item!==''){
          reject(item);
          return true;
        }
        if(key.length===index+1){
          resolve('success')
        }
      });
    })
  }

  let validate={
    extend(rules){
      __RULES__=Object.assign({},__RULES__,rules)
    },
    option(option){
      __OPTION__=Object.assign({},__OPTION__,option)
    }
  };




  let mixin={
    beforeCreate(){
      this.$validator = {
        errMsg: {},
        validate(){
          return validateResult.call(this)
        }
      }

    }
  };
  let directive = {
    bind(el, binding, vnode){
      let validator = vnode.context.$validator;
      let name = el.name;

      if (!validator) {
        error("No validator instance is present on vm, did you forget to inject '$validator'?");
        return;
      }
      if (!name) {
        error("no definition name");
        return;
      }

      let tagName = el.tagName.toLocaleLowerCase();
      if (tagName === 'input') {

        let vaData = selectData(el.dataset);
        let options = Object.assign({}, __OPTION__, vaData);

        let ruleArr = binding.expression ? ruleFormat(binding.expression) : [];
        !binding.modifiers.disable ? ruleArr.push('require') : ruleArr; //是否添加空值验证


        let rulesName = Object.keys(__RULES__);


        if (ruleArr != false && !isAccordRule.call(vnode.context,ruleArr, rulesName, __RULES__, el)) { //如果当前规则不为[]，且当前的value不满足规则要求
          validator.errMsg[name] = options.msg || options.submitMsg(name);
        }
        else {
          validator.errMsg[name] = '';
        }

        el.addEventListener(options.raise, function () {

          binding.modifiers.msg? removeSiblingsClass(el, options.className) : '';

          let result= isAccordRule.call(vnode.context,ruleArr, rulesName, __RULES__, el);

          el.style.border = binding.modifiers.border ?
            (result ? `1px solid ${options.sColor}` : `1px solid ${options.eColor}`) : '';

          if (!result) {
            binding.modifiers.msg ? createAfterTag(el, options) : '';
            validator.errMsg[name] = options.msg || options.submitMsg(name);
          }
          else {
            validator.errMsg[name] = '';
          }
        })

      }
      else {
        error('not input element')
      }
    }
  };

  return {
    mixin,
    directive,
    validate
  }



});



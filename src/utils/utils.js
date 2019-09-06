/**
* Vue的插件，用来获取和设置localStorage存储
**/

import Vue from 'vue';

export const local = {
	save (key,value) {
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch (key) {
		return JSON.parse(localStorage.getItem(key)) || {}
	},
    saveString (key,value) {
        localStorage.setItem(key,value);
    },
    getString (key) {
        return localStorage.getItem(key);
    },

}

// 检测值是否为空
let isEmpty = function (value) {
    if (!value || value == '' ) {
        return true;
    }
    return false;
}

let isEmail = function (str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}
//手机校验
let isPhoneNumber = function (str){
    var reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    return reg.test(str);
}

let inArray = function (val,array) {
    for (let i=0;i<array.length;i++) {
        if ( val == array[i] ) return true;
    }
    return false;
}

let arrayRemove = function (val,array) {
    for (let i=0;i<array.length;i++) {
        if ( val == array[i] ) {
            array.splice(i,1);
            return true;
        }
    }
    return false;
}
let each = function (array,cb) {
    for (let i=0;i<array.length;i++) {
        if(cb(array[i],i)==false){
            break;
        }
    }
}

export const bus = new Vue();

export default {
	install: function(vm){
		vm.prototype.$local = local;
		vm.prototype.isEmpty = isEmpty;
        vm.prototype.isEmail = isEmail;
        vm.prototype.isPhoneNumber = isPhoneNumber;
        vm.prototype.inArray = inArray;
        vm.prototype.arrayRemove = arrayRemove;
        vm.prototype.$each = each;
        vm.prototype.$bus = bus;
	}
}

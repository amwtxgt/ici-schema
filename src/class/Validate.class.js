import {isString,isNumber} from '../functions';

/*
* 验证类
*
* */
export default class Validate {
	constructor() {
		/*
		* _validateType = null; //验证类型
		* _default = '' //默认值
		* _field = '' ,//绑定字段名称
		* */

		this._required = false; //是否必填

		this._validateList = [];
	}

	required(errMsg) {
		this._required = {
			errorMsg:errMsg && isString(errMsg)?errMsg:'%s是必填的'
		};
		return this
	}

	default(defaultData){
		this._default = defaultData;
		return this;
	}

	min(num,errMsg){

		if(!isNumber(num)){
			console.warn('参数不是数值型，min设置无效')
			return this;
		}

		this._minlangth = {
			number:num,
			errorMsg:errMsg && isString(errMsg)?errMsg:`%s不能小于最小值"${num}"`
		};
		return this;
	}

	max(num,errMsg){
		if(!isNumber(num)){
			console.warn('参数不是数值型，min设置无效');
			return this;
		}

		this._maxlangth = {
			number:num,
			errorMsg:errMsg && isString(errMsg)?errMsg:`%s不能大于最大值"${num}"`
		};

		return this;
	}


}



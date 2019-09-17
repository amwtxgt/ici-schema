import Validate from '../class/Validate.class'
import {isNumber, isString} from "../functions";

/*
* 字符串类
*
* */
export default class StringValidate extends Validate {
	constructor(errMsg) {
		super()

		/*
		* _validateType = null; //验证类型
		* _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
		* _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
		* _default = '' //默认值
		* */
		this.type = 'string'
		this._systemDefault = '' //系统默认值
		this._validateType = {
			validate: isString,
			errorMsg: errMsg && isString(errMsg) ? errMsg : '%s is not a string'
		};
	}

	//正则匹配
	regex(reg, errMsg) {
		if(reg instanceof RegExp) {
			this._validateList.push({
				validate: (v) => reg.test(v),
				errorMsg: errMsg && isString(errMsg) ? errMsg : '%s format is illegal',
			});
		}
		else {
			console.error(`${reg} is not a regular expression`)
		}
		return this;
	}
	//限制固定长度
	length(num,errMsg){
		this._validateList.push({
			validate: (v) => v.length===num,
			errorMsg: errMsg && isString(errMsg) ? errMsg : '%s length must be “'+num+'” digits',
		});
		return this;
	}

}

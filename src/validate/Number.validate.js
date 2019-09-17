import Validate from '../class/Validate.class'
import {isInteger, isPositiveInteger, isNumber, isString, isBoolean} from "../functions";

/*
* 数值类
*
* */
export default class NumberValidate extends Validate {
	constructor(str) {
		super()
		/*
		* _validateType = null; //验证类型
		* _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
		* _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
		* _default = '' //默认值
		* this._validateList = []; //验证器列表
		* */
		this.type = 'number'
		this._systemDefault = 0 //系统默认值
		this._validateType = {
			validate: isNumber,
			errorMsg: str && isString(str) ? str : '%s is not a number, Current value: %v'
		};
	}

	//@param 可选 positiveInteger {Boolean} 是否是正整；
	integer(positiveInteger, msg) {
		let str, positive;
		if(isBoolean(positiveInteger)) {
			positive = positiveInteger;
			str = msg;
		}
		else {
			str = positiveInteger;
		}

		//正整数
		let validate = positive ? isPositiveInteger : isInteger;

		this._validateList.push({
			validate: validate,
			errorMsg: str && isString(str) ? str : positiveInteger ? '%s is not an integer, Current value: %v' :
                '%s is not a positive integer, Current value: %v'
		});
		return this
	}

	//使其支持数字型的字符串
	numberString() {
		this._validateType.validate = function (v) {
			if(typeof v === "string") {
				v = Number(v)
			}
			return isNumber(v)
		}
		return this;
	}
}

import Validate from '../class/Validate.class'
import {isBoolean, isString} from "../functions";

/*
* 数组类
*
* */
export default class BooleanValidate extends Validate{
	constructor(errMsg){
		super()
		/*
		* _validateType = null; //验证类型
		* _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
		* _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
		* _default = '' //默认值
		* */
		this.type = 'boolean'
		this._systemDefault = false //系统默认值
		this._validateType = {
			validate:isBoolean,
			errorMsg:errMsg && isString(errMsg)?errMsg:'%s不是一个boolean'
		};

	}
}

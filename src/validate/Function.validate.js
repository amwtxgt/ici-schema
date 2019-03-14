import Validate from '../class/Validate.class'
import {isBoolean, isObject, isString} from "../functions";

/*
* 函数验证
*
* */
export default class FunctionValidate extends Validate{
	constructor(errMsg){
		super()
		/*
		* _validateType = null; //验证类型
		* _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
		* _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
		* _default = '' //默认值
		* */
		this.type = 'function'
		this._systemDefault = null //系统默认值
		this._validateType = {
			validate:(v)=>{return typeof v === "function"},
			errorMsg:errMsg && isString(errMsg)?errMsg:'%s不是一个function'
		};

	}

}

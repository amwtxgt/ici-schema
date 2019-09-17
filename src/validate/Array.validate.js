import Validate from '../class/Validate.class'
import {isString} from "../functions";

/*
* 数组类
*
* */
export default class ArrayValidate extends Validate{
	constructor(schema,errMsg){
		super()
		/*
		* _validateType = null; //验证类型
		* _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
		* _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
		* _default = '' //默认值
		* */

		if(schema){
			this._schema = schema;
		}

		this.type = 'array'

		this._systemDefault = [] //系统默认值

		this._validateType = {
			validate:Array.isArray,
			errorMsg:errMsg && isString(errMsg)?errMsg:'%s must be an array'
		};
	}
}

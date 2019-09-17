import Validate from '../class/Validate.class'
import {isObject, isString} from "../functions";

/*
* 对象类
*
* */
export default class ObjectValidate extends Validate {
	constructor(schema, errMsg) {
		super()
		/*
		* _validateType = null; //验证类型
		* _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
		* _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
		* _default = '' //默认值
		* */

		if(schema){
			this._schema = schema;
			this._systemDefault = this._schema.model(true); //系统默认值
		}else{
			this._systemDefault = {}
		}

		this.type = 'object'



		this._validateType = {
			validate: isObject,
			errorMsg: errMsg && isString(errMsg) ? errMsg : '%s must be an object, Current value: %v'
		};
	}

	//不允许空对象
	noEmptyObject(str) {

		let obj = {
			validate: (v) => {
				return isObject(v) && Object.keys(v).length > 0
			},
			errorMsg: str && isString(str) ? str : '%s cannot be an empty object, Current value: %v'
		};

		this._validateList.push(obj)
	}

}

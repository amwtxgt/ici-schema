import ArrayValidate from '../validate/Array.validate';
import BooleanValidate from '../validate/Boolean.validate';
import NumberValidate from '../validate/Number.validate';
import StringValidate from '../validate/String.validate';
import EnumValidate from '../validate/Enum.validate';
import ObjectValidate from '../validate/Object.validate';
import FunctionValidate from '../validate/Function.validate';
import MixinValidate from '../validate/Mixin.validate';
import Validate from '../class/Validate.class';
import errorCode from '../error.code'

import CustomError from "./CustomError.class";

import {isObject, isString, isNumber, isDev} from "../functions";

export default class Schema {

	static string(errmsg) {
		return new StringValidate(errmsg)
	}

	static number(errmsg) {
		return new NumberValidate(errmsg)
	}

	static object(schema, errMsg) {

		let sche, msg;
		if(isObject(schema)) {

			if(schema instanceof Schema) sche = schema;
			else sche = new Schema(schema);
			msg = errMsg;
		}
		else if(typeof errMsg === "string") {
			sche = null;
			msg = errMsg;
		}
		else if(typeof schema === "string") {
			sche = null;
			msg = schema;
		}

		return new ObjectValidate(sche, msg);
	}

	static array(schema, errMsg) {
		let sche, msg;
		if(isObject(schema)) {

			if(schema instanceof Schema) sche = schema;
			else if(schema instanceof Validate) sche = new Schema({$default: schema});
			else sche = new Schema(schema);
			msg = errMsg;

		}
		else if(typeof errMsg === "string") {
			sche = null;
			msg = errMsg;
		}
		else if(typeof schema === "string") {
			sche = null;
			msg = schema;
		}

		return new ArrayValidate(sche, msg);
	}

	static boolean(errmsg) {
		return new BooleanValidate(errmsg)
	}

	static enum(enums, errmsg) {
		return new EnumValidate(enums, errmsg)
	}

	static function(errmsg) {
		return new FunctionValidate(errmsg)
	}

	static mixin(errmsg) {
		return new MixinValidate(errmsg)
	}

	constructor(data) {

		Object.defineProperty(this, 'schema', {
			value: data,
			enumerable: false,
			configurable: false,
			writable: false,
		});

		Object.defineProperty(this, 'keys', {
			value: Object.keys(this.schema),
			enumerable: false,
			configurable: false,
			writable: false,
		});

		let isLegal = this.keys.every((v) => {

			if(this.schema[v] instanceof Validate) {
				return true
			}
			else {
				console.error(`"${v}"字段类型错误`);
				return false
			}
		});

		if(!isLegal) {
			return false;
		}
	}

	/*
	* 生成数据模型
	* @param 可选 isSystemDefault {Boolean} 是否使用系统默认值，默认为false,为false时，字段如果没有设置default字段忽略该字段
	* @param 可选 isLock {Boolean} 是否锁定对象属性，对象属性只可以修改，不可添加和删除
	* */
	model(isSystemDefault, isLock) {

		if(!this.schema) return;

		let data;
		if(this.__proto__ instanceof Schema) {
			data = Object.create(this.__proto__);
		}
		else {
			data = Object.create(this);
		}

		for (let i in this.schema) {
			if(this.schema[i]._default !== undefined) {
				let def = this.schema[i]._default;
				data[i] = typeof def === 'object' ? JSON.parse(JSON.stringify(def)) : def
			}
			else if(isSystemDefault) {
				data[i] = this.schema[i]._systemDefault;
			}
			else {
				delete data[i]
			}

		}
		if(isLock) {
			Object.preventExtensions(data);
		}
		return data;
	}

	//验证数据
	async validate(data) {
		if(!data) data = this;

		if(!isObject(data)) {
			throw new CustomError(errorCode.validate_error, '验证数据失败，验证目标必须是对象')
		}

		//TODO 检查必填项
		let errMsg = ''

		for (let v in this.schema) {
			if(this.schema[v]._required && !data[v]) {
				console.log(v)
				errMsg = this.getMsg(this.schema[v]._required.errorMsg, v);
				throw new CustomError(errorCode.validate_error, errMsg)
				break;
			}
		}

		for (let v in data) {

			if(data[v] === null || data[v] === undefined) {
				continue;
			}

			//必须在数据架构存在

			if(this.schema[v]) {

				//TODO 检查类型是否正确
				if(!this.schema[v]._validateType.validate(data[v])) {
					if(v === '$default') {
						errMsg = this.getMsg(this.schema[v]._validateType.errorMsg, `"${data[v]}" `);
					}
					else {
						errMsg = this.getMsg(this.schema[v]._validateType.errorMsg, v);
					}

					throw new CustomError(errorCode.validate_error, errMsg);
				}

				if(this.schema[v].type === 'object') {
					if(this.schema[v]._schema) {
						//如果是ojbect对象，自带schema验证
						await this.schema[v]._schema.validate(data[v]);
					}

				}
				else if(this.schema[v].type === 'array') {

					if(this.schema[v]._schema) {

						//数组分两种情况
						//1.数组元素是对象，直接调用数组的schema
						//2.数组元素不是对象，把元素放到$default key再验证
						let isDefault = this.schema[v]._schema.keys[0] === '$default';

						for (let item of data[v]) {

							if(isDefault) {
								await this.schema[v]._schema.validate({$default: item});
							}
							else {
								await this.schema[v]._schema.validate(item);
							}
						}
					}

				}
				else {
					//除了object和array类型，其它类型走默认验证流程

					//长度检查
					//最小值检查
					if(this.schema[v]._minlangth) {
						let min = this.schema[v]._minlangth.number

						//字符串与数组检查长度
						if((isString(data[v]) || Array.isArray(data[v])) && data[v].length < min) {
							//如果长度大于0，又是必填项目，才要验证
							if(data[v].length > 0 && this.schema[v]._required) {
								errMsg = this.getMsg(this.schema[v]._minlangth.errorMsg, v);
								throw new CustomError(errorCode.validate_error, errMsg);
							}
						}

						//数值对比大小
						if(isNumber(data[v]) && data[v] < min) {
							errMsg = this.getMsg(this.schema[v]._minlangth.errorMsg, v);

							throw new CustomError(errorCode.validate_error, errMsg);
						}

					}

					//长度检查
					//最大值检查
					if(this.schema[v]._maxlangth) {
						let max = this.schema[v]._maxlangth.number

						//字符串与数组检查长度
						if((isString(data[v]) || Array.isArray(data[v])) && data[v].length > max) {
							errMsg = this.getMsg(this.schema[v]._maxlangth.errorMsg, v);

							throw new CustomError(errorCode.validate_error, errMsg);
						}

						//数值对比大小
						if(isNumber(data[v]) && data[v] > max) {
							errMsg = this.getMsg(this.schema[v]._maxlangth.errorMsg, v);
							throw new CustomError(errorCode.validate_error, errMsg);
						}

					}

					//验证器验证
					if(this.schema[v]._validateList.length) {

						let validList = this.schema[v]._validateList;

						let isList = validList.every((val) => {
							if(!val.validate(data[v])) {
								errMsg = this.getMsg(val.errorMsg, v);
								return false
							}
							return true;
						});
						if(!isList) throw new CustomError(errorCode.validate_error, errMsg);
					}
				}
			}
			else {
				isDev() && console.warn(`${v} 字段没有在schema里，跳过验证`)
			}
		}

		return Promise.resolve(true)
	}


	//输出最终数据
	output(data) {

		if(!data) data = this;

		let output = {}

		for (let v in data) {
			//必须在数据架构存在
			if(this.schema[v]) {
				if(this.schema[v].type === 'object' && this.schema[v]._schema) {
					output[v] = this.schema[v]._schema.output(data[v])
				}
				else if(this.schema[v].type === 'array' && this.schema[v]._schema) {

					output[v] = (data[v].map(item => {
						if(isObject(item)) {
							return this.schema[v]._schema.output(item)
						}
						else {
							return item
						}
					}));
				}
				else {
					output[v] = data[v]
				}
			}
		}
		return output;
	}

	//转化提示信息，替换%s为实际内容
	getMsg(msg, string) {

		if(string && /%s/.test(msg)) {
			return msg.replace('%s', string)
		}
		else {
			return msg
		}
	}

	toString() {
		return '[schema Object]'
	}
}


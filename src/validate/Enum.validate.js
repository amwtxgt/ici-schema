import Validate from '../class/Validate.class';
import {isString, isNumber} from "../functions";
import CustomError from "../class/CustomError.class";
import errorCode from '../error.code'

/*
* 数组类
*
* */
export default class EnumValidate extends Validate {
    constructor(enums, errMsg) {

        super();

        if (!Array.isArray(enums) || enums.length === 0) {
            console.error('枚举类型参数必须是数组');
            throw new CustomError(errorCode.validate_error,
                'The enumerated type parameter must be an array, Current value: ' + enums.toString())
        }
        /*
        * _validateType = null; //验证类型
        * _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
        * _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
        * _default = '' //默认值
        * */
        this.type = 'enum'
        this._systemDefault = enums[0]; //系统默认值
        this._enums = enums;
        this._validateType = {
            validate: (value) => {
                if (this._required) {
                    return this._enums.some(v => v === value);
                } else {
                    return !value || this._enums.some(v => v === value);
                }

            },
            errorMsg: errMsg && isString(errMsg) ? errMsg : `%s Must be a [${this._enums}], Current value: %v`
        };
    }
}

import Validate from '../class/Validate.class'
import {isString} from "../functions";

/*
* 混合类
* 参数可以是任意类型
* */
export default class MixinValidate extends Validate {
    constructor(errMsg) {
        super()
        /*
        * _validateType = null; //验证类型
        * _maxlangth = null; //最大值，字符串时为字符的长度，数值型时为数字的大小
        * _minlangth = null; //最小值，字符串时为字符的长度，数值型时为数字的大小
        * _default = '' //默认值
        * */
        this.type = 'minxin'
        this._systemDefault = null //系统默认值
        this._validateType = {
            validate: (v) => {
                return true
            },
            errorMsg: errMsg && isString(errMsg) ? errMsg : '%s type is incorrect, Current value: %v'
        };

    }
}

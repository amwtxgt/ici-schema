/**
 * 是否是普通JavaScript对象。只返回boolean
 */
let _toString = Object.prototype.toString;

export function isObject(obj) {
    return _toString.call(obj) === '[object Object]'
}

/**
 * 是否是字符串
 */
export function isString(v) {
    return typeof v === "string";
}

/**
 * 是否是boolean
 */
export function isBoolean(v) {
    return typeof v === "boolean";
}

/*
* 是否是数值
* */
export function isNumber(v) {
    return v === +v
}

/*
* 是否是整型
* */
export function isInteger(v) {
    return v === parseInt(v) || v === parseInt(v).toString();
}

/*
* 是否是正整型
* */
export function isPositiveInteger(v) {
    return isInteger(v) && v >= 0
}

/*
* 是否是测试模式
* 一般用于日志打印，测试模式输出日志， 生产模式不输出
* */
export function isDev() {
    return process && process.env && process.env.NODE_ENV !== 'production';
}

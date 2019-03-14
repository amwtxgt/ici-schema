/*
* 自定义错误
* @param Object {code:0,msg:""}
*
* */
export default class CustomError extends Error {
	constructor(code, errmsg) {
		super();
		this.code = code;
		this.msg = errmsg ? errmsg : '';
		this.message = this.msg;
	}
}




import Schema from './class/Schema.class'

if (typeof window !== 'undefined') {
    window.Schema = Schema;
}


export let number = Schema.number;
export let string = Schema.string;
export let object = Schema.object;
export let array = Schema.array;
export let enums = Schema.enum;
export let boolean = Schema.boolean;
export let func = Schema.function;
export let mixin = Schema.mixin;
export default Schema

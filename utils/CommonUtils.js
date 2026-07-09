/**
 *  传入一个数字，可以获取到数字的各个位数，结果为一个列表
 * 示例:
 * 12345 => [1, 2, 3, 4, 5]
 */
const getDigits = (number) => {
    // 转换为字符串
    const numStr = number.toString();
    // 分割为字符数组
    const digits = numStr.split('');
    // 转换回数字数组
    return digits.map(d => parseInt(d));
}


/**
 *  传入鸽笼position，将鸽笼位置0 1 2映射为上中下
 */
const translatePositions = (position)=>{
	if(position === 0){
		return "up"
	}
	if(position === 1){
		return "middle"
	}
	if(position === 2){
		return "lower"
	}
}

/**
 * 传入鸽笼leftRight，将0，1映射为左、右
 */
const translateLeftRight = (leftRight)=>{
	if(leftRight === 0){
		return "左"
	}
	if(leftRight === 1){
		return "右"
	}
}

/**
 * 传入鸽笼leftRight，将0，1映射为left、right
 */
const translateLeftRight2 = (leftRight)=>{
	if(leftRight === 0){
		return "left"
	}
	if(leftRight === 1){
		return "right"
	}
}


export default{
	getDigits,
	translatePositions,
	translateLeftRight,
	translateLeftRight2
}

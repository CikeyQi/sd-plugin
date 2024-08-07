import axios from 'axios'

/**
 * 图片URL转Base64
 * @param {*} url 图片url
 * @returns 
 */
export async function url2Base64(url) {
    let base64 = await axios.get(url, {
        responseType: 'arraybuffer'
    }).then(res => {
        return Buffer.from(res.data, 'binary').toString('base64')
    }).catch(err => {
        console.log(err)
    })
    return base64
}

/**
 * 解析命令字符串
 * @param {*} commandString 命令字符串
 * @returns 
 */
export async function parseCommandString(commandString) {

    const regex = /--(\w+)(?:\s+((?:"[^"]*")|(\S+)))?/g;

    let match;
    const result = {};

    while ((match = regex.exec(commandString)) !== null) {
        const key = match[1]; // 捕获参数名
        if (match[2]) {
            const value = match[2].replace(/"/g, '');
            result[key] = value === 'true' || value === 'false' ? value === 'true' : isNaN(value) ? value : Number(value);
        } else {
            // 如果没有值，则设置为null
            result[key] = null;
        }
    }

    return result;
}
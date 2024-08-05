import axios from 'axios';
import crypto from 'crypto';
import Config from '../components/Config.js';

// 定义错误消息
const ERROR_MESSAGES = {
    52000: "成功",
    52001: "请求超时，检查请求query是否超长，以及原文或译文参数是否在支持的语种列表里",
    52002: "系统错误，请重试",
    52003: "未授权用户，请检查appid是否正确或者服务是否开通",
    54000: "必填参数为空，请检查是否少传参数",
    54001: "签名错误，请检查您的签名生成方法",
    54003: "访问频率受限，请降低您的调用频率，或在控制台进行身份认证后切换为高级版/尊享版",
    54004: "账户余额不足，请前往管理控制台为账户充值",
    54005: "长query请求频繁，请降低长query的发送频率，3s后再试",
    58000: "客户端IP非法，检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改",
    58001: "译文语言方向不支持，检查译文语言是否在语言列表里",
    58002: "服务当前已关闭，请前往管理控制台开启服务",
    58003: "此IP已被封禁，同一IP当日使用多个APPID发送翻译请求，则该IP将被封禁当日请求权限，次日解封。请勿将APPID和密钥填写到第三方软件中。",
    90107: "认证未通过或未生效，请前往我的认证查看认证进度",
    20003: "请求内容存在安全风险，请检查请求内容"
};

/**
 * 使用百度翻译API进行双语翻译
 * @param {string} text - 要翻译的文本
 * @returns {Promise<string>} 返回翻译结果或错误信息
 */
export async function translate(text) {
    try {
        const { translate: config } = await Config.getConfig();
        
        // 匹配文本中的中文字符
        const chineseChars = text.match(/[\u4e00-\u9fa5]+/g);
        if (!chineseChars) return text; // 若无中文，返回原文本

        // 使用 Promise.all 进行并行翻译
        const translations = await Promise.all(
            chineseChars.map(async (ch) => {
                const salt = Math.random().toString(36).substr(2); // 生成随机盐值
                const sign = crypto
                    .createHash('md5')
                    .update(`${config.appid}${ch}${salt}${config.appkey}`)
                    .digest('hex'); // 生成签名

                // 构建请求URL
                const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(ch)}&from=zh&to=en&appid=${config.appid}&salt=${salt}&sign=${sign}`;

                try {
                    const { data } = await axios.get(url); // 发送GET请求
                    if (data.error_code) {
                        // 处理翻译错误
                        console.error("[SD-PLUGIN] 翻译过程中发生错误：", ERROR_MESSAGES[data.error_code]);
                        return { original: ch, translated: ch }; // 返回原字符
                    }
                    return { original: ch, translated: data.trans_result[0].dst }; // 返回翻译结果
                } catch (error) {
                    console.error("[SD-PLUGIN] 翻译过程中发生错误：\n", error);
                    return { original: ch, translated: ch }; // 返回原字符
                }
            })
        );

        // 替换原文本中的汉字为翻译结果
        return translations.reduce((acc, { original, translated }) => {
            return acc.replace(new RegExp(original, 'g'), translated);
        }, text);
    } catch (error) {
        console.error("[SD-PLUGIN] 翻译过程中发生错误：\n", error);
        return text; // 返回原文本
    }
}
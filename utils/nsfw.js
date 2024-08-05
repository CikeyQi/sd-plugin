import axios from "axios";
import Config from "../components/Config.js";

// 定义错误消息
const ERROR_MESSAGES = {
    1: "服务器内部错误，请重试请求。如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息”）",
    2: "服务暂不可用，请重试请求。如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息”）",
    3: "调用的API不存在，请检查接口地址是否输入正确",
    4: "集群超限额，请再次请求，如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单",
    6: "没有接口权限，无权限访问，请检查创建的APP应用是否有该接口的使用权限（请确认API列表页是否可见，以及应用详情的接口是否勾选）",
    17: "每天流量超限额，请您注意控制日调用量，调用量须≤该接口的日调用量限制，若有更高调用量需求，请查看价格说明，可直接自助购买、或联系商务接口人",
    18: "QPS超限额，请您注意控制处理并发量，调用并发须≤该接口的QPS限制，若需要提升QPS限额，请查看价格说明，可直接自助购买、或联系商务接口人",
    19: "请求总量超限额，请确认是否已领取QPS或需提升配额，提升配额可直接自助购买、或联系商务接口人",
    100: "无效参数，token拉取失败，可以参考“Access Token获取”重新获取",
    110: "Access Token失效，token有效期为30天，注意需要定期更换",
    111: "Access token过期，token有效期为30天，注意需要定期更换",
    216015: "模块关闭，如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息、logid”）",
    216100: "非法参数，请检查请求参数是否正确，如使用noticeUrl参数，需保证URL视频公网可访问，注意去掉防盗链",
    216101: "参数数量不够，请检查请求参数是否正确",
    216102: "业务不支持，请先检查请求URL，如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息、logid”）",
    216103: "参数太长，检查请求参数是否正确，参数长度是否符合要求",
    216110: "AppID不存在，请检查控制台应用列表中的应用信息",
    216111: "非法用户ID，请检查鉴权AK、SK是否正确",
    216200: "空的图片，请检查请求参数中的图片字段，不能为空",
    216201: "图片格式错误，请检查图片格式是否符合要求，支持的图片格式：PNG、JPG、JPEG、BMP、GIF（仅对首帧进行审核）、WebP、TIFF",
    216202: "图片大小错误，请检查图片大小是否符合要求，图像要求base64后大于等于5KB，小于等于4MB，最短边大于等于128像素，小于等于4096像素",
    216300: "DB错误，如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息、logid”）",
    216400: "后端系统错误，如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息、logid”）",
    216401: "业务层内部错误，请重试请求。如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息、logid”）",
    216500: "服务器内部错误，请重试请求。如果持续出现此类错误，请提交工单：选择具体问题类型后，在智能助手中查询问题或创建工单（“问题描述”请提供“使用的接口或哪种语言的SDK、报错信息、logid”）",
};

/**
 * 检查图像的NSFW状态
 * @param {string} img - 图片base64编码
 * @returns {Promise<Object>} 返回审核结果或错误信息
 */
export async function nsfwCheck(img) {
    try {
        const { nsfw_check: config } = await Config.getConfig();

        if (!config.enable) {
            return { status: true, data: '审核未启用' };
        }

        // 获取鉴权签名
        const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.appid}&client_secret=${config.apikey}`;
        const { data: { access_token } } = await axios.post(tokenUrl);

        // 审核图片
        const checkUrl = `https://aip.baidubce.com/rest/2.0/solution/v1/img_censor/v2/user_defined?access_token=${access_token}`;
        const { data: result } = await axios.post(checkUrl, new URLSearchParams({ image: img }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            }
        });

        if (result.error_code) {
            return { status: false, msg: ERROR_MESSAGES[result.error_code] || "未知错误" };
        }

        console.log("[SD-PLUGIN] 审核结果：\n", result);

        return result.conclusion === '合规'
            ? { status: true, data: '审核通过' }
            : { status: false, msg: result.data[0].msg };
        
    } catch (error) {
        console.error("[SD-PLUGIN] 审核过程中发生错误：", error);
        return { status: false, msg: '审核失败，请检查控制台日志' };
    }
}
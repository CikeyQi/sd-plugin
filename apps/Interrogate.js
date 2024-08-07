import plugin from '../../../lib/plugins/plugin.js';
import { parseCommandString, url2Base64 } from '../utils/utils.js';
import Code from '../components/Core.js';

export class Interrogate extends plugin {
    constructor() {
        super({
            name: 'SD-鉴赏',
            dsc: '鉴赏图像',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^#?interrogate([\\s\\S]*)$',
                    fnc: 'interrogate'
                }
            ]
        });
    }

    async interrogate(e) {
        try {
            if (!e.img) return await e.reply('请将图片与命令一同发送');

            const base64 = await url2Base64(e.img[0]);
            const params = await parseCommandString(e.msg);
            params.image = base64;

            const getInfo = async () => {
                const result = await Code.getInfo(params);
                return result.data.info ? e.reply(result.data.info) : getTags();
            };

            const getTags = async () => {
                Object.assign(params, { model: params.model || 'wd14-vit-v2-git', threshold: params.threshold || 0.35 });
                const result = await Code.getTags(params);
                return result.status ? e.reply(Object.keys(result.data.caption).join(",")) : e.reply(result.msg);
            };

            if ('tags' in params) await getTags();
            else if ('info' in params) await getInfo();
            else await getInfo();

        } catch (error) {
            console.error('[SD-PLUGIN] 图像超分失败:', error);
            await e.reply('图像超分过程中发生错误，请查看控制台信息');
        }
        return true;
    }
}
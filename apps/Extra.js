import plugin from '../../../lib/plugins/plugin.js';
import { parseCommandString, url2Base64 } from '../utils/utils.js';
import Code from '../components/Core.js';

export class Extra extends plugin {
    constructor() {
        super({
            name: 'SD-超分',
            dsc: '超分图像',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^#?extra([\\s\\S]*)$',
                    fnc: 'extra'
                }
            ]
        });
    }

    async extra(e) {
        try {
            if (!e.img) return await e.reply('请将图片与命令一同发送');

            const base64 = await url2Base64(e.img[0]);

            const params = await parseCommandString(e.msg);

            if (!params.upscaler_1) {
                params.upscaler_1 = 'ScuNET PSNR';
            }
            if (!params.upscaler_2) {
                params.upscaler_2 = 'R-ESRGAN 4x+ Anime6B';
            }

            params.image = base64;

            await e.reply(`正在超分图片，请稍后...`, true);

            const result = await Code.upscale(params);

            if (result.status) {
                await e.reply(segment.image('base64://' + result.data.image));
            } else {
                await e.reply(result.message);
            }

        } catch (error) {
            console.error('[SD-PLUGIN] 图像超分失败:', error);
            await e.reply('图像超分过程中发生错误，请查看控制台信息');
        }
        return true;
    }
}
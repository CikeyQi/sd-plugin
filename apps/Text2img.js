import plugin from '../../../lib/plugins/plugin.js'
import { parseCommandString } from '../utils/utils.js';
import { translate } from '../utils/translate.js';
import { nsfwCheck } from '../utils/nsfw.js';
import Code from '../components/Core.js';

export class Text2img extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'SD-文生图',
      /** 功能描述 */
      dsc: '绘画',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1009,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(绘图|咏唱|draw)([\\s\\S]*)$',
          /** 执行方法 */
          fnc: 'text2img'
        }
      ]
    })
  }

  async text2img(e) {
    // 解析命令
    const params = await parseCommandString(e.msg);

    // 翻译
    if (params.prompt) {
      params.prompt = await translate(params.prompt);
    }

    // 调用接口
    const result = await Code.text2img(params);

    // 处理响应
    if (result.status) {
      let isNsfw = await nsfwCheck(result.data.images[0]);

      if (!isNsfw.status) {
        await e.reply(`生成图片未通过审核，${isNsfw.msg}`);
        return true;
      }

      await e.reply(segment.image('base64://' + result.data.images[0]));

      const message = Object.entries(result.data.parameters)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

      await e.reply(Bot.makeForwardMsg([{ message }]));
    } else {
      await e.reply(result.msg);
    }

    return true;
  }
}
import plugin from '../../../lib/plugins/plugin.js'
import { parseCommandString } from '../utils/utils.js';
import { translate } from '../utils/translate.js';
import { getParams } from '../utils/param.js';
import { nsfwCheck } from '../utils/nsfw.js';
import Code from '../components/Core.js';
import YAML from 'yaml';

export class Text2img extends plugin {
  constructor() {
    super({
      name: 'SD-文生图',
      dsc: '文生图',
      event: 'message',
      priority: 1009,
      rule: [
        {
          reg: '^#?draw([\\s\\S]*)$',
          fnc: 'text2img'
        }
      ]
    })
  }

  async text2img(e) {

    // 获取参数
    const params = await getParams(e, await parseCommandString(e.msg));

    // 翻译
    if (params.prompt) {
      params.prompt = await translate(params.prompt);
    }

    await e.reply(`正在生成图片，请稍后...`, true);

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

      const message = YAML.stringify(result.data.parameters)

      await e.reply(Bot.makeForwardMsg([{ message }]));
    } else {
      await e.reply(result.msg);
    }

    return true;
  }
}
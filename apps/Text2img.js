import plugin from '../../../lib/plugins/plugin.js'
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
          reg: '^(/|#)?(绘图|咏唱|draw)([\\s\\S]*)$',
          /** 执行方法 */
          fnc: 'text2img'
        }
      ]
    })
  }

  async text2img(e) {

  }
}
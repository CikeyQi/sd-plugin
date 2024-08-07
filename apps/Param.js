import plugin from '../../../lib/plugins/plugin.js';
import { parseCommandString } from '../utils/utils.js';
import YAML from 'yaml';

export class SetParam extends plugin {
    constructor() {
        super({
            name: 'SD-默认参数',
            dsc: '参数',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^#?setparam([\\s\\S]*)$',
                    fnc: 'setparam'
                },
                {
                    reg: '^#?delparam([\\s\\S]*)$',
                    fnc: 'delparam'
                },
                {
                    reg: '^#?param([\\s\\S]*)$',
                    fnc: 'param'
                }
            ]
        });
    }

    async setparam(e) {
        try {
            const params = await parseCommandString(e.msg);
            const user_param = await JSON.parse(await redis.get(`sd:param:${e.user_id}`)) || {};
            const updatedParams = { ...user_param, ...params };
            await redis.set(`sd:param:${e.user_id}`, JSON.stringify(updatedParams));
            await e.reply(`设置默认参数成功！\n当前默认参数为：\n${YAML.stringify(updatedParams)}`);
        } catch (error) {
            console.error('[SD-PLUGIN] 设置默认参数失败:', error);
            await e.reply('设置默认参数时出现错误，请查看控制台');
        }
        return true;
    }

    async delparam(e) {
        try {
            const params = await parseCommandString(e.msg);
            const user_param = await JSON.parse(await redis.get(`sd:param:${e.user_id}`)) || {};
            Object.keys(params).forEach(key => delete user_param[key]);
            await redis.set(`sd:param:${e.user_id}`, JSON.stringify(user_param));
            await e.reply(`删除默认参数成功！\n当前默认参数为：\n${YAML.stringify(user_param)}`);
        } catch (error) {
            console.error('[SD-PLUGIN] 删除默认参数失败:', error);
            await e.reply('删除默认参数时出现错误，请查看控制台');
        }
        return true;
    }

    async param(e) {
        try {
            const user_param = await JSON.parse(await redis.get(`sd:param:${e.user_id}`)) || {};
            await e.reply(`当前默认参数为：\n${YAML.stringify(user_param)}`);
        } catch (error) {
            console.error('[SD-PLUGIN] 获取默认参数失败:', error);
            await e.reply('获取默认参数时出现错误，请查看控制台');
        }
        return true;
    }
}
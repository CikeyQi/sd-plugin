import plugin from '../../../lib/plugins/plugin.js';
import { parseCommandString } from '../utils/utils.js';
import Config from "../components/Config.js";
import YAML from 'yaml';

export class SetDefParam extends plugin {
    constructor() {
        super({
            name: 'SD-默认绘图参数',
            dsc: '参数',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^#?添加默认参数([\\s\\S]*)$',
                    fnc: 'addDefParam'
                },
                {
                    reg: '^#?删除默认参数([\\s\\S]*)$',
                    fnc: 'delDefParam'
                },
                {
                    reg: '^#?查看默认参数$',
                    fnc: 'examDefParam'
                }
            ]
        })
    }

    async addDefParam(e) {
        const defDrawParams = Config.getDefDrawParams();
        const addParams = await parseCommandString(e.msg);
        const newDrawParams = {...defDrawParams, ...addParams};
        Config.setDefDrawParams(newDrawParams);
        return true;
    }

    async delDefParam(e) {
        let defDrawParams = Config.getDefDrawParams();
        const delParams = e.msg.replace(/^#?删除默认参数/,'').split(/\s+/);
        delParams.map(param => {
            if (param.startsWith("--")) {
                delete defDrawParams[param.replace('--','')];
            }
        })
        Config.setDefDrawParams(defDrawParams);
        return true;
    }

    async examDefParam(e) {
        const defDrawParams = Config.getDefDrawParams();
        if (defDrawParams) {
            const message = YAML.stringify(defDrawParams);
            await e.reply(Bot.makeForwardMsg([{ message }]));
        } else {
            await e.reply("默认绘图参数为空");
        }
        return true;
    }
}
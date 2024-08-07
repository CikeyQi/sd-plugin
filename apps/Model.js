import plugin from '../../../lib/plugins/plugin.js';
import { parseCommandString } from '../utils/utils.js';
import Code from '../components/Core.js';

export class Model extends plugin {
    constructor() {
        super({
            name: 'SD-模型',
            dsc: '管理和设置模型',
            event: 'message',
            priority: 1009,
            rule: [
                {
                    reg: '^#?model([\\s\\S]*)$',
                    fnc: 'model'
                },
                {
                    reg: '^#?vae([\\s\\S]*)$',
                    fnc: 'vae'
                }
            ]
        });
    }

    async model(e) {
        try {
            const params = await parseCommandString(e.msg);

            if ('list' in params) {
                // 处理列出模型的请求
                const modelsRes = await Code.getModels();
                const configRes = await Code.getConfig();

                if (modelsRes.status && configRes.status) {
                    const models = modelsRes.data.map((model, index) => `${index + 1}. ${model.title}`).join('\n');
                    await e.reply(`当前模型：\n${configRes.data.sd_model_checkpoint}\n\n可用模型列表：\n${models}`);
                } else {
                    await e.reply(modelsRes.msg || configRes.msg);
                }
            } else if ('set' in params && e.isMaster) {
                // 处理设置模型的请求
                const modelsRes = await Code.getModels();
                if (modelsRes.status) {
                    if (modelsRes.data.some(model => model.title === params.set)) {
                        const setRes = await Code.setConfig({ sd_model_checkpoint: params.set });
                        await e.reply(setRes.status ? `模型已切换至：${params.set}` : `设置模型失败：${msg}`);
                    } else {
                        await e.reply('指定的模型不存在，请检查模型名称');
                    }
                } else {
                    await e.reply(`获取模型列表失败：${modelsRes.msg}`);
                }
            } else if ('refresh' in params && e.isMaster) {
                // 处理刷新模型的请求
                const refreshRes = await Code.refreshModel();
                await e.reply(refreshRes.status ? '模型列表已刷新' : `刷新模型列表失败：${msg}`);
            } else {
                await e.reply('未知参数，请检查命令格式后再试');
            }
        } catch (error) {
            console.error('[SD-PLUGIN] 模型设置失败:', error);
            await e.reply('操作过程中发生错误，请查看控制台信息');
        }
        return true;
    }

    async vae(e) {
        try {
            const params = await parseCommandString(e.msg);

            if ('list' in params) {
                // 处理列出模型的请求
                const modelsRes = await Code.getVaes();
                const configRes = await Code.getConfig();

                if (modelsRes.status && configRes.status) {
                    const models = modelsRes.data.map((model, index) => `${index + 1}. ${model.model_name}`).join('\n');
                    await e.reply(`当前VAE：\n${configRes.data.sd_vae}\n\n可用VAE列表：\n${models}`);
                } else {
                    await e.reply(modelsRes.msg || configRes.msg);
                }
            } else if ('set' in params && e.isMaster) {
                // 处理设置模型的请求
                const modelsRes = await Code.getVaes();
                if (modelsRes.status) {
                    if (modelsRes.data.some(model => model.model_name === params.set)) {
                        const setRes = await Code.setConfig({ sd_vae: params.set });
                        await e.reply(setRes.status ? `VAE已切换至：${params.set}` : `设置VAE失败：${msg}`);
                    } else {
                        await e.reply('指定的VAE不存在，请检查VAE名称');
                    }
                } else {
                    await e.reply(`获取VAE列表失败：${modelsRes.msg}`);
                }
            } else if ('refresh' in params && e.isMaster) {
                // 处理刷新模型的请求
                const refreshRes = await Code.refreshVae();
                await e.reply(refreshRes.status ? 'VAE列表已刷新' : `刷新VAE列表失败：${msg}`);
            } else {
                await e.reply('未知参数，请检查命令格式后再试');
            }
        } catch (error) {
            console.error('[SD-PLUGIN] VAE设置失败:', error);
            await e.reply('操作过程中发生错误，请查看控制台信息');
        }
        return true;
    }
}
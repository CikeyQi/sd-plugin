import Config from "../components/Config.js";

export async function getParams(e, params) {
    try {

        // 全局默认参数
        const { def_param } = await Config.getConfig();

        // 个人参数
        const user_param = await JSON.parse(await redis.get(`sd:param:${e.user_id}`)) || {};

        // 合并参数
        console.log("[SD-PLUGIN] 合并参数：\n", { ...def_param, ...user_param, ...params });
        return { ...def_param, ...user_param, ...params };
        
    } catch (error) {
        console.error("[SD-PLUGIN] 合并参数过程中发生错误：", error);
        return params;
    }
}
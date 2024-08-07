import axios from 'axios'
import Config from './Config.js';

class Code {
    constructor() {
    }

    // 获取接口
    async getBase() {
        const config = await Config.getConfig();

        const api_list = config.api_list;
        if (config.use_api == 0) {
            const index = Math.floor(Math.random() * api_list.length);
            return api_list[index];
        } else {
            return api_list[config.use_api - 1];
        }
    }

    /**
     * 文生图接口
     * @param {*} params 参数
     * @returns 响应
     */
    async text2img(params) {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/txt2img`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 文生图接口调用失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 图生图接口
     * @param {*} params 参数
     * @returns 响应
     */
    async img2img(params) {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/img2img`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 图生图接口调用失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 获取模型列表
     * @returns 响应
     */
    async getModels() {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.get(`${baseurl}/sdapi/v1/sd-models`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 获取模型列表失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 获取VAE列表
     * @returns 响应
     */
    async getVaes() {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.get(`${baseurl}/sdapi/v1/sd-vae`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 获取VAE列表失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 读取配置
     * @returns 响应
     */
    async getConfig() {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.get(`${baseurl}/sdapi/v1/options`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 读取配置失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 设置配置
     * @param {*} params 参数
     * @returns 响应
     */
    async setConfig(params) {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/options`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 设置配置失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }



}

export default new Code();
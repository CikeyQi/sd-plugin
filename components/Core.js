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

    /**
     * 刷新模型
     * @returns 响应
     */
    async refreshModel() {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/refresh-checkpoints`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 刷新模型失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 刷新VAE
     * @returns 响应
     */
    async refreshVae() {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/refresh-vae`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 刷新VAE失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 超分图像
     * @param {*} params 参数
     * @returns 基础信息
     */
    async upscale(params) {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/extra-single-image`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 超分图像失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 解析图片信息
     * @param {*} params 参数
     * @returns 图片信息
     */
    async getInfo(params) {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/png-info`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN] 获取图片信息失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

    /**
     * 鉴赏图片信息
     * @param {*} params 参数
     * @returns 图片信息
     */
    async getTags(params) {
        // 获取接口
        const { baseurl, username, password } = await this.getBase();
        // 发送请求
        try {
            const response = await axios.post(`${baseurl}/sdapi/v1/interrogate`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            });

            return { status: true, data: response.data }
        } catch (error) {
            console.error('[SD-PLUGIN]鉴赏图片信息失败:\n', error);
            if (error.response) {
                return { status: false, msg: error.response.data.detail }
            } else {
                return { status: false, msg: error.message }
            }
        }
    }

}

export default new Code();
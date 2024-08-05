import YAML from 'yaml'
import fs from 'fs'
import { pluginRoot } from '../model/path.js'

class Config {
  getConfig() {
    try {
      const config_yaml = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config/config.yaml`, 'utf-8')
      )
      return config_yaml
    } catch (err) {
      console.error('[SD-PLUGIN] 读取config.yaml失败', err)
      return false
    }
  }

  getDefConfig() {
    try {
      const config_default_yaml = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config_default.yaml`, 'utf-8')
      )
      return config_default_yaml
    } catch (err) {
      console.error('[SD-PLUGIN] 读取config_default.yaml失败', err)
      return false
    }
  }

  setConfig(config_data) {
    try {
      fs.writeFileSync(
        `${pluginRoot}/config/config/config.yaml`,
        YAML.stringify(config_data)
      )
      return true
    } catch (err) {
      console.error('[SD-PLUGIN] 写入config.yaml失败', err)
      return false
    }
  }

  getDefDrawParams() {
    try {
      const def_draw_param = YAML.parse(
          fs.readFileSync(`${pluginRoot}/config/config/def_draw_params.yaml`, 'utf-8')
      )
      return def_draw_param
    } catch (err) {
      console.error('[SD-PLUGIN] 读取def_draw_params.yaml失败', err)
      return false
    }
  }
  setDefDrawParams(param) {
    try {
      fs.writeFileSync(
          `${pluginRoot}/config/config/def_draw_params.yaml`,
          YAML.stringify(param),
          'utf-8'
      )
      return true
    } catch (err) {
      console.error('[SD-PLUGIN] 写入def_draw_params.yaml失败', err)
      return false
    }
  }
}

export default new Config()

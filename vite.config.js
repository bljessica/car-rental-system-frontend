import path from 'path'
import vue from '@vitejs/plugin-vue'

function pathResolve (dir) {
  return path.resolve(__dirname, dir)
}

export default {
  plugins: [vue()],
  alias: {
    '/@/': pathResolve('src')
  }
}

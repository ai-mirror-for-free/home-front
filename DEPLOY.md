# 部署教程

本项目为 Vue3 + Vite 构建的纯静态前端（单页应用 / History 路由），构建产物为 `dist/`。
线上域名：`ai.chat-keeper.com`
线上部署目录：`/opt/1panel/www/sites/www.yang-sjq.cn/index/dist`（`dist` 文件夹放在 `index` 目录下）

> 说明：该路径是 **1Panel 宿主机** 上的完整路径（宿主 `/opt/1panel/www/sites/...` 挂载为容器内 `/www/sites/...`），站点根目录即 `index/dist`。

---

## 一、本地打包

在项目根目录执行：

```bash
# 首次或依赖变更时安装依赖
npm install

# 打包（产物输出到 dist/）
npm run build
```

打包完成后，项目根目录会生成 `dist/` 文件夹，里面包含 `index.html`、`assets/` 等静态文件。

本地预览构建结果（可选）：

```bash
npm run preview
```

---

## 二、上传到服务器

### 方式 A：命令行 scp（Windows PowerShell / Git Bash）

```bash
# 把整个 dist 文件夹上传到 index 目录下（先备份/清空线上旧 dist，见第三节）
scp -r dist root@<服务器IP>:/opt/1panel/www/sites/www.yang-sjq.cn/index/
```

### 方式 B：1Panel 文件管理器（推荐，无需命令行）

1. 登录 1Panel → **文件** → 定位到 `/opt/1panel/www/sites/www.yang-sjq.cn/index`
2. 将本地整个 `dist` 文件夹拖拽上传（覆盖旧 `dist`）

### 方式 C：先压缩再上传（文件较多时更快）

```bash
# 本地压缩（保留 dist 目录结构）
tar -czf dist.tar.gz dist

# 上传
scp dist.tar.gz root@<服务器IP>:/opt/1panel/www/sites/www.yang-sjq.cn/
```

---

## 三、备份旧版本（重要）

在服务器上执行，先备份再覆盖：

```bash
cd /opt/1panel/www/sites/www.yang-sjq.cn/index

# 用日期命名备份旧的 dist，便于回滚
mv dist dist_bak_$(date +%Y%m%d_%H%M%S)

# 上传/解压新的 dist 到 index 目录下
```

若使用方式 C 上传，则解压：

```bash
tar -xzf /opt/1panel/www/sites/www.yang-sjq.cn/dist.tar.gz -C /opt/1panel/www/sites/www.yang-sjq.cn/index
```

> 使用 1Panel 文件管理器时，可右键 `index` 下的 `dist` 目录 → **重命名 / 压缩** 做备份，再上传新 `dist` 文件夹替换。

---

## 四、配置 Nginx（首次部署需要）

在 1Panel → **网站** → `ai.chat-keeper.com` → **配置文件** 中，确保包含以下关键配置：

```nginx
server {
    listen 80;
    server_name ai.chat-keeper.com;

    root /www/sites/www.yang-sjq.cn/index/dist;
    index index.html;

    # Vue Router History 模式：找不到的路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端接口代理（按实际后端地址修改端口）
    # /api/v1 为 OpenWebUI 接口
    location /api/v1/ {
        proxy_pass https://chat.yang-sjq.cn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 其余 /api 为自建注册 / 额度后端
    location /api/ {
        proxy_pass http://localhost:25141;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
}
```

要点：
- `try_files ... /index.html` 必须配置，否则刷新 `/models`、`/plans` 等子路由会 404。
- 生产环境不走 Vite 代理，`/api`、`/api/v1` 必须由 Nginx 转发到真实后端。
- 修改配置后点击 **保存并重载**（或 `nginx -s reload`）。静态文件更新本身无需重启 Nginx。

---

## 五、验证部署

1. 浏览器访问 `https://ai.chat-keeper.com`，确认首页正常。
2. 直接访问并刷新子路由，如 `https://ai.chat-keeper.com/models`、`/plans`，确认不出现 404。
3. 打开开发者工具 Network，确认 `/api` 请求返回 200，注册 / 登录 / 额度查询功能正常。

---

## 六、回滚

若新版有问题，恢复备份目录：

```bash
cd /opt/1panel/www/sites/www.yang-sjq.cn/index

# 停用问题版本
mv dist dist_bad_$(date +%Y%m%d_%H%M%S)

# 恢复备份（替换为实际备份目录名）
mv dist_bak_20260101_120000 dist
```

---

## 七、快速部署速查

```bash
# 本地
npm run build

# 上传（本地执行，上传整个 dist 文件夹）
scp -r dist root@<服务器IP>:/opt/1panel/www/sites/www.yang-sjq.cn/index/

# 服务器备份（建议先执行，见第三节）
```

适用场景：仅前端代码 / 样式变更，后端接口不变。

# gitlab-cli

支持从对接gitlab仓库，从对应仓库中拉取模版代码

## 脚手架项目

快速生成本地模版

### 模板工程说明

`templates`目录下，以文件夹的方式划分模版。

### 主要功能一览

使用前提：

🌈🌈🌈 需要设置全局的gitlab账号和密码，因为我们的gitlab是私有库，需要进行登录鉴权后才可以获取模版。

```bash
# 查看当前的账号密码

git config --global user.name
git config --global user.password


# 设置全局的账号密码

git config --global user.name xxxxx
git config --global user.password xxxxxxxx

```

1. 支持查看所有模版列表⌚️
2. 初始化一个工程（从模板列表中选择）👨‍🍳

### 支持选项

```bash
gyenno-cli --list
```

查看目前支持的模版列表

### 支持命令

```bash
gyenno-cli init <project name>
# gyenno-cli init my-project
```

在当前目录下，初始化一个项目，初始化过程中会让你选择以哪个模版初始化

### 源码目录说明

```js
📦bin --- 入口文件
 ┗ 📜enter.js
📦lib --- 主要代码
 ┣ 📜Creator.js --- 初始化类
 ┗ 📜init.js 
📦utils 工具方法
 ┣ 📂common
 ┃ ┣ 📜env.js
 ┃ ┣ 📜exit.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜loading.js
 ┣ 📜api.js got请求模块
 ┣ 📜getTemplateList.js --- 请求模版列表的方法
 ┣ 📜gitlabToken.js --- gitlab验证的方法
 ┗ 📜require.js --- require语法
```

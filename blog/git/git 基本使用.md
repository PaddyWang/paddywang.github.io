---
outline: deep
---

# git 基本使用
## 初次使用 git 生成公钥
```bash
# 测试一下
ssh -T git@github.com
# 生成公钥
ssh-keygen -t rsa -C "PaddyWang"
# 一路 enter
# 查看 key
cat /root/.ssh/id_rsa_pub
```

## 配置 API
```bash
# 用户信息配置
git config --global user.name "username"
git config --global user.email 123@123.com

git config --list  # 列出所有配置项
git config <key>  # 来检查 Git 的某一项配置
e.g: git config user.name

# 重新设置远端仓储地址
git remote set-url origin https://git.coding.net/stylr/misv2.git

# 获取帮助 查看 git 手册
git help <verb>
git <verb> --help
man git-<verb>
e.g: git help config

# 自定义本地仓库的名字
git clone <url> <repositoryName>

git status  # 查看已暂存和未暂存的修改
git diff  # 看暂存前后的变化
# 此命令比较的是工作目录中当前文件和暂存区域快照之间的差异， 也就是修改之后还没有暂存起来的变化内容
git diff --staged/--cached  # 查看已经暂存起来的变化 (--staged 和 --cached 是同义词）
# 查看已暂存的将要添加到下次提交里的内容

git commit -am  # 加上 -a 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 git add 步骤

git log  # 查看提交日志
# 一个常用的选项是 -p，用来显示每次提交的内容差异。 你也可以加上 -2 来仅显示最近两次提交：
git log -p -2
git log --stat  # 查看每次提交的简略的统计信息
git log --pretty=<options>  # 可以指定使用不同于默认格式的方式展示提交历史
# options: oneline/short/full/fuller/format
# format，可以定制要显示的记录格式
git log --pretty=format:"%h - %an, %ar : %s"
# a11bef0 - Scott Chacon, 6 years ago : first commit

# 清除跟踪 开始有这个文件 然后 忽略
# 忽略不生效问题
git update-index --assume-unchanged iOS/CmsApp/AppDelegate.m  # 忽略跟踪
git update-index –no-assume-unchanged iOS/CmsApp/AppDelegate.m  # 恢复跟踪
```

## 常用 API
```bash
# http://learngitbranching.js.org/

# clone
    # 克隆版本库的时候，所使用的远程主机自动被 Git 命名为 origin
    # 该命令会在本地主机生成一个目录，与远程主机的版本库同名
    # 如果要指定不同的目录名，可以将目录名作为 git clone 命令的第二个参数
    git clone <版本库的地址>
    git clone <版本库的地址> <本地目录名>
    git clone -o jQuery https:...  # 克隆的时候，指定远程主机叫做 jQuery

# remote 远程
    git remote  # 列出所有远程主机
    git remote show <主机名>  # 查看该主机的详细信息
    git remote add <主机名> <地址>  # 添加远程主机
    git remote rm <主机名>  # 删除远程主机
    git remote rename <原主机名> <新主机名>  # 改变远程主机名
    git remote set-url origin https://git.coding.net/stylr/mis.git  # 更改本地的远端链接

    git rm --cache ./.DS_Store  # 移除暂存区
    git status  # 查看 git 状态

# branch
    git branch -l  # 查看本地分支
    git branch -r  # 查看远端分支
    git branch -a  # 查看所有分支
    git branch -m dev develop  # 重命名本地分支
    git branch -f master HEAD~3  # (强制)移动 master 指向 HEAD 的第 3 次父提交
    git branch <分支名> <commit_id>  # 找回误删分支

# checkout
    git checkout master  # 切换到 master 分支
    git checkout -b bug_master  # 新建并切换到新分支

# commit
    git commit -m 'fix'  # 提交带有 fix 的注释
    git commit -am 'fix'  # 提交修改的文件 并带有 fix 注释
    git commit --amend  # 修改当前提交点注释(进入 vim)

# pull
    git pull  # 拉取远端代码 会生成一个新的提交点
    git pull --rebase  # 不会生成新的提交点
    git pull -p  # 

# push 
    git push origin <branch_name>  # 将本地分支推送到远端
    git push origin :<branch_name>  # 删除远端指定分支

# reset
    git reset --hard HEAD  # 回退到修改之前
    git reset --hard <commit_id>  # 跳到某个提交点

# revert

# merge
    # merge 操作会在当前的分支增加一个新的提交点 包含有目标分支的所有提交
    # 当前分支会和目标分支建立一个联系
    git merge <branch_name>  # 目标分支(branch_name)合并到当前分支

# rebase
    # rebase 操作会把当前分支的所有提交点 合并到目标分支
    # 只是提交点的复制 当前分支不会和目标分支建立联系
    git rebase <branch_name>  # 合并提交点到目标分支(branch_name)

# HEAD
    # HEAD 总是指向最近一次的提交点
```


- 相对引用
    + 使用 `^` 向上移动一个提交纪录
        * 切换到 bugFix 的父提交
        * `git checkout bugFix^`
    + 使用 `~<num>` 向上移动多个提交纪录
        * `git checkout HEAD~3`

- 多个提交点合并
    + `git commit -am 'fix1'`
    + `git commit -am 'fix2'`
    + `git commit -am 'fix3'`
    + `git rebase -i HEAD~3 `
    + 进入 vim 环境, `i` 编辑模式
    + 将除了第一个 `base` 全部改为 `s` , `Esc` `shift + :` `wq` 保存并退出
    + 然后把 `commit` 的提交信息只保留一个, `Esc` `shift + :` `wq` 保存并退出
    + 最后再 `push` 就可以了
- `-i`: Interactive
- `-f`: forcing

```bash
        # Git Workflow
        1.  git checkout master
        2.  git pull --rebase
        3.  git checkout -b <feature_branch>|<bug_branch>
        4.  modify and commit
        5.  git rebase -i HEAD~N ?
        6.  git checkout master
        7.  git pull --rebase
        8.  git checkout -b <production_branch>
        9.  git cherry-pick <SHA-one>
        10. git push origin <production_branch>
        11. git checkout master
        12. git branch -d <feature_branch>|<bug_branch>
```

```bash
git pull --rebase
1. successed
2. conflict
   --> fix conflict
   --> git add A
   --> git add B
   ...

   git rebase --continue
   git status

   git push origin master

git pull --cherry-pick
1. successed
2. conflict
   --> fix conflict
   --> git add A
   --> git add B
   ...

   git cherry-pick --continue
   git status

   git push origin master
```

## 分支误删恢复
```bash
git log -g
git branch recover_branch_<新分支> <commit_id>
# e.g.
git branch recover_branch_abc 3eac14d05bc1264cda54a7c21f04c3892f32406a
```


## `git log --pretty=format` 常用的选项

| 选项 | 说明
| --- | ---
| %H  | 提交对象（commit）的完整哈希字串
| %h  | 提交对象的简短哈希字串
| %T  | 树对象（tree）的完整哈希字串
| %t  | 树对象的简短哈希字串
| %P  | 父对象（parent）的完整哈希字串
| %p  | 父对象的简短哈希字串
| %an | 作者（author）的名字
| %ae | 作者的电子邮件地址
| %ad | 作者修订日期（可以用 --date= 选项定制格式）
| %ar | 作者修订日期，按多久以前的方式显示
| %cn | 提交者(committer)的名字
| %ce | 提交者的电子邮件地址
| %cd | 提交日期
| %cr | 提交日期，按多久以前的方式显示
| %s  | 提交说明


## .gitignore  
一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。 通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。 在这种情况下，我们可以创建一个名为 .gitignore 的文件，列出要忽略的文件的模式。 来看一个实际的 .gitignore 例子：

```
*.[oa]
*~
```

第一行告诉 Git 忽略所有以 .o 或 .a 结尾的文件。一般这类对象文件和存档文件都是编译过程中出现的。 第二行告诉 Git 忽略所有名字以波浪符（~）结尾的文件，许多文本编辑软件（比如 Emacs）都用这样的文件名保存副本。 此外，你可能还需要忽略 log，tmp 或者 pid 目录，以及自动生成的文档等等。 要养成一开始就为你的新仓库设置好 .gitignore 文件的习惯，以免将来误提交这类无用的文件。

文件 .gitignore 的格式规范如下：

所有空行或者以 # 开头的行都会被 Git 忽略。

可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。

匹配模式可以以（/）开头防止递归。

匹配模式可以以（/）结尾指定目录。

要忽略指定模式以外的文件或目录，可以在模式前加上叹号（!）取反。

所谓的 glob 模式是指 shell 所使用的简化了的正则表达式。 星号（*）匹配零个或多个任意字符；[abc] 匹配任何一个列在方括号中的字符 （这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）； 问号（?）只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符， 表示所有在这两个字符范围内的都可以匹配（比如 [0-9] 表示匹配所有 0 到 9 的数字）。 使用两个星号（**）表示匹配任意中间目录，比如 a/**/z 可以匹配 a/z 、 a/b/z 或 a/b/c/z 等。
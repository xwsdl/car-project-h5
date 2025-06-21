#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 检查开发环境配置...\n');

// 检查 Node.js 版本
function checkNodeVersion() {
    try {
        const version = process.version;
        const majorVersion = parseInt(version.slice(1).split('.')[0]);

        if (majorVersion >= 20) {
            console.log('✅ Node.js 版本:', version);
        } else {
            console.log('❌ Node.js 版本过低:', version, '(需要 20.9.0+)');
            return false;
        }
        return true;
    } catch (error) {
        console.log('❌ 无法获取 Node.js 版本');
        return false;
    }
}

// 检查 npm 版本
function checkNpmVersion() {
    try {
        const version = execSync('npm --version', { encoding: 'utf8' }).trim();
        console.log('✅ npm 版本:', version);
        return true;
    } catch (error) {
        console.log('❌ 无法获取 npm 版本');
        return false;
    }
}

// 检查依赖是否安装
function checkDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');

    if (!fs.existsSync(packageJsonPath)) {
        console.log('❌ 未找到 package.json 文件');
        return false;
    }

    if (!fs.existsSync(nodeModulesPath)) {
        console.log('❌ 依赖未安装，请运行: npm install');
        return false;
    }

    console.log('✅ 项目依赖已安装');
    return true;
}

// 检查 VSCode 配置
function checkVscodeConfig() {
    const extensionsPath = path.join(process.cwd(), '.vscode', 'extensions.json');
    const settingsPath = path.join(process.cwd(), '.vscode', 'settings.json');

    if (fs.existsSync(extensionsPath)) {
        console.log('✅ VSCode 扩展配置已存在');
    } else {
        console.log('⚠️  未找到 VSCode 扩展配置文件');
    }

    if (fs.existsSync(settingsPath)) {
        console.log('✅ VSCode 设置配置已存在');
    } else {
        console.log('⚠️  未找到 VSCode 设置配置文件');
    }
}

// 检查 Git 配置
function checkGitConfig() {
    try {
        const gitPath = path.join(process.cwd(), '.git');
        if (fs.existsSync(gitPath)) {
            console.log('✅ Git 仓库已初始化');
        } else {
            console.log('⚠️  Git 仓库未初始化');
        }
    } catch (error) {
        console.log('⚠️  无法检查 Git 配置');
    }
}

// 主检查函数
function main() {
    let allPassed = true;

    allPassed = checkNodeVersion() && allPassed;
    allPassed = checkNpmVersion() && allPassed;
    allPassed = checkDependencies() && allPassed;
    checkVscodeConfig();
    checkGitConfig();

    console.log('\n📋 检查结果:');
    if (allPassed) {
        console.log('🎉 环境配置正确，可以开始开发！');
    } else {
        console.log('⚠️  请根据上述提示修复环境配置问题');
        console.log('\n📖 详细配置说明请查看 README.md');
    }
}

main();

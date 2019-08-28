
'use strict'

const prompts = require('prompts')
const commander = require('commander')

// import * as libs from './libs';
import version from './modules/version';

// 基本オプション
commander
    .option('-M=<mode>, --mode=<mode>', '実行モードを指定できます。（標準は default ）')

// バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(version)

// パース実行
commander.parse(process.argv)






// (async () => {
//     const response = await prompts([
//         // {
//         //     type: 'text',
//         //     name: 'twitter',
//         //     message: `What's your twitter handle?`
//         // },
//         // {
//         //     type: 'password',
//         //     name: 'pw',
//         //     message: `What's your pw?`
//         // },
//         {
//             type: 'select',
//             name: 'select',
//             message: 'Pick a color',
//             choices: [
//                 { title: 'Red', description: 'ăăăŤčŞŹć', value: '#ff0000' },
//                 { title: 'Green', value: '#00ff00', disabled: true },
//                 { title: 'Blue', value: '#0000ff' }
//             ],
//             initial: 1
//         },
//         {
//             type: 'multiselect',
//             name: 'color',
//             message: 'Pick colors',
//             choices: [
//                 { title: 'Red', value: '#ff0000' },
//                 { title: 'Green', value: '#00ff00' },
//                 { title: 'Blue', value: '#0000ff' },
//                 { title: 'Blue2', value: '#0000ff', disabled: true, description: 'đş' }
//             ],
//         }
//     ]);

//     // => { twitter: 'terkelg', color: [ '#ff0000', '#0000ff' ] }

//     console.log(response)

// })();

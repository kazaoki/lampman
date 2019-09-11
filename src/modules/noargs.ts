
'use strict'

import libs = require('../libs');
const child = require('child_process')
const color = require('cli-color')
const cliui = require('cliui')({width: color.windowSize.width-4})


/**
 * 引数なしのとき
 */
export default function noargs(commands: any, lampman: any)
{
    // Images
    console.log('  [Images]')
    libs.Message(child.execFileSync('docker', ['images']).toString(), 'primary', 1)

    // Volumes
    console.log('\n  [Volumes]')
    libs.Message(child.execFileSync('docker', ['volume', 'ls', '--format', 'table {{.Name}}\t{{.Driver}}\t{{.Scope}}']).toString(), 'primary', 1)

    // Containers
    console.log('\n  [Containers]')
    let lines = child.execFileSync('docker', ['ps', '-a', '--format', '{{.Names}}\t{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}']).toString().trim().split('\n')
    lines.unshift(['NAMES', 'ID', 'IMAGE', 'STATUS', 'PORTS'].join('\t'))
    for(let i in lines) {
        let column = lines[i].split(/\t/)
        let set = []
        for(let j in column) {
            set.push({
                text: column[j].replace(/, ?/g, '\n'),
                padding: [0, 1, 0, 1],
            })
        }
        cliui.div(...set)
    }
    libs.Message(cliui.toString(), 'primary', 1)
}

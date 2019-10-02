
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
    let groups = []
    let lines = <any>[]
    for(let line of child.execFileSync('docker', ['ps', '-a', '--format', '{{.Names}}\t{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\t{{.Labels}}']).toString().split('\n')) {
        let columns = line.split(/\t/)
        let label = columns.pop()
        lines.push({
            columns: columns,
            label: label
        })
    }
    lines.unshift({columns: ['NAMES', 'ID', 'IMAGE', 'STATUS', 'PORTS']})
    for(let line of lines) {
        let set = []
        for(let column of line.columns) {
            let text = column
            let is_group = 'config' in lampman && line.label && line.label.split(/,/).includes(`com.docker.compose.project=${lampman.config.project}`)
            let texts = []
            for(let item of text.split(/, ?/)) {
                texts.push(is_group
                    ? item
                    : 'label' in line
                        ? color.blue(item)
                        : item
                )
            }
            set.push({
                text: texts.join('\n'),
                padding: [0, 1, 0, 1],
            })
        }
        cliui.div(...set)
    }
    libs.Message(cliui.toString(), 'primary', 1, {for_container: true})
}

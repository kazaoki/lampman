
'use strict'

const prompts = require('prompts');

/**
 * デモ
 */

export default async function demo(cmd: any, options: any, config: object) {

    const response = await prompts([
        // {
        //     type: 'text',
        //     name: 'twitter',
        //     message: `What's your twitter handle?`
        // },
        // {
        //     type: 'password',
        //     name: 'pw',
        //     message: `What's your pw?`
        // },
        {
            type: 'select',
            name: 'select',
            message: 'Pick a color',
            choices: [
                { title: 'Red', description: '😺', value: '#ff0000' },
                { title: 'Green', value: '#00ff00', disabled: true },
                { title: 'Blue', value: '#0000ff' }
            ],
            initial: 1
        },
        {
            type: 'multiselect',
            name: 'color',
            message: 'Pick colors',
            choices: [
                { title: 'Red', value: '#ff0000' },
                { title: 'Green', value: '#00ff00' },
                { title: 'Blue', value: '#0000ff' },
                { title: 'Blue2', value: '#0000ff', disabled: true, description: '😺' }
            ],
        }
    ]);

    console.log(response)

}

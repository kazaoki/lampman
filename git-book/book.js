
let pkg = require('../package')

module.exports = {
    "plugins": ["-sharing","hide-published-with"],
    "language": "ja",
    "title": "Lampman "+pkg.version,
    "variables": {
        "version": pkg.version
    }
}

import pluginTester from 'babel-plugin-tester';
import plugin from '../src';

pluginTester({
    plugin,
    filename: __filename,
    tests: [
        {
            title: 'converts imports and require',
            fixture: '../../test/fixtures/code.js',
            outputFixture: '../../test/fixtures/output.js',
        }
    ]
})
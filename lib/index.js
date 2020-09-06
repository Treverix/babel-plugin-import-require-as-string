"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const endsWith = (str, search) => {
    if (typeof (search) === 'string') {
        return str.endsWith(search);
    }
    else {
        let match = false;
        search.forEach((s) => {
            match = match || str.endsWith(s);
        });
        return match;
    }
};
function default_1({ types: t }) {
    return {
        visitor: {
            ImportDeclaration: {
                exit: function (path, state) {
                    const importDeclaration = path.node;
                    if (endsWith(importDeclaration.source.value, ['.html', '.css'])) {
                        const dir = path_1.default.dirname(path_1.default.resolve(state.file.opts.filename));
                        const absolutePath = path_1.default.resolve(dir, importDeclaration.source.value);
                        const html = fs_1.default.readFileSync(absolutePath, 'utf8');
                        // replace the import statement with a 'const foo = '<html-content>';
                        path.replaceWith(t.variableDeclaration('const', [
                            t.variableDeclarator(t.identifier(importDeclaration.specifiers[0].local.name), t.stringLiteral(html))
                        ]));
                    }
                }
            },
            CallExpression: {
                exit: function (path, state) {
                    // we need a call expression with something like
                    // var foo = require('bar.html');
                    if (!path.parentPath.isVariableDeclarator())
                        return;
                    const callee = path.get('callee');
                    if (callee?.isIdentifier() && callee.equals('name', 'require')) {
                        const moduleArg = path.get('arguments')[0];
                        if (moduleArg?.isStringLiteral()) {
                            const argValue = moduleArg.node.value;
                            if (endsWith(argValue, ['.html', '.css'])) {
                                const dir = path_1.default.dirname(path_1.default.resolve(state.file.opts.filename));
                                const absolutePath = path_1.default.resolve(dir, argValue);
                                // replace the CallExpression (require('foo.html')) by the string html file content as a string
                                const html = fs_1.default.readFileSync(absolutePath, 'utf8');
                                path.replaceWith(t.stringLiteral(html));
                            }
                        }
                    }
                }
            }
        }
    };
}
exports.default = default_1;

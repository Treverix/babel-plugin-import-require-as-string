import fs from 'fs';
import p from 'path';
import * as BabelTypes from 'babel-types';
import {PluginObj} from "babel-core";
import {CallExpression, Identifier, ImportDeclaration, StringLiteral} from "babel-types";
import {NodePath} from "babel-traverse";

const endsWith = (str: string, search: string | string[]): boolean => {
  if (typeof(search) === 'string') {
    return str.endsWith(search);
  } else {
    let match = false;
    search.forEach((s) => {
      match = match || str.endsWith(s)
    })
    return match;
  }
}

export default function ({types: t} : {types: typeof BabelTypes}): PluginObj {
  return {
    name: 'babel-plugin-transform-html-css-import-require-to-string',
    visitor: {
      ImportDeclaration: {
        exit: function (path: NodePath<ImportDeclaration>, state) {
          const importDeclaration: ImportDeclaration = path.node;

          if (endsWith(importDeclaration.source.value, ['.html', '.css'])) {
            const dir = p.dirname(p.resolve(state.file.opts.filename));
            const absolutePath = p.resolve(dir, importDeclaration.source.value);
            const html = fs.readFileSync(absolutePath, 'utf8');

            // replace the import statement with a 'const foo = '<html-content>';
            path.replaceWith(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(importDeclaration.specifiers[0].local.name),
                  t.stringLiteral(html)
                )
              ])
            );
          }
        }
      },
      CallExpression: {
        exit: function (path: NodePath<CallExpression>, state) {
          // we need a call expression with something like
          // var foo = require('bar.html');
          if (!path.parentPath.isVariableDeclarator()) return;

          const callee = path.get('callee') as NodePath<Identifier>;
          if (callee?.isIdentifier() && callee.equals('name', 'require')) {
            const moduleArg = path.get('arguments')[0] as NodePath<StringLiteral>;

            if (moduleArg?.isStringLiteral()) {
              const argValue = moduleArg.node.value;
              if (endsWith(argValue, ['.html', '.css'])) {
                  const dir = p.dirname(p.resolve(state.file.opts.filename));
                  const absolutePath = p.resolve(dir, argValue);

                  // replace the CallExpression (require('foo.html')) by the string html file content as a string
                  const html = fs.readFileSync(absolutePath, 'utf8');
                  path.replaceWith(t.stringLiteral(html));
                }
            }
          }
        }
      }
    }
  };
}

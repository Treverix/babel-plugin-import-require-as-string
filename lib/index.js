'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      ImportDeclaration: {
        exit: function exit(path, state) {
          var node = path.node;

          if (endsWith(node.source.value, '.html')) {
            var dir = _path2.default.dirname(_path2.default.resolve(state.file.opts.filename));
            var absolutePath = _path2.default.resolve(dir, node.source.value);

            var html = _fs2.default.readFileSync(absolutePath, 'utf8');

            path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(node.specifiers[0].local.name), t.stringLiteral(html))]));
          }
        }
      },
      CallExpression: {
        exit: function exit(path, state) {
          var node = path.node;
          var callee = path.get('callee');
          if (callee.isIdentifier() && callee.equals('name', 'require')) {
            var moduleArg = path.get('arguments')[0];
            var argValue = moduleArg.node.value;
            // console.log(moduleArg);
            if (moduleArg && moduleArg.isStringLiteral() && endsWith(argValue, '.html')) {
              if (path.parentPath.isVariableDeclarator()) {
                var dir = _path2.default.dirname(_path2.default.resolve(state.file.opts.filename));
                var absolutePath = _path2.default.resolve(dir, argValue);

                var html = _fs2.default.readFileSync(absolutePath, 'utf8');
                var pathSegments = argValue.split('/');
                var varName = pathSegments[pathSegments.length - 1];
                console.log('argValue', argValue);
                console.log('pathSegments', pathSegments);
                path.replaceWith(t.stringLiteral(html));
                // path.parentPath.replaceWith(
                //   t.variableDeclarator(
                //     t.identifier(varName.replace('.', '_')),
                //     t.stringLiteral(html)
                //   )
                // );
                // node.callee = t.stringLiteral(html);

                // node.callee = t.variableDeclaration('var', [
                //   t.variableDeclarator(t.identifier(varName), t.stringLiteral(html))
                // ]);

                // path.replaceWith(
                //   t.variableDeclaration('var', [
                //     t.variableDeclarator(
                //       t.identifier(node.specifiers[0].local.name),
                //       t.stringLiteral(html)
                //     )
                //   ])
                // );
              }
            }
          }
        }
      }
    }
  };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function endsWith(str, search) {
  return str.indexOf(search, str.length - search.length) !== -1;
}
import * as BabelTypes from 'babel-types';
import { PluginObj } from "babel-core";
export default function ({ types: t }: {
    types: typeof BabelTypes;
}): PluginObj;

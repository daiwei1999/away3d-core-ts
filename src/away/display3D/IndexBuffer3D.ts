/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>

module away.display3D
{
	export class IndexBuffer3D
	{
		private _gl:WebGLRenderingContext;
		private _numIndices:number;
		
		constructor(gl:WebGLRenderingContext, numIndices:number)
		{
			this._gl = gl;
			this._numIndices = numIndices;
		}
	}
}
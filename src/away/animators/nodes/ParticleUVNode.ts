///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Vector3D						= away.geom.Vector3D;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	/**
	 * A particle animation node used to control the UV offset and scale of a particle over time.
	 */
	export class ParticleUVNode extends ParticleNodeBase
	{
		/** @private */
		public static UV_INDEX:number /*uint*/ = 0;
		
		/** @private */
		public _iUvData:Vector3D;
		
		/**
		 *
		 */
		public static U_AXIS:string = "x";
		
		/**
		 *
		 */
		public static V_AXIS:string = "y";
		
		private _cycle:number;
		private _scale:number;
		private _axis:string;
		
		/**
		 * Creates a new <code>ParticleTimeNode</code>
		 *
		 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
		 * @param    [optional] cycle           Defines whether the time track is in loop mode. Defaults to false.
		 * @param    [optional] scale           Defines whether the time track is in loop mode. Defaults to false.
		 * @param    [optional] axis            Defines whether the time track is in loop mode. Defaults to false.
		 */
		constructor(mode:number /*uint*/, cycle:number = 1, scale:number = 1, axis:string = "x")
		{
			//because of the stage3d register limitation, it only support the global mode
			super("ParticleUV", ParticlePropertiesMode.GLOBAL, 4, ParticleAnimationSet.POST_PRIORITY + 1);
			
			this._pStateClass = ParticleUVState;
			
			this._cycle = cycle;
			this._scale = scale;
			this._axis = axis;

			this.updateUVData();
		}
		
		/**
		 *
		 */
		public get cycle():number
		{
			return this._cycle;
		}
		
		public set cycle(value:number)
		{
			this._cycle = value;

			this.updateUVData();
		}
		
		/**
		 *
		 */
		public get scale():number
		{
			return this._scale;
		}
		
		public set scale(value:number)
		{
			this._scale = value;

			this.updateUVData();
		}
		
		/**
		 *
		 */
		public get axis():string
		{
			return this._axis;
		}
		
		public set axis(value:string)
		{
			this._axis = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public getAGALUVCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var code:string = "";
			
			if (animationRegisterCache.needUVAnimation) {
				var uvConst:ShaderRegisterElement = animationRegisterCache.getFreeVertexConstant();
				animationRegisterCache.setRegisterIndex(this, ParticleUVNode.UV_INDEX, uvConst.index);
				
				var axisIndex:number = this._axis == "x"? 0 :
					this._axis == "y"? 1 :
					2;
				var target:ShaderRegisterElement = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, axisIndex);
				
				var sin:ShaderRegisterElement = animationRegisterCache.getFreeVertexSingleTemp();
				
				if (this._scale != 1)
					code += "mul " + target + "," + target + "," + uvConst + ".y\n";
				
				code += "mul " + sin + "," + animationRegisterCache.vertexTime + "," + uvConst + ".x\n";
				code += "sin " + sin + "," + sin + "\n";
				code += "add " + target + "," + target + "," + sin + "\n";
			}
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public getAnimationState(animator:IAnimator):ParticleUVState
		{
			return <ParticleUVState> animator.getAnimationState(this);
		}
		
		private updateUVData()
		{
			this._iUvData = new Vector3D(Math.PI*2/this._cycle, this._scale, 0, 0);
		}
		
		/**
		 * @inheritDoc
		 */
		public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet)
		{
			particleAnimationSet.hasUVNode = true;
		}
	}
}

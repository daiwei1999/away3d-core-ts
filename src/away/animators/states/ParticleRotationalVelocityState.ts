///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Camera3D							= away.cameras.Camera3D;
	import Context3DVertexBufferFormat		= away.display3D.Context3DVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import Stage3DProxy						= away.managers.Stage3DProxy;
	
	/**
	 * ...
	 */
	export class ParticleRotationalVelocityState extends ParticleStateBase
	{
		private _particleRotationalVelocityNode:ParticleRotationalVelocityNode;
		private _rotationalVelocityData:Vector3D;
		private _rotationalVelocity:Vector3D;
		
		/**
		 * Defines the default rotationalVelocity of the state, used when in global mode.
		 */
		public get rotationalVelocity():Vector3D
		{
			return this._rotationalVelocity;
		}
		
		public set rotationalVelocity(value:Vector3D)
		{
			this._rotationalVelocity = value;

			this.updateRotationalVelocityData();
		}
		
		/**
		 *
		 */
		public getRotationalVelocities():Array<Vector3D>
		{
			return this._pDynamicProperties;
		}
		
		public setRotationalVelocities(value:Array<Vector3D>)
		{
			this._pDynamicProperties = value;

			this._pDynamicPropertiesDirty = new Object();
		}
		
		constructor(animator:ParticleAnimator, particleRotationNode:ParticleRotationalVelocityNode)
		{
			super(animator, particleRotationNode);

			this._particleRotationalVelocityNode = particleRotationNode;
			this._rotationalVelocity = this._particleRotationalVelocityNode._iRotationalVelocity;

			this.updateRotationalVelocityData();
		}
		
		/**
		 * @inheritDoc
		 */
		public setRenderState(stage3DProxy:Stage3DProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
				this._pUpdateDynamicProperties(animationSubGeometry);
			
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotationalVelocityNode.ROTATIONALVELOCITY_INDEX);
			
			if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
				animationRegisterCache.setVertexConst(index, this._rotationalVelocityData.x, this._rotationalVelocityData.y, this._rotationalVelocityData.z, this._rotationalVelocityData.w);
			else
				animationSubGeometry.activateVertexBuffer(index, this._particleRotationalVelocityNode._iDataOffset, stage3DProxy, Context3DVertexBufferFormat.FLOAT_4);
		}
		
		private updateRotationalVelocityData()
		{
			if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.GLOBAL) {
				if (this._rotationalVelocity.w <= 0)
					throw(new Error("the cycle duration must greater than zero"));
				var rotation:Vector3D = this._rotationalVelocity.clone();
				
				if (rotation.length <= 0)
					rotation.z = 1; //set the default direction
				else
					rotation.normalize();
				// w is used as angle/2 in agal
				this._rotationalVelocityData = new Vector3D(rotation.x, rotation.y, rotation.z, Math.PI/rotation.w);
			}
		}
	}
}

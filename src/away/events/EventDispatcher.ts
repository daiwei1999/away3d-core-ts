/*
 * Author: mr.doob / https://github.com/mrdoob/eventdispatcher.js/
 * TypeScript Conversion : Karim Beyrouti ( karim@kurst.co.uk )
 */
 
 ///<reference path="Event.ts" />

/**
 * @module kurst.events
 */
module away.events {

    /**
     * Base class for dispatching events
     *
     * @class kurst.events.EventDispatcher
     *
     */

    export class EventDispatcher{

        private listeners   : Object[] = new Array<Object>();
        private lFncLength  : number;
        /**
         * Add an event listener
         * @method addEventListener
         * @param {String} Name of event to add a listener for
         * @param {Function} Callback function
         */
        public addEventListener ( type : string , listener : Function ) {

            if ( this.listeners[ type ] === undefined ) {

                this.listeners[ type ] = new Array<Function>();//Function[];

            }

            if ( this.listeners[ type ].indexOf( listener ) === - 1 ) {

                this.listeners[ type ].push( listener );

            }

        }
        /**
         * Remove an event listener
         * @method removeEventListener
         * @param {String} Name of event to remove a listener for
         * @param {Function} Callback function
         */
        public removeEventListener ( type : string , listener : Function ) {

            var index = this.listeners[ type ].indexOf( listener );

            if ( index !== - 1 ) {

                this.listeners[ type ].splice( index, 1 );

            }

        }
        /**
         * Dispatch an event
         * @method dispatchEvent
         * @param {Event} Event to dispatch
         */
        public dispatchEvent ( event : Event ) {

            var listenerArray : Function[] = <Function[]> this.listeners[ event.type ];

            if ( listenerArray !== undefined ) {

                this.lFncLength     = listenerArray.length;
                event.target        = this;

                for ( var i = 0, l = this.lFncLength; i < l; i ++ ) {

                    listenerArray[ i ].call( this, event );

                }
            }

        }

    }

}
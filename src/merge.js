/** ------------------------------------------------------------------------------------------------
 *  @filename  merge.js
 *  @author  brikcss  <https://github.com/brikcss>
 *  @description  Deep merge objects and arrays.
 ** --------------------------------------------------------------------------------------------- */

/**
 *  Merge arrays according to a given strategy.
 *
 *  @param   {Array}  target  Target Array.
 *  @param   {Array}  source  Source Array.
 *  @param   {String}  'unique' ('unique'|'overwrite'|'concat')  Strategy to merge arrays with.
 *      'unique' concatenates and removes duplicate items. 'concat' combines source and target.
 *      'overwrite' takes source values.
 *  @return  {Array}  Merged array.
 */
function mergeArray(target = [], source, { arrayStrategy = 'unique' } = {}) {
	// Make sure target is an array.
	if (!(target instanceof Array)) target = [target];
	// Merge according to array strategy.
	if (arrayStrategy === 'overwrite') {
		target = source;
	} else if (arrayStrategy === 'unique') {
		target = target.concat(source).filter((item, i, array) => array.indexOf(item) === i);
	} else if (arrayStrategy === 'concat') {
		target = target.concat(source);
	} else {
		target = source;
	}
	return target;
}

/**
 *  Deep merge two objects.
 *
 *  @param   {Object}  target  Target object.
 *  @param   {Object}  source  Source object.
 *  @param   {Object}  options  Options.
 *  @return  {Object}  Merged object.
 */
function mergeObject(target = {}, source, options = {}) {
	// If both are mergeable and of the same object type, merge them.
	Object.keys(source).forEach(function(key) {
		const value = source[key];

		if (value === target) {
			// Return target if source and target are the same.
			return;
		} else if (
			!(value instanceof Object) ||
			(value.constructor !== Object && value.constructor !== Array)
		) {
			// If source is not mergeable, take the source.
			target[key] = value;
			return;
		} else if (value instanceof Array) {
			// If source is an array, merge as an array.
			target[key] = mergeArray(target[key], value, options);
			return;
		} else if (
			!(target[key] instanceof Object) ||
			(target[key].constructor !== Object && target[key].constructor !== Array)
		) {
			// If source is mergeable and target is not, clone it.
			if (value instanceof Array) {
				target[key] = mergeArray([], value, options);
			} else {
				target[key] = mergeObject({}, value, options);
			}
			return;
		} else {
			// Otherwise, merge as an object.
			target[key] = mergeObject(target[key], value, options);
			return;
		}
	});
	return target;
}

/**
 *  Deep merge two objects.
 *
 *  @param   {Object|Array}  target  Target object/array.
 *  @param   {Object|Array}  source  Source object/array.
 *  @param   {Object}  options  Options.
 *  @return  {Object|Array}  Merged object or array.
 */
function mergeTwoObjects(target, source, options = {}) {
	// If source is not mergeable, return the source.
	if (
		!(source instanceof Object) ||
		(source.constructor !== Object && source.constructor !== Array)
	) {
		return source;
	}
	// Merge according as an object or array...
	if (source instanceof Array) target = mergeArray(target, source, options);
	else target = mergeObject(target, source, options);
	return target;
}

/**
 *  Entry which handles how to merge the given objects. If the first argument is not an Array, or
 *  the second argument is an Array, all arguments are treated as objects to be merged (with the
 *  default options). This allows user to pass arguments directly to function, unless options are
 *  needed.
 *
 *  @param   {Array}  objectsArray  Array of objects.
 *  @param   {Object}  options  Options object.
 *  @return  {Object|Array}  Merged object or array.
 */
function merge(objectsArray, options = {}) {
	// If the first argument is NOT an array, objectsArray = arguments as it is assumed there are no options being passed.
	if (!(objectsArray instanceof Array) || arguments[1] instanceof Array) {
		objectsArray = Array.prototype.slice.call(arguments, 0);
	}

	// Validate there is at least two items in objectsArray and they are all mergeable.
	if (objectsArray.length < 1) return false;
	if (objectsArray.length < 2) return objectsArray[0];

	// Set target and remove target from objectsArray.
	let target = objectsArray[0];
	objectsArray = objectsArray.slice(1);

	// Reduce all object in array and merge them all.
	objectsArray.forEach((obj) => (target = mergeTwoObjects(target, obj, options)));

	return target;
}

export default merge;

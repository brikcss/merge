/*! merge.js | @author brikcss <https://github.com/brikcss> | @reference https://github.com/brikcss/merge */

// -------------------------------------------------------------------------------------------------
// Merge constructor.
//

/**
 * Merge constructor. Provides a consistent API container for merging Objects or Arrays.
 * @return {any}  Merged value, same type as 2nd merge value.
 */
function Merge (...args) {
  let options = {}

  // If there are two args and first is an Array and second is an Object, use Array as objects and
  // Object as options.
  if (args.length === 2 && _isArray(args[0]) && _isObject(args[1])) {
    options = args[1]
    args = args[0]
  }

  // Validate there are at least two iterable values.
  if (args.length < 1) return false
  if (args.length < 2) return args[0]

  // Set target and remove target from objectsArray.
  let target = args.shift()

  // Reduce all object in array and merge them all.
  return args.reduce((target, source) => {
    // If target or source is not iterable, return the source.
    if (
      _trueType(target) !== _trueType(source) ||
      !_isIterable(target) ||
      !_isIterable(source)
    ) return source
    // Merge source/target as Arrays or Objects.
    return Merge[_isArray(source) ? 'arrays' : 'objects'](target, source, options)
  }, target)
}


/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */
function isPrototypePolluted(key){
  return ['__proto__', 'prototype', 'constructor'].includes(key);
}

/**
 * Merge two Arrays according to the specified strategy.
 * @param  {Array}  target
 * @param  {Array}  source
 * @param  {String}  options.arrayStrategy  ('unique')  Strategy to merge Arrays with. 'concat'
 *     concatenates. 'unique' concatenates and removes duplicates. 'overwrite' overwrites target
 *     with source Array.
 * @return {Array}  Merged Arrays.
 */
Merge.arrays = (target = [], source, { arrayStrategy = 'unique', ignore = [], parent = '' } = {}) => {
  // If source or target are not Arrays, return target.
  if (!_isArray(target) || !_isArray(source)) return target

  // Iterate through array...
  source.forEach((value, i) => {
    const currentPath = _joinPath(parent, i.toString())

    // Return target if path is ignored.
    if (ignore && ignore.includes(currentPath)) return

    // If source is not iterable, merge according to array strategy.
    if (arrayStrategy === 'overwrite') {
      target[i] = value
    } else if (arrayStrategy === 'merge') {
      if (_isIterable(value)) {
        target[i] = Merge[_trueType(value) + 's'](target[i], value, { arrayStrategy, ignore, parent: _joinPath(parent, i) })
      } else {
        target[i] = value
      }
    } else if (arrayStrategy === 'unique') {
      if (!Object.is(target[i], value) && target.indexOf(value) === -1) {
        target.push(value)
      }
    } else if (arrayStrategy === 'concat') {
      target.push(value)
    } else {
      target[i] = value
    }
  })
  return target
}

/**
 * Deep merge two objects.
 * @param  {Object} target  Target Object.
 * @param  {Object} source  Source Object.
 * @param  {Object} options
 * @return {Object}  Merged Objects.
 */
Merge.objects = (target = {}, source, { arrayStrategy, ignore = [], parent = '' } = {}) => {
  // If both are iterable and of the same object type, merge them.
  Object.keys(source).forEach(function (key) {
    if (isPrototypePolluted(key)) return;
    const value = source[key]
    const currentPath = _joinPath(parent, key)

    // Return target if path is ignored.
    if (ignore && ignore.includes(currentPath)) return

    // Return target if source and target are the same.
    if (value === target[key] || !_exists(value)) return

    // If source is not iterable, overwrite the target.
    if (!_isIterable(value)) {
      target[key] = value

    // If source is an array, merge as an array.
    } else if (_isArray(value)) {
      // If target is not an Array, convert it to one according to arrayStrategy.
      if (!_isArray(target[key])) {
        if (arrayStrategy === 'overwrite') target[key] = []
        else target[key] = _exists(target[key]) ? [target[key]] : []
      }
      target[key] = Merge.arrays(
        target[key],
        value,
        { arrayStrategy, ignore, parent: currentPath }
      )

    // Otherwise, merge as an object.
    } else {
      target[key] = Merge.objects(
        _isObject(target[key]) ? target[key] : {},
        value,
        { arrayStrategy, ignore, parent: currentPath })
    }
  })
  return target
}

// -------------------------------------------------------------------------------------------------
// Helper functions.
//

/**
 * Join parent and child object paths.
 *
 * @param {String} parent  Parent path.
 * @param {String} key  Child key/path.
 * @return {String}  String path.
 */
function _joinPath (parent, key) {
  return parent ? [parent, key].join('.') : key === undefined ? '' : key
}

/**
 * Get true type of a variable.
 *
 * @param {any} value  The value to check.
 * @return {String}  String type.
 */
function _trueType (value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

/**
 * Test if value is a true Object.
 * @param  {any}  value
 * @return {Boolean}  Whether value is a true Object.
 */
function _isObject (value) {
  return _trueType(value) === 'object'
}

/**
 * Test if value is an Array.
 * @param  {any}  value
 * @return {Boolean}  Whether value is an Array.
 */
function _isArray (value) {
  return _trueType(value) === 'array'
}

/**
 * Test if value exists.
 * @param  {any} value
 * @return {Boolean}  Whether value exists.
 */
function _exists (value) {
  return value !== null && value !== undefined
}

/**
 * Test if a value is iterable (Object or Array).
 * @param  {any} value
 * @return {Boolean}  Whether value is iterable.
 */
function _isIterable (value) {
  return ['array', 'object'].includes(_trueType(value))
}

// -------------------------------------------------------------------------------------------------
// Exports.
//

module.exports = Merge

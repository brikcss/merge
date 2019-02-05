/*! merge.js | @author brikcss <https://github.com/brikcss> | @reference https://github.com/brikcss/merge */

// -------------------------------------------------------------------------------------------------
// Merge constructor.
//

/**
 * Merge constructor. Provides a consistent API container for merging Objects or Arrays.
 * @return {Object|Array}  Merged Object or Array.
 */
function Merge (...args) {
  let options = {}
  let objects = args

  // If there are two args and first is an Array and second is an Object, use Array as objects and
  // Object as options.
  if (objects.length === 2 && isArray(objects[0]) && isObject(objects[1])) {
    options = objects[1]
    objects = objects[0]
  }

  // Validate there is at least two items in objectsArray and they are all mergeable.
  if (objects.length < 1) return false
  if (objects.length < 2) return objects[0]

  // Set target and remove target from objectsArray.
  let target = objects.shift()

  // Reduce all object in array and merge them all.
  return objects.reduce((target, source) => {
    // If source is not mergeable, return the source.
    if (!mergeable(source)) return source
    // Merge source/target as Arrays or Objects.
    return Merge[isArray(source) ? 'arrays' : 'objects'](target, source, options)
  }, target)
}

/**
 * Merge two Arrays according to the specified strategy.
 * @param  {Array}  target
 * @param  {Array} source
 * @param  {String} options.arrayStrategy  ('unique')  Strategy to merge Arrays with. 'concat'
 *     concatenates. 'unique' concatenates and removes duplicates. 'overwrite' overwrites target
 *     with source Array.
 * @return {Array}  Merged Arrays.
 */
Merge.arrays = (target = [], source, { arrayStrategy = 'unique' } = {}) => {
  // If source or target are not Arrays, return target.
  if (!isArray(target) || !isArray(source)) return target
  // Merge according to array strategy.
  if (arrayStrategy === 'overwrite') {
    target = source
  } else if (arrayStrategy === 'unique') {
    target = target.concat(source).filter((item, i, array) => array.indexOf(item) === i)
  } else if (arrayStrategy === 'concat') {
    target = target.concat(source)
  } else {
    target = source
  }
  return target
}

/**
 * Deep merge two objects.
 * @param  {Object} target  Target Object.
 * @param  {Object} source  Source Object.
 * @param  {Object} options
 * @return {Object}  Merged Objects.
 */
Merge.objects = (target = {}, source, options = {}) => {
  // If both are mergeable and of the same object type, merge them.
  Object.keys(source).forEach(function (key) {
    const value = source[key]
    // Return target if source and target are the same.
    if (value === target[key] || !exists(value)) return
    // If source is not mergeable, overwrite the target.
    if (!mergeable(value)) {
      target[key] = value
    // If source is an array, merge as an array.
    } else if (isArray(value)) {
      // If target is not an Array, convert it to one according to arrayStrategy.
      if (!isArray(target[key])) {
        if (options.arrayStrategy === 'overwrite') target[key] = []
        else target[key] = exists(target[key]) ? [target[key]] : []
      }
      target[key] = Merge.arrays(target[key], value, options)
    // Otherwise, merge as an object.
    } else {
      target[key] = Merge.objects(isObject(target[key]) ? target[key] : {}, value, options)
    }
  })
  return target
}

// -------------------------------------------------------------------------------------------------
// Helper functions.
//

/**
 * Test if value is a true Object.
 * @param  {any}  value
 * @return {Boolean}  Whether value is a true Object.
 */
function isObject (value) {
  return value && typeof value === 'object' && value.constructor && value.constructor === Object
}

/**
 * Test if value is an Array.
 * @param  {any}  value
 * @return {Boolean}  Whether value is an Array.
 */
function isArray (value) {
  return value instanceof Array
}

/**
 * Test if value exists.
 * @param  {any} value
 * @return {Boolean}  Whether value exists.
 */
function exists (value) {
  return value !== null && value !== undefined
}

/**
 * Test if a value is mergeable (Object or Array).
 * @param  {any} value
 * @return {Boolean}  Whether value is mergeable.
 */
function mergeable (value) {
  return isArray(value) || isObject(value)
}

// -------------------------------------------------------------------------------------------------
// Exports.
//

module.exports = Merge

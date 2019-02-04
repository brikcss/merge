/* eslint-env jest */
const assert = require('assert');
const merge = require('../dist/lib/merge.js');

describe('merge()', () => {
	it('should merge objects', () => {
		const test1 = [
			{
				a: 1,
				b: 2,
				d: {
					a: 1,
					b: [],
					c: { test1: 123, test2: 321 }
				},
				f: 5,
				g: 123,
				i: 321,
				j: [1, 2, 3]
			},
			{
				b: 3,
				c: 5,
				d: {
					b: { first: 'one', second: 'two' },
					c: { test2: 222 }
				},
				e: { one: 1, two: 2 },
				f: [],
				g: void 0,
				h: /abc/g,
				i: null,
				j: [3, 4]
			},
			{ b: 4, k: 'hi' }
		];
		const result1 = {
			a: 1,
			b: 4,
			d: {
				a: 1,
				b: { first: 'one', second: 'two' },
				c: { test1: 123, test2: 222 }
			},
			f: [5],
			g: undefined,
			c: 5,
			e: { one: 1, two: 2 },
			h: /abc/g,
			i: null,
			j: [1, 2, 3, 4],
			k: 'hi'
		};
		assert.deepStrictEqual(merge(test1), result1);
		assert.deepStrictEqual(merge(...test1), result1);
	});

	const test2 = [
		{ a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
		{ b: 2, one: 1, array: [2, 3, 4] },
		{ two: 2, array: [4, 5, 6] }
	];
	it('should merge objects and make arrays unique', () => {
		assert.deepStrictEqual(merge([{}, ...test2], { arrayStrategy: 'unique' }), {
			a: 'a',
			b: 2,
			c: 'c',
			one: 1,
			two: 2,
			array: [1, 2, 3, 4, 5, 6]
		});
		assert.deepStrictEqual(test2, [
			{ a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
			{ b: 2, one: 1, array: [2, 3, 4] },
			{ two: 2, array: [4, 5, 6] }
		]);
	});
	it('should merge objects and overwrite arrays', () => {
		assert.deepStrictEqual(merge([{}, ...test2], { arrayStrategy: 'overwrite' }), {
			a: 'a',
			b: 2,
			c: 'c',
			one: 1,
			two: 2,
			array: [4, 5, 6]
		});
		assert.deepStrictEqual(test2, [
			{ a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
			{ b: 2, one: 1, array: [2, 3, 4] },
			{ two: 2, array: [4, 5, 6] }
		]);
	});
	it('should merge objects and concatenate arrays', () => {
		assert.deepStrictEqual(merge([{}, ...test2], { arrayStrategy: 'concat' }), {
			a: 'a',
			b: 2,
			c: 'c',
			one: 1,
			two: 2,
			array: [1, 2, 3, 2, 3, 4, 4, 5, 6]
		});
		assert.deepStrictEqual(test2, [
			{ a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
			{ b: 2, one: 1, array: [2, 3, 4] },
			{ two: 2, array: [4, 5, 6] }
		]);
	});

	const test3 = [[1, 2, 3], [2, 3, 4, 5], [1, 5, 9, 10]];
	it('should merge and make arrays unique', () => {
		assert.deepStrictEqual(merge(test3, { arrayStrategy: 'unique' }), [1, 2, 3, 4, 5, 9, 10]);
	});
	it('should merge and concatenate arrays', () => {
		assert.deepStrictEqual(merge(test3, { arrayStrategy: 'concat' }), [
			1,
			2,
			3,
			2,
			3,
			4,
			5,
			1,
			5,
			9,
			10
		]);
	});
	it('should merge and overwrite arrays', () => {
		assert.deepStrictEqual(merge(test3, { arrayStrategy: 'overwrite' }), [1, 5, 9, 10]);
	});

	const test4 = [
		[2, { one: 1, two: { three: 3, four: 4 }, five: 5 }, 9, 5],
		[1, { one: 'one', two: { three: 'three' }, four: 'four' }, 9, 10]
	];
	it('should merge arrays with objects with concatenate strategy', () => {
		assert.deepStrictEqual(merge(test4, { arrayStrategy: 'concat' }), [
			2,
			{ one: 1, two: { three: 3, four: 4 }, five: 5 },
			9,
			5,
			1,
			{ one: 'one', two: { three: 'three' }, four: 'four' },
			9,
			10
		]);
	});
	it('should merge arrays with objects with unique strategy', () => {
		assert.deepStrictEqual(merge(test4, { arrayStrategy: 'unique' }), [
			2,
			{ one: 1, two: { three: 3, four: 4 }, five: 5 },
			9,
			5,
			1,
			{ one: 'one', two: { three: 'three' }, four: 'four' },
			10
		]);
	});
	it('should merge arrays with objects with overwrite strategy', () => {
		assert.deepStrictEqual(merge(test4, { arrayStrategy: 'overwrite' }), test4[1]);
	});

	it('should merge two arrays, even if they are empty', () => {
		assert.deepStrictEqual(merge([], ['one', 'two']), ['one', 'two']);
	});

	it('should clone objects when the first argument is empty', () => {
		let brik = { options: { files: ['/this/path/one', '/this/path/two'] } };
		let child = { files: '/this/path', root: '/another/path' };
		let merged = merge({}, brik, { options: child });
		assert.deepStrictEqual(merged, {
			options: {
				files: '/this/path',
				root: '/another/path'
			}
		});
		assert.deepStrictEqual(brik, { options: { files: ['/this/path/one', '/this/path/two'] } });
	});
});

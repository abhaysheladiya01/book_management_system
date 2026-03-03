import { expect } from 'chai';
it('should add numbers correctly', function() {
    const num1 = 2;
    const num2 = 3;
    expect(num1 + num2).to.equal(5);
});

it('should compare two objects deeply', function() {
  const obj1 = { name: 'Alice', age: 25 };
  const obj2 = { name: 'Alice', age: 25 };
  
  expect(obj1).to.deep.equal(obj2);
});

it('should check the type of a variable', function() {
  const str = 'hello';
  const num = 123;
  const arr = [1, 2, 3];
  
  expect(str).to.be.a('string');
  expect(num).to.be.a('number');
  expect(arr).to.be.an('array');
});

it('should check the length of an array', function() {
  const arr = [1, 2, 3];
  expect(arr).to.have.lengthOf(3);
});

# Advanced Javascript Learnings 

Contents:
- JS Revision
- Event Loop / task queue / call stack
- http1 vs http2
- callbacks 
- Synchronous vs Asynchronous execution in JS
- Closures and currying 
- Promises and promise chaining
- Data Structures
- ES6 data structures: maps and sets
- Promise.all and Promise.allSettled
- DOM manipulation
- Comp Sci fundamentals
- Hoisting 
- The Scope Chain

## JS Revision:
- https://github.com/Mark-Cooper-Janssen-Vooles/javascript

Notes on JS revision:
- primitive values can be pointed to but can’t be changed (immutable). Objects and functions can be changed (mutation)
- let vs const: const means you can’t change what the variable points to (although you can mutate the object)
- prototypes: your object can inherit from a prototype using __proto__. By default they inherit from the Object prototype. Not commonly embraced
- Closure: a closure has to do with scope - typically a function within a function, or a variable within a function, only accessible within that function.
	- they let you associate data with a function that operates on that data. (Line 215 for a good example, associates a pre-assigned variable so you can keep using it without making a function call again and again
- promises: the promise object represents the eventual completion of an async operation and its resulting value. It is a proxy for a value not necessarily known when the promise is created.
	- you attach (chain) a callback instead of passing callbacks
- DOM: document object model - the data representation of the objects that comprise the structure and content of a document on the web.
	- represents the document as nodes and objects so programming languages can interact with the web page
	- to access, you just use the `document` variable.
	- i.e. `const paragraphs = document.querySelectorAll(“p”);`
- Core web and browser concepts:
	- initial request:
		- browser sends a request to a server to fetch a html document, server returns a html page + its encoding type
	- DOM Tree:
		- this refers to elements like HTML > head / body > div / h1 / text node / etc
	- CSS Object Model
		- styles websites
		- after constructing the DOM, the browser reads and constructs the CSS object model (CSSOM)
		- if some values aren’t defined, they are set to the W3C css default standard
	- Render Tree
		- combines DOM and CSSOM
	- Browser Engine
		- I.e. Webkit (safari), Blink (chromium)
		- constructs Dom tree, constructs CSSOM tree, constructs render Tree, prints individual elements, paint operation, compositing operation (Draws it on the screen)
		- FP is ‘first paint’ - i.e. time browser started printing first pixel of background colour
		- FCP is ‘first contentful paint’ - i.e browser rendered first pixel of content such as text or image
		- LCP ‘largest contentful part’ - browser has rendered large pieces of text or image
- Static vs Dynamic Websites
	- usually refers to delivery.
		- static: delivered pre-rendered (via a CDN)
		- dynamic: rendered in real-time by the server
	- the more static, the better load times
- Front end System Design
	- Focus on RADAD: requirements, architecture, data model, api design, deep dive
		- requirements:
			- primary device, desktop?
			- which browser to support?
			- internationalisation? Accessibility?
		- architecture:
			- draw diagram
			- I.e. main image, thumbnails, image store (client side cache of list of photos to display)
		- data model - how will it store data passed into it? Data structures?
			- state, lifecycle methods, each component being independent
		- API design
			- reusable components
		- Deep dive
			- ux, performance, accessibility, internationalisation, multi-device support, security (ie. on input form)
- debugging in JS
	- use console.log and open the dev tools
	- use the ‘debugger’ keyword


---


## Event loop / task queue / call stack
- JS code has an 'event loop' which manages the 'task queue', and each task has a 'call stack':
  - the event loop is a mechanism that manages the order in which tasks are executed in javascript
    - it monitors the callstack and the task queue for new tasks to execute. 
    - when the callstack is empty, the event loop takes the first task from the task queue (the oldest one) and adds it to the call stack for execution 
      - the call stack fires off various functions, with the one most nested to be at the top and executed first 
    - the task queue is where tasks like "setTimeout", callbacks, user events, and other asynchronous operations are stored until they are ready to be executed
  - `setTimeout(()=>{}, 0)` will have to wait until `console.log('hi')` is run because it is an async task, thus its put second on the queue. the second argument is the minimum time required for it to run.
  - A web worker has its own event loop / queue / call stack

---

## http1 vs http2
- http1 (6 max simultaneous requests) or http2 (potentially infinite) 
  - HTTP/1.x uses a request-response model where each request from the client initiates a new connection to the server 
    - the main drawback is that it is limited by its ability to efficiently handle multiple requests over a single connection. 
    - can lead to slow loading times for web pages with many resources (i.e. 6 simultaneous requests, not 1000)
  - HTTP/2 is the latest version of the HTTP protocol, introduced in 2015
    - addresses limitations of HTTP/1.x and improves performance of web communcation
    - uses binary format instead of text-based format 
    - multiple requests can be sent over a single connection, reducing the latency and improving the overall performance of web pages

---

## What are the similarities and differences between Maps and Objects in Javascript?
  - Similarities:
    - both maps and objects can be used to store key-value pairs 
    - both maps and objects can use any JavaScript value as a value
    - both maps and objects are iterable, meaning you can loop over their contents 
  - Differences:
    - the primary difference is that maps allow any type of key, including objects. while objects only allow string and symbol keys. 
    - maps maintain an order of their elements, while objects do not 
    - maps have a built-in size property that returns the number of key-value pairs in the map, while Objects do not have built-in size properties 
    - maps have a variety of built-in methods for working with keys and values, such as `set(), get(), has(), and delete()`. Objects have fewer built-in methods, such as `Object.keys()` and `Object.values()`. 
    - maps are typically used for more advanced data structures, while Objects are typically used for simpler data structures. 
  ````js
  // Using a Map
  const myMap = new Map();
  const key1 = 'foo';
  const key2 = {name: 'bar'};
  myMap.set(key1, 'value1');
  myMap.set(key2, 'value2');
  console.log(myMap.get(key1)); // 'value1'
  console.log(myMap.get(key2)); // 'value2'

  // Using an Object
  const myObj = {foo: 'value1', bar: 'value2'};
  console.log(myObj.foo); // 'value1'
  console.log(myObj.bar); // 'value2'
  ````


---


## Callbacks:
A callback function is a function passed in as an argument to another function, to be executed in that parent function.
Often used for asynchronous code - the function passed can be called when the data is ready in the receiving function. A standard pattern is the first argument is an error, and the second is the data:
````js
getPuzzle((error, puzzle) => {
	if (error) {
		console.log(“error:“, error)
	} else {
		console.log(puzzle)
	}
})
````
Where getPuzzle would only execute the function passed in once the async code is completed:
````js
const getPuzzle = (callback) => {
	fetch('someurl.com')
		.then((response) => response.json())
		.then((data) => {
			callback(undefined, data)
		})
		.catch((error) => {
			callback(error, undefined)
		}
}
````
---

## Synchronous vs Asynchronous Execution:
- Synchronous:
	- we need to wait till the task completes before moving on to the next one of code
	- this can cause the browser to ‘lock up’, i.e. a checkbox is unclickable for this duration
	- each synchronous execution that takes time will cause a longer wait, and will have individual wait times (not simultaneous)
	- if two requests taking 1 second each, we need to wait 2 seconds for our program to complete.
- Asynchronous:
	- we can start fetching things, but then move on to the next line of execution.
	- the user has a far reduced waiting period and nothing is locked up
	- we can then run through all the code and complete it
	- we then wait for the async tasks to complete
	- the two async calls can be waited on simultaneously. If a request takes 1 second, even if there are two requests we will still only wait around 1 second.

---

## Closures:
- useful to create scope for a variable so it can only be accessed within that function.
	- may use functions within that function to alter the variable(s)
- stops the ability of outside accidental variable change
- if the closure returns a function, it can be useful if you want to use that particular flavour of function over and over.
I.e.
````js
Const createAdder = (a) => {
	return (b) => {
		return a + b
	}
}
Const add10 = createAdder(10)
console.log(add10(-2)) //8
console.log(add10(20) //30
````
This also uses ‘currying’ => transforming a single function that takes a lot of arguments into single functions the take a subset of those arguments. i.e. the uncurried version would be `const add = (a, b) => a + b`

---

## Promises:
  - using promises:
    - an object representing the eventual completion or failure of an async operation 
    - most people are consumers of already-created promises 
      - a promise is a returned object to which you attach callbacks, instead of passing callbacks into a function. 
      - i.e.  Imagine a function, createAudioFileAsync(), which asynchronously generates a sound file given a configuration record and two callback functions: one called if the audio file is successfully created, and the other called if an error occurs:
      ````js
      // not using promises:
      function successCallback(result) {
        console.log(`Audio file ready at URL: ${result}`);
      }

      function failureCallback(error) {
        console.error(`Error generating audio file: ${error}`);
      }

      createAudioFileAsync(audioSettings, successCallback, failureCallback);

      // if re-written to return a promise, you would attach callbacks to it instead: 
      createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
      ````
      - the advantages of promises:
        - chaining: if we need to execute two or more async operations, it leads to ugly nested code 
        ````js
        // non-promises:
        doSomething(function (result) {
          doSomethingElse(result, function (newResult) {
            doThirdThing(newResult, function (finalResult) {
              console.log(`Got the final result: ${finalResult}`);
            }, failureCallback);
          }, failureCallback);
        }, failureCallback);

        // promises: 
        doSomething()
          .then((result) => doSomethingElse(result))
          .then((newResult) => doThirdThing(newResult))
          .then((finalResult) => {
            console.log(`Got the final result: ${finalResult}`); // note we need to return result otherwise the promise won't catch it. 
          })
          .catch(failureCallback);
        ````
        - We can also chain after a failure (after the `.catch`), useful if trying to do another task after a failure. 
        - Error handling is much simpler using promises, you can use it right at the end instead of each time. 
        - You can also do this using the async / await syntax by wrapping it in a try/catch block:
        ````js
        async function foo() {
          try {
            const result = await doSomething();
            const newResult = await doSomethingElse(result);
            const finalResult = await doThirdThing(newResult);
            console.log(`Got the final result: ${finalResult}`);
          } catch (error) {
            failureCallback(error);
          }
        }
        ````
  - Composition tools refers to the ability to chain together multiple async operations to create a more complex workflow. 
    - There a four currently: `Promise.all()`, `Promise.allSettled()`, `Promise.any()`, `Promise.race()`
      - If one of the promises in the array rejects, `Promise.all()` immediately stops and aborts other operations. it returns an iterable of promises.
      - `Promise.allSettled()` however ensures all operations are complete before resolving. it returns an array of the resolved promises
      - `Promise.any()` takes an iterable of promises, and then returns the first one to resolve. `promise.race()` is similar.
      - These methods all run promises concurrently - a sequence of promises are started simultaneously and do not wait for each other. 
      ````javascript
      [func1, func2, func3]
        .reduce((p, f) => p.then(f), Promise.resolve())
        .then((result3) => {
          /* use result3 */
        });

      // In this example, we reduce an array of asynchronous functions down to a promise chain. The code above is equivalent to:
      Promise.resolve()
      .then(func1)
      .then(func2)
      .then(func3)
      .then((result3) => {
        /* use result3 */
      });
      ````
      - sequential composition can be done with async/await:
      ````js
      let result;
      for (const f of [func1, func2, func3]) {
        result = await f(result);
      }
      /* use last result (i.e. result3) */
      ````
  - Promise callbacks are handled as as `microtask` whereas `setTimeout() / setInterval()` and user events (i.e. listening to keyboard input etc) callbacks are handled as `task queues`


````js
// resolve is what happens when things go well, reject is when things go bad (built into the promise object). Similar to callback arguments, except you have two separate functions now.
const myPromise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(‘this is the promise data’) // things went well
		// reject(’this is the promise error) // call this if things went poorly
	}, 2000)
})
// .then is called when things resolve above, i.e. they went well.
myPromise.then((data) => {
	console.log(data)
}, (error) => {
	console.log(err) // this is called when there’s an error above
})
````
- Promises are an improvement on callbacks: more clear syntax, easier to reason about
- when working with promises, you can return whatever you want from a .then - it will then get passed along to the next .then, it doesn’t necessarily have to be another promise.

---

### Promise chaining:
- when we return a promise from another promise, we can use promise chaining
- much cleaner syntax
- we can call a promise within a promise without nesting
````js
const getDataPromise = (num) => new Promise((resolve, reject) => {
	setTimeout(() => {
		typeof num === 'number' ? resolve(num * 2) : reject('number must be provided')
	}, 2000)
})

getDataPromise(10).then((data) => { //first promise call
	return getDataPromise(data) // call promise again with new data
}).then(data => {
	console.log(data)
}).catch((error) => { // as soon as one resolve fails, it comes here
	console.log(error)
})
````
- above example shows it only goes one layer deep - we could continue to call .then’s and repeat the process too.

---

### Fetch API:
- fetch has promises built-in
````js
fetch('http://example.com', {}).then((response) => {
	if (response.status === 200) {
		return response.json() // this parses the data as json, fetch gives this to us
		// .json() returns another promise. We can either call .then again here, or return this promise (what we do)
	} else {
		throw new Error(`Status was ${response.status}`)
	}
}).then((data) => {
	console.log(data)
}).catch((error) => {
	console.log(error)
})
````

---

### Async/Await:
- when you make a function async, it returns a promise
	- the resolve value is the value you choose to return from the function
	- async can be used to make any function return a promise
- the await operator can only be used with async functions
````js
// put async to make it an async function
const getPokemon = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto')
  if (response.status === 200) {
    return response.json()
  } else {
    throw new Error('Unable to fetch data')
  }
}
// async functions always return a promise
getPokemon().then((data) => {
  console.log(data)
})
console.log('hi')
````
- instead of attaching a `.then`, you can use `await`, it looks like synchronous code - no need for .then callbacks
````js
// example using try catch block:
const asyncFunc = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto')
    const data = await response.json()
    console.log(data.name) 
  } catch (e) {
    console.log("error:", e)
  }
}
````

---


### Object Oriented Programming:
````js
const person = new Person('Clancey', 'Turner', 54)
const bio = person.getBio()
console.log(bio)
````
- using the class syntax is the new way:
````js
class PersonClass {
	constructor(firstName, lastName, age) {
		this.firstName = firstName
		this.lastName = lastName
		this.age = age
		this.likes = likes
	}
	getBio() {	
		let bio = `${this.firstName} is ${this.age}.`
	}
}
const myPerson = new PersonClass('Andrew', 'Mead', 27)
````

---
## Data Structures 

- A data structure is a format to organise, manage and store data in a way that allows efficient access and modification. 
- JS has primitive (built in) and non-primitive (not built in) data structures
  - primitive come by default (i.e. arrays and objects)
  - non-primitive don't - you have to code them to use them 


- Arrays and Objects are primitive data structures in JS
  - Arrays:
    - each element has an index defined by its position in the array
    - when we add / delete a new item at the beginning or the middle of the array, the indexes of all the elements that come after the element added / deleted have to be changed.  
      - this has a computational cost, and is one of the weaknesses of this data structure 
    - useful when we store individual values and add / delete values from the end of the data structure - but when we want to add / delete from any part of it, there are other data structures that perform more efficiently 
  - Objects (hash tables):
    - a js object is a collection of key-value pairs.
      - also called a map, dictionary or hash-table in other languages 
    ````js
    // typically looks like this:
    const obj = {
      prop1: "hello",
      prop2: "world"
    }
    ````
    - use curly braces to declare the object, then declare each key followed by a colon and its corresponding value. Each key has to be unique within an object. 
    - can store both values and functions
    ````js
    // access properties like either of these syntaxes:
    console.log(obj.prop1) // hello
    console.log(obj["prop2"]) // world

    // assign new values in a similar way: 
    obj.prop3 = "goodbye"
    obj["prop4"] = "universe"
    obj.prop5 = () => console.log("hi hi")
    ````
    - can assign new values in a similar way 


- Stacks
  - stacks are a data structure that store info in the form of a list 
  - they only allow adding and removing elements under a LIFO pattern (last in, first out) 
    - elements can't be added or removed out of order, i.e. undo re-do functionality
    - imagine a stack of papers on your desk
  - one way to use a stack would be to implement an array and only use the `.push()` and `.pop()` methods 
  - the big O of stack methods is:
    - insertion - O(1)
    - removal - O(1)
    - searching - O(n)
    - access - O(n)

- Queues 
  - Queues work similar to stacks, but elements follow FIFO (first in first out)
    - elements can't be added or removed out of order, must follow FIFO pattern
    - i.e. imagine people making a queue to buy food 
  - one way to implement queue would be an array with its `push` and `shift` methods
  - the big O of queues is:
    - insertion - O(1)
    - removal - O(1)
    - searching - O(n)
    - access - O(n)


- Linked Lists
  - linked lists are a type of data structure that store values in the form of a list
    - within the list, each value is considered a node and is connected with the following value in the list (or nul if the element is the last in the list) through a pointer 
  - two kinds: `singly linked lists` and `doubly linked lists`
    - both are similar, but in singly linked lists each node has a single pointer that indicates the next node. where doubly linked lists, each node has two pointers: the next node and the previous node. 
  - the first element of the list is considerd the HEAD, the last element is considered the TAIL
  - compared to arrays:
    - lists don't have indexes, each value only knows the values which its connected through the pointers
    - since theres no indexes, we can't access values randomly
      - we must iterate through it starting from its head or tail
    - because of no indexes, insertion / deletion in any part of the list is more efficient than with arrays (arrays need to be re-indexed each time)
  - we need to create a custom class to implement linked lists 
  - big O of singly linked list:
    - insertion - O(1)
    - removal - O(n)
    - search - O(n)
    - access - O(n)
  - big O of doubly linked lists: 
    - insertion - O(1)
    - removal - O(1)
    - search - O(n)
    - access - O(n) 

- Trees
  - Trees link nodes in a parent / child relationship, in the sense that theres nodes that depend on or come off other nodes
    - trees are formed by a root node (first node on the tree)
    - nodes on the bottom of the tree with no children are called "leaf nodes"
  - trees are non-linear
    - with linkedlists or arrays, the program can only iterate the data structure from one extreme of it to the other, always following the same path
    - with trees, the only valid connection between nodes is from parent to child 
      - connection between siblings or from child to parent are not allowed in trees 
  - examples of trees: 
    - the DOM model
    - situation analysis in AI
    - file folders in operating systems
  - Types of trees:
    - Binary trees
      - each node has a max of two children
      - often used in searching, "binary search trees"
        - in BSTs, its ordered so each node that descends to the left of its parent has a value less than its parent, and each node to the right has a value bigger than its parent 
      - the big O of a binary tree is logarithmic, log(n)
    - Heaps
      - two main types: MaxHeaps and MinHeaps 
        - MaxHeaps: parent nodes always greater than its children 
        - MinHeaps: parent nodes always smaller than its children
  - we need to create a custom class to implement trees


- Graphs
  - a data structure formed by a group of nodes and certain connections between those nodes 
    - no root and leaf nodes, nor a 'head' or a 'tail'
    - no implicit parent-child connection between them
  - often used for:
    - social networks
    - geo location

---
## ES6 Data Structures: Maps and Sets 

https://www.freecodecamp.org/news/how-to-use-javascript-collections-map-and-set/

### Overview
- maps are sort of a combination of objects an arrays, they are more perfomant and can be used instead of objects - ideal for when we don't know how many attributes we will have in advance
  - maintains the order of elements
  - keys / values can be of any type
  - has new methods like 'length'
  - doesn't waste resources on inheriting from object prototype
  - doesn't allow duplicates
  - can be iterated on using `.forEach`
  - methods are: 
    - `map.set('key', 'value')`
    - `map.size`
    - `map.get('key')`
    - `map.has('key')`
    - `map.delete('key')`
    - `map.clear()`
    - `map.values() map.keys() .map.entries()` 
  - can be converted to and from arrays and objects
  - there is also `weakMap`:
    - the keys are weak - if references to the key are lost, the value can be garbage collected. unlike map where the keys and values remain indefinitely.
    - weakMap has the same API as map but you cannot iterate over it and you cannot clear it. 
- sets are like arrays except they use key-value under the hood instead of indexing and are in general more performant, especially as the app scales 
  - doesn't allow duplicates
  - can be iterated on using `.forEach`
  - methods are:
    - `set.add('item')`
    - `set.size`
    - `set.has('item')`
    - `set.delete('item')`
    - `set.clear()`
    - `set.values() set.keys() set.entries` 
  - can be converted to and from arrays and objects
  - there is also `weakSet`, basically the same as set except:
    - the values stored in weakset cannot be primitive values (boolean, number, string or undefined)
    - if there are no other reference to an object stored in weakset, they can be garbage collected. we cannot iterate over weakset items. 
  

### Map
- An object is a key-value pair where the key must be a string and the value can be of any type 
- An array is an ordered collection that can hold data of any type 
- until ES6, objects and arrays were the most important data structures to handle collections of data
  - the dev community didn't have many choices outside of that. 
- there were shortcomings:
  - object keys can only be of type string
  - objects don't maintain the order of the elements inserted into them
  - objects lack some useful methods, so theyre hard to use in some situations
    - i.e. theres no `length` and they're hard to enumerate (i.e. iterate) on
  - arrays allow duplicates
- in ES6 (2015) we got two new data structures that address these shortcomings: `Map` and `Set`. 

Map in Javascript:
- `Map` is a collection of key-value pairs where the key can be of any type. 
- It remembers the original order in which the elements were added to it, which means data can be retrieved in the same order it was inserted in
- In other words, `Map` has characteristics of both `Object` and `Array`. 
  - like an object it supports key-value pair structure
  - like an array, it remembers insertion order 
````js
// create a new Map like this:
const map = new Map();

// can also create it using initial values: 
const initialValues = new Map([
  ['name', 'mark'],
  ['profession', 'software dev']
])

// to add values use the set(key, value) method
const map = new Map();
map.set('name', 'mark')
map.set('job', 'software dev')
map.set('age', 31)
map.set('alive', true)
map.set('name', 'steven') //note, this will replace the existing name
// keys can be anything:
map.set(0, 'hello world')
const obj = {'sky': 'blue'}
map.set(obj, true)

// how to get values from map: use the get(key) method 
map.get('name') //returns 'steven'


// OTHER OPERATIONS: 
// size property tells you how many elements are in it:
console.log('size of the map is:', map.size)
// search an element with the has(key) method:
console.log(map.has('name'))
// remove an element with the delete(key) method:
console.log(map.delete('name'))
// use the clear() method to remove all elements from the map at once:
map.clear()
````
- MapIterator: `keys()`, `values()`, `entries()`
  - these methods return a `MapIterator` - you can use a forEach loop directly on it 
````js
const ageMap = new Map([
  ['Jack', 27],
  ['Tom', 26],
  ['Mark', 31]
])

console.log(ageMap.keys()) // gets all the keys
console.log(ageMap.values()) // gets all the values
console.log(ageMap.entries()) // gets all the key-value pairs

// how to iterate over a Map
ageMap.forEach((value, key) => {
  console.log(`${key} is ${value} years old`)
})
````
- you may encounter a situation where you need to convert an object to a map-like structure, and you can use the method entries of Object to do that:
````js
// convert object to a map
const address = {
  'Tapas': 'Bangalore',
  'James': 'Huston',
  'Selva': 'Srilanka'
};

const addressMap = new Map(Object.entries(address));

// convert map to an object 
const objAgain = Object.fromEntries(addressMap)

// convert map into array 
const toArray = Array.from(map) //or it can also be done using spread operator:
const toArray2 = [...addressMap]
````


Map vs Object, when should you use them?
- use map when: 
  - your needs are not that simple, i.e. you want keys that are non-strings
  - you need a data structure where elements can be ordered (i.e. you can iterate using foreach over a map, but not an object)
  - you are looking for methods like .has, .delete, .set .get
- use object when:
  - you don't have any of the needs listed above
  - you rely on JSON.parse() as Map cannot be parsed with it 


### Set 
- a set is a collection of unique elements that can be of any type. it is also an ordered collection of elements, i.e. elements can be retrieved in the same order they were inserted in 
- a `Set` in javascript behaves the same way as a mathematical set 
````js
// create empty set:
const set = new Set();
// create set with values:
const fruitSet = new Set(['🍉', '🍎', '🍈', '🍏'])
console.log(fruitSet)
````
- set has methods to add an element to it, delete elements, check if an element exists, and to clear it completely
````js
const set = new Set();
set.add('hello')
set.add('world')
set.add('world') // we can't add this again, because set is a collection of unique elements only
console.log(set)

set.has('hello') // will return true
set.delete('hello') // deletes the hello element

set.clear() // removes all elements from a Set
````

- Set has a method called `values()` which returns a `SetIterator` to get all its values 
- we can use a forEach or for-of loop on a set to retrieve the values 
  - javascript treats set similar to map, were we're given `keys()` and `entries()` too. keys() returns nothing and entries returns the value as the key.
````js
const set = new Set([ 'goodbye', 'universe'])
console.log(set.entries())

set.forEach(value => {
  console.log(value)
})
````

- Set is different to array:
  - arrays allow you to have duplicate elements, sets do not 
  - set operations like `delete()` are faster than array operations like `shift()` or `splice()`
  - `Set` is like an extension of a regular array but with more muscles 

````js
// convert set into array:
const arr = [...set]
console.log(arr)

// convert array into a set:
const arr = ['hello', 'world']
const set = new Set(arr)
````

- you can also convert object to set
````js
const person = {
  name: 'Mark',
  age: 31
}

const pSet = new Set();
pSet.add(person)
console.log(pSet)

````

- set doesn't have a huge advantage over regular arrays


---

### Objects vs Maps (again)
https://www.zhenghao.io/posts/object-vs-map
- Map seems like a more capable Object 
- Most people still reach for objects when they need a hashmap (key-value pair data structure)
- TLDR:
  - use Object for records where you have a fixed and finite number properties/fields known at compile time
  - use Map for dictionaries or hash maps where you have a variable number of entries, with frequent updates, whose keys might not be known at compile time, such as an event emitter 
- Map is more performant than Object on insertion, deletion and iteration speed and consumes less memory than an object of the same size. 
  - although overall this is relatively minor and unlikely to be the bottleneck of the app

Why object falls short of a hash map use case:
- objects only allow keys that are strings and symbols 
- object has unwanted inheritance (i.e. it inherits from Object.prototype by default - comes with 'toString' etc which we dont want on a hashmap)
- object doesn't come with a size api (i.e. number of properties)
- no way to delete all properties in an object at once 

---

https://bretcameron.medium.com/how-to-make-your-code-faster-using-javascript-sets-b432457a4a77

### Sets vs Arrays 
- sets are better as your app scales and can bring runtime benefits
- Arrays are an indexed collection - the value of data in an array is ordered by the index
- Sets are a keyed collection - sets order their data using keys. 
  - order of insertion, and cannot contain any duplicate data 


- searching for an item using `indexOf()` or `includes()` to check if an item exists in an array is slow, so is using `splice()` to delete an item - as it is all based on the index and needs to be re-indexed. 
- Methods an array uses to search for items is O(n), i.e. run-time increases at the same rate as the size of the data increases. 
- Methods used by Sets have a time complexity of just O(1) - the size of the data has virtually no bearing on the run-time of these methods. 

---


## Promise.all, Promise.allSettled 
### Promise.all() example with async / await 

````js
async function makeRequests() {
  const requests = [];
  for (let i = 0; i < 5; i++) {
    requests.push(fetch('https://pokeapi.co/api/v2/pokemon/ditto'));
  }
  const responses = await Promise.all(requests); // Promise.all takes an array of promises and attempts to resolve them all
  console.log(responses);

  const data = []

  responses.forEach(response => {
    if (response.status === 200) {
      data.push(response.json())
    }
  })

  const awaitedData = await Promise.all(data) // here taking an array of response.json() which is also a promise

  console.log(awaitedData) // now logs the data, no longer a promise! 
}

makeRequests();
````


---

### Promise.allSettled() example with async / await and try/ catch AND sets!

````js
export const fetchPokemon = async (pokeArr) => {
  const requests = new Set()
  const jsonData = new Set()

  try {
    // requests becomes array of fetch promises
    pokeArr.forEach(async (pokemon) => {
      requests.add(fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`))
    })

    // resolve them using Promise.allSettled() => if there is a failed one, will continue
    const fetchedRequests = (await Promise.allSettled(requests)).filter(result => result.status === 'fulfilled')

    // jsonData becomes array of .json() promises
    fetchedRequests.forEach((request) => {
      if (request.value.status === 200) {
        jsonData.add(request.value.json())
      } else {
        console.log('issue fetching:', request)
      }
    })

    // resolve them
    const fetchedJson = await Promise.all(jsonData)
    
    return fetchedJson
  } catch (error) {
    console.log(error)
  }
}
````

---

## DOM Manipulation: Create a html / JS stack from scratch 

- the html page is created on the 'document' object in javascript, which is the 'document object model' (DOM). 
- to select an element from here to interact with, you need your script to be loaded after the html element you're trying to select has. 
  - i.e. in index.html if you're trying to select the body element, you'll need to load the script after - the order matters!
  ````html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
  </body>
  <!-- here it's after the body and can now select it: -->
  <script src="./index2.js"></script>
  </html>
  ````
  ````js
  // index2.js:
  const body = document.querySelector('body')
  console.log(body) // no longer null 

  const ps = document.querySelectorAll('p') // gets an array of all of them 
  ps.forEach(() => {

    console.log(p.textContent) // prints text content to console
    p.textContent = '*****' // changes text content 
    p.remove() // removes all of them 
  })

  // create an element:
  const paragraph = document.createElement('p')
  paragraph.textContent = 'this is a new element'

  // appendChild adds a child as the last element in the parent
  body.appendChild(paragraph)
  ````
-

- use existing pokemon API 
- use DOM manipulation (watch some of that udemy course to brush up on it)
  - find DOM cheatsheet?
- maybe just print some basic boxes with different pokemon. try using Promise.all

---
## Comp Sci Fundamentals 

#### Garbage collection: https://javascript.info/garbage-collection
- memory management in JS is performed automatically when something is not needed anymore
- the main concept of memory management is 'reachability'
````js
let user = {
  name: 'John'
}

user = null;
// now the original user object is no longer reachable
````
- because the object is no longer reachable, the garbage collector will junk the data and free up memory. 


### memory management: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management
- javascript automatically allocates memory when objects are created and frees it when they are not used anymore (garbage collection)
- this automaticity can give developers a false impression that they don't need to worry about memory management
- data structures aiding memory management:
  - js offers several data structures that indirectly observe garbage collection and can be used to manage memory usage: weakMaps and weakSets 
  - WeakMap allows you to maintain a collection of key-value pairs, while WeakSet allows you to maintain a collection of unique values. Both have performant addition, deletion and querying. 
  - They weakly reference something - so if it is the only thing referencing it, that thing is garbage collectable

### Big O notation / memory and complexity
Memory / complexity: https://medium.com/@bretcameron/ace-your-coding-interview-by-understanding-big-o-notation-and-write-faster-code-6b60bd498040 
- At its most basic level, big O notation provides us with a quick way to assess the speed / performance of an algorithm.
  - it measures how quickly the run-time grows relative to the input, as the input increases


- `O(1)` represents an algorithm whose run-time is fixed. No matter the amount of data you feed in, the algorithm will always take the same amount of time
````js
// i.e: 
function(array) {
  return array[0];
}
````


- `O(N)` - linear time 
- as the length of the array increases, the amount of processing required increases at the same rate. 
````js
// i,e:
function logArray(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}
````

- `O(N²)` - Quadratic time 
- increases at twice the relative rate of `O(N)`.
- i.e. an nested loop:
````js
function(array){
  for (let i = 0; i < array.length; i++){
    for (let j = 0; j < array.length; j++){
      console.log(array[j]);
    }
  }
}
````


- `O(N3), O(N4)` - cubic time, quartic time, and so on
- If two nested loops give us `O(N²)`, three and four give us these and so on...
````js
function(array){
  for (let i = 0; i < array.length; i++){
    for (let j = 0; j < array.length; j++){
      for (let k = 0; k < array.length; k++){
        console.log(array[k]);
    }
  }
}
````


- `O(logN)` - Binary search
- involves finding the midpoint of an array, 8. from there 11 is higher than 8 so we cut the array in half and ignore the first half. we then look from 9-15, again find the midpoint, cut it in half etc. 
- for an array of length 15, we have a maximum number of steps of 3. compare that to `O(N)` and the maximum would be 15. 
  - if we double the array, we'd only have a max step of 4. but in `O(N)` it would be 30. 
````js
// the array must be sorted 

function binarySearch(array, searchValue) {
// Define start, end and pivot (middle)
  let start = 0;
  let end = array.length - 1;
  let pivot = Math.floor((start + end) / 2);
// As long as the pivot is not our searchValue and the array is greater than 1, define a new start or end
  while (array[pivot] !== searchValue && start < end) {
    if (searchValue < array[pivot]) {
      end = pivot - 1
    } else {
      start = pivot + 1
    }
// Every time, calculate a new pivot value
    pivot = Math.floor((start + end) / 2);
  };
// If the current pivot is out search value, return it's index. Otherwise, return false.
  return array[pivot] === searchValue ? pivot : false;
};
````

- From fastests to slowest:
  - `O(1)`
  - `O(logN)`
  - `O(N)`
  - `O(N²)` (etc)


---

## Hoisting

- when the JS engine gets our script, it sets up memory for the data in our code. No code is executed, it just prepares it
  - the way function declarations and variables are stored is different - functions are stored with a reference to the entire function 
  - variables declared with `let` or `const` are stored as uninitialized
  - variables declared with `var` are stored as `undefined`
- if you try to access a `var` defined variable before it is defined (but is prepared) it will give you `undefined`. if you try to access a `let` or `const` variable, it will give you a `ReferenceError`. 
  - it is recommended to only use let and const for this reason


## The Scope Chain
````js
const name = "Lydia"
const age = 21
const city = "San Francisco"


function getPersonInfo() {
  const name = "Sarah"
  const age = 22

  return `${name} is ${age} and lives in ${city}`
}

console.log(getPersonInfo())
````
- returns: 'Sarah is 22 and lives in San Franciso`, but the getPersonInfo function doesn't contain a variable named City 
- The scope chain is basically a "chain of references" to objects that contain references fo values (and other scopes). 
- In the above example we have the 'local execution context' of getPersonInfo where the name and age is defined. We first check this for the city, and its not there 
  - we then check the global execution context, a layer up, and see there is a city there. So we used that one. 




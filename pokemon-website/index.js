// setTimeout(() => {
//   console.log('timeout')
// }, 0)
// console.log("hello world");

// fetch('https://pokeapi.co/api/v2/pokemon/ditto')
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data)
//   })
//   .catch((e) => {
//     console.log(e)
//   })
//   .finally(() => {
//     console.log('finally!')
//   })

// const asyncFunc = async () => {
//   try {
//     const val = await fetch('https://pokeapi.co/api/v2/pokemon/ditto')
//     const hm = await val.json()
//     console.log(hm)
//     console.log(hm.name) 
//   } catch (e) {
//     console.log("error:", e)
//   } finally {
//     console.log('final countdown...')
//   }
// }

// asyncFunc()


//=====

// const ageMap = new Map([
//   ['Jack', 27],
//   ['Tom', 26],
//   ['Mark', 31]
// ])

// console.log(ageMap.keys()) // gets all the keys
// console.log(ageMap.values()) // gets all the values
// console.log(ageMap.entries()) // gets all the key-value pairs

// ageMap.forEach((value, key) => {
//   console.log(`${key} is ${value} years old`)
// })

//=====

// const address = {
//   'Tapas': 'Bangalore',
//   'James': 'Huston',
//   'Selva': 'Srilanka'
// };

// const addressMap = new Map(Object.entries(address));

// console.log(addressMap)

// const objAgain = Object.fromEntries(addressMap)
// console.log(objAgain)

// const toArray = Array.from(addressMap)
// console.log(toArray)

// const set = new Set([ 'goodbye', 'universe'])

// set.add('hello')
// set.add('world')
// set.add('world')
// console.log(set)

// console.log(set.has('hello'))

// console.log(set.entries())

// set.forEach(value => {
//   console.log(value)
// })


// const person = {
//   name: 'Mark',
//   age: 31
// }

// const pSet = new Set();
// pSet.add(person)
// console.log(pSet)

// function unique(arr) {
//   const set = new Set([...arr])
//   return set
// }

// let values = ["Hare", "Krishna", "Hare", "Krishna",
//   "Krishna", "Krishna", "Hare", "Hare", ":-O"
// ];

//console.log( unique(values) ); // Hare, Krishna, :-O

// async function makeRequests() {
//   const requests = [];
//   for (let i = 0; i < 5; i++) {
//     requests.push(fetch('https://pokeapi.co/api/v2/pokemon/ditto'));
//   }
//   const responses = await Promise.all(requests);
//   console.log(responses);

//   const data = []

//   responses.forEach(response => {
//     if (response.status === 200) {
//       data.push(response.json())
//     }
//   })

//   const awaitedData = await Promise.all(data)

//   console.log(awaitedData)
// }

// makeRequests();

// ===


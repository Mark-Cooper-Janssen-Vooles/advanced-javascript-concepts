// need to install 'npm install -g http-server' and cd to the index.html location and run 'http-server' which will serve it at localhost:8080  - and this will allow the CORS issue to pass in chrome.
export const fetchPokemon = async (pokeArr) => {
  const requests = new Set()
  const jsonData = new Set()

  //debugger

  try {
    // requests becomes array of fetch promises
    pokeArr.forEach(async (pokemon) => {
      // using array:
      //requests.push(fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`))

      // using set:
      requests.add(fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`))
    })

    // resolve them using Promise.all => if there is a failed one, will throw an error 
    //const fetchedRequests = await Promise.all(requests)

    // resolve them using Promise.allSettled() => if there is a failed one, will continue
    debugger
    const fetchedRequests = (await Promise.allSettled(requests)).filter(result => result.status === 'fulfilled')

    // jsonData becomes array of .json() promises
    fetchedRequests.forEach((request) => {
      //jsonData.push(request.json())
      if (request.value.status === 200) {
        jsonData.add(request.value.json())
      } else {
        console.log('issue fetching:', request)
      }
    })

    // resolve them
    const fetchedJson = await Promise.all(jsonData)

    // console.log(fetchedJson)
    return fetchedJson
  } catch (error) {
    console.log(error)
  }
}

function getFirstElement(arr) {
    return arr[0];  
  }
  
  const numbers = [10, 20, 30, 40, 50];
  console.log(getFirstElement(numbers));  
  


  function sumArray(arr) {
    let sum = 0; // Initialize sum to 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];  // Add each element to sum
    }
    return sum; // Return the total sum
  }
  
  // Example usage:
  const numbers2 = [1, 2, 3, 4, 5];
  console.log(sumArray(numbers)); 


  function sumPairs(arr) {
    let pairs = []; // Array to store pairs
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        pairs.push([arr[i], arr[j]]); // Create pairs
      }
    }
    return pairs; // Return all pairs
  }
  
  // Example usage:
  const numbers3 = [1, 2, 3];
  console.log(sumPairs(numbers));
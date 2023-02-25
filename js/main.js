
document.getElementById('find-allergens').addEventListener('click', getFetch)

function getFetch(){
  const userInput = document.getElementById('barcode').value
 
  if (userInput.length !== 12) {
    const inputLabel = document.querySelector('label')
    const inputBox = document.getElementById('barcode')

    inputLabel.style.color = 'red'
    inputLabel.innerHTML = 'Please ensure barcode is 12 characters.'

    inputBox.classList.add('error')

    setTimeout(function() {
      inputBox.classList.remove('error')
    }, 300)
    return;
  }

  const url = `https://world.openfoodfacts.org/api/v0/product/${userInput}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (data.status === 1) {
          const foodItem = new ProductInfo(data.product)
          foodItem.showInfo()
          foodItem.listIngredients()
        } else {
          alert(`Product ${userInput} not found. Please try again.`)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //Passing in data.product
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  }
  
  showInfo() {
    document.getElementById('product-img').src = this.image
    document.getElementById('product-name').innerText = this.name
  }

    
    listIngredients() {
      let table = document.getElementById('ingredient-table')

      for (let i = 1; i < table.rows.length;) {
        table.deleteRow(i)
      }

      if (!(this.ingredients == null)) {
        for (let key in this.ingredients) {
          let newRow = table.insertRow(-1)
          let newICell = newRow.insertCell(0) 
          let newVCell = newRow.insertCell(1)
          let newACell = newRow.insertCell(2)
          
          let newIText = document.createTextNode(
            this.ingredients[key].text
            )
            
          let veganStatus = !(this.ingredients[key].vegan) ? 'unknown' : this.ingredients[key].vegan
          let newVText = document.createTextNode(veganStatus)
            
            
          newICell.appendChild(newIText)
          newVCell.appendChild(newVText)
            
          const str = this.ingredients[key].text
          if(/milk|eggs|egg|fish|shellfish|nuts|peanuts|peanut|wheat|soybeans|soybean|crustacean|sesame/i.test(str)){
            let allergenStatus = 'yes'
            let newAText = document.createTextNode(allergenStatus)
            newACell.appendChild(newAText)
            newACell.classList.add('non-vegan-allergens')
          } else {
            let allergenStatus = 'no'
            let newAText = document.createTextNode(allergenStatus)
            newACell.appendChild(newAText)
          }

          if (veganStatus === 'no') {
            newVCell.classList.add('non-vegan-allergens')
          } else if ( veganStatus === 'unknown' || veganStatus === 'maybe') {
            newVCell.classList.add('unknown-maybe')
          }
          
        }

      }
      
    }
    
  }
